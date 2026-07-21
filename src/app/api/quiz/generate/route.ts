import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Quiz from "@/models/Quiz";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized! Pehle login karein." }, { status: 401 });
    }

    const { topic, difficulty = "Medium", numQuestions = 5 } = await req.json();

    if (!topic || topic.trim().length === 0) {
      return NextResponse.json({ error: "Topic specify karna zaroori hai" }, { status: 400 });
    }

    // AI Prompt requiring STRICT JSON output
    const prompt = `Generate a ${numQuestions}-question multiple choice quiz on the topic: "${topic}".
Difficulty level: ${difficulty}.

IMPORTANT: Return ONLY a raw valid JSON array of objects with NO markdown code block formatting, NO preamble, and NO extra text.

JSON format structure:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0, // Zero-based index (0 for Option A, 1 for Option B, etc.)
    "explanation": "Brief explanation of why this answer is correct in simple Roman Urdu / English."
  }
]`;

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a JSON-only API. You output strictly valid JSON arrays containing quiz questions.",
        },
        { role: "user", content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
    });

    let rawContent = response.choices[0]?.message?.content || "";
    
    // Clean potential markdown blocks like ```json ... ```
    rawContent = rawContent.replace(/```json/g, "").replace(/```/g, "").trim();

    const questions = JSON.parse(rawContent);

    // Save initial quiz to MongoDB
    await connectDB();
    const userId = session.user.id || session.user.email;

    const newQuiz = await Quiz.create({
      userId,
      topic,
      difficulty,
      questions,
    });

    return NextResponse.json({
      quizId: newQuiz._id,
      topic: newQuiz.topic,
      difficulty: newQuiz.difficulty,
      questions: newQuiz.questions,
    });
  } catch (error: unknown) {
    console.error("Quiz Generation Error:", error);
    return NextResponse.json(
      { error: "Quiz generate karne mein error aaya. Plz try again." },
      { status: 500 }
    );
  }
}
