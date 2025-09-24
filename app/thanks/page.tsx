import Link from "next/link";

export default function ThanksPage() {
  return (
    <div className="mx-auto max-w-lg space-y-6 text-center">
      <h1 className="text-4xl font-bold text-slate-100">Tack!</h1>
      <p className="text-slate-300">Vi återkommer inom 24 timmar med onboarding för Chart2Signals Pro.</p>
      <Link href="/" className="inline-flex rounded-md bg-sky-500 px-4 py-2 font-semibold text-slate-950 hover:bg-sky-400">
        Tillbaka till startsidan
      </Link>
    </div>
  );
}
