const { default: mongoose } = require("mongoose");
const tagModel = require("../models/tag.models");

const createTag = async (req, res) => {
  try {
    const newtag = new tagModel({
      name: req.body.name,
    });

    const saveTag = await newtag.save();
    return res.status(200).json(saveTag);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const getTags = async (req, res) => {
  try {
    const tags = await tagModel.find();
    return res.status(200).json(tags);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const getTag = async (req, res) => {
  try {
    const tag = await tagModel.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(req.tag._id),
        },
      },
      {
        $lookup: {
          from: "follows",
          localField: "_id",
          foreignField: "following.entity",
          as: "followers",
        },
      },
      {
        $addFields: {
          followers: {
            $size: "$followers",
          },
        },
      },
      {
        $lookup: {
          from: "stories",
          localField: "_id",
          foreignField: "tags",
          as: "stories",
        },
      },
      {
        $addFields: {
          stories: {
            $size: "$stories",
          },
        },
      },
    ]);

    return res.status(200).json(tag);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const deleteTag = async (req, res) => {
  const id = req.tag._id;
  try {
    const tag = await tagModel.findByIdAndDelete(id);
    return res.status(200).json(tag);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const updateTag = async (req, res) => {
  const id = req.tag._id;
  try {
    const tag = await tagModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.status(200).json(tag);
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports.createTag = createTag;
module.exports.getTag = getTag;
module.exports.getTags = getTags;
module.exports.deleteTag = deleteTag;
module.exports.updateTag = updateTag;
