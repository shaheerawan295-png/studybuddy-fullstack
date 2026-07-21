"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import ExportActions from "@/components/ExportActions";
import { Skeleton, SkeletonCard } from "@/components/ui/Skeleton";
import { fetchJson, getErrorMessage } from "@/lib/api";

interface DailyTask {
  day: number;
  title: string;
  topics: string[];
  actionItem: string;
  completed?: boolean;
}

type RoadmapResponse = {
  subject: string;
  totalDays: number;
  dailyHours: number;
  tasks: DailyTask[];
};

function RoadmapSkeleton() {
  return (
    <div className="space-y-4">
      <SkeletonCard />
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
      </div>
    </div>
  );
}

function buildRoadmapMarkdown(roadmap: RoadmapResponse | null) {
  if (!roadmap) return "";

  const tasks = roadmap.tasks
    .map(
      (task) => `## Day ${task.day}: ${task.title}

Topics:
${task.topics.map((topic) => `- ${topic}`).join("\n")}

Goal: ${task.actionItem}
Status: ${task.completed ? "Completed" : "Pending"}`
    )
    .join("\n\n");

  return `# ${roadmap.subject} Study Roadmap

- Duration: ${roadmap.totalDays} days
- Daily study time: ${roadmap.dailyHours} hour(s)

${tasks}
`;
}

export default function RoadmapPage() {
  const [subject, setSubject] = useState("");
  const [totalDays, setTotalDays] = useState(7);
  const [dailyHours, setDailyHours] = useState(2);
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null);

  const roadmapMarkdown = useMemo(() => buildRoadmapMarkdown(roadmap), [roadmap]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || loading) return;

    setLoading(true);
    setRoadmap(null);

    try {
      const data = await fetchJson<RoadmapResponse>("/api/roadmap/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, totalDays, dailyHours }),
      });

      setRoadmap(data);
      toast.success("Study roadmap generated successfully.");
    } catch (error) {
      console.error("Roadmap generation error:", error);
      toast.error(getErrorMessage(error, "Failed to generate a roadmap. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskCompletion = (index: number) => {
    if (!roadmap) return;

    const updatedTasks = roadmap.tasks.map((task, taskIndex) =>
      taskIndex === index ? { ...task, completed: !task.completed } : task
    );

    setRoadmap({ ...roadmap, tasks: updatedTasks });
  };

  const completedCount = roadmap?.tasks.filter((task) => task.completed).length ?? 0;
  const taskCount = roadmap?.tasks.length ?? 0;
  const progressPercent = taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-col gap-4 rounded-[28px] border-2 border-slate-900 bg-white p-6 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] sm:p-8 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="rounded-full border-2 border-slate-900 bg-sky-300 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.2em] text-sky-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
              Study Roadmap
            </span>
            <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Build a plan that actually feels doable.
            </h1>
            <p className="mt-2 text-sm leading-7 text-slate-700 sm:text-base">
              Create a realistic day-by-day plan for your next exam or project.
            </p>
          </div>

          {roadmap && (
            <ExportActions
              targetId="roadmap-export"
              filename={`${roadmap.subject} roadmap`}
              markdown={roadmapMarkdown}
            />
          )}
        </div>

        {!roadmap && (
          <form
            onSubmit={handleGenerate}
            className="space-y-6 rounded-[24px] border-2 border-slate-900 bg-white p-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] sm:p-8"
          >
            <div>
              <label className="mb-2 block text-sm font-black uppercase tracking-[0.2em] text-slate-700">
                Exam name or subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Computer Networks Midterm, Calculus II, Macroeconomics"
                className="min-h-[44px] w-full rounded-xl border-2 border-slate-900 bg-stone-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:border-lime-400 focus:outline-none"
                required
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-black uppercase tracking-[0.2em] text-slate-700">
                  Total days available
                </label>
                <select
                  value={totalDays}
                  onChange={(e) => setTotalDays(Number(e.target.value))}
                  className="min-h-[44px] w-full rounded-xl border-2 border-slate-900 bg-stone-50 px-4 py-2.5 text-sm text-slate-900 focus:border-lime-400 focus:outline-none"
                >
                  <option value={3}>3 days</option>
                  <option value={7}>7 days</option>
                  <option value={14}>14 days</option>
                  <option value={30}>30 days</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-black uppercase tracking-[0.2em] text-slate-700">
                  Daily study hours
                </label>
                <select
                  value={dailyHours}
                  onChange={(e) => setDailyHours(Number(e.target.value))}
                  className="min-h-[44px] w-full rounded-xl border-2 border-slate-900 bg-stone-50 px-4 py-2.5 text-sm text-slate-900 focus:border-lime-400 focus:outline-none"
                >
                  <option value={1}>1 hour per day</option>
                  <option value={2}>2 hours per day</option>
                  <option value={4}>4 hours per day</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !subject.trim()}
              className="min-h-[44px] w-full rounded-xl border-2 border-slate-900 bg-lime-400 py-3 text-sm font-black text-slate-950 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Generating roadmap..." : "Generate study plan"}
            </button>
          </form>
        )}

        {loading && <RoadmapSkeleton />}

        {roadmap && (
          <div id="roadmap-export" className="space-y-6">
            <div className="space-y-4 rounded-[24px] border-2 border-slate-900 bg-white p-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] sm:p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-sky-700">
                    Target subject
                  </span>
                  <h2 className="mt-1 text-2xl font-black text-slate-900">{roadmap.subject}</h2>
                  <p className="mt-1 text-sm text-slate-700">
                    {roadmap.totalDays} days planned at {roadmap.dailyHours} hours per day
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setRoadmap(null)}
                  className="no-print self-start rounded-xl border-2 border-slate-900 bg-white px-4 py-2 text-sm font-black text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none md:self-auto"
                >
                  Create new plan
                </button>
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-sm text-slate-700">
                  <span>Overall progress</span>
                  <span className="font-black text-emerald-700">
                    {progressPercent}% completed ({completedCount}/{taskCount} days)
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-stone-200">
                  <div
                    className="h-2.5 rounded-full bg-lime-500 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {roadmap.tasks.map((task, idx) => (
                <div
                  key={`${task.day}-${task.title}`}
                  className={`rounded-[20px] border-2 p-5 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition-colors md:p-6 ${
                    task.completed
                      ? "border-emerald-600 bg-emerald-50/80 opacity-80"
                      : "border-slate-900 bg-white hover:border-lime-400"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <button
                      type="button"
                      onClick={() => toggleTaskCompletion(idx)}
                      aria-label={`Mark day ${task.day} ${task.completed ? "incomplete" : "complete"}`}
                      className={`no-print mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-xs transition-colors ${
                        task.completed
                          ? "border-emerald-500 bg-emerald-600 text-white"
                          : "border-slate-300 text-transparent hover:border-slate-400"
                      }`}
                    >
                      <span
                        className={`h-2.5 w-2.5 rounded-sm ${
                          task.completed ? "bg-white" : "bg-transparent"
                        }`}
                      />
                    </button>

                    <div className="min-w-0 flex-1 space-y-3">
                      <h3
                        className={`text-base font-semibold md:text-lg ${
                          task.completed ? "text-slate-500 line-through" : "text-slate-900"
                        }`}
                      >
                        Day {task.day}: {task.title}
                      </h3>

                      <div className="flex flex-wrap gap-2">
                        {task.topics.map((topic) => (
                          <span
                            key={topic}
                            className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                        <span className="font-semibold text-slate-900">Goal: </span>
                        {task.actionItem}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
