import { Schema, models, model } from "mongoose";

const DailyTaskSchema = new Schema({
  day: { type: Number, required: true },
  title: { type: String, required: true },
  topics: [{ type: String }],
  actionItem: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const RoadmapSchema = new Schema(
  {
    userId: { type: String, required: true },
    subject: { type: String, required: true },
    totalDays: { type: Number, required: true },
    dailyHours: { type: Number, required: true },
    tasks: [DailyTaskSchema],
  },
  { timestamps: true }
);

const Roadmap = models.Roadmap || model("Roadmap", RoadmapSchema);

export default Roadmap;
