const authCont = require("../controllers/auth.controllers");
const verifyToken = require("../middleware/verifyToken");
const router = require("express").Router();

router.post("/login", authCont.Login);
router.post("/register", authCont.Register);
router.get("/verify", authCont.verifyEmail);
router.post("/forgotpassword", authCont.forgotPassword);
router.post("/resetpassword", authCont.resetPassword);
router.get("/logout", verifyToken, authCont.logOut);

module.exports = router;
