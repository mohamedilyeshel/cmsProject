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

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes middleware
app.use("/", routerAuth);
app.use("/users", routerUser);

// server listening
const port = 8000;

app.listen(port,() => {
    console.log("Connection done with the server");
})