import { getLastMagicLink } from "@/lib/dev/lastLink";
import { listUsers } from "@/lib/db/mockAuth";

export default function DevAuthPage() {
  const link = getLastMagicLink();
  const users = listUsers();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-100">Dev-inlogg</h1>
      <p className="text-sm text-slate-300">Senaste magiska länken visas nedan (ingen e-post skickas i dev-läge).</p>
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-200">
        {link ? (
          <div className="space-y-2">
            <div>E-post: {link.email}</div>
            <a href={link.url} className="text-sky-400 hover:text-sky-300">
              {link.url}
            </a>
          </div>
        ) : (
          <span>Ingen länk genererad ännu.</span>
        )}
      </div>
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-200">
        <h2 className="text-lg font-semibold text-slate-100">Registrerade användare</h2>
        <ul className="mt-2 space-y-1 text-xs text-slate-400">
          {users.map((user) => (
            <li key={user.email}>
              {user.email} – {user.pro ? "PRO" : "FREE"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
