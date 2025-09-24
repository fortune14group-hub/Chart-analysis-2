import { bollinger } from "@/lib/ta/bollinger";
import { ema } from "@/lib/ta/ema";
import { macd } from "@/lib/ta/macd";
import { rsi } from "@/lib/ta/rsi";
import { sma } from "@/lib/ta/sma";
import type { Signal, Series } from "@/lib/types";

export type IndicatorId = "sma" | "ema" | "rsi" | "macd" | "bollinger" | "atr";

type Trigger = { reason: string; weight: number };

const DEFAULT_INDICATORS: IndicatorId[] = ["sma", "ema", "rsi", "macd", "bollinger", "atr"];

const WEIGHTS: Record<Exclude<IndicatorId, "atr">, number> = {
  sma: 0.22,
  ema: 0.16,
  rsi: 0.18,
  macd: 0.24,
  bollinger: 0.15,
};

type GenerateSignalsOptions = {
  enabledIndicators?: string[];
};

function toIndicatorSet(enabled?: string[]): Set<IndicatorId> {
  if (!enabled || enabled.length === 0) {
    return new Set(DEFAULT_INDICATORS);
  }
  const normalized = enabled.filter((id): id is IndicatorId =>
    (DEFAULT_INDICATORS as readonly string[]).includes(id)
  );
  return new Set(normalized.length ? normalized : DEFAULT_INDICATORS);
}

