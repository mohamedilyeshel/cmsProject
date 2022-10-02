const authCont = require("../controllers/auth.controllers");
const router = require("express").Router();

router.post("/login", authCont.Login);
router.post("/register", authCont.Register);
router.get("/verify", authCont.verifyEmail);
router.post("/forgotpassword", authCont.forgotPassword);
router.post("/resetpassword", authCont.resetPassword);

module.exports = router;
