import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Roadmap from "@/models/Roadmap";

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

    const { subject, totalDays = 7, dailyHours = 2 } = await req.json();

    if (!subject || subject.trim().length === 0) {
      return NextResponse.json(
        { error: "Subject or Exam name is required" },
        { status: 400 }
      );
    }

    const prompt = `Create a realistic, structured ${totalDays}-day study roadmap and revision plan for the subject/exam: "${subject}".
Assuming the student studies ${dailyHours} hours per day.

IMPORTANT: Return ONLY a raw valid JSON array of objects with NO markdown code block formatting, NO preamble, and NO extra text.

Format strictly as:
[
  {
    "day": 1,
    "title": "Day 1 Focus Subject / Module Name",
    "topics": ["Key Concept 1", "Key Concept 2", "Key Concept 3"],
    "actionItem": "Practical task or practice activity in Roman Urdu / English blend for today."
  }
]`;

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a strict JSON generator. Output only a valid JSON array of daily study tasks.",
        },
        { role: "user", content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.4,
    });

    let rawContent = response.choices[0]?.message?.content || "";
    rawContent = rawContent.replace(/```json/g, "").replace(/```/g, "").trim();

    const tasks = JSON.parse(rawContent);

    // Save to Database
    await connectDB();
    const userId = session.user.id || session.user.email;

    const newRoadmap = await Roadmap.create({
      userId,
      subject,
      totalDays: Number(totalDays),
      dailyHours: Number(dailyHours),
      tasks,
    });

    return NextResponse.json({
      roadmapId: newRoadmap._id,
      subject: newRoadmap.subject,
      totalDays: newRoadmap.totalDays,
      dailyHours: newRoadmap.dailyHours,
      tasks: newRoadmap.tasks,
    });
  } catch (error: unknown) {
    console.error("Roadmap Generation Error:", error);
    return NextResponse.json(
      { error: "Roadmap generate karne mein masla hua. Dubara try karein." },
      { status: 500 }
    );
  }
}
