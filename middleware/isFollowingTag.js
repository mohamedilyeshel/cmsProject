const followModel = require("../models/follow.models");
module.exports = async function (req, res, next) {
  const isFollowing = await followModel.findOne({
    follower: req.verifiedUser._id,
    "following.entity": req.tag._id,
    // el fark bin hedhi w lokhra taa el blog li lfouk ennou elli lfoukk tkollou choufli elli el following mte3ha fiha entity : id w model : "Blog"
    // ama thenya li hiya hédhi toksod choufli elli el entity taa following te3ha fiha hédhi quelque soit fiha model walla lé
  });

  if (isFollowing) {
    return res.status(200).json("Already following this tag");
  }

  next();
};
