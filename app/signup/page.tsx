import { redirect } from "next/navigation";
import { ENABLE_PRO } from "@/lib/utils/features";
import { isValidEmail } from "@/lib/utils/validators";
import { addStatus } from "@/lib/utils/status";
import { uuid } from "@/lib/utils/uuid";

async function signupAction(formData: FormData) {
  "use server";
  const email = String(formData.get("email") || "").trim();
  if (!isValidEmail(email)) {
    throw new Error("Ogiltig e-postadress");
  }
  addStatus({ id: uuid(), event: "Signup", createdAt: new Date().toISOString(), payload: { email } });
  redirect("/thanks");
}

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-4xl font-bold text-slate-100">Bli Pro-kund</h1>
      {!ENABLE_PRO && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-900/30 p-4 text-sm text-amber-200">
          PRO-läget är avstängt i denna miljö. Använd <code className="rounded bg-amber-800 px-1">ENABLE_PRO=true</code> för att öppna riktiga flödet.
        </div>
      )}
      <form action={signupAction} className="space-y-4">
        <div>
          <label htmlFor="email" className="text-sm text-slate-300">
            E-postadress
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-4 py-2 text-slate-100"
            placeholder="du@bolag.se"
          />
        </div>
        <div>
          <label htmlFor="company" className="text-sm text-slate-300">
            Företag (valfritt)
          </label>
          <input
            id="company"
            name="company"
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-4 py-2 text-slate-100"
            placeholder="BetSpread AB"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-xl bg-sky-500 px-6 py-3 text-lg font-semibold text-slate-950 hover:bg-sky-400"
        >
          Skicka förfrågan
        </button>
      </form>
    </div>
  );
}
