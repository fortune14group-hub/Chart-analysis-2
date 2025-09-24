import type { Series } from "@/lib/types";

export function parseCsv(input: string): Series {
  const rows = input.trim().split(/\r?\n/);
  const headers = rows.shift()?.split(/[,;\t]/).map((h) => h.trim().toLowerCase());
  if (!headers) return [];
  const tIndex = headers.findIndex((h) => ["t", "time", "timestamp", "date"].includes(h));
  const closeIndex = headers.findIndex((h) => ["close", "c"].includes(h));
  if (tIndex === -1 || closeIndex === -1) return [];
  const openIndex = headers.findIndex((h) => ["open", "o"].includes(h));
  const highIndex = headers.findIndex((h) => ["high", "h"].includes(h));
  const lowIndex = headers.findIndex((h) => ["low", "l"].includes(h));
  const volumeIndex = headers.findIndex((h) => ["volume", "v"].includes(h));

  return rows
    .filter(Boolean)
    .map((row) => row.split(/[,;\t]/))
    .map((cols) => ({
      t: cols[tIndex],
      c: Number(cols[closeIndex]),
      o: openIndex >= 0 ? Number(cols[openIndex]) : undefined,
      h: highIndex >= 0 ? Number(cols[highIndex]) : undefined,
      l: lowIndex >= 0 ? Number(cols[lowIndex]) : undefined,
      v: volumeIndex >= 0 ? Number(cols[volumeIndex]) : undefined,
    }))
    .filter((candle) => Number.isFinite(candle.c));
}
