import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { auth } from "@/auth";
import { extractText } from "unpdf";
import connectDB from "@/lib/mongodb";
import Chat from "@/models/Chat";

export const runtime = "nodejs";

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

    // 2. Extract File & Custom Prompt
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const userPrompt =
      (formData.get("prompt") as string) ||
      "Is PDF document ko ache se analyze karo. Iske key concepts, main points, aur important terms ko Roman Urdu / English mix mein bilkul easy and step-by-step tareeqay se explain karo.";

    if (!file) {
      return NextResponse.json(
        { error: "PDF file upload karna zaroori hai" },
        { status: 400 }
      );
    }

    // 3. Extract Text from PDF using unpdf
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    const { text, totalPages } = await extractText(uint8Array);
    const extractedText = Array.isArray(text) ? text.join("\n") : text;

    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json(
        {
          error:
            "PDF se text extract nahi ho saka. Empty ya scanned image PDF ho sakti hai.",
        },
        { status: 400 }
      );
    }

    const textSnippet = extractedText.substring(0, 40000);

    // 4. Send Content to Groq AI
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are 'StudyBuddy AI', an expert tutor. Your task is to analyze the provided PDF text and explain it clearly in Roman Urdu / English mix using easy bullet points and headings.`,
        },
        {
          role: "user",
          content: `PDF Content (Total Pages: ${totalPages}):\n---\n${textSnippet}\n---\n\nStudent Instructions: ${userPrompt}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_tokens: 2048,
    });

    const explanation =
      response.choices[0]?.message?.content ||
      "Explanation generate nahi ho saki.";

    // 5. Save the PDF exchange to the user's active chat session.
    await connectDB();
    const userId = session.user.id || session.user.email;
    const userMessageContent = `Uploaded PDF: \`${file.name}\`\n${userPrompt}`;

    // Active Chat session dhoondo ya naya document banao
    let chat = await Chat.findOne({ userId }).sort({ updatedAt: -1 });

    if (!chat) {
      chat = new Chat({
        userId,
        title: `Study Session (${file.name})`,
        messages: [],
      });
    }

    // Messages array mein user message aur AI explanation push karein
    chat.messages.push({ role: "user", content: userMessageContent });
    chat.messages.push({ role: "assistant", content: explanation });

    await chat.save();

    return NextResponse.json({
      explanation,
      pages: totalPages,
      fileName: file.name,
    });
  } catch (error: unknown) {
    console.error("PDF Processing Error:", error);
    const message =
      error instanceof Error ? error.message : "PDF analyze karne mein error aaya hai.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
