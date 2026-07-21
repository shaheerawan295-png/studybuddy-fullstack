import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Chat from "@/models/Chat";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ messages: [] }, { status: 401 });
    }

    const userId = session.user.id || session.user.email;
    await connectDB();

    const chatSession = await Chat.findOne({ userId }).sort({ updatedAt: -1 });

    if (!chatSession) {
      return NextResponse.json({ messages: [] });
    }

    return NextResponse.json({ messages: chatSession.messages });
  } catch (error) {
    console.error("History fetch error:", error);
    return NextResponse.json(
      { error: "Failed to load history" },
      { status: 500 }
    );
  }
}
export async function DELETE() {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id || session.user.email;
    await connectDB();

    // User ki purani chat clear kar do
    await Chat.deleteMany({ userId });

    return NextResponse.json({ message: "Chat session cleared successfully" });
  } catch (error) {
    console.error("Delete history error:", error);
    return NextResponse.json(
      { error: "Failed to reset session" },
      { status: 500 }
    );
  }
}