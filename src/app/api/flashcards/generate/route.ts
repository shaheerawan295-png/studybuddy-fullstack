import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import FlashcardDeck from "@/models/Flashcard";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized! Pehle login karein." },
        { status: 401 }
      );
    }

    const { topic, cardCount = 5 } = await req.json();

    if (!topic || topic.trim().length === 0) {
      return NextResponse.json(
        { error: "Topic specify karna zaroori hai" },
        { status: 400 }
      );
    }

    const prompt = `Create a study flashcard deck with ${cardCount} cards on the topic: "${topic}".

IMPORTANT: Return ONLY a raw valid JSON array of objects with NO markdown formatting, NO preamble, and NO extra text.

Format:
[
  {
    "front": "Concise Question, Term, or Concept",
    "back": "Clear, direct answer or explanation in easy Roman Urdu / English blend."
  }
]`;

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a strict JSON API. Output only valid JSON arrays containing flashcards.",
        },
        { role: "user", content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
    });

    let rawContent = response.choices[0]?.message?.content || "";
    rawContent = rawContent.replace(/```json/g, "").replace(/```/g, "").trim();

    const cards = JSON.parse(rawContent);

    // Save Deck to MongoDB
    await connectDB();
    const userId = session.user.id || session.user.email;

    const newDeck = await FlashcardDeck.create({
      userId,
      title: topic,
      cards,
    });

    return NextResponse.json({
      deckId: newDeck._id,
      title: newDeck.title,
      cards: newDeck.cards,
    });
  } catch (error: unknown) {
    console.error("Flashcards Generation Error:", error);
    return NextResponse.json(
      { error: "Flashcards generate karne mein error aaya." },
      { status: 500 }
    );
  }
}
