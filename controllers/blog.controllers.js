const blogModel = require("../models/blog.models");

const createBlog = async (req, res) => 
{
	try 
    {
        const newBlog = new blogModel({
            name : req.body.name,
            slug : req.body.slug,
            owners : req.body.owners
        });

        const saveBlog = await newBlog.save();
        return res.status(200).json(saveBlog);
	} 
    catch (err)
    {
		return res.status(500).json(err);
	}
};

const getBlogs = async (req, res) => 
{
	try
    {
		const blogs = await blogModel.find();
		return res.status(200).json(blogs);
	} 
    catch (err) 
    {
		return res.status(500).json(err);
	}
};

const getBlog = async (req, res) =>
{
	try 
    {
		return res.status(200).json(req.blog);
	} 
    catch (err) 
    {
		return res.status(500).json(err);
	}
};

const deleteBlog = async (req, res) => 
{
	const id = req.blog._id;
	try 
    {
		const blog = await blogModel.findByIdAndDelete(id);
		return res.status(200).json(blog);
	} 
    catch (err) 
    {
		return res.status(500).json(err);
	}
};

const updateBlog = async (req, res) => 
{
	const id = req.blog._id;
	try 
    {
		const blog = await blogModel.findByIdAndUpdate(id, req.body, {
			new: true,
		});
		return res.status(200).json(blog);
	} 
    catch (err) 
    {
		return res.status(500).json(err);
	}
};

module.exports.createBlog = createBlog;
module.exports.getBlog = getBlog;
module.exports.getBlogs = getBlogs;
module.exports.deleteBlog = deleteBlog;
module.exports.updateBlog = updateBlog;