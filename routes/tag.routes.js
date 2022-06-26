const tagCont = require("../controllers/tag.controllers");
const verifyToken = require("../middleware/verifyToken");
const tagModel = require("../models/tag.models");
const router = require("express").Router();

router.param("tag", async (req, res, next, id) =>
{
    try
    {
        const tag = await tagModel.findById(id);
        
        if(!tag)
        {
            return res.status(404).json("tag not found");
        }

        req.tag = tag;
        next();
    }
    catch (err)
    {
        return res.status(500).json(err);
    }
});

router.post("/",tagCont.createTag);
router.get("/",tagCont.getTags);
router.get("/:tag",tagCont.getTag);
router.put("/:tag",tagCont.updateTag);
router.delete("/:tag",tagCont.deleteTag);

module.exports = router;