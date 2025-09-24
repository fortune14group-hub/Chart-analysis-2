import { ema } from "./ema";

export type MACDResult = {
  macd: (number | null)[];
  signal: (number | null)[];
  histogram: (number | null)[];
};

export function macd(values: number[], fast = 12, slow = 26, signalPeriod = 9): MACDResult {
  if (fast >= slow) throw new Error("Slow-perioden måste vara större än fast-perioden");
  const fastEma = ema(values, fast);
  const slowEma = ema(values, slow);
  const macdLine = values.map((_, i) => {
    const f = fastEma[i];
    const s = slowEma[i];
    if (f == null || s == null) return null;
    return f - s;
  });
  const macdValues = macdLine.map((v) => (v == null ? 0 : v));
  const signalLine = ema(macdValues, signalPeriod);
  const histogram = macdLine.map((v, i) => {
    const signalValue = signalLine[i];
    if (v == null || signalValue == null) return null;
    return v - signalValue;
  });
  return { macd: macdLine, signal: signalLine, histogram };
}
