"use client";

import { useCallback } from "react";
import type { Signal, Series } from "@/lib/types";

function download(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function ExportButtons({ series, signals, chartId }: { series: Series; signals: Signal[]; chartId: string }) {
  const onExportCsv = useCallback(() => {
    const header = "t,o,h,l,c,v";
    const rows = series
      .map((candle) =>
        [candle.t, candle.o ?? "", candle.h ?? "", candle.l ?? "", candle.c, candle.v ?? ""].join(",")
      )
      .join("\n");
    download("chart2signals.csv", `${header}\n${rows}`, "text/csv");
  }, [series]);

  const onExportJson = useCallback(() => {
    download("chart2signals.json", JSON.stringify({ series, signals }, null, 2), "application/json");
  }, [series, signals]);

  const onExportPng = useCallback(async () => {
    const container = document.getElementById(chartId);
    if (!container) return;
    const svg = container.querySelector("svg");
    if (!svg) return;
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);
    const image = new Image();
    const canvas = document.createElement("canvas");
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    await new Promise<void>((resolve) => {
      image.onload = () => {
        ctx.fillStyle = "#020617";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(svgUrl);
        resolve();
      };
      image.src = svgUrl;
    });
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "chart2signals.png";
      link.click();
      URL.revokeObjectURL(url);
    });
  }, [chartId]);

  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={onExportPng} className="rounded-md border border-slate-700 px-3 py-2 text-sm hover:border-slate-500">
        Exportera PNG
      </button>
      <button onClick={onExportCsv} className="rounded-md border border-slate-700 px-3 py-2 text-sm hover:border-slate-500">
        Exportera CSV
      </button>
      <button onClick={onExportJson} className="rounded-md border border-slate-700 px-3 py-2 text-sm hover:border-slate-500">
        Exportera JSON
      </button>
    </div>
  );
}
