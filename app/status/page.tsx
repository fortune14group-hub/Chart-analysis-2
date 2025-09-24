import { getStatus } from "@/lib/utils/status";

export default function StatusPage({ searchParams }: { searchParams?: Record<string, string> }) {
  const token = searchParams?.token;
  if (!token || token !== process.env.DEV_ADMIN_TOKEN) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-300">
        Otillåten åtkomst. Lägg till <code className="rounded bg-slate-800 px-1">?token=</code> med din DEV_ADMIN_TOKEN.
      </div>
    );
  }
  const entries = getStatus();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-100">Statuslogg</h1>
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="min-w-full divide-y divide-slate-800 text-sm">
          <thead className="bg-slate-900/80 text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-2 text-left">Tid</th>
              <th className="px-4 py-2 text-left">Händelse</th>
              <th className="px-4 py-2 text-left">Payload</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-slate-950/60 text-slate-200">
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td className="px-4 py-2">{new Date(entry.createdAt).toLocaleString()}</td>
                <td className="px-4 py-2">{entry.event}</td>
                <td className="px-4 py-2 text-xs text-slate-400">{JSON.stringify(entry.payload)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
