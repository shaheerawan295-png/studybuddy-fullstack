"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App route error:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-slate-900 sm:px-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Something went wrong.</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          StudyBuddy hit an unexpected issue while loading this page. Please try again.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-5 min-h-[44px] rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
