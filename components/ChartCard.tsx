"use client";

import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Signal, Series } from "@/lib/types";

function formatTimestamp(ts: string) {
  try {
    return new Date(ts).toLocaleString();
  } catch (error) {
    return ts;
  }
}

export function ChartCard({ series, signals }: { series: Series; signals: Signal[] }) {
  const data = series.map((candle) => ({ ...candle }));
  return (
    <div className="h-[360px] w-full rounded-xl border border-slate-800 bg-slate-900/40 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="t" stroke="#94a3b8" tickFormatter={(v) => new Date(v).toLocaleTimeString()} minTickGap={32} />
          <YAxis stroke="#94a3b8" domain={['dataMin', 'dataMax']} width={72} />
          <Tooltip
            contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", color: "#e2e8f0" }}
            labelFormatter={(label) => formatTimestamp(label as string)}
          />
          <Line type="monotone" dataKey="c" stroke="#38bdf8" strokeWidth={2} dot={false} />
          {signals.map((signal) => (
            <ReferenceDot
              key={signal.timestamp}
              x={signal.timestamp}
              y={signal.price}
              r={6}
              fill={signal.type === "BUY" ? "#22c55e" : "#f87171"}
              strokeWidth={0}
              isFront
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-4 flex gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <ArrowUpCircle className="h-4 w-4 text-emerald-400" /> Köp
        </span>
        <span className="flex items-center gap-1">
          <ArrowDownCircle className="h-4 w-4 text-rose-400" /> Sälj
        </span>
      </div>
    </div>
  );
}
