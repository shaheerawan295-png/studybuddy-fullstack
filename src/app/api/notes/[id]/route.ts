import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Note from "@/models/Note";
import UserStat from "@/models/UserStat";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id || session.user.email;
    const { id } = await params;

    await connectDB();

    const deletedNote = await Note.findOneAndDelete({ _id: id, userId });

    if (!deletedNote) {
      return NextResponse.json(
        { error: "Note not found or unauthorized" },
        { status: 404 }
      );
    }

    let userStat = await UserStat.findOne({ userId });
    if (!userStat) {
      userStat = new UserStat({ userId });
    }

    userStat.totalNotesSaved = await Note.countDocuments({ userId });
    await userStat.save();

    return NextResponse.json({ message: "Note deleted successfully" });
  } catch (error: unknown) {
    console.error("Delete note error:", error);
    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 }
    );
  }
}
