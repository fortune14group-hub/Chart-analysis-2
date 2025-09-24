import { atr } from "@/lib/ta/atr";
import type { Signal, Series } from "@/lib/types";

export type RiskPlan = {
  entry: number;
  stopLoss: number;
  takeProfit: number;
};

type RiskOptions = {
  atrPeriod?: number;
  useAtr?: boolean;
};

function estimateVolatility(series: Series, index: number): number {
  const lookbackStart = Math.max(1, index - 5);
  const window = series.slice(lookbackStart, index + 1);
  if (window.length <= 1) {
    const base = Math.abs(series[index].c - (series[index - 1]?.c ?? series[index].c));
    return base > 0 ? base : Math.max(series[index].c * 0.01, 0.01);
  }
  const trueRanges: number[] = [];
  for (let i = 1; i < window.length; i++) {
    const current = window[i];
    const previous = window[i - 1];
    const prevClose = previous.c;
    const high = current.h ?? Math.max(current.c, current.o ?? current.c);
    const low = current.l ?? Math.min(current.c, current.o ?? current.c);
    const tr = Math.max(high - low, Math.abs(high - prevClose), Math.abs(low - prevClose));
    if (Number.isFinite(tr)) {
      trueRanges.push(tr);
    }
  }
  if (trueRanges.length === 0) {
    const fallback = Math.abs(series[index].c - (series[index - 1]?.c ?? series[index].c));
    return fallback > 0 ? fallback : Math.max(series[index].c * 0.01, 0.01);
  }
  const avg = trueRanges.reduce((sum, value) => sum + value, 0) / trueRanges.length;
  return avg > 0 ? avg : Math.max(series[index].c * 0.01, 0.01);
}

export function calculateRisk(
  series: Series,
  signals: Signal[],
  options: RiskOptions = {}
): Record<string, RiskPlan> {
  const { atrPeriod = 14, useAtr = true } = options;
  const atrValues = useAtr ? atr(series, atrPeriod) : null;
  const plans: Record<string, RiskPlan> = {};

  for (const signal of signals) {
    const atrValue = atrValues ? atrValues[signal.index] : null;
    const volatility = !atrValue || atrValue <= 0 ? estimateVolatility(series, signal.index) : atrValue;
    if (!volatility || volatility <= 0) {
      continue;
    }
    if (signal.type === "BUY") {
      plans[signal.timestamp] = {
        entry: signal.price,
        stopLoss: signal.price - 1.5 * volatility,
        takeProfit: signal.price + 2 * volatility,
      };
    } else {
      plans[signal.timestamp] = {
        entry: signal.price,
        stopLoss: signal.price + 1.5 * volatility,
        takeProfit: signal.price - 2 * volatility,
      };
    }
  }

  return plans;
}
