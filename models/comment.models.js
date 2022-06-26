const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
	{
		story: { type: mongoose.Schema.Types.ObjectId, ref: "Story" },
		content: { type: String },
		replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
		author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);