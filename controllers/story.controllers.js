const mongoose = require("mongoose");
const storyModel = require("../models/story.models");

const createStory = async (req, res) => {
  try {
    const newstory = new storyModel({
      title: req.body.title,
      content: req.body.content,
      tags: req.body.tags,
      author: req.verifiedUser._id,
    });

    const savestory = await newstory.save();
    return res.status(200).json(savestory);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const getStories = async (req, res) => {
  try {
    const storys = await storyModel.find();
    return res.status(200).json(storys);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const getStory = async (req, res) => {
  try {
    const isDraft = req.story.isDraft;
    let story;
    if (isDraft) {
      story = await storyModel.aggregate([
        {
          $match: {
            _id: mongoose.Types.ObjectId(req.story._id),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "author",
            foreignField: "_id",
            as: "author",
          },
        },
        {
          $project: {
            "author.password": 0,
          },
        },
        {
          $unwind: { path: "$author" },
        },
        {
          $lookup: {
            from: "tags",
            localField: "tags",
            foreignField: "_id",
            as: "tags",
          },
        },
      ]);

      return res.status(200).json(story);
    }

    // increament the number of viewers fields each time a nonDraft story got requested
    await req.story.updateOne({ $inc: { viewers: 1 } });

    story = await storyModel.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(req.story._id) },
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },
      {
        $lookup: {
          from: "tags",
          localField: "tags",
          foreignField: "_id",
          as: "tags",
        },
      },
      {
        $lookup: {
          from: "blogs",
          localField: "blog",
          foreignField: "_id",
          as: "blog",
        },
      },
      { $unwind: "$blog" },
      {
        $project: {
          "author.password": 0,
          "blog.owners": 0,
        },
      },
      {
        $lookup: {
          from: "reactions",
          let: { storyId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$story", "$$storyId"],
                },
              },
            },
            {
              $group: {
                _id: "$emoji",
                count: { $sum: 1 },
              },
            },
          ],
          as: "reactions",
        },
      },
    ]);

    return res.status(200).json(story);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const deleteStory = async (req, res) => {
  const id = req.story._id;
  try {
    console.log(req.story);

    const story = await storyModel.findOneAndDelete({
      _id: mongoose.Types.ObjectId(id),
    });
    return res.status(200).json(story);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const updateStory = async (req, res) => {
  const id = req.story._id;
  try {
    const story = await storyModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    story.calculateReadTime();
    story.save();
    return res.status(200).json(story);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const publishStory = async (req, res) => {
  const id = req.story._id;
  try {
    const story = await storyModel.findByIdAndUpdate(
      id,
      {
        publishAt: new Date(),
        isDraft: false,
        blog: req.blog._id,
      },
      {
        new: true,
        runValidators: true,
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
