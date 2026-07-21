"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Skeleton, SkeletonCard } from "@/components/ui/Skeleton";
import { fetchJson, getErrorMessage } from "@/lib/api";

interface AnalyticsData {
  streakCount: number;
  lastStudyDate: string | null;
  totalFlashcardDecks: number;
  totalQuizzesTaken: number;
  totalNotesSaved: number;
}

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-36 rounded-2xl" />
      <div className="grid gap-5 sm:grid-cols-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingStudy, setLoggingStudy] = useState(false);

  const fetchAnalytics = useCallback(async () => {
    try {
      const json = await fetchJson<AnalyticsData>("/api/analytics");
      setData(json);
    } catch (error) {
      console.error("Failed to load analytics", error);
      toast.error(getErrorMessage(error, "Failed to load analytics."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    fetchJson<AnalyticsData>("/api/analytics")
      .then((json) => {
        if (isActive) setData(json);
      })
      .catch((error) => {
        console.error("Failed to load analytics", error);
        toast.error(getErrorMessage(error, "Failed to load analytics."));
      })
      .finally(() => {
        if (isActive) setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const handleLogStudySession = async () => {
    setLoggingStudy(true);
    try {
      await fetchJson("/api/analytics", { method: "POST" });
      await fetchAnalytics();
      toast.success("Study session logged successfully.");
    } catch (error) {
      console.error("Failed to log study session", error);
      toast.error(getErrorMessage(error, "Failed to log your study session."));
    } finally {
      setLoggingStudy(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="rounded-[28px] border-2 border-slate-900 bg-white p-6 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] sm:p-8">
          <span className="rounded-full border-2 border-slate-900 bg-lime-400 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
            Analytics & Progress
          </span>
          <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Your progress is gaining XP.
          </h1>
          <p className="mt-2 text-sm leading-7 text-slate-700 sm:text-base">
            Review your streak, study activity, and the learning tools you use most often.
          </p>
        </div>

        {loading ? (
          <AnalyticsSkeleton />
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col items-start justify-between gap-6 rounded-[24px] border-2 border-slate-900 bg-amber-50 p-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] md:flex-row md:items-center md:p-8">
              <div>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-amber-800">
                  Current streak
                </span>
                <h2 className="mt-2 text-3xl font-black text-amber-900 md:text-4xl">
                  {data?.streakCount ?? 0} day streak
                </h2>
                <p className="mt-2 text-sm leading-7 text-amber-800">
                  {data?.streakCount && data.streakCount > 0
                    ? "You are building a steady study rhythm. Keep it going."
                    : "Log a study session today to start your streak."}
                </p>
                {data?.lastStudyDate && (
                  <p className="mt-1 text-sm text-amber-800/80">
                    Last study date: {new Date(data.lastStudyDate).toLocaleDateString()}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleLogStudySession}
                disabled={loggingStudy}
                className="min-h-[44px] rounded-xl border-2 border-slate-900 bg-white px-6 py-3 text-sm font-black text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loggingStudy ? "Logging..." : "Log study session"}
              </button>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <div className="space-y-2 rounded-[20px] border-2 border-slate-900 bg-white p-6 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">
                  Flashcard decks
                </span>
                <p className="text-3xl font-black text-purple-700">
                  {data?.totalFlashcardDecks ?? 0}
                </p>
                <p className="text-sm text-slate-700">Created for quick revision</p>
              </div>

              <div className="space-y-2 rounded-[20px] border-2 border-slate-900 bg-white p-6 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">
                  Quizzes attempted
                </span>
                <p className="text-3xl font-black text-emerald-700">
                  {data?.totalQuizzesTaken ?? 0}
                </p>
                <p className="text-sm text-slate-700">Reviewed with AI explanations</p>
              </div>

              <div className="space-y-2 rounded-[20px] border-2 border-slate-900 bg-white p-6 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">
                  Saved study notes
                </span>
                <p className="text-3xl font-black text-fuchsia-700">
                  {data?.totalNotesSaved ?? 0}
                </p>
                <p className="text-sm text-slate-700">Collected from chats and PDFs</p>
              </div>
            </div>

            <div className="rounded-[24px] border-2 border-slate-900 bg-white p-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
              <h3 className="text-lg font-black text-slate-900">Recommended next step</h3>
              <p className="mt-2 text-sm leading-7 text-slate-700">
                Consistency matters more than intensity. Try one short quiz or one flashcard review today to keep your momentum strong.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
