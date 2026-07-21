"use client";

import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import ExportActions from "@/components/ExportActions";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { fetchJson, getErrorMessage } from "@/lib/api";

interface NoteItem {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

type NotesResponse = {
  notes?: NoteItem[];
};

function buildNotesMarkdown(notes: NoteItem[]) {
  if (notes.length === 0) return "";

  return `# StudyBuddy Saved Notes

${notes
  .map(
    (note) => `## ${note.title}

Saved: ${new Date(note.createdAt).toLocaleDateString()}

${note.content}`
  )
  .join("\n\n")}
`;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const notesMarkdown = useMemo(() => buildNotesMarkdown(notes), [notes]);

  useEffect(() => {
    let isActive = true;

    fetchJson<NotesResponse>("/api/notes")
      .then((data) => {
        if (isActive) setNotes(data.notes ?? []);
      })
      .catch((error) => {
        console.error("Failed to load notes:", error);
        toast.error(getErrorMessage(error, "Failed to load notes."));
      })
      .finally(() => {
        if (isActive) setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const deleteNote = async (id: string) => {
    try {
      await fetchJson(`/api/notes/${id}`, { method: "DELETE" });
      setNotes((prev) => prev.filter((note) => note._id !== id));
      toast.success("Note deleted.");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(getErrorMessage(error, "Failed to delete note."));
    }
  };

  const requestDelete = (note: NoteItem) => {
    toast("Delete this note?", {
      description: note.title,
      action: {
        label: "Delete",
        onClick: () => void deleteNote(note._id),
      },
    });
  };

  const handleCopy = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      toast.success("Copied to clipboard.");
      window.setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Failed to copy note.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Saved Notes
            </h1>
            <p className="mt-2 text-sm leading-7 text-slate-600 sm:text-base">
              Keep your AI explanations and study insights in one organized place.
            </p>
          </div>

          {notes.length > 0 && (
            <ExportActions
              targetId="notes-export"
              filename="studybuddy saved notes"
              markdown={notesMarkdown}
            />
          )}
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : notes.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white py-20 text-center shadow-sm">
            <p className="text-base font-medium text-slate-900">No notes saved yet.</p>
            <p className="mt-2 text-sm text-slate-600">
              Save useful AI responses from chat or the PDF tutor to build your library.
            </p>
          </div>
        ) : (
          <div id="notes-export" className="grid gap-6 md:grid-cols-2">
            {notes.map((note) => (
              <article
                key={note._id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-indigo-200"
              >
                <div>
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <h2 className="min-w-0 truncate font-semibold text-slate-900">
                      {note.title}
                    </h2>
                    <span className="whitespace-nowrap text-[11px] text-slate-500">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="max-h-60 overflow-y-auto pr-2 text-sm leading-relaxed text-slate-600">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight]}
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        ul: ({ children }) => (
                          <ul className="mb-2 list-inside list-disc">{children}</ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="mb-2 list-inside list-decimal">{children}</ol>
                        ),
                        code: ({ className, children }) => {
                          const isInline = !className;
                          return isInline ? (
                            <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs text-indigo-700">
                              {children}
                            </code>
                          ) : (
                            <code className={className}>{children}</code>
                          );
                        },
                        pre: ({ children }) => (
                          <pre className="my-2 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs">
                            {children}
                          </pre>
                        ),
                      }}
                    >
                      {note.content}
                    </ReactMarkdown>
                  </div>
                </div>

                <div className="no-print mt-4 flex items-center justify-between border-t border-slate-200 pt-3">
                  <button
                    type="button"
                    onClick={() => handleCopy(note.content, note._id)}
                    className="text-sm text-slate-600 transition-colors hover:text-slate-900"
                  >
                    {copiedId === note._id ? "Copied" : "Copy"}
                  </button>

                  <button
                    type="button"
                    onClick={() => requestDelete(note)}
                    className="text-sm text-rose-600 transition-colors hover:text-rose-700"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
