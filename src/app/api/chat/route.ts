import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Chat from "@/models/Chat";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    // 1. Auth Check
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized! Pehle login karein." },
        { status: 401 }
      );
    }

    const userId = session.user.id || session.user.email;
    const { message, history } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // 2. System Instruction
    const systemMessage = {
      role: "system",
      content: `You are 'StudyBuddy AI', an encouraging, expert, and patient AI study tutor.
- Answer clearly, step-by-step, and in an easy-to-understand language.
- Use examples whenever helpful.
- If the user talks in Urdu/English mix (Roman Urdu), respond politely in the same tone.
- Keep responses clean, organized with markdown points or code blocks where needed.`,
    };

    // 3. Format History
    const formattedHistory = (history || []).map(
      (h: { role: string; text?: string; content?: string }) => ({
        role: h.role === "user" ? "user" : "assistant",
        content: h.content || h.text || "",
      })
    );

    // 4. Call Groq API
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        systemMessage,
        ...formattedHistory,
        { role: "user", content: message },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
    });

    const aiReply =
      chatCompletion.choices[0]?.message?.content ||
      "Sorry, response generate nahi ho saka.";

    // 5. Save to MongoDB
    await connectDB();

    // User ki active chat dhoondo ya nai banao
    let chatSession = await Chat.findOne({ userId }).sort({ updatedAt: -1 });

    if (!chatSession) {
      chatSession = new Chat({
        userId,
        title: message.substring(0, 30) + "...",
        messages: [],
      });
    }

    // User ka message aur AI ka reply push karo
    chatSession.messages.push(
      { role: "user", content: message },
      { role: "assistant", content: aiReply }
    );

    await chatSession.save();

    return NextResponse.json({ reply: aiReply });
  } catch (error: unknown) {
    console.error("Chat API Error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
