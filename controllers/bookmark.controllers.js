const bookmarkModel = require("../models/bookmark.models");
const mongoose = require("mongoose");

module.exports.bookMarkStory = async (req, res, next) => {
  try {
    const existBook = await bookmarkModel.findOne({
      user: mongoose.Types.ObjectId(req.verifiedUser._id),
      story: mongoose.Types.ObjectId(req.story._id),
    });

    if (!existBook) {
      const bookStory = new bookmarkModel({
        user: req.verifiedUser._id,
        story: req.story._id,
      });

      await bookStory.save();

      return res.status(200).json({
        success: true,
        message: `${req.story.title} is bookmarked`,
      });
    }

    return res.status(200).json({
      success: false,
      message: `${req.story.title} already bookmarked`,
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports.unbookMarkStory = async (req, res, next) => {
  try {
    await bookmarkModel.findOneAndDelete({
      user: mongoose.Types.ObjectId(req.verifiedUser._id),
      story: mongoose.Types.ObjectId(req.story._id),
    });

    return res.status(200).json({
      success: true,
      message: `${req.story.title} is unbookmarked`,
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports.getBookmarkedStories = async (req, res, next) => {
  try {
    const bookmarkedStories = await bookmarkModel.aggregate([
      {
        $match: { user: mongoose.Types.ObjectId(req.verifiedUser._id) },
      },
      {
        $project: {
          story: 1,
        },
      },
      {
        $lookup: {
          from: "stories",
          localField: "story",
          foreignField: "_id",
          as: "story",
        },
      },
    ]);

    return res.status(200).json(bookmarkedStories);
  } catch (err) {
    return res.status(500).json(err);
  }
};
