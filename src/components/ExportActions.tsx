"use client";

import { toast } from "sonner";
import { downloadMarkdown, printElementAsPdf } from "@/lib/export";

type ExportActionsProps = {
  targetId: string;
  filename: string;
  markdown: string;
  disabled?: boolean;
  className?: string;
};

export default function ExportActions({
  targetId,
  filename,
  markdown,
  disabled = false,
  className = "",
}: ExportActionsProps) {
  const handlePdf = () => {
    try {
      printElementAsPdf(targetId, filename);
      toast.success("Export opened successfully.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "PDF export failed.");
    }
  };

  const handleMarkdown = () => {
    try {
      downloadMarkdown(filename, markdown);
      toast.success("Markdown file downloaded.");
    } catch {
      toast.error("Markdown export failed.");
    }
  };

  return (
    <div className={`no-print flex flex-wrap items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={handlePdf}
        disabled={disabled}
        className="min-h-[44px] rounded-xl border-2 border-slate-900 bg-white px-3 py-2 text-sm font-black text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        📥 Export as PDF
      </button>
      <button
        type="button"
        onClick={handleMarkdown}
        disabled={disabled}
        className="min-h-[44px] rounded-xl border-2 border-slate-900 bg-lime-400 px-3 py-2 text-sm font-black text-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        Export Markdown
      </button>
    </div>
  );
}
