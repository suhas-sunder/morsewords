import type { PrintableChart } from "~/client/data/printableCharts";
import { downloadBlobFile } from "./actionOutputUtils";

export type PrintableChartFormat = "pdf" | "png" | "jpg" | "webp";

export async function downloadPrintableChart(chart: PrintableChart, format: PrintableChartFormat) {
  const response = await fetch(chart.url, { credentials: "omit", signal: AbortSignal.timeout(30_000) });
  if (!response.ok || !response.headers.get("content-type")?.startsWith("image/png")) {
    throw new Error("The original chart could not be loaded.");
  }
  const source = await response.blob();
  let output = source;
  if (format === "pdf") {
    // Loaded only after a PDF download is requested; no conversion runs on the server.
    const { PDFDocument, PageSizes } = await import("pdf-lib");
    const pdf = await PDFDocument.create();
    const image = await pdf.embedPng(await source.arrayBuffer());
    const page = pdf.addPage(PageSizes.A4);
    const margin = 18;
    const fitted = image.scaleToFit(page.getWidth() - margin * 2, page.getHeight() - margin * 2);
    page.drawImage(image, {
      x: (page.getWidth() - fitted.width) / 2,
      y: (page.getHeight() - fitted.height) / 2,
      ...fitted,
    });
    pdf.setTitle(chart.title);
    pdf.setCreator("MorseWords");
    output = new Blob([new Uint8Array(await pdf.save())], { type: "application/pdf" });
  } else if (format !== "png") {
    output = await convertChartImage(source, format);
  }
  const result = downloadBlobFile({ blob: output, filename: `morsewords-${chart.id}-chart.${format}` });
  if (!result.ok) throw new Error(result.message);
}

async function convertChartImage(source: Blob, format: "jpg" | "webp") {
  const url = URL.createObjectURL(source);
  const canvas = document.createElement("canvas");
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Image conversion is unavailable.");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0);
    const mime = format === "jpg" ? "image/jpeg" : "image/webp";
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, mime, 0.95));
    // Some browsers silently fall back to PNG for unsupported output types.
    if (!blob || blob.type !== mime) throw new Error("This image format is unavailable.");
    return blob;
  } finally {
    URL.revokeObjectURL(url);
    canvas.width = canvas.height = 0;
  }
}
