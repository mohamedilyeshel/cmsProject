const blogCont = require("../controllers/blog.controllers");
const verifyToken = require("../middleware/verifyToken");
const blogModel = require("../models/blog.models");
const router = require("express").Router();

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

router.post("/",blogCont.createBlog);
router.get("/",blogCont.getBlogs);
router.get("/:blog",blogCont.getBlog);
router.put("/:blog",blogCont.updateBlog);
router.delete("/:blog",blogCont.deleteBlog);

module.exports = router;