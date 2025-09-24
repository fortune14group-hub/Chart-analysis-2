export function rsi(values: number[], period = 14): (number | null)[] {
  if (period <= 0) throw new Error("Period måste vara större än 0");
  const result: (number | null)[] = [];
  let gains = 0;
  let losses = 0;
  for (let i = 1; i < values.length; i++) {
    const change = values[i] - values[i - 1];
    gains += Math.max(change, 0);
    losses += Math.max(-change, 0);
    if (i > period) {
      const prevChange = values[i - period] - values[i - period - 1];
      gains -= Math.max(prevChange, 0);
      losses -= Math.max(-prevChange, 0);
    }
    if (i >= period) {
      const avgGain = gains / period;
      const avgLoss = losses / period;
      if (avgLoss === 0) {
        result.push(100);
      } else {
        const rs = avgGain / avgLoss;
        result.push(100 - 100 / (1 + rs));
      }
    } else {
      result.push(null);
    }
  }
  return [null, ...result];
}
