import type { Signal } from "@/lib/types";

export function SignalsTable({ signals }: { signals: Signal[] }) {
  if (!signals.length) return null;
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800">
      <table className="min-w-full divide-y divide-slate-800 text-sm">
        <thead className="bg-slate-900/80 text-xs uppercase tracking-wide text-slate-400">
          <tr>
            <th className="px-4 py-2 text-left">Tid</th>
            <th className="px-4 py-2 text-left">Typ</th>
            <th className="px-4 py-2 text-left">Pris</th>
            <th className="px-4 py-2 text-left">Konfidens</th>
            <th className="px-4 py-2 text-left">Anledning</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800 bg-slate-950/60 text-slate-200">
          {signals.map((signal) => (
            <tr key={signal.timestamp}>
              <td className="px-4 py-2">{new Date(signal.timestamp).toLocaleString()}</td>
              <td className="px-4 py-2 font-semibold text-slate-100">{signal.type === "BUY" ? "KÖP" : "SÄLJ"}</td>
              <td className="px-4 py-2">{signal.price.toFixed(2)}</td>
              <td className="px-4 py-2">{(signal.confidence * 100).toFixed(0)}%</td>
              <td className="px-4 py-2 text-xs text-slate-400">{signal.reason.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
