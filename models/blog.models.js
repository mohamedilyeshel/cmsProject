const mongoose = require("mongoose");
const slug = require("slug");
const storyModel = require("../models/story.models");

const BlogSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			minlength: 4,
			maxlength: 256,
			required: true,
			unique : true,
			lowercase : true
		},
		slug: { type: String, maxlength: 512, unique: true, index: true },
		owners: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
	},
	{ timestamps: true }
);

BlogSchema.pre("findOneAndDelete", async function(next)
{
	const stories = await storyModel.find({blog : this.getQuery()["_id"]});
	for await(const s of stories)
	{
		await storyModel.findByIdAndDelete(s._id);
	}
	next();
});

BlogSchema.pre("validate", function(next)
{
	if(this.name)
	{
		this.slugify(this.name);
	}
	next();
});

BlogSchema.methods.slugify = function(text)
{
	this.slug = slug(text);
};

BlogSchema.methods.addOwner = async function (id) {
	if (this.owners.indexOf(id) === -1) {
		this.owners.push(id);
	}
	return await this.save();
};

BlogSchema.methods.removeOwner = async function (id) {
	if (this.owners.indexOf(id) !== -1) {
		this.owners = this.owners.filter((o) => {
			return o.toString() !== id.toString();
		});
	}
	return await this.save();
};

module.exports = mongoose.model("Blog", BlogSchema);