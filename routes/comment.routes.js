const commentCont = require("../controllers/comment.controllers");
const verifyToken = require("../middleware/verifyToken");
const commentModel = require("../models/comment.models");
const router = require("express").Router();

module.exports = router;