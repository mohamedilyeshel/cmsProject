const storyModel = require("../models/story.models");

const createStory = async (req, res) => 
{
	try 
    {
        const newstory = new storyModel({
			title : req.body.title,
            content: req.body.content,
            tags: req.body.tags,
            author: req.verifiedUser._id
        });

        const savestory = await newstory.save();
        return res.status(200).json(savestory);
	} 
    catch (err)
    {
		return res.status(500).json(err);
	}
};

const getStories = async (req, res) => 
{
	try
    {
		const storys = await storyModel.find();
		return res.status(200).json(storys);
	} 
    catch (err) 
    {
		return res.status(500).json(err);
	}
};

const getStory = async (req, res) =>
{
	try 
    {
		return res.status(200).json(req.story);
	} 
    catch (err) 
    {
		return res.status(500).json(err);
	}
};

const deleteStory = async (req, res) => 
{
	const id = req.story._id;
	try 
    {
		const story = await storyModel.findByIdAndDelete(id);
		return res.status(200).json(story);
	} 
    catch (err) 
    {
		return res.status(500).json(err);
	}
};

const updateStory = async (req, res) => 
{
	const id = req.story._id;
	try 
    {
		const story = await storyModel.findByIdAndUpdate(id, req.body, {
			new: true,
		});
		story.calculateReadTime();
		story.save();
		return res.status(200).json(story);
	} 
    catch (err) 
    {
		return res.status(500).json(err);
	}
};

const publishStory = async (req, res) => {
	const id = req.story._id;
	try {
		const story = await storyModel.findByIdAndUpdate(
			id,
			{
				publishAt : new Date,
				isDraft : false,
				blog : req.blog._id,
			},
			{
				new: true,
			}
		);
		return res.status(200).json(story);
	} catch (err) {
		return res.status(500).json(err);
	}
};

module.exports.createStory = createStory;
module.exports.getStory = getStory;
module.exports.getStories = getStories;
module.exports.deleteStory = deleteStory;
module.exports.updateStory = updateStory;
module.exports.publishStory = publishStory;