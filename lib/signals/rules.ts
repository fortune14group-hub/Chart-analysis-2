import { bollinger } from "@/lib/ta/bollinger";
import { macd } from "@/lib/ta/macd";
import { rsi } from "@/lib/ta/rsi";
import { sma } from "@/lib/ta/sma";
import type { Signal, Series } from "@/lib/types";

export function generateSignals(series: Series): Signal[] {
  if (series.length === 0) return [];
  const closes = series.map((c) => c.c);
  const volumes = series.map((c) => c.v ?? null);
  const sma20 = sma(closes, 20);
  const sma50 = sma(closes, 50);
  const macdRes = macd(closes);
  const rsi14 = rsi(closes, 14);
  const boll = bollinger(closes, 20, 2);
  const volSma = volumes.some((v) => v !== null)
    ? sma(
        volumes.map((v) => v ?? 0),
        20
      )
    : null;

  const signals: Signal[] = [];

  for (let i = 1; i < series.length; i++) {
    const candle = series[i];
    const prev = series[i - 1];
    const reasons: string[] = [];
    let action: Signal["type"] | null = null;
    let confidence = 0.4;

    const shortNow = sma20[i];
    const shortPrev = sma20[i - 1];
    const longNow = sma50[i];
    const longPrev = sma50[i - 1];
    if (shortPrev != null && longPrev != null && shortNow != null && longNow != null) {
      const prevDiff = shortPrev - longPrev;
      const nowDiff = shortNow - longNow;
      if (prevDiff <= 0 && nowDiff > 0) {
        action = "BUY";
        reasons.push("SMA20 korsar upp över SMA50");
        confidence = Math.max(confidence, 0.55);
      } else if (prevDiff >= 0 && nowDiff < 0) {
        action = "SELL";
        reasons.push("SMA20 korsar ned under SMA50");
        confidence = Math.max(confidence, 0.55);
      }
    }

    const macdNow = macdRes.macd[i];
    const macdPrev = macdRes.macd[i - 1];
    const signalNow = macdRes.signal[i];
    const signalPrev = macdRes.signal[i - 1];
    if (macdPrev != null && signalPrev != null && macdNow != null && signalNow != null) {
      const prevDiff = macdPrev - signalPrev;
      const nowDiff = macdNow - signalNow;
      if (prevDiff <= 0 && nowDiff > 0 && macdNow < 0) {
        action = "BUY";
        reasons.push("MACD korsar upp under nollinjen");
        confidence = Math.max(confidence, 0.6);
      } else if (prevDiff >= 0 && nowDiff < 0 && macdNow > 0) {
        action = "SELL";
        reasons.push("MACD korsar ned över nollinjen");
        confidence = Math.max(confidence, 0.6);
      }
    }

    const rsiNow = rsi14[i];
    const rsiPrev = rsi14[i - 1];
    if (rsiPrev != null && rsiNow != null) {
      if (rsiPrev < 30 && rsiNow > rsiPrev) {
        action = "BUY";
        reasons.push("RSI vänder upp från översålt");
        confidence = Math.max(confidence, 0.5);
      } else if (rsiPrev > 70 && rsiNow < rsiPrev) {
        action = "SELL";
        reasons.push("RSI vänder ned från överköpt");
        confidence = Math.max(confidence, 0.5);
      }
    }

    const bollPrev = boll[i - 1];
    const bollNow = boll[i];
    if (bollPrev.middle != null && bollNow.middle != null) {
      if (prev.c <= (bollPrev.lower ?? prev.c) && candle.c >= bollNow.middle) {
        action = "BUY";
        reasons.push("Bollinger-återtag mot mittbandet");
        confidence = Math.max(confidence, 0.5);
      }
      if (prev.c >= (bollPrev.upper ?? prev.c) && candle.c <= bollNow.middle) {
        action = "SELL";
        reasons.push("Bollinger-återtag från övre bandet");
        confidence = Math.max(confidence, 0.5);
      }
    }

    if (volSma && volSma[i] != null && volumes[i] != null && volumes[i]! > (volSma[i] ?? 0)) {
      confidence += 0.15;
      reasons.push("Volym över 20-dagars medel");
    }

    if (action) {
      signals.push({
        type: action,
        reason: reasons,
        timestamp: candle.t,
        index: i,
        price: candle.c,
        confidence: Math.min(1, parseFloat(confidence.toFixed(2))),
      });
    }
  }

  return signals;
}
