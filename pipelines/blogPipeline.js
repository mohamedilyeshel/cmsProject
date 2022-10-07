const mongoose = require("mongoose");

module.exports.pipelineBlog = (blogId, verifiedUser) => {
  if (!verifiedUser) {
    return [
      {
        $match: { _id: mongoose.Types.ObjectId(blogId) },
      },
      {
        $lookup: {
          from: "users",
          localField: "owners",
          foreignField: "_id",
          as: "owners",
        },
      },
      {
        $unset: "owners.password",
      },
    ];
  }

  return [
    {
      $match: { _id: mongoose.Types.ObjectId(blogId) },
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
          $in: [mongoose.Types.ObjectId(verifiedUser._id), "$owners._id"],
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
                      mongoose.Types.ObjectId(verifiedUser._id),
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
  ];
};
