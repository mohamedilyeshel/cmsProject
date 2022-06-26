const mongoose = require("mongoose");

const StorySchema = new mongoose.Schema(
	{
		content: { type: String },
		publishedAt: { type: Date },
		readTime: { type: Number, default: 60 },
		tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
		author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		blog: { type: mongoose.Schema.Types.ObjectId, ref: "Blog" },
		isDraft: { type: Boolean, default: true },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Story", StorySchema);