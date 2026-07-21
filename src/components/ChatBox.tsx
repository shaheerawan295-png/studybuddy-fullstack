"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import { fetchJson, getErrorMessage } from "@/lib/api";
import { Skeleton } from "@/components/ui/Skeleton";

interface Message {
  role: "user" | "assistant";
  content: string;
}

type ChatHistoryResponse = {
  messages?: Message[];
};

type ChatResponse = {
  reply?: string;
};

type PdfTutorResponse = {
  explanation?: string;
};

function ChatHistorySkeleton() {
  return (
    <div className="space-y-4 py-2">
      <div className="flex justify-end">
        <Skeleton className="h-16 w-2/3 rounded-2xl" />
      </div>
      <div className="flex justify-start">
        <Skeleton className="h-24 w-4/5 rounded-2xl" />
      </div>
      <div className="flex justify-end">
        <Skeleton className="h-12 w-1/2 rounded-2xl" />
      </div>
    </div>
  );
}

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingHistory, setFetchingHistory] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [savedIndex, setSavedIndex] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await fetchJson<ChatHistoryResponse>("/api/chat/history");
        setMessages(data.messages ?? []);
      } catch (error) {
        console.error("Failed to load history:", error);
        toast.error(getErrorMessage(error, "Failed to load chat history."));
      } finally {
        setFetchingHistory(false);
      }
    };

    void fetchHistory();
  }, []);

  const handleSaveNote = async (content: string, idx: number) => {
    try {
      await fetchJson("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      setSavedIndex(idx);
      toast.success("Saved to notes.");
      window.setTimeout(() => setSavedIndex(null), 3000);
    } catch (error) {
      console.error("Save note error:", error);
      toast.error(getErrorMessage(error, "Failed to save note."));
    }
  };

  const clearChat = async () => {
    setClearing(true);
    try {
      await fetchJson("/api/chat/history", { method: "DELETE" });
      setMessages([]);
      toast.success("Chat history cleared.");
    } catch (error) {
      console.error("New chat error:", error);
      toast.error(getErrorMessage(error, "Failed to clear chat."));
    } finally {
      setClearing(false);
    }
  };

  const handleNewChat = () => {
    if (messages.length === 0 || clearing) return;

    toast("Start a new chat?", {
      description: "Your previous chat history will be cleared.",
      action: {
        label: "Clear",
        onClick: () => void clearChat(),
      },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are supported.");
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !selectedFile) || loading) return;

    const userMsg = input.trim();
    const currentFile = selectedFile;

    setInput("");
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    if (currentFile) {
      const displayMsg = `Uploaded PDF: \`${currentFile.name}\`${userMsg ? `\n\n${userMsg}` : ""}`;
      setMessages((prev) => [...prev, { role: "user", content: displayMsg }]);
      setLoading(true);

      try {
        const formData = new FormData();
        formData.append("file", currentFile);
        if (userMsg) formData.append("prompt", userMsg);

        const data = await fetchJson<PdfTutorResponse>("/api/pdf-tutor", {
          method: "POST",
          body: formData,
        });

        if (!data.explanation) {
          throw new Error("The PDF tutor returned an empty explanation.");
        }

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.explanation ?? "" },
        ]);
      } catch (error) {
        console.error("PDF send error:", error);
        toast.error(getErrorMessage(error, "Failed to analyze the PDF."));
      } finally {
        setLoading(false);
      }
      return;
    }

    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        text: m.content,
      }));

      const data = await fetchJson<ChatResponse>("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, history: historyPayload }),
      });

      if (!data.reply) {
        throw new Error("StudyBuddy returned an empty reply.");
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.reply ?? "" }]);
    } catch (error) {
      console.error("Chat error:", error);
      toast.error(getErrorMessage(error, "Failed to send the message."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex h-[40rem] w-full max-w-4xl flex-col overflow-hidden rounded-[28px] border-2 border-slate-900 bg-white shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
      <div className="flex items-center justify-between border-b-2 border-slate-900 bg-stone-50 p-4">
        <div>
          <h2 className="text-lg font-black text-slate-900">StudyBuddy AI</h2>
          <p className="mt-0.5 text-xs font-black uppercase tracking-[0.2em] text-purple-700">Groq-powered tutor</p>
        </div>

        <button
          type="button"
          onClick={handleNewChat}
          disabled={clearing || messages.length === 0}
          className="rounded-xl border-2 border-slate-900 bg-white px-3 py-1.5 text-xs font-black text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:cursor-not-allowed disabled:opacity-40"
        >
          {clearing ? "Clearing..." : "New chat"}
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto bg-stone-50 p-4">
        {fetchingHistory ? (
          <ChatHistorySkeleton />
        ) : messages.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-500">
            No conversation yet. Ask a question or attach a PDF to begin.
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={`${msg.role}-${idx}`}
              className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-[20px] border-2 px-4 py-3 text-sm leading-relaxed shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] ${
                  msg.role === "user"
                    ? "rounded-br-none border-slate-900 bg-lime-400 text-slate-950"
                    : "overflow-x-auto rounded-bl-none border-slate-900 bg-white text-slate-700"
                }`}
              >
                <ReactMarkdown
                  remarkPlugins={msg.role === "assistant" ? [remarkGfm] : undefined}
                  rehypePlugins={msg.role === "assistant" ? [rehypeHighlight] : undefined}
                  components={{
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    ul: ({ children }) => (
                      <ul className="mb-2 list-inside list-disc space-y-1">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="mb-2 list-inside list-decimal space-y-1">{children}</ol>
                    ),
                    code: ({ className, children }) => {
                      const isInline = !className;
                      return isInline ? (
                        <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-indigo-700">
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
                  {msg.content}
                </ReactMarkdown>
              </div>

              {msg.role === "assistant" && (
                <button
                  type="button"
                  onClick={() => handleSaveNote(msg.content, idx)}
                  className="mt-1 px-1 text-[11px] font-semibold text-slate-600 transition-colors hover:text-slate-900"
                >
                  {savedIndex === idx ? "Saved to notes" : "Save as note"}
                </button>
              )}
            </div>
          ))
        )}

        {loading && (
          <div className="flex justify-start">
            <div className="w-4/5 max-w-xl rounded-[20px] rounded-bl-none border-2 border-slate-900 bg-white p-4 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="mt-3 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-5/6" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="flex flex-col gap-2 border-t-2 border-slate-900 bg-white p-4">
        {selectedFile && (
          <div className="flex items-center justify-between rounded-lg border-2 border-slate-900 bg-stone-50 px-3 py-1.5 text-xs font-semibold text-slate-700">
            <span className="truncate">Selected PDF: {selectedFile.name}</span>
            <button
              type="button"
              onClick={() => setSelectedFile(null)}
              className="ml-2 font-black text-rose-600 transition-colors hover:text-rose-700"
              aria-label="Remove selected PDF"
            >
              ×
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <input type="file" accept=".pdf" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Attach PDF"
            className="min-h-[44px] rounded-xl border-2 border-slate-900 bg-stone-50 px-3 py-2.5 text-sm font-black text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            PDF
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={selectedFile ? "Ask something about this PDF..." : "Ask your study question..."}
            className="min-w-0 flex-1 rounded-xl border-2 border-slate-900 bg-stone-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:border-lime-400 focus:outline-none"
          />

          <button
            type="submit"
            disabled={loading || (!input.trim() && !selectedFile)}
            className="min-h-[44px] rounded-xl border-2 border-slate-900 bg-lime-400 px-5 py-2.5 text-sm font-black text-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
