const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			minlength: 4,
			maxlength: 256,
			required: true,
		},
		slug: { type: String, maxlength: 512, unique: true, index: true },
		owners: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Blog", BlogSchema);