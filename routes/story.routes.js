const storyCont = require("../controllers/story.controllers");
const commentCont = require("../controllers/comment.controllers");
const {
  bookMarkStory,
  unbookMarkStory,
} = require("../controllers/bookmark.controllers");
const commentModel = require("../models/comment.models");
const isStoryOwner = require("../middleware/isStoryOwner");
const verifyToken = require("../middleware/verifyToken");
const alreadyReacted = require("../middleware/alreadyReacted");
const storyModel = require("../models/story.models");
const isCommentOwner = require("../middleware/isCommentOwner");
const {
  getReactions,
  createReaction,
} = require("../controllers/reaction.controllers");
const router = require("express").Router();

router.param("story", async (req, res, next, id) => {
  try {
    const story = await storyModel.findById(id);

    if (!story) {
      return res.status(404).json("story not found");
    }

    req.story = story;
    next();
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.param("comment", async (req, res, next, id) => {
  try {
    const comment = await commentModel.findById(id);

    if (!comment) {
      return res.status(404).json("comment not found");
    }

    req.comment = comment;
    next();
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.post("/", verifyToken, storyCont.createStory);
router.get("/", storyCont.getStories);
router.get("/:story", storyCont.getStory);
router.put("/:story", verifyToken, isStoryOwner, storyCont.updateStory);
router.delete("/:story", verifyToken, isStoryOwner, storyCont.deleteStory);

router.post("/:story/comments/", verifyToken, commentCont.createComment);
router.post(
  "/:story/comments/:comment",
  verifyToken,
  commentCont.createComment
);
router.get("/:story/comments", commentCont.getComments);
router.get("/:story/comments/:comment", commentCont.getComment);
router.put(
  "/:story/comments/:comment",
  verifyToken,
  isCommentOwner,
  commentCont.updateComment
);
router.delete(
  "/:story/comments/:comment",
  verifyToken,
  isCommentOwner,
  commentCont.deleteComment
);

router.post("/:story/bookmark", verifyToken, bookMarkStory);
router.delete("/:story/unbookmark", verifyToken, unbookMarkStory);

router.get("/:story/reactions", getReactions);
router.post("/:story/react", verifyToken, alreadyReacted, createReaction);

module.exports = router;
