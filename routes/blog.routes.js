const blogCont = require("../controllers/blog.controllers");
const isBlogOwner = require("../middleware/isBlogOwner");
const isStoryOwner = require("../middleware/isStoryOwner");
const isFollowingBlog = require("../middleware/isFollowingBlog");
const notBlogOwner = require("../middleware/notBlogOwner");
const verifyToken = require("../middleware/verifyToken");
const hasToken = require("../middleware/hasToken");
const blogModel = require("../models/blog.models");
const storyModel = require("../models/story.models");
const router = require("express").Router();
const storyCont = require("../controllers/story.controllers");
const followCont = require("../controllers/follow.controllers");

router.param("blog", async (req, res, next, id) => {
  try {
    const blog = await blogModel.findById(id);

    if (!blog) {
      return res.status(404).json("blog not found");
    }

    req.blog = blog;
    next();
  } catch (err) {
    return res.status(500).json(err);
  }
});

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

router.get("/", blogCont.getBlogs);
router.get("/me", verifyToken, blogCont.getOwnedBlog);

router.get("/:blog", hasToken, blogCont.getBlog);
router.get("/:blog", verifyToken, blogCont.getBlog);

router.get("/:blog/stories", blogCont.getBlogStories);

router.get(
  "/:blog/follow",
  verifyToken,
  notBlogOwner,
  isFollowingBlog,
  followCont.followBlog
);

router.post("/:blog/owners", verifyToken, isBlogOwner, blogCont.addOwnerToBlog);
router.patch(
  "/:blog/owners",
  verifyToken,
  isBlogOwner,
  blogCont.removeOwnerFromBlog
);

router.post("/", verifyToken, blogCont.createBlog);
router.put("/:blog", verifyToken, isBlogOwner, blogCont.updateBlog);
router.delete("/:blog", verifyToken, isBlogOwner, blogCont.deleteBlog);

router.patch(
  "/:blog/stories/:story/publish",
  verifyToken,
  isBlogOwner,
  isStoryOwner,
  storyCont.publishStory
);

module.exports = router;
