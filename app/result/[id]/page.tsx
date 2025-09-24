import { notFound } from "next/navigation";
import { ChartCard } from "@/components/ChartCard";
import { ExportButtons } from "@/components/ExportButtons";
import { SummaryPanel } from "@/components/SummaryPanel";
import { SignalsTable } from "@/components/SignalsTable";
import { getAnalysis } from "@/lib/utils/persist";

export default function ResultPage({ params }: { params: { id: string } }) {
  const analysis = getAnalysis(params.id);
  if (!analysis) {
    notFound();
  }
  const chartId = "analysis-chart";
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1 space-y-4">
          <div id={chartId}>
            <ChartCard series={analysis.series} signals={analysis.signals} />
          </div>
          <ExportButtons series={analysis.series} signals={analysis.signals} chartId={chartId} />
        </div>
        <div className="w-full max-w-sm">
          <SummaryPanel signals={analysis.signals} risk={analysis.risk} />
        </div>
      </div>
      <SignalsTable signals={analysis.signals} />
    </div>
  );
}
