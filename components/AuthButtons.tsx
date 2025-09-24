import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { ENABLE_PRO } from "@/lib/utils/features";
import { ProBadge } from "./ProBadge";

export async function AuthButtons() {
  const session = await auth();
  const user = session?.user as (typeof session.user & { pro?: boolean }) | undefined;

  return (
    <div className="flex items-center gap-3 text-sm text-slate-200">
      {user ? (
        <>
          {user.pro && <ProBadge />}
          <span className="hidden sm:inline">{user.email}</span>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button className="rounded-md border border-slate-700 px-3 py-1 hover:border-slate-500">Logga ut</button>
          </form>
        </>
      ) : (
        <Link href="/auth/signin" className="rounded-md bg-sky-500 px-3 py-1 font-semibold text-slate-950 hover:bg-sky-400">
          Logga in
        </Link>
      )}
      {!ENABLE_PRO && (
        <Link href="/auth/dev" className="text-xs text-slate-400 hover:text-slate-200">
          Dev-länkar
        </Link>
      )}
    </div>
  );
}
