"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import ExportActions from "@/components/ExportActions";
import { Skeleton, SkeletonCard } from "@/components/ui/Skeleton";
import { fetchJson, getErrorMessage } from "@/lib/api";

interface Question {
  _id?: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

type QuizData = {
  quizId: string;
  questions: Question[];
  topic: string;
  difficulty?: string;
};

function QuizSkeleton() {
  return (
    <div className="rounded-[24px] border-2 border-slate-900 bg-white p-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="mt-5 h-8 w-4/5" />
      <div className="mt-6 space-y-3">
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    </div>
  );
}

function buildQuizMarkdown(
  quizData: QuizData | null,
  score: number,
  answers: Record<number, number>
) {
  if (!quizData) return "";

  const questions = quizData.questions
    .map((question, index) => {
      const selected = answers[index];
      const selectedText =
        typeof selected === "number" ? question.options[selected] : "Not answered";
      const correctText = question.options[question.correctAnswer] ?? "Unknown";

      return `## Question ${index + 1}

${question.question}

- Your answer: ${selectedText}
- Correct answer: ${correctText}
- Explanation: ${question.explanation}`;
    })
    .join("\n\n");

  return `# Quiz Results: ${quizData.topic}

- Score: ${score}/${quizData.questions.length}
- Difficulty: ${quizData.difficulty ?? "Not specified"}

${questions}
`;
}

export default function QuizPage() {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [numQuestions, setNumQuestions] = useState(5);
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const quizMarkdown = useMemo(
    () => buildQuizMarkdown(quizData, score, answers),
    [answers, quizData, score]
  );

  const resetQuizState = () => {
    setQuizData(null);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setQuizFinished(false);
    setAnswers({});
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || loading) return;

    setLoading(true);
    resetQuizState();

    try {
      const data = await fetchJson<QuizData>("/api/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, difficulty, numQuestions }),
      });

      setQuizData({ ...data, difficulty });
      toast.success("Quiz generated successfully.");
    } catch (error) {
      console.error("Quiz generation error:", error);
      toast.error(getErrorMessage(error, "Failed to generate a quiz. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (optionIdx: number) => {
    if (isSubmitted) return;
    setSelectedOption(optionIdx);
  };

  const handleConfirmAnswer = () => {
    if (selectedOption === null || !quizData) return;

    const currentQ = quizData.questions[currentIndex];
    setAnswers((prev) => ({ ...prev, [currentIndex]: selectedOption }));

    if (selectedOption === currentQ.correctAnswer) {
      setScore((prev) => prev + 1);
    }

    setIsSubmitted(true);
  };

  const handleNextQuestion = async () => {
    if (!quizData) return;

    if (currentIndex + 1 < quizData.questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      try {
        await fetchJson("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "quiz-complete" }),
        });
      } catch (error) {
        console.error("Failed to update quiz analytics", error);
      }

      setQuizFinished(true);
    }
  };

  const currentQuestion = quizData?.questions[currentIndex];

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex flex-col gap-4 rounded-[28px] border-2 border-slate-900 bg-white p-6 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] sm:p-8 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="rounded-full border-2 border-slate-900 bg-amber-300 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.2em] text-amber-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
              Quiz Generator
            </span>
            <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Spin up a challenge fast.
            </h1>
            <p className="mt-2 text-sm leading-7 text-slate-700 sm:text-base">
              Generate targeted practice questions and review the explanations instantly.
            </p>
          </div>

          {quizFinished && quizData && (
            <ExportActions
              targetId="quiz-results-export"
              filename={`${quizData.topic} quiz results`}
              markdown={quizMarkdown}
            />
          )}
        </div>

