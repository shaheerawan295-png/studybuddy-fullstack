import { Schema, models, model } from "mongoose";

const UserStatSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true },
    streakCount: { type: Number, default: 0 },
    lastStudyDate: { type: Date, default: null },
    totalQuizzesTaken: { type: Number, default: 0 },
    totalFlashcardDecks: { type: Number, default: 0 },
    totalNotesSaved: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const UserStat = models.UserStat || model("UserStat", UserStatSchema);

export default UserStat;
