const jwt = require("jsonwebtoken");
const userModel = require("../models/user.models");
const Redis = require("ioredis");
const crypto = require("crypto");
const { SEND_EMAIL_JOB } = require("../constants/constants");
const { emailQueue } = require("../queues/emailQueue");
require("dotenv").config();

module.exports.forgotPasswordJob = async (body) => {
  const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  });

  try {
    const existUser = await userModel.findOne(
      { email: body.email },
      { password: 0 }
    );

    if (existUser) {
      // const token = jwt.sign(
      //   {
      //     id: existUser._id,
      //     email: existUser.email,
      //     username: existUser.username,
      //   },
      //   process.env.FORGOT_EMAIL_TOKEN_PASS,
      //   { expiresIn: "1h" }
      // );

      const code = crypto.randomBytes(3).toString("hex").toUpperCase();

      await redis.set(code, existUser.email, "EX", 3600);

      const msg = {
        from: process.env.TRANSPORTER_EMAIL, // sender address
        to: existUser.email, // list of receivers
        subject: "Reset Password ✔", // Subject line
        text: `Here is your token to reset the password : ${code}`, // plain text body
      };

      await emailQueue.add(SEND_EMAIL_JOB, msg);
    }
  } catch (err) {
    console.log(err);
  }
};
