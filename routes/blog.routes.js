const blogCont = require("../controllers/blog.controllers");
const isBlogOwner = require("../middleware/isBlogOwner");
const isStoryOwner = require("../middleware/isStoryOwner");
const verifyToken = require("../middleware/verifyToken");
const blogModel = require("../models/blog.models");
const storyModel = require("../models/story.models");
const router = require("express").Router();
const storyCont = require("../controllers/story.controllers");

router.param("blog", async (req, res, next, id) =>
{
    try
    {
        const blog = await blogModel.findById(id);
        
        if(!blog)
        {
            return res.status(404).json("blog not found");
        }

        req.blog = blog;
        next();
    }
    catch (err)
    {
        return res.status(500).json(err);
    }
});

router.param("story", async (req, res, next, id) =>
{
    try
    {
        const story = await storyModel.findById(id);
        
        if(!story)
        {
            return res.status(404).json("story not found");
        }

        req.story = story;
        next();
    }
    catch (err)
    {
        return res.status(500).json(err);
    }
});

router.get("/", blogCont.getBlogs);
router.get("/me", verifyToken, blogCont.getOwnedBlog);
router.get("/:blog", blogCont.getBlog);

router.post("/:blog/owners", verifyToken, isBlogOwner, blogCont.addOwnerToBlog);
router.patch("/:blog/owners", verifyToken, isBlogOwner, blogCont.removeOwnerFromBlog);

router.post("/", verifyToken, blogCont.createBlog);
router.put("/:blog", verifyToken, isBlogOwner, blogCont.updateBlog);
router.delete("/:blog", verifyToken, isBlogOwner, blogCont.deleteBlog);

router.patch("/:blog/stories/:story/publish", verifyToken, isBlogOwner, isStoryOwner, storyCont.publishStory)


module.exports = router;