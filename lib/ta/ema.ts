export function ema(values: number[], period: number): (number | null)[] {
  if (period <= 0) throw new Error("Period måste vara större än 0");
  const result: (number | null)[] = [];
  const multiplier = 2 / (period + 1);
  let prev: number | null = null;
  for (let i = 0; i < values.length; i++) {
    const value = values[i];
    if (prev === null) {
      if (i >= period - 1) {
        const slice = values.slice(i - period + 1, i + 1);
        prev = slice.reduce((acc, v) => acc + v, 0) / slice.length;
        result.push(prev);
      } else {
        result.push(null);
      }
      continue;
    }
    prev = value * multiplier + prev * (1 - multiplier);
    result.push(prev);
  }
  return result;
}
