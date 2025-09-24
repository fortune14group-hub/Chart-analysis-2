import { redirect } from "next/navigation";
import { signIn } from "@/lib/auth";
import { isValidEmail } from "@/lib/utils/validators";

async function requestMagicLink(formData: FormData) {
  "use server";
  const email = String(formData.get("email") || "").trim();
  if (!isValidEmail(email)) {
    throw new Error("Ogiltig e-postadress");
  }
  await signIn("email", { email, redirectTo: "/" });
  redirect("/auth/dev");
}

export default function SignInPage() {
  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-3xl font-bold text-slate-100">Logga in</h1>
      <p className="text-sm text-slate-300">Ange din e-postadress så visas den magiska länken på dev-sidan.</p>
      <form action={requestMagicLink} className="space-y-4">
        <div>
          <label htmlFor="email" className="text-sm text-slate-300">
            E-post
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-4 py-2 text-slate-100"
            placeholder="du@example.com"
          />
        </div>
        <button type="submit" className="w-full rounded-md bg-sky-500 px-4 py-2 font-semibold text-slate-950 hover:bg-sky-400">
          Skicka magisk länk
        </button>
      </form>
    </div>
  );
}
