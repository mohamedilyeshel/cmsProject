const followModel = require("../models/follow.models");
module.exports = async function (req, res, next)
{
    const isFollowing = await followModel.find
    ({
        follower : req.verifiedUser._id,
        following : 
        {
            entity : req.blog._id,
            model : "Blog"
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