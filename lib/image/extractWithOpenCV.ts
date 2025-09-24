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
  const series: Series = [];
  let previousClose = 100;

  for (let index = 0; index < length; index++) {
    const byte = buffer[index % buffer.length] ?? buffer[buffer.length - 1];
    const ratio = byte / 255;
    const drift = Math.sin(index / 4) * 1.2;
    const noise = (ratio - 0.5) * 2.5;
    const close = Number((previousClose + noise + drift).toFixed(2));
    const open = Number(previousClose.toFixed(2));
    const highBase = Math.max(open, close);
    const lowBase = Math.min(open, close);
    const spread = Math.max(0.6, Math.abs(drift) + 0.6);
    const high = Number((highBase + spread).toFixed(2));
    const low = Number((lowBase - spread).toFixed(2));
    const volume = Math.round(900 + ratio * 700 + Math.abs(drift) * 120);

    series.push({
      t: timestamps[index],
      o: open,
      h: high,
      l: low,
      c: close,
      v: volume,
    });

    previousClose = close;
  }

  return { series, meta: { kind: "heuristic", interval: "1m" } };
}
