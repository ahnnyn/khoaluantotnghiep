import mongoose from "mongoose";

const ArticleTopicSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String }, // Banner nếu có
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const ArticleTopic = mongoose.model("ArticleTopic", ArticleTopicSchema);
export default ArticleTopic;
