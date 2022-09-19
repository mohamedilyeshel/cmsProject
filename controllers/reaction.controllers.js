const { default: mongoose } = require("mongoose");
const reactionModel = require("../models/reaction.models");

const createReaction = async (req, res) => {
  try {
    const newReaction = new reactionModel({
      emoji: req.body.emoji,
      user: req.verifiedUser._id,
      story: req.story._id,
    });

    const saveReaction = await newReaction.save();
    return res.status(200).json(saveReaction);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const getReactions = async (req, res) => {
  const story = req.story._id;
  try {
    const reactions = await reactionModel.aggregate([
      {
        $match: {
          story: mongoose.Types.ObjectId(story._id),
        },
      },
      {
        $group: {
          _id: "$emoji",
          amount: {
            $sum: 1,
          },
        },
      },
    ]);
    return res.status(200).json(reactions);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const getReaction = async (req, res) => {
  try {
    return res.status(200).json(req.reaction);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const deleteReaction = async (req, res) => {
  const id = req.reaction._id;
  try {
    const reaction = await reactionModel.findByIdAndDelete(id);
    return res.status(200).json(reaction);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const updateReaction = async (req, res) => {
  const id = req.reaction._id;
  try {
    const reaction = await reactionModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.status(200).json(reaction);
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports.createReaction = createReaction;
module.exports.getReaction = getReaction;
module.exports.getReactions = getReactions;
module.exports.deleteReaction = deleteReaction;
module.exports.updateReaction = updateReaction;
