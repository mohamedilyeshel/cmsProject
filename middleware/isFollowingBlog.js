const followModel = require("../models/follow.models");
module.exports = async function (req, res, next) {
  const isFollowing = await followModel.findOne({
    follower: req.verifiedUser._id,
    following: {
      entity: req.blog._id,
      model: "Blog",
    },
  });

  if (isFollowing) {
    return res.status(200).json("Already following this blog");
  }

  next();
};
