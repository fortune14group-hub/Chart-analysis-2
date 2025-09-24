import Link from "next/link";
import { sv } from "@/lib/i18n/sv";

export function CTASticky() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 text-sm text-slate-200">
        <span>{sv.footerCta}</span>
        <Link
          href="/pricing"
          className="rounded-md bg-sky-500 px-4 py-2 font-semibold text-slate-950 shadow hover:bg-sky-400"
        >
          Se planer
        </Link>
      </div>
    </div>
  );
}
