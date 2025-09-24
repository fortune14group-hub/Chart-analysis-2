import { describe, expect, it } from "vitest";
import { calculateRisk } from "@/lib/signals/risk";
import { generateSignals } from "@/lib/signals/rules";
import type { Series } from "@/lib/types";

const start = Date.parse("2024-01-01T00:00:00Z");
const series: Series = Array.from({ length: 120 }).map((_, index) => {
  const timestamp = new Date(start + index * 60_000).toISOString();
  let close = 100;
  if (index < 40) close = 90 + index * 0.8;
  else if (index < 80) close = 122 - (index - 40) * 0.9;
  else close = 86 + (index - 80) * 1.2;
  const high = close + 0.8;
  const low = close - 0.8;
  const open = close - 0.3;
  const volume = 100 + (index % 10) * 5;
  return { t: timestamp, o: open, h: high, l: low, c: Number(close.toFixed(2)), v: volume };
});

describe("Signals", () => {
  it("genererar köp- och säljsignaler", () => {
    const signals = generateSignals(series);
    expect(signals.length).toBeGreaterThan(0);
    expect(signals.some((signal) => signal.type === "BUY")).toBe(true);
    expect(signals.some((signal) => signal.type === "SELL")).toBe(true);
    expect(signals.every((signal) => signal.reason.length > 0)).toBe(true);
    expect(signals.some((signal) => signal.reason.some((reason) => reason.includes("SMA20")))).toBe(true);
    expect(signals.every((signal) => signal.confidence >= 0.35 && signal.confidence <= 0.95)).toBe(true);
  });

  it("respekterar indikatorval", () => {
    const allSignals = generateSignals(series);
    const filtered = generateSignals(series, {
      enabledIndicators: ["macd", "rsi", "bollinger", "ema", "atr"],
    });
    expect(filtered.some((signal) => signal.reason.some((reason) => reason.includes("SMA20")))).toBe(false);
    expect(filtered.length).toBeLessThanOrEqual(allSignals.length);
  });

  it("skapar riskplaner även med begränsad data", () => {
    const signals = generateSignals(series);
    const risk = calculateRisk(series, signals);
    const first = signals[0];
    const plan = risk[first.timestamp];
    expect(plan.entry).toBeCloseTo(first.price, 5);
    if (first.type === "BUY") {
      expect(plan.stopLoss).toBeLessThan(plan.entry);
      expect(plan.takeProfit).toBeGreaterThan(plan.entry);
    } else {
      expect(plan.stopLoss).toBeGreaterThan(plan.entry);
      expect(plan.takeProfit).toBeLessThan(plan.entry);
    }

    const closeOnly = series.map(({ t, c }) => ({ t, c }));
    const closeSignals = generateSignals(closeOnly);
    const closeRisk = calculateRisk(closeOnly, closeSignals);
    if (closeSignals.length > 0) {
      const closePlan = closeRisk[closeSignals[0].timestamp];
      expect(closePlan).toBeDefined();
      expect(closePlan.entry).toBeCloseTo(closeSignals[0].price, 5);
    }
  });
});
