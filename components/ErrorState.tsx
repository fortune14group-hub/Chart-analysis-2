export function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-rose-500/40 bg-rose-900/30 p-4 text-sm text-rose-200">
      {message}
    </div>
  );
}
