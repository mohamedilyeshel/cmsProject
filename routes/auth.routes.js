const authCont = require("../controllers/auth.controllers");
const router = require("express").Router();

router.post("/login", authCont.Login);
router.post("/register", authCont.Register);

module.exports = router;