// import packages
const express = require("express");
const app = express();
const mongoose = require("mongoose");

// DB connection
mongoose.connect("mongodb://localhost:27017/cmsProject");
mongoose.connection.on("connected", () => {console.log("Connection with db good")});
mongoose.connection.on("error", (err) => {console.log("Connection with db failed", err)});

// import routes
const routerAuth = require("./routes/auth.routes");
const routerUser = require("./routes/user.routes");
const routerBlog = require("./routes/blog.routes");
const routerTag = require("./routes/tag.routes");
const routerStory = require("./routes/story.routes");
const routerReaction = require("./routes/reaction.routes");
const routerFollow = require("./routes/follow.routes");
const routerComment = require("./routes/comment.routes");

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes middleware
app.use("/", routerAuth);
app.use("/users", routerUser);
app.use("/blogs", routerBlog);
app.use("/tags", routerTag);
app.use("/stories", routerStory);
app.use("/reactions", routerReaction);
app.use("/follows", routerFollow);
app.use("/comments", routerComment);

// server listening
const port = 8000;

app.listen(port,() => {
    console.log("Connection done with the server");
})