import { describe, expect, it } from "vitest";
import { atr } from "@/lib/ta/atr";
import { bollinger } from "@/lib/ta/bollinger";
import { ema } from "@/lib/ta/ema";
import { macd } from "@/lib/ta/macd";
import { rsi } from "@/lib/ta/rsi";
import { sma } from "@/lib/ta/sma";

const closeValues = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

describe("TA", () => {
  it("beräknar SMA", () => {
    const values = sma(closeValues, 3);
    expect(values[2]).toBeCloseTo(11);
    expect(values.at(-1)).toBeCloseTo(19);
  });

  it("beräknar EMA", () => {
    const values = ema(closeValues, 3);
    expect(values[2]).toBeCloseTo(11);
    expect(values.at(-1)).toBeGreaterThan(19);
  });

  it("beräknar RSI", () => {
    const values = rsi(closeValues, 3);
    expect(values.filter((v) => v === null).length).toBe(3);
    expect(values.at(-1)).toBeGreaterThan(70);
  });

  it("beräknar MACD", () => {
    const result = macd(closeValues, 3, 6, 3);
    expect(result.macd.at(-1)).toBeTypeOf("number");
    expect(result.signal.at(-1)).toBeTypeOf("number");
    expect(result.histogram.at(-1)).toBeTypeOf("number");
  });

  it("beräknar Bollingerband", () => {
    const bands = bollinger(closeValues, 3, 2);
    const last = bands.at(-1);
    expect(last?.middle).toBeCloseTo(19);
    expect(last?.upper).toBeGreaterThan(last!.middle!);
  });

  it("beräknar ATR", () => {
    const candles = closeValues.map((c, index) => ({
      t: `2024-01-0${index + 1}`,
      o: c - 0.5,
      h: c + 1,
      l: c - 1,
      c,
    }));
    const result = atr(candles, 3);
    expect(result.at(-1)).toBeGreaterThan(0);
  });
});
