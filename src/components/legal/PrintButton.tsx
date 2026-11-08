"use client";

import { Upload } from "lucide-react";

/** "Download PDF": opens the browser print dialog; the print stylesheet keeps only the document. */
export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="flex items-center gap-2 text-label-strong text-cyan hover:underline"
    >
      <Upload size={16} strokeWidth={1.5} aria-hidden />
      Download PDF
    </button>
  );
}
