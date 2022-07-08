const followModel = require("../models/follow.models");
module.exports = async function (req, res, next)
{
    const isFollowing = await followModel.find({
        follower : req.verifiedUser._id,
        following : {
            entity : req.tag._id,
            model : "Tag"
        }
    });

    if(isFollowing.length > 0)
    {
        req.isFollowing = true;
    }
    else
    {
        req.isFollowing = false;
    }

    next();
}