import { randomUUID } from "crypto";
import type { RiskPlan } from "@/lib/signals/risk";
import type { Signal, Series } from "@/lib/types";

export type AnalysisSnapshot = {
  series: Series;
  signals: Signal[];
  risk: Record<string, RiskPlan>;
  meta?: Record<string, unknown>;
};

const store = new Map<string, AnalysisSnapshot>();

export function createId(): string {
  return randomUUID();
}

export function saveAnalysis(data: AnalysisSnapshot): string {
  const id = createId();
  store.set(id, data);
  return id;
}

export function updateAnalysis(id: string, data: AnalysisSnapshot): void {
  store.set(id, data);
}

export function getAnalysis(id: string): AnalysisSnapshot | undefined {
  return store.get(id);
}
