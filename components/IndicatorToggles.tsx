const indicators = [
  { id: "sma", label: "SMA" },
  { id: "ema", label: "EMA" },
  { id: "rsi", label: "RSI" },
  { id: "macd", label: "MACD" },
  { id: "bollinger", label: "Bollinger" },
  { id: "atr", label: "ATR" },
];

export function IndicatorToggles() {
  return (
    <fieldset className="mt-6 space-y-2">
      <legend className="text-sm font-semibold text-slate-200">Indikatorer</legend>
      <div className="grid gap-2 sm:grid-cols-3">
        {indicators.map((indicator) => (
          <label key={indicator.id} className="flex items-center gap-2 rounded-md border border-slate-700 bg-slate-900/60 px-3 py-2">
            <input defaultChecked type="checkbox" name="indicators" value={indicator.id} className="accent-sky-500" />
            <span className="text-sm text-slate-200">{indicator.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
