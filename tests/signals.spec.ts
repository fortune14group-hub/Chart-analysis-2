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
    expect(signals.map((s) => s.reason.join(", "))).toContainEqual(expect.stringContaining("SMA20"));
    expect(signals).toMatchInlineSnapshot(`
      [
        {
          "confidence": 0.5,
          "index": 41,
          "price": 121.1,
          "reason": [
            "RSI vänder ned från överköpt",
          ],
          "timestamp": "2024-01-01T00:41:00.000Z",
          "type": "SELL",
        },
        {
          "confidence": 0.6,
          "index": 42,
          "price": 120.2,
          "reason": [
            "MACD korsar ned över nollinjen",
            "RSI vänder ned från överköpt",
          ],
          "timestamp": "2024-01-01T00:42:00.000Z",
          "type": "SELL",
        },
        {
          "confidence": 0.5,
          "index": 43,
          "price": 119.3,
          "reason": [
            "RSI vänder ned från överköpt",
          ],
          "timestamp": "2024-01-01T00:43:00.000Z",
          "type": "SELL",
        },
        {
          "confidence": 0.5,
          "index": 44,
          "price": 118.4,
          "reason": [
            "RSI vänder ned från överköpt",
          ],
          "timestamp": "2024-01-01T00:44:00.000Z",
          "type": "SELL",
        },
        {
          "confidence": 0.55,
          "index": 62,
          "price": 102.2,
          "reason": [
            "SMA20 korsar ned under SMA50",
          ],
          "timestamp": "2024-01-01T01:02:00.000Z",
          "type": "SELL",
        },
        {
          "confidence": 0.5,
          "index": 81,
          "price": 87.2,
          "reason": [
            "RSI vänder upp från översålt",
          ],
          "timestamp": "2024-01-01T01:21:00.000Z",
          "type": "BUY",
        },
        {
          "confidence": 0.5,
          "index": 82,
          "price": 88.4,
          "reason": [
            "RSI vänder upp från översålt",
          ],
          "timestamp": "2024-01-01T01:22:00.000Z",
          "type": "BUY",
        },
        {
          "confidence": 0.6,
          "index": 83,
          "price": 89.6,
          "reason": [
            "MACD korsar upp under nollinjen",
            "RSI vänder upp från översålt",
          ],
          "timestamp": "2024-01-01T01:23:00.000Z",
          "type": "BUY",
        },
        {
          "confidence": 0.5,
          "index": 84,
          "price": 90.8,
          "reason": [
            "RSI vänder upp från översålt",
          ],
          "timestamp": "2024-01-01T01:24:00.000Z",
          "type": "BUY",
        },
        {
          "confidence": 0.55,
          "index": 101,
          "price": 111.2,
          "reason": [
            "SMA20 korsar upp över SMA50",
          ],
          "timestamp": "2024-01-01T01:41:00.000Z",
          "type": "BUY",
        },
      ]
    `);
  });

  it("skapar riskplaner", () => {
    const signals = generateSignals(series);
    const risk = calculateRisk(series, signals);
    const first = signals[0];
    expect(risk[first.timestamp].entry).toBeCloseTo(first.price, 5);
  });
});
