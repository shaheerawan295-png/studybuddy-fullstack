import { auth } from "@/auth";
import Link from "next/link";

const modules = [
  {
    title: "AI Chat",
    description: "Ask questions, review tutor responses, and save helpful explanations.",
    href: "/chat",
    badge: "AI Chat",
    badgeClass: "bg-purple-300 text-purple-950",
  },
  {
    title: "PDF Tutor",
    description: "Upload study materials and receive a clear, structured summary.",
    href: "/pdf-tutor",
    badge: "PDF Tutor",
    badgeClass: "bg-cyan-300 text-cyan-950",
  },
  {
    title: "Quiz Generator",
    description: "Create practice questions with explanations for quick self-checking.",
    href: "/quiz",
    badge: "Quiz",
    badgeClass: "bg-amber-300 text-amber-950",
  },
  {
    title: "Flashcards",
    description: "Build active-recall cards for focused revision sessions.",
    href: "/flashcards",
    badge: "Flashcards",
    badgeClass: "bg-pink-300 text-pink-950",
  },
  {
    title: "Exam Roadmap",
    description: "Plan your preparation with a structured daily study schedule.",
    href: "/roadmap",
    badge: "Roadmap",
    badgeClass: "bg-sky-300 text-sky-950",
  },
  {
    title: "Analytics",
    description: "Monitor your progress, streak, and study activity in one place.",
    href: "/analytics",
    badge: "Analytics",
    badgeClass: "bg-lime-300 text-lime-950",
  },
];

export default async function DashboardPage() {
  const session = await auth();

  // ❌ KOI REDIRECT NAHI — yeh line bilkul mat likhna
  // if (session?.user) { redirect("/dashboard") } ← KABHI NAHI

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="rounded-[28px] border-2 border-slate-900 bg-white p-6 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border-2 border-slate-900 bg-lime-400 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
              Dashboard
            </span>
            <span className="rounded-full border-2 border-slate-900 bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-slate-700 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
              XP Mode
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Welcome back, {session?.user?.name || "student"}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-700 sm:text-base">
            Choose your next power-up and keep your revision flow loud, bright, and productive.
          </p>
        </header>

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {modules.map((module) => (
            <Link
              key={module.href}
              href={module.href}
              className="group rounded-[24px] border-2 border-slate-900 bg-white p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-all duration-200 hover:-translate-y-1 hover:translate-x-0.5 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]"
            >
              <span className={`inline-flex rounded-full border-2 border-slate-900 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.2em] shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] ${module.badgeClass}`}>
                {module.badge}
              </span>
              <h2 className="mt-4 text-lg font-black text-slate-900">{module.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">{module.description}</p>
              <span className="mt-5 inline-flex text-sm font-black text-slate-900 transition-transform duration-200 group-hover:translate-x-1">
                Open module →
              </span>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}