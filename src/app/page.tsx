import { auth } from "@/auth";
import Link from "next/link";
import { permanentRedirect } from "next/navigation";  

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    permanentRedirect("/dashboard");  
   }

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 px-4 py-10 text-slate-900">
      <section className="w-full max-w-2xl space-y-6">
        <div className="rounded-[28px] border-2 border-slate-900 bg-white p-8 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] sm:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border-2 border-slate-900 bg-lime-400 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
              StudyBuddy AI
            </span>
            <span className="rounded-full border-2 border-slate-900 bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-slate-700 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
              Free to Start
            </span>
          </div>
          <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            Your focused AI study workspace.
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-700 sm:text-base">
            Chat with a tutor, summarize PDFs, generate quizzes, build flashcards,
            and plan exam prep — all in one loud, bright, productive place.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/login"
              className="rounded-[14px] border-2 border-slate-900 bg-slate-900 px-6 py-3 text-sm font-black uppercase tracking-[0.15em] text-white shadow-[4px_4px_0px_0px_rgba(99,102,241,1)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_rgba(99,102,241,1)]"
            >
              Log in →
            </Link>
            <Link
              href="/signup"
              className="rounded-[14px] border-2 border-slate-900 bg-white px-6 py-3 text-sm font-black uppercase tracking-[0.15em] text-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_rgba(15,23,42,1)]"
            >
              Create account
            </Link>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {[
            { label: "AI Chat",    color: "bg-purple-300 text-purple-950" },
            { label: "PDF Tutor",  color: "bg-cyan-300 text-cyan-950"    },
            { label: "Quiz",       color: "bg-amber-300 text-amber-950"  },
            { label: "Flashcards", color: "bg-pink-300 text-pink-950"    },
            { label: "Roadmap",    color: "bg-sky-300 text-sky-950"      },
            { label: "Analytics",  color: "bg-lime-300 text-lime-950"    },
          ].map((f) => (
            <span
              key={f.label}
              className={`inline-flex rounded-full border-2 border-slate-900 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.2em] shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] ${f.color}`}
            >
              {f.label}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}