import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import UserStat from "@/models/UserStat";
import FlashcardDeck from "@/models/Flashcard";
import Note from "@/models/Note";

function buildAnalyticsPayload(userStat: any, flashcardCount: number) {
  return {
    streakCount: userStat.streakCount || 0,
    lastStudyDate: userStat.lastStudyDate,
    totalFlashcardDecks: flashcardCount,
    totalQuizzesTaken: userStat.totalQuizzesTaken || 0,
    totalNotesSaved: userStat.totalNotesSaved || 0,
  };
}

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized! Pehle login karein." },
        { status: 401 }
      );
    }

    await connectDB();
    const userId = session.user.id || session.user.email;

    let userStat = await UserStat.findOne({ userId });

    if (!userStat) {
      userStat = await UserStat.create({ userId, streakCount: 0 });
    }

    // Dynamic Flashcard Decks Count
    const flashcardCount = await FlashcardDeck.countDocuments({ userId });
    const noteCount = await Note.countDocuments({ userId });

    // Streak Check Logic
    let currentStreak = userStat.streakCount;
    const now = new Date();
    const lastDate = userStat.lastStudyDate ? new Date(userStat.lastStudyDate) : null;

    if (lastDate) {
      const diffInDays = Math.floor(
        (now.getTime() - lastDate.getTime()) / (1000 * 3600 * 24)
      );

      if (diffInDays > 1) {
        // Streak break ho gaya (gap > 1 day)
        currentStreak = 0;
        userStat.streakCount = 0;
        await userStat.save();
      }
    }

    userStat.totalNotesSaved = noteCount;
    await userStat.save();

    return NextResponse.json({
      streakCount: currentStreak,
      lastStudyDate: userStat.lastStudyDate,
      totalFlashcardDecks: flashcardCount,
      totalQuizzesTaken: userStat.totalQuizzesTaken || 0,
      totalNotesSaved: noteCount,
    });
  } catch (error: unknown) {
    console.error("Analytics GET Error:", error);
    return NextResponse.json(
      { error: "Analytics fetch karne mein masla hua." },
      { status: 500 }
    );
  }
}

// Daily study log record karne ke liye (Jab user quiz ya flashcard complete kare)
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const userId = session.user.id || session.user.email;
    const body = await req.json().catch(() => ({}));
    const action = typeof body?.action === "string" ? body.action : "study-session";

    let userStat = await UserStat.findOne({ userId });
    if (!userStat) {
      userStat = new UserStat({ userId });
    }

    if (action === "quiz-complete") {
      userStat.totalQuizzesTaken = (userStat.totalQuizzesTaken || 0) + 1;
    } else if (action === "note-saved") {
      userStat.totalNotesSaved = (userStat.totalNotesSaved || 0) + 1;
    } else {
      const today = new Date();
      const lastDate = userStat.lastStudyDate ? new Date(userStat.lastStudyDate) : null;

      if (!lastDate) {
        userStat.streakCount = 1;
      } else {
        const isToday = today.toDateString() === lastDate.toDateString();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        const isYesterday = yesterday.toDateString() === lastDate.toDateString();

        if (!isToday) {
          if (isYesterday) {
            userStat.streakCount += 1;
          } else {
            userStat.streakCount = 1;
          }
        }
      }

      userStat.lastStudyDate = today;
    }

    await userStat.save();

    const flashcardCount = await FlashcardDeck.countDocuments({ userId });

    return NextResponse.json({
      success: true,
      ...buildAnalyticsPayload(userStat, flashcardCount),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Analytics update failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
