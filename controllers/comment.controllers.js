const commentModel = require("../models/comment.models");

const createComment = async (req, res) => 
{
	try 
    {
        const newcomment = new commentModel({
            story: req.story._id,
            content: req.body.content,
            author: req.verifiedUser._id,
        });

        let savecomment = await newcomment.save();

		if(req.comment)
		{
			await req.comment.addReply(savecomment._id); 
			
			savecomment = await req.comment.populate(
				{
					path : "replies",
					select : "content author story"
				}
			);
		}

        return res.status(200).json(savecomment);
	} 
    catch (err)
    {
		return res.status(500).json(err);
	}
};

const getComments = async (req, res) => 
{
	try
    {
		const comments = await commentModel.find();
		return res.status(200).json(comments);
	} 
    catch (err) 
    {
		return res.status(500).json(err);
	}
};

const getComment = async (req, res) =>
{
	try 
    {
		return res.status(200).json(req.comment);
	} 
    catch (err) 
    {
		return res.status(500).json(err);
	}
};

const deleteComment = async (req, res) => 
{
	const id = req.comment._id;
	try 
    {
		for (let r of req.comment.replies)
		{
			await commentModel.findByIdAndDelete(r.toString());
		}

		const comment = await commentModel.findOneAndDelete(id);
		return res.status(200).json(comment);
	} 
    catch (err) 
    {
		return res.status(500).json(err);
	}
};

const updateComment = async (req, res) => 
{
	const id = req.comment._id;
	try 
    {
		const comment = await commentModel.findByIdAndUpdate(id, req.body, {
			new: true,
		});
		return res.status(200).json(comment);
	} 
    catch (err) 
    {
		return res.status(500).json(err);
	}
};

module.exports.createComment = createComment;
module.exports.getComment = getComment;
module.exports.getComments = getComments;
module.exports.deleteComment = deleteComment;
module.exports.updateComment = updateComment;