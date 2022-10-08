// import packages
const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const morgan = require("morgan");
const helmet = require("helmet");
const sanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
const compression = require("compression");

// DB connection
mongoose.connect(process.env.MONGODB_URL);
mongoose.connection.on("connected", () => {
  console.log("Connection with db good");
});
mongoose.connection.on("error", (err) => {
  console.log("Connection with db failed", err);
});
mongoose.connection.on("disconnected", (err) => {
  console.log("Connection with db failed", err);
});

// import routes
const routerAuth = require("./routes/auth.routes");
const routerUser = require("./routes/user.routes");
const routerBlog = require("./routes/blog.routes");
const routerTag = require("./routes/tag.routes");
const routerStory = require("./routes/story.routes");
const routerReaction = require("./routes/reaction.routes");
const routerFollow = require("./routes/follow.routes");
const routerComment = require("./routes/comment.routes");
const routerFeed = require("./routes/bookmarked.routes");

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(helmet());
app.use(sanitize());
app.use(xss());
app.use(hpp());
app.use(cors());
app.use(compression());

// routes middleware
app.use("/api/", routerAuth);
app.use("/api/users", routerUser);
app.use("/api/blogs", routerBlog);
app.use("/api/tags", routerTag);
app.use("/api/stories", routerStory);
app.use("/api/reactions", routerReaction);
app.use("/api/follows", routerFollow);
app.use("/api/comments", routerComment);
app.use("/api/feed", routerFeed);

// server listening
const port = 8000;

app.listen(port, () => {
  console.log("Connection done with the server");
});
