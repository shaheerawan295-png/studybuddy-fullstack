"use client";

import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import ExportActions from "@/components/ExportActions";
import { Skeleton, SkeletonCard } from "@/components/ui/Skeleton";
import { fetchJson, getErrorMessage } from "@/lib/api";

type PdfTutorResult = {
  explanation: string;
  pages: number;
  fileName: string;
};

function buildPdfTutorMarkdown(result: PdfTutorResult | null) {
  if (!result) return "";

  return `# PDF Tutor Summary: ${result.fileName}

- Pages: ${result.pages}

${result.explanation}
`;
}

function PdfTutorSkeleton() {
  return (
    <div className="space-y-4">
      <SkeletonCard />
      <div className="rounded-[24px] border-2 border-slate-900 bg-white p-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
        <Skeleton className="h-5 w-44" />
        <Skeleton className="mt-4 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-11/12" />
        <Skeleton className="mt-2 h-4 w-4/5" />
      </div>
    </div>
  );
}

export default function PdfTutorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PdfTutorResult | null>(null);
  const [savingNote, setSavingNote] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const markdown = useMemo(() => buildPdfTutorMarkdown(result), [result]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      toast.error("Only PDF files are supported. Please upload a readable document.");
      e.target.value = "";
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || loading) return;

    setLoading(true);
    setResult(null);
    setSavedSuccess(false);

    const formData = new FormData();
    formData.append("file", file);
    if (prompt.trim()) {
      formData.append("prompt", prompt.trim());
    }

    try {
      const data = await fetchJson<PdfTutorResult>("/api/pdf-tutor", {
        method: "POST",
        body: formData,
      });

      setResult(data);
      toast.success("PDF analysis completed successfully.");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(getErrorMessage(error, "Failed to process the document. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToNotes = async () => {
    if (!result) return;
    setSavingNote(true);

    try {
      await fetchJson("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `PDF Summary: ${result.fileName}`,
          content: result.explanation,
        }),
      });

      setSavedSuccess(true);
      toast.success("Saved to notes.");
    } catch (error) {
      console.error("Save note error:", error);
      toast.error(getErrorMessage(error, "Failed to save the summary as a note."));
    } finally {
      setSavingNote(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col gap-4 rounded-[28px] border-2 border-slate-900 bg-white p-6 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] sm:p-8 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="rounded-full border-2 border-slate-900 bg-cyan-300 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.2em] text-cyan-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
              PDF Tutor
            </span>
            <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Turn dense docs into a study shortcut.
            </h1>
            <p className="mt-2 text-sm leading-7 text-slate-700 sm:text-base">
              Upload a document and receive a concise, structured explanation.
            </p>
          </div>

          {result && (
            <ExportActions
              targetId="pdf-tutor-export"
              filename={`${result.fileName} summary`}
              markdown={markdown}
            />
          )}
        </div>

        <form
          onSubmit={handleUpload}
          className="space-y-4 rounded-[24px] border-2 border-slate-900 bg-white p-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] sm:p-8"
        >
          <div>
            <label className="mb-2 block text-sm font-black uppercase tracking-[0.2em] text-slate-700">
              Upload PDF
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="block min-h-[44px] w-full cursor-pointer rounded-xl border-2 border-slate-900 bg-stone-50 text-sm text-slate-700 file:mr-4 file:border-0 file:bg-lime-400 file:px-4 file:py-2.5 file:text-sm file:font-black file:text-slate-950 hover:file:bg-lime-300"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-black uppercase tracking-[0.2em] text-slate-700">
              Focus area or question
            </label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Specify any focus areas, key themes, or custom learning goals..."
              className="min-h-[44px] w-full rounded-xl border-2 border-slate-900 bg-stone-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:border-lime-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={!file || loading}
            className="flex min-h-[44px] w-full items-center justify-center rounded-xl border-2 border-slate-900 bg-lime-400 py-3 text-sm font-black text-slate-950 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Analyzing PDF..." : "Analyze document"}
          </button>
        </form>

        {loading && <PdfTutorSkeleton />}

        {result && (
          <div
            id="pdf-tutor-export"
            className="space-y-5 rounded-[24px] border-2 border-slate-900 bg-white p-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] sm:p-8"
          >
            <div className="flex flex-col gap-3 border-b-2 border-slate-900 pb-3 md:flex-row md:items-center md:justify-between">
              <div className="text-sm text-slate-700">
                File: <strong className="text-slate-900">{result.fileName}</strong>
                <span className="mx-2">|</span>
                Pages: <strong className="text-cyan-700">{result.pages}</strong>
              </div>

              <button
                type="button"
                onClick={handleSaveToNotes}
                disabled={savingNote || savedSuccess}
                className="no-print self-start rounded-xl border-2 border-slate-900 bg-white px-3 py-2 text-sm font-black text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 md:self-auto"
              >
                {savedSuccess ? "Saved to notes" : savingNote ? "Saving..." : "Save as note"}
              </button>
            </div>

            <div className="overflow-x-auto text-sm leading-relaxed text-slate-700">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                  ul: ({ children }) => (
                    <ul className="mb-3 list-inside list-disc space-y-1">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="mb-3 list-inside list-decimal space-y-1">{children}</ol>
                  ),
                  code: ({ className, children }) => {
                    const isInline = !className;
                    return isInline ? (
                      <code className="rounded bg-stone-100 px-1.5 py-0.5 font-mono text-xs text-cyan-700">
                        {children}
                      </code>
                    ) : (
                      <code className={className}>{children}</code>
                    );
                  },
                  pre: ({ children }) => (
                    <pre className="my-3 overflow-x-auto rounded-lg border-2 border-slate-900 bg-stone-50 p-4 font-mono text-xs">
                      {children}
                    </pre>
                  ),
                }}
              >
                {result.explanation}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
