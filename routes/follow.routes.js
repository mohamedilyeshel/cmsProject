const followCont = require("../controllers/follow.controllers");
const verifyToken = require("../middleware/verifyToken");
const followModel = require("../models/follow.models");
const router = require("express").Router();

router.param("follow", async (req, res, next, id) =>
{
    try
    {
        const follow = await followModel.findById(id);
        
        if(!follow)
        {
            return res.status(404).json("follow not found");
        }

        req.follow = follow;
        next();
    }
    catch (err)
    {
        return res.status(500).json(err);
    }
});

router.post("/", verifyToken ,followCont.createFollow);
router.get("/",followCont.getFollows);
router.get("/:follow",followCont.getFollow);
router.put("/:follow",followCont.updateFollow);
router.delete("/:follow",followCont.deleteFollow);

module.exports = router;