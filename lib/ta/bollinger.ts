export type BollingerBand = {
  middle: number | null;
  upper: number | null;
  lower: number | null;
};

export function bollinger(values: number[], period = 20, multiplier = 2): BollingerBand[] {
  if (period <= 0) throw new Error("Period måste vara större än 0");
  const result: BollingerBand[] = [];
  for (let i = 0; i < values.length; i++) {
    if (i < period - 1) {
      result.push({ middle: null, upper: null, lower: null });
      continue;
    }
    const slice = values.slice(i - period + 1, i + 1);
    const mean = slice.reduce((sum, v) => sum + v, 0) / period;
    const variance =
      slice.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / period;
    const std = Math.sqrt(variance);
    result.push({ middle: mean, upper: mean + multiplier * std, lower: mean - multiplier * std });
  }
  return result;
}
