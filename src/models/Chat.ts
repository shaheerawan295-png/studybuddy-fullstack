import { Schema, models, model } from "mongoose";
const messageSchema=new Schema({
    role: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
})
const ChatSchema=new Schema({
     userId: { type: String, required: true },
    title: { type: String, default: "Study Session" },
    messages: [messageSchema],
},
{ timestamps: true }
);
const Chat = models.Chat || model("Chat", ChatSchema);
export default Chat;
