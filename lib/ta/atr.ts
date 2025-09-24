import type { Candle } from "@/lib/types";

export function atr(candles: Candle[], period = 14): (number | null)[] {
  if (period <= 0) throw new Error("Period måste vara större än 0");
  const result: (number | null)[] = [];
  const trs: number[] = [];
  for (let i = 0; i < candles.length; i++) {
    const candle = candles[i];
    const prevClose = i > 0 ? candles[i - 1].c : candle.c;
    const high = candle.h ?? candle.c;
    const low = candle.l ?? candle.c;
    const tr = Math.max(high - low, Math.abs(high - prevClose), Math.abs(low - prevClose));
    trs.push(tr);
    if (i >= period - 1) {
      const slice = trs.slice(i - period + 1, i + 1);
      const avg = slice.reduce((sum, v) => sum + v, 0) / slice.length;
      result.push(avg);
    } else {
      result.push(null);
    }
  }
  return result;
}
