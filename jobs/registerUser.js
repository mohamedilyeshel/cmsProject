const userModel = require("../models/user.models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Redis = require("ioredis");
const { emailQueue } = require("../queues/emailQueue");
const { SEND_EMAIL_JOB } = require("../constants/constants");
require("dotenv").config();

module.exports.registerAccount = async (req) => {
  const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  });

  try {
    const salt = await bcrypt.genSalt(16);
    const hashPass = await bcrypt.hash(req.password, salt);

    const newUser = new userModel({
      firstName: req.firstName,
      lastName: req.lastName,
      username: req.username,
      email: req.email,
      password: hashPass,
    });

    const saveUser = await newUser.save();

    // const token = jwt.sign(
    //   {
    //     id: saveUser._id,
    //     email: saveUser.email,
    //     username: saveUser.username,
    //   },
    //   process.env.VERIFY_EMAIL_TOKEN_PASS,
    //   { expiresIn: "1h" }
    // );

    const code = crypto.randomBytes(3).toString("hex").toUpperCase();

    await redis.set(code, saveUser._id, "EX", 3600);

    const msg = {
      from: process.env.TRANSPORTER_EMAIL, // sender address
      to: saveUser.email, // list of receivers
      subject: "Verify Account ✔", // Subject line
      text: `Here is your token to verify the account : ${code}`, // plain text body
    };

    await emailQueue.add(SEND_EMAIL_JOB, msg);
  } catch (err) {
    console.log(err);
  }
};
