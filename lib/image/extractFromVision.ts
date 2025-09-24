import OpenAI from "openai";
import type { Series } from "@/lib/types";

export type VisionExtraction = {
  series: Series;
  meta: {
    symbol?: string;
    interval?: string;
    kind?: string;
  };
};

const systemPrompt = `Du är en teknisk analys-assistent. Extrahera tidsserien från en uppladdad prisgraf.
Returnera JSON med fälten series (lista av candle-objekt med t,o,h,l,c,v) och meta (kind, interval, optional symbol).
Om datum är oläsligt: använd jämn tidsaxel (ISO8601 start + steg 1).
`;

export async function extractFromVision(file: File): Promise<VisionExtraction> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY saknas");
  }
  const model = process.env.OPENAI_VISION_MODEL || "gpt-4o-mini";
  const openai = new OpenAI({ apiKey });
  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString("base64");
  const response = await openai.responses.create({
    model,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "chart2signals_extraction",
        schema: {
          type: "object",
          properties: {
            series: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  t: { type: "string" },
                  o: { type: "number" },
                  h: { type: "number" },
                  l: { type: "number" },
                  c: { type: "number" },
                  v: { type: "number" },
                },
                required: ["t", "c"],
                additionalProperties: false,
              },
            },
            meta: {
              type: "object",
              properties: {
                symbol: { type: "string" },
                interval: { type: "string" },
                kind: { type: "string" },
              },
              additionalProperties: true,
            },
          },
          required: ["series", "meta"],
          additionalProperties: false,
        },
      },
    },
    input: [
      {
        role: "system",
        content: [{ type: "text", text: systemPrompt }],
      },
      {
        role: "user",
        content: [
          { type: "text", text: "Extrahera serien som JSON" },
          { type: "input_image", image: { base64, mime_type: file.type || "image/png" } },
        ],
      },
    ],
  });

  const output = response.output?.[0];
  if (!output || output.type !== "output_text") {
    throw new Error("Kunde inte tolka Vision-svar");
  }
  const parsed = JSON.parse(output.text);
  return parsed as VisionExtraction;
}
