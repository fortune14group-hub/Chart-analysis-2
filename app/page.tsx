import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { UploadDropzone } from "@/components/UploadDropzone";
import { IndicatorToggles } from "@/components/IndicatorToggles";
import { TrustBar } from "@/components/TrustBar";
import { sv } from "@/lib/i18n/sv";
import { parseCsv } from "@/lib/utils/csv";
import { saveAnalysis } from "@/lib/utils/persist";
import { generateSignals } from "@/lib/signals/rules";
import { calculateRisk } from "@/lib/signals/risk";
import type { Series } from "@/lib/types";
import { extractFromVision } from "@/lib/image/extractFromVision";
import { extractWithOpenCV } from "@/lib/image/extractWithOpenCV";

async function analyzeImage(formData: FormData) {
  "use server";
  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    throw new Error("Ingen fil mottagen");
  }

  let series: Series = [];
  let meta: Record<string, unknown> | undefined;
  const indicators = formData.getAll("indicators").map(String);

  if ((file.type && file.type.includes("csv")) || file.name.endsWith(".csv") || file.name.endsWith(".txt")) {
    const text = await file.text();
    series = parseCsv(text);
    meta = { kind: "csv", indicators };
  } else if (process.env.OPENAI_API_KEY) {
    try {
      const vision = await extractFromVision(file);
      series = vision.series;
      meta = { ...vision.meta, indicators };
    } catch (error) {
      console.warn("Vision misslyckades, använder heuristik", error);
      const fallback = await extractWithOpenCV(file);
      series = fallback.series;
      meta = { ...fallback.meta, indicators };
    }
  } else {
    const fallback = await extractWithOpenCV(file);
    series = fallback.series;
    meta = { ...fallback.meta, indicators };
  }

  if (!series.length) {
    throw new Error("Kunde inte tolka data");
  }

  const signals = generateSignals(series);
  const risk = calculateRisk(series, signals);
  const id = saveAnalysis({ series, signals, risk, meta });
  revalidatePath(`/result/${id}`);
  redirect(`/result/${id}`);
}

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="space-y-6 text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-sky-400">AI + TA</p>
        <h1 className="text-4xl font-bold text-slate-100 sm:text-5xl">{sv.tagline}</h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-300">
          Ladda upp en prisgraf och låt Chart2Signals skapa indikatorer, signalpilar och risknivåer redo för export.
        </p>
      </section>

      <form action={analyzeImage} className="space-y-6">
        <UploadDropzone />
        <IndicatorToggles />
        <button
          type="submit"
          className="w-full rounded-xl bg-sky-500 px-6 py-3 text-lg font-semibold text-slate-950 shadow-lg shadow-sky-500/20 transition hover:bg-sky-400"
        >
          {sv.analyzeButton}
        </button>
      </form>

      <TrustBar />
    </div>
  );
}
