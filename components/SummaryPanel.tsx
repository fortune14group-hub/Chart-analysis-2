import type { RiskPlan } from "@/lib/signals/risk";
import type { Signal } from "@/lib/types";

export function SummaryPanel({ signals, risk }: { signals: Signal[]; risk: Record<string, RiskPlan> }) {
  if (!signals.length) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
        Inga signaler ännu – prova att justera dina indikatorer eller ladda upp en annan graf.
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <h3 className="text-lg font-semibold text-slate-100">Signalöversikt</h3>
      <ul className="space-y-3 text-sm text-slate-200">
        {signals.map((signal) => {
          const plan = risk[signal.timestamp];
          return (
            <li key={signal.timestamp} className="rounded-md border border-slate-800 bg-slate-900/60 p-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-100">
                  {signal.type === "BUY" ? "KÖP" : "SÄLJ"} @ {signal.price.toFixed(2)}
                </span>
                <span className="text-xs text-slate-400">Konfidens: {(signal.confidence * 100).toFixed(0)}%</span>
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-400">
                {signal.reason.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
              {plan && (
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-300">
                  <div>
                    <span className="block text-slate-500">Entry</span>
                    {plan.entry.toFixed(2)}
                  </div>
                  <div>
                    <span className="block text-slate-500">Stop-loss</span>
                    {plan.stopLoss.toFixed(2)}
                  </div>
                  <div>
                    <span className="block text-slate-500">Take-profit</span>
                    {plan.takeProfit.toFixed(2)}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
