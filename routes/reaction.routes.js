const reactionCont = require("../controllers/reaction.controllers");
const verifyToken = require("../middleware/verifyToken");
const reactionModel = require("../models/reaction.models");
const router = require("express").Router();

router.param("reaction", async (req, res, next, id) =>
{
    try
    {
        const reaction = await reactionModel.findById(id);
        
        if(!reaction)
        {
            return res.status(404).json("reaction not found");
        }

        req.reaction = reaction;
        next();
    }
    catch (err)
    {
        return res.status(500).json(err);
    }
});

router.post("/",reactionCont.createReaction);
router.get("/",reactionCont.getReactions);
router.get("/:reaction",reactionCont.getReaction);
router.put("/:reaction",reactionCont.updateReaction);
router.delete("/:reaction",reactionCont.deleteReaction);

module.exports = router;