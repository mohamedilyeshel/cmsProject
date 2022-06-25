const userCont = require("../controllers/user.controllers");
const verifyToken = require("../middleware/verifyToken");
const router = require("express").Router();

router.post("/adduser",verifyToken, userCont.createUser);
router.get("/",verifyToken, userCont.getUsers);
router.get("/:userId",verifyToken, userCont.getUser);
router.put("/:userId",verifyToken, userCont.updateUser);
router.delete("/:userId",verifyToken, userCont.deleteUser);

module.exports = router;