import { Schema, model, models } from "mongoose";

const NoteSchema = new Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true, default: "Study Note" },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const Note = models.Note || model("Note", NoteSchema);
export default Note;
