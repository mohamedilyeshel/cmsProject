const userCont = require("../controllers/user.controllers");
const verifyToken = require("../middleware/verifyToken");
const userModel = require("../models/user.models");
const router = require("express").Router();

router.param("user", async (req, res, next, id) =>
{
    try
    {
        const user = await userModel.findById(id);
        
        if(!user)
        {
            return res.status(404).json("User not found");
        }

        req.user = user;
        next();
    }
    catch (err)
    {
        return res.status(500).json(err);
    }
});

router.post("/adduser",userCont.createUser);
router.get("/",userCont.getUsers);
router.get("/:user",userCont.getUser);
router.put("/:user",userCont.updateUser);
router.delete("/:user",userCont.deleteUser);

module.exports = router;