export function generateSignals(series: Series, options?: GenerateSignalsOptions): Signal[] {
  if (series.length === 0) return [];

  const enabledIndicators = toIndicatorSet(options?.enabledIndicators);
  const closes = series.map((c) => c.c);
  const volumes = series.map((c) => c.v ?? null);

  const needsSma = enabledIndicators.has("sma");
  const needsEma = enabledIndicators.has("ema");
  const needsRsi = enabledIndicators.has("rsi");
  const needsMacd = enabledIndicators.has("macd");
  const needsBollinger = enabledIndicators.has("bollinger");

  const sma20 = needsSma ? sma(closes, 20) : [];
  const sma50 = needsSma ? sma(closes, 50) : [];
  const ema21 = needsEma ? ema(closes, 21) : [];
  const macdRes = needsMacd ? macd(closes) : null;
  const rsi14 = needsRsi ? rsi(closes, 14) : [];
  const boll = needsBollinger ? bollinger(closes, 20, 2) : [];
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
    const triggers: Record<Signal["type"], Trigger[]> = { BUY: [], SELL: [] };

    const pushTrigger = (type: Signal["type"], reason: string, weightKey: keyof typeof WEIGHTS) => {
      const weight = WEIGHTS[weightKey];
      triggers[type].push({ reason, weight });
    };

    if (needsSma) {
      const shortNow = sma20[i];
      const shortPrev = sma20[i - 1];
      const longNow = sma50[i];
      const longPrev = sma50[i - 1];
      if (shortPrev != null && longPrev != null && shortNow != null && longNow != null) {
        const prevDiff = shortPrev - longPrev;
        const nowDiff = shortNow - longNow;
        if (prevDiff <= 0 && nowDiff > 0) {
          pushTrigger("BUY", "SMA20 korsar upp över SMA50", "sma");
        } else if (prevDiff >= 0 && nowDiff < 0) {
          pushTrigger("SELL", "SMA20 korsar ned under SMA50", "sma");
        }
      }
    }

    if (needsMacd && macdRes) {
      const macdNow = macdRes.macd[i];
      const macdPrev = macdRes.macd[i - 1];
      const signalNow = macdRes.signal[i];
      const signalPrev = macdRes.signal[i - 1];
      if (macdPrev != null && signalPrev != null && macdNow != null && signalNow != null) {
        const prevDiff = macdPrev - signalPrev;
        const nowDiff = macdNow - signalNow;
        if (prevDiff <= 0 && nowDiff > 0 && macdNow < 0) {
          pushTrigger("BUY", "MACD korsar upp under nollinjen", "macd");
        } else if (prevDiff >= 0 && nowDiff < 0 && macdNow > 0) {
          pushTrigger("SELL", "MACD korsar ned över nollinjen", "macd");
        }
      }
    }

    if (needsRsi) {
      const rsiNow = rsi14[i];
      const rsiPrev = rsi14[i - 1];
      if (rsiPrev != null && rsiNow != null) {
        if (rsiPrev < 30 && rsiNow > rsiPrev) {
          pushTrigger("BUY", "RSI vänder upp från översålt", "rsi");
        } else if (rsiPrev > 70 && rsiNow < rsiPrev) {
          pushTrigger("SELL", "RSI vänder ned från överköpt", "rsi");
        }
      }
    }

    if (needsBollinger) {
      const bollPrev = boll[i - 1];
      const bollNow = boll[i];
      if (bollPrev && bollNow && bollPrev.middle != null && bollNow.middle != null) {
        if (prev.c <= (bollPrev.lower ?? prev.c) && candle.c >= bollNow.middle) {
          pushTrigger("BUY", "Bollinger-återtag mot mittbandet", "bollinger");
        }
        if (prev.c >= (bollPrev.upper ?? prev.c) && candle.c <= bollNow.middle) {
          pushTrigger("SELL", "Bollinger-återtag från övre bandet", "bollinger");
        }
      }
    }

    if (needsEma) {
      const emaNow = ema21[i];
      const emaPrev = ema21[i - 1];
      if (emaPrev != null && emaNow != null) {
        if (prev.c <= emaPrev && candle.c > emaNow) {
          pushTrigger("BUY", "Pris bryter upp genom EMA21", "ema");
        } else if (prev.c >= emaPrev && candle.c < emaNow) {
          pushTrigger("SELL", "Pris faller under EMA21", "ema");
        }
      }
    }

    const aggregate = (type: Signal["type"]) => {
      const items = triggers[type];
      if (items.length === 0) {
        return { score: 0, maxWeight: 0, reasons: [] as string[] };
      }
      const score = items.reduce((sum, item) => sum + item.weight, 0);
      const maxWeight = Math.max(...items.map((item) => item.weight));
      const reasons = items.map((item) => item.reason);
      return { score, maxWeight, reasons };
    };

    const buy = aggregate("BUY");
    const sell = aggregate("SELL");

    if (!buy.reasons.length && !sell.reasons.length) {
      continue;
    }

    let action: Signal["type"] | null = null;
    let chosen = buy;
    if (buy.score > sell.score) {
      action = "BUY";
    } else if (sell.score > buy.score) {
      action = "SELL";
      chosen = sell;
    } else if (buy.maxWeight > sell.maxWeight) {
      action = "BUY";
    } else if (sell.maxWeight > buy.maxWeight) {
      action = "SELL";
      chosen = sell;
    } else if (buy.reasons.length > sell.reasons.length) {
      action = "BUY";
    } else if (sell.reasons.length > buy.reasons.length) {
      action = "SELL";
      chosen = sell;
    }

    if (!action) {
      continue;
    }

    const hasVolumeBoost = Boolean(
      volSma &&
        volSma[i] != null &&
        volumes[i] != null &&
        volumes[i]! > (volSma[i] ?? 0)
    );

    const reasons = Array.from(
      new Set([
        ...chosen.reasons,
        ...(hasVolumeBoost ? ["Volym över 20-dagars medel"] : []),
      ])
    );

    let confidence = 0.35 + chosen.score + (hasVolumeBoost ? 0.1 : 0);
    confidence = Math.max(0.35, Math.min(0.95, Number(confidence.toFixed(2))));

    signals.push({
      type: action,
      reason: reasons,
      timestamp: candle.t,
      index: i,
      price: candle.c,
      confidence,
    });
  }

  return signals;
}
