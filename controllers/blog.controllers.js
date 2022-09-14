const blogModel = require("../models/blog.models");
const userModels = require("../models/user.models");
const storyModels = require("../models/story.models");
const mongoose = require("mongoose");

const createBlog = async (req, res) => {
  try {
    const newBlog = new blogModel({
      name: req.body.name,
      owners: [req.verifiedUser._id],
    });

    const saveBlog = await newBlog.save();
    return res.status(200).json(saveBlog);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const getBlogs = async (req, res) => {
  try {
    const blogs = await blogModel.find().populate({
      path: "owners",
      select: "firstName lastName email username",
    });

    return res.status(200).json(blogs);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const getBlog = async (req, res) => {
  try {
    const blog = await blogModel.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(req.params.blog) },
      },
      {
        $lookup: {
          from: "users",
          let: { owners: "$owners" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$_id", "$$owners"],
                },
              },
            },
            {
              $project: {
                _id: 1,
                firstName: 1,
                lastName: 1,
                email: 1,
                username: 1,
              },
            },
          ],
          as: "owners",
        },
      },
      {
        $addFields: {
          isOwner: {
            $in: [mongoose.Types.ObjectId(req.verifiedUser._id), "$owners._id"],
          },
        },
      },
      {
        $lookup: {
          from: "follows",
          let: { blogId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: [
                        "$follower",
                        mongoose.Types.ObjectId(req.verifiedUser._id),
                      ],
                    },
                    { $eq: ["$following.entity", "$$blogId"] },
                    { $eq: ["$following.model", "Blog"] },
                  ],
                },
              },
            },
          ],
          as: "followers",
        },
      },
      {
        $addFields: {
          followers: { $size: "$followers" },
        },
      },
      {
        $addFields: {
          canFollow: {
            $switch: {
              branches: [
                {
                  case: {
                    $eq: ["$isOwner", true],
                  },
                  then: false,
                },
              ],
              default: { $not: [{ $toBool: "$followers" }] },
            },
          },
        },
      },
      {
        $unset: ["followers", "isOwner"],
      },
    ]);

    return res.status(200).json(blog);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const deleteBlog = async (req, res) => {
  const id = req.blog._id;
  try {
    const blog = await blogModel.findByIdAndDelete(id);
    return res.status(200).json(blog);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const updateBlog = async (req, res) => {
  const id = req.blog._id;
  try {
    const blog = await blogModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.status(200).json(blog);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const getOwnedBlog = async (req, res) => {
  try {
    const blogs = await blogModel.find({
      owners: { $in: [req.verifiedUser._id] },
    });

    return res.status(200).json(blogs);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const addOwnerToBlog = async (req, res) => {
  const blog = req.blog;

  try {
    const existUser = await userModels.findOne({ email: req.body.email });
    if (!existUser) {
      const newUser = new userModels({
        email: req.body.email,
      });
      const savedUser = await newUser.save();
      await blog.addOwner(savedUser._id);
    } else {
      await blog.addOwner(existUser._id);
    }
    return res.status(200).json(blog);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const removeOwnerFromBlog = async (req, res) => {
  const blog = req.blog;

  try {
    const existUser = await userModels.findOne({ email: req.body.email });
    if (!existUser) {
      return res.status(400).json("User is not a member of this blog");
    } else {
      await blog.removeOwner(existUser._id);
    }
    return res.status(200).json(blog);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const getBlogStories = async (req, res) => {
  const id = req.blog._id;
  try {
    const blogStories = await storyModels.find({ blog: id });
    return res.status(200).json(blogStories);
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports.createBlog = createBlog;
module.exports.getBlog = getBlog;
module.exports.getBlogs = getBlogs;
module.exports.deleteBlog = deleteBlog;
module.exports.updateBlog = updateBlog;
module.exports.getOwnedBlog = getOwnedBlog;
module.exports.addOwnerToBlog = addOwnerToBlog;
module.exports.removeOwnerFromBlog = removeOwnerFromBlog;
module.exports.getBlogStories = getBlogStories;
