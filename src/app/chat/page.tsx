import ChatBox from "@/components/ChatBox";

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-stone-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-[28px] border-2 border-slate-900 bg-white p-6 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border-2 border-slate-900 bg-purple-300 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.2em] text-purple-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
              AI Chat
            </span>
            <span className="rounded-full border-2 border-slate-900 bg-lime-400 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
              Turbo tutor
            </span>
          </div>
          <h1 className="mt-4 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Study chat that actually feels alive.
          </h1>
          <p className="mt-2 text-sm leading-7 text-slate-700 sm:text-base">
            Ask questions, attach a PDF, and save useful explanations as study notes.
          </p>
        </div>
        <ChatBox />
      </div>
    </div>
  );
}
