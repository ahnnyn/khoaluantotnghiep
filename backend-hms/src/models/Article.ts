import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema(
  {
    title: String,
    slug: String,
    summary: String,
    content: String,
    thumbnail: String,
    tags: [String],
    category: { type: String, enum: ["Blog", "Tư vấn", "Tin tức"] },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    relatedDoctorIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    relatedDepartmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },

    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ArticleTopic",
      required: false,
    },

    isPublished: { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Article = mongoose.model("Article", ArticleSchema);
export default Article;
