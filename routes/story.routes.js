const storyCont = require("../controllers/story.controllers");
const verifyToken = require("../middleware/verifyToken");
const storyModel = require("../models/story.models");
const router = require("express").Router();

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

router.post("/", verifyToken, storyCont.createStory);
router.get("/",storyCont.getStories);
router.get("/:story",storyCont.getStory);
router.put("/:story",storyCont.updateStory);
router.delete("/:story",storyCont.deleteStory);

module.exports = router;