import { sv } from "@/lib/i18n/sv";

export function TrustBar() {
  return (
    <div className="mt-12 rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
      <span className="font-semibold text-slate-100">Pålitlighet:</span>
      <div className="mt-2 flex flex-wrap gap-3">
        {sv.trust.map((item) => (
          <span
            key={item}
            className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs uppercase tracking-wide"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
