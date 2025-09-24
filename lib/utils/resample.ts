import type { Series } from "@/lib/types";

export function resampleSeries(series: Series, target = 200): Series {
  if (series.length <= target) return series;
  const factor = series.length / target;
  return Array.from({ length: target }).map((_, i) => {
    const index = Math.floor(i * factor);
    return series[Math.min(series.length - 1, index)];
  });
}
