import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Note from "@/models/Note";
import UserStat from "@/models/UserStat";

// 1. GET: Fetch all saved notes for the logged-in user
export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ notes: [] }, { status: 401 });
    }

    const userId = session.user.id || session.user.email;
    await connectDB();

    const notes = await Note.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ notes });
  } catch (error: unknown) {
    console.error("Fetch notes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

// 2. POST: Save a new note (Existing Code)
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id || session.user.email;
    const { title, content } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: "Note content is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const noteTitle = title || content.substring(0, 30) + "...";

    const existingNote = await Note.findOne({ userId, title: noteTitle, content });

    if (existingNote) {
      return NextResponse.json({
        message: "Note already saved.",
        note: existingNote,
        duplicate: true,
      });
    }

    const note = await Note.create({
      userId,
      title: noteTitle,
      content,
    });

    let userStat = await UserStat.findOne({ userId });
    if (!userStat) {
      userStat = new UserStat({ userId });
    }

    userStat.totalNotesSaved = await Note.countDocuments({ userId });
    await userStat.save();

    return NextResponse.json({ message: "Note saved successfully!", note });
  } catch (error: unknown) {
    console.error("Save note error:", error);
    const message = error instanceof Error ? error.message : "Failed to save note";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
