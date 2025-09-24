import { atr } from "@/lib/ta/atr";
import type { Signal, Series } from "@/lib/types";

export type RiskPlan = {
  entry: number;
  stopLoss: number;
  takeProfit: number;
};

export function calculateRisk(series: Series, signals: Signal[], period = 14): Record<string, RiskPlan> {
  const atrValues = atr(series, period);
  const plans: Record<string, RiskPlan> = {};
  for (const signal of signals) {
    const atrValue = atrValues[signal.index];
    if (!atrValue) continue;
    if (signal.type === "BUY") {
      plans[signal.timestamp] = {
        entry: signal.price,
        stopLoss: signal.price - 1.5 * atrValue,
        takeProfit: signal.price + 2 * atrValue,
      };
    } else {
      plans[signal.timestamp] = {
        entry: signal.price,
        stopLoss: signal.price + 1.5 * atrValue,
        takeProfit: signal.price - 2 * atrValue,
      };
    }
  }
  return plans;
}
