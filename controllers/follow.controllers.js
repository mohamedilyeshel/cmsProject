const followModel = require("../models/follow.models");

const createFollow = async (req, res) => 
{
	try 
    {
        const newfollow = new followModel({
            follower : req.verifiedUser._id,
            following : req.body.following
        });

        const savefollow = await newfollow.save();
        return res.status(200).json(savefollow);
	} 
    catch (err)
    {
		return res.status(500).json(err);
	}
};

const getFollows = async (req, res) => 
{
	try
    {
		const follows = await followModel.find();
		return res.status(200).json(follows);
	} 
    catch (err) 
    {
		return res.status(500).json(err);
	}
};

const getFollow = async (req, res) =>
{
	try 
    {
		return res.status(200).json(req.follow);
	} 
    catch (err) 
    {
		return res.status(500).json(err);
	}
};

const deleteFollow = async (req, res) => 
{
	const id = req.follow._id;
	try 
    {
		const follow = await followModel.findByIdAndDelete(id);
		return res.status(200).json(follow);
	} 
    catch (err) 
    {
		return res.status(500).json(err);
	}
};

const updateFollow = async (req, res) => 
{
	const id = req.follow._id;
	try 
    {
		const follow = await followModel.findByIdAndUpdate(id, req.body, {
			new: true,
		});
		return res.status(200).json(follow);
	} 
    catch (err) 
    {
		return res.status(500).json(err);
	}
};

module.exports.createFollow = createFollow;
module.exports.getFollow = getFollow;
module.exports.getFollows = getFollows;
module.exports.deleteFollow = deleteFollow;
module.exports.updateFollow = updateFollow;