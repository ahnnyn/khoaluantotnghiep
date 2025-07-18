import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  {
    timestamps: true,
    collection: "conversations",
  }
);

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;
