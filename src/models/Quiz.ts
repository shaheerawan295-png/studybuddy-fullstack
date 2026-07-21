import { Schema, models, model } from "mongoose";

const QuestionSchema = new Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true }, // Index of correct option (0, 1, 2, or 3)
  explanation: { type: String, required: true },
});

const QuizSchema = new Schema(
  {
    userId: { type: String, required: true },
    topic: { type: String, required: true },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium" },
    questions: [QuestionSchema],
    score: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Quiz = models.Quiz || model("Quiz", QuizSchema);
export default Quiz;
