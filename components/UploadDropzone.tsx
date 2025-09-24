import { sv } from "@/lib/i18n/sv";

export function UploadDropzone({ name = "file" }: { name?: string }) {
  return (
    <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-700 bg-slate-900/40 p-8 text-center transition hover:border-sky-500">
      <span className="text-lg font-semibold text-slate-100">{sv.uploadTitle}</span>
      <span className="mt-2 text-sm text-slate-400">{sv.uploadHint}</span>
      <input
        className="mt-4 w-full cursor-pointer rounded-md border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-200 file:mr-4 file:rounded-md file:border-0 file:bg-sky-500 file:px-4 file:py-2 file:text-slate-950"
        type="file"
        name={name}
        accept="image/*,.csv,.txt"
        required
      />
    </label>
  );
}
