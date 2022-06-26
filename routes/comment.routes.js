const commentCont = require("../controllers/comment.controllers");
const verifyToken = require("../middleware/verifyToken");
const commentModel = require("../models/comment.models");
const router = require("express").Router();

router.param("comment", async (req, res, next, id) =>
{
    try
    {
        const comment = await commentModel.findById(id);
        
        if(!comment)
        {
            return res.status(404).json("comment not found");
        }

        req.comment = comment;
        next();
    }
    catch (err)
    {
        return res.status(500).json(err);
    }
});

router.post("/",commentCont.createComment);
router.get("/",commentCont.getComments);
router.get("/:comment",commentCont.getComment);
router.put("/:comment",commentCont.updateComment);
router.delete("/:comment",commentCont.deleteComment);

module.exports = router;