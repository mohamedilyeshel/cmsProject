const reactionModel = require("../models/reaction.models");
module.exports = async (req, res, next) => {
  try {
    const reactionExist = await reactionModel.findOne({
      emoji: req.body.emoji.trim().toLowerCase(),
      user: req.verifiedUser._id,
    });

    if (reactionExist) {
      return res
        .status(400)
        .json(`Already reacted with ${req.body.emoji.trim().toLowerCase()}`);
    }

    next();
  } catch (err) {
    return res.status(500).json(err);
  }
};
