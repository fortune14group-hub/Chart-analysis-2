import type { Series } from "@/lib/types";

export type OpenCVExtraction = {
  series: Series;
  meta: { kind: string; interval: string };
};

function generateTimestamps(length: number): string[] {
  const start = Date.now() - length * 60_000;
  return Array.from({ length }, (_, i) => new Date(start + i * 60_000).toISOString());
}

export async function extractWithOpenCV(file: File): Promise<OpenCVExtraction> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const length = Math.max(30, Math.min(200, Math.floor(buffer.length / 32)));
  const timestamps = generateTimestamps(length);
  const series = timestamps.map((t, index) => {
    const value = buffer[index % buffer.length] / 255;
    const price = 100 + value * 10 + Math.sin(index / 5) * 2;
    return { t, c: parseFloat(price.toFixed(2)) };
  });
  return { series, meta: { kind: "heuristic", interval: "1m" } };
}
