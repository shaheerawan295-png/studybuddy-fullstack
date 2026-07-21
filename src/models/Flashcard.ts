import { Schema, models, model } from "mongoose";

const CardSchema = new Schema({
  front: { type: String, required: true }, 
  back: { type: String, required: true },  
});

const FlashcardDeckSchema = new Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    cards: [CardSchema],
  },
  { timestamps: true }
);

const FlashcardDeck =
  models.FlashcardDeck || model("FlashcardDeck", FlashcardDeckSchema);

export default FlashcardDeck;
