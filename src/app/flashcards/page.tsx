"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Skeleton, SkeletonCard } from "@/components/ui/Skeleton";
import { fetchJson, getErrorMessage } from "@/lib/api";

interface Flashcard {
  front: string;
  back: string;
}

type FlashcardsResponse = {
  cards?: Flashcard[];
  title?: string;
};

function FlashcardDeckSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-5 w-48" />
      <Skeleton className="h-72 rounded-2xl" />
      <div className="flex justify-between">
        <Skeleton className="h-10 w-28 rounded-lg" />
        <Skeleton className="h-10 w-28 rounded-lg" />
      </div>
    </div>
  );
}

export default function FlashcardsPage() {
  const [topic, setTopic] = useState("");
  const [cardCount, setCardCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || loading) return;

    setLoading(true);
    setCards([]);
    setCurrentIndex(0);
    setIsFlipped(false);

    try {
      const data = await fetchJson<FlashcardsResponse>("/api/flashcards/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, cardCount }),
      });

      setCards(data.cards ?? []);
      toast.success("Flashcard deck generated successfully.");
    } catch (error) {
      console.error("Flashcards generation error:", error);
      toast.error(getErrorMessage(error, "Failed to generate flashcards. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < cards.length) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const currentCard = cards[currentIndex];

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-[28px] border-2 border-slate-900 bg-white p-6 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] sm:p-8">
          <span className="rounded-full border-2 border-slate-900 bg-pink-300 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.2em] text-pink-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
            Flashcard Decks
          </span>
          <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Build recall power in one click.
          </h1>
          <p className="mt-2 text-sm leading-7 text-slate-700 sm:text-base">
            Generate active-recall cards for faster review and stronger long-term memory.
          </p>
        </div>

        {cards.length === 0 && (
          <form
            onSubmit={handleGenerate}
            className="space-y-5 rounded-[24px] border-2 border-slate-900 bg-white p-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] sm:p-8"
          >
            <div>
              <label className="mb-2 block text-sm font-black uppercase tracking-[0.2em] text-slate-700">
                Topic or subject
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., JavaScript ES6, Database Normalization, Cell Biology"
                className="min-h-[44px] w-full rounded-xl border-2 border-slate-900 bg-stone-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 focus:border-lime-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-black uppercase tracking-[0.2em] text-slate-700">
                Number of cards
              </label>
              <select
                value={cardCount}
                onChange={(e) => setCardCount(Number(e.target.value))}
                className="min-h-[44px] w-full rounded-xl border-2 border-slate-900 bg-stone-50 px-4 py-2.5 text-sm text-slate-900 focus:border-lime-400 focus:outline-none"
              >
                <option value={5}>5 cards</option>
                <option value={10}>10 cards</option>
                <option value={15}>15 cards</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="min-h-[44px] w-full rounded-xl border-2 border-slate-900 bg-lime-400 py-3 text-sm font-black text-slate-950 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Generating deck..." : "Generate flashcards"}
            </button>
          </form>
        )}

        {loading && (
          <div className="space-y-4">
            <SkeletonCard />
            <FlashcardDeckSkeleton />
          </div>
        )}

        {cards.length > 0 && currentCard && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[20px] border-2 border-slate-900 bg-white px-4 py-3 text-sm text-slate-700 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
              <span>
                Topic: <strong className="text-slate-900">{topic}</strong>
              </span>
              <span>
                Card <strong>{currentIndex + 1}</strong> of <strong>{cards.length}</strong>
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsFlipped((prev) => !prev)}
              className="relative flex min-h-[260px] w-full cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-slate-900 bg-white p-8 text-center shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-all hover:-translate-y-0.5 md:min-h-[300px]"
            >
              <span className="absolute right-4 top-4 rounded-full border-2 border-slate-900 bg-stone-50 px-2.5 py-1 text-xs font-black uppercase tracking-[0.2em] text-slate-700">
                {isFlipped ? "Answer" : "Question"}
              </span>

              <p className="max-w-xl text-xl font-black leading-relaxed text-slate-900 md:text-2xl">
                {isFlipped ? currentCard.back : currentCard.front}
              </p>

              <span className="mt-6 block text-sm font-semibold text-slate-700">
                Tap the card to {isFlipped ? "view the question" : "reveal the answer"}
              </span>
            </button>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="min-h-[44px] rounded-xl border-2 border-slate-900 bg-white px-5 py-2.5 text-sm font-black text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:cursor-not-allowed disabled:opacity-30"
              >
                Previous
              </button>

              <button
                type="button"
                onClick={() => setCards([])}
                className="text-sm font-semibold text-slate-700 underline transition-colors hover:text-slate-900"
              >
                Start a new deck
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={currentIndex === cards.length - 1}
                className="min-h-[44px] rounded-xl border-2 border-slate-900 bg-lime-400 px-5 py-2.5 text-sm font-black text-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:cursor-not-allowed disabled:opacity-30"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