        {!quizData && (
          <form
            onSubmit={handleGenerate}
            className="space-y-5 rounded-[24px] border-2 border-slate-900 bg-white p-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] sm:p-8"
          >
            <div>
              <label className="mb-2 block text-sm font-black uppercase tracking-[0.2em] text-slate-700">
                Subject or topic
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Advanced React Hooks, Data Structures & Algorithms, Macroeconomics..."
                className="min-h-[44px] w-full rounded-xl border-2 border-slate-900 bg-stone-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:border-lime-400 focus:outline-none"
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-black uppercase tracking-[0.2em] text-slate-700">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="min-h-[44px] w-full rounded-xl border-2 border-slate-900 bg-stone-50 px-4 py-2.5 text-sm text-slate-900 focus:border-lime-400 focus:outline-none"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-black uppercase tracking-[0.2em] text-slate-700">
                  Number of questions
                </label>
                <select
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Number(e.target.value))}
                  className="min-h-[44px] w-full rounded-xl border-2 border-slate-900 bg-stone-50 px-4 py-2.5 text-sm text-slate-900 focus:border-lime-400 focus:outline-none"
                >
                  <option value={3}>3 questions</option>
                  <option value={5}>5 questions</option>
                  <option value={10}>10 questions</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="min-h-[44px] w-full rounded-xl border-2 border-slate-900 bg-lime-400 py-3 text-sm font-black text-slate-950 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Generating quiz..." : "Generate practice quiz"}
            </button>
          </form>
        )}

        {loading && (
          <div className="grid gap-4">
            <SkeletonCard />
            <QuizSkeleton />
          </div>
        )}

        {quizData && currentQuestion && !quizFinished && (
          <div className="space-y-6 rounded-[24px] border-2 border-slate-900 bg-white p-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] sm:p-8">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3 text-sm text-slate-600">
              <span>
                Topic: <strong className="text-slate-900">{quizData.topic}</strong>
              </span>
              <span>
                Question <strong>{currentIndex + 1}</strong> of <strong>{quizData.questions.length}</strong>
              </span>
            </div>

            <h2 className="text-lg font-black text-slate-900">{currentQuestion.question}</h2>

            <div className="space-y-3">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQuestion.correctAnswer;

                let optionStyle = "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100";

                if (isSubmitted) {
                  if (isCorrect) {
                    optionStyle = "border-emerald-200 bg-emerald-50 text-emerald-700";
                  } else if (isSelected && !isCorrect) {
                    optionStyle = "border-rose-200 bg-rose-50 text-rose-700";
                  } else {
                    optionStyle = "border-slate-200 bg-slate-50 text-slate-400";
                  }
                } else if (isSelected) {
                  optionStyle = "border-indigo-300 bg-indigo-50 text-indigo-700";
                }

                return (
                  <button
                    key={`${opt}-${idx}`}
                    type="button"
                    onClick={() => handleOptionSelect(idx)}
                    disabled={isSubmitted}
                    className={`flex min-h-[44px] w-full items-center justify-between rounded-xl border p-4 text-left text-sm transition-colors ${optionStyle}`}
                  >
                    <span>{opt}</span>
                    {isSubmitted && isCorrect && <span className="text-xs font-semibold">Correct</span>}
                    {isSubmitted && isSelected && !isCorrect && (
                      <span className="text-xs font-semibold">Incorrect</span>
                    )}
                  </button>
                );
              })}
            </div>

            {isSubmitted && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                <span className="block font-semibold text-indigo-700">Explanation</span>
                <p className="mt-1 leading-7">{currentQuestion.explanation}</p>
              </div>
            )}

            <div className="flex justify-end border-t border-slate-200 pt-3">
              {!isSubmitted ? (
                <button
                  type="button"
                  onClick={handleConfirmAnswer}
                  disabled={selectedOption === null}
                  className="min-h-[44px] rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Submit answer
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="min-h-[44px] rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                >
                  {currentIndex + 1 < quizData.questions.length ? "Next question" : "Finish quiz"}
                </button>
              )}
            </div>
          </div>
        )}

        {quizFinished && quizData && (
          <div id="quiz-results-export" className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Quiz complete</h2>
                <p className="mt-1 text-sm text-slate-600">
                  You scored {score} out of {quizData.questions.length}.
                </p>
              </div>
              <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                {Math.round((score / quizData.questions.length) * 100)}% accuracy
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
