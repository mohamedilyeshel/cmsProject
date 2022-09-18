const router = require("express").Router();
const { getBookmarkedStories } = require("../controllers/bookmark.controllers");
const verifyToken = require("../middleware/verifyToken");

router.get("/", verifyToken, getBookmarkedStories);

module.exports = router;
