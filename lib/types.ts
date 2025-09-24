export type Candle = {
  t: string;
  o?: number;
  h?: number;
  l?: number;
  c: number;
  v?: number;
};

export type Series = Candle[];

export type Signal = {
  type: "BUY" | "SELL";
  reason: string[];
  timestamp: string;
  index: number;
  price: number;
  confidence: number;
};
