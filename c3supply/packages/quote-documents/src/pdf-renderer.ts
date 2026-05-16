import type { QuotePdfRenderInput } from "./types";

export interface QuotePdfReadyDTO {
  html: string;
  fileName: string;
  pdfReady: true;
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function renderQuoteDocumentHtml(input: QuotePdfRenderInput): QuotePdfReadyDTO {
  if (!input.document.documentApproved) {
    throw new Error("Quote document must be approved before PDF-ready rendering.");
  }

  const lines = input.document.lines
    .map((line) => `<tr><td>${escapeHtml(line.description)}</td><td>${line.quantity}</td><td>${line.totalCents ?? 0}</td></tr>`)
    .join("");

  return {
    fileName: `quote-${input.document.id}.html`,
    pdfReady: true,
    html: `<!doctype html><html><body><h1>${escapeHtml(input.brandName)} Quote</h1><p>Human-reviewed quote document.</p><table>${lines}</table><p>${escapeHtml(input.document.terms.humanReviewStatement)}</p></body></html>`
  };
}
