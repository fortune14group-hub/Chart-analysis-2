import Link from "next/link";
import { sv } from "@/lib/i18n/sv";

export default function PricingPage() {
  return (
    <div className="space-y-10">
      <div className="space-y-3 text-center">
        <h1 className="text-4xl font-bold text-slate-100">{sv.pricingTitle}</h1>
        <p className="text-slate-300">Skala din analys med planerna nedan. Uppgradera när du är redo.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {[sv.freePlan, sv.proPlan].map((plan) => (
          <div key={plan.title} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <h2 className="text-2xl font-semibold text-slate-100">{plan.title}</h2>
            <p className="mt-2 text-3xl font-bold text-sky-400">{plan.price}</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              {plan.features.map((feature) => (
                <li key={feature} className="rounded-md border border-slate-800 bg-slate-950/60 px-3 py-2">
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href={plan.title === "Pro" ? "/signup" : "/"}
              className="mt-6 inline-flex w-full justify-center rounded-md bg-sky-500 px-4 py-2 font-semibold text-slate-950 hover:bg-sky-400"
            >
              {plan.title === "Pro" ? "Bli Pro" : "Starta gratis"}
            </Link>
          </div>
        ))}
      </div>
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-100">Vanliga frågor</h2>
        <div className="space-y-3">
          {sv.faq.map((item) => (
            <div key={item.question} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <h3 className="text-lg font-semibold text-slate-100">{item.question}</h3>
              <p className="mt-2 text-sm text-slate-300">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-center text-sm text-slate-300">
        PRO-funktioner kräver aktivering. Använd din dev-token mot <code className="rounded bg-slate-800 px-1">/api/dev/pro</code> för att låsa upp.
      </div>
    </div>
  );
}
