const jwt = require("jsonwebtoken");
const userModel = require("../models/user.models");
const { SEND_EMAIL_JOB } = require("../constants/constants");
const { emailQueue } = require("../queues/emailQueue");
require("dotenv").config();

module.exports.forgotPasswordJob = async (body) => {
  try {
    const existUser = await userModel.findOne(
      { email: body.email },
      { password: 0 }
    );

    if (existUser) {
      const token = jwt.sign(
        {
          id: existUser._id,
          email: existUser.email,
          username: existUser.username,
        },
        process.env.FORGOT_EMAIL_TOKEN_PASS,
        { expiresIn: "1h" }
      );

      const msg = {
        from: process.env.TRANSPORTER_EMAIL, // sender address
        to: existUser.email, // list of receivers
        subject: "Reset Password ✔", // Subject line
        text: `Here is your token to reset the password : ${token}`, // plain text body
      };

      await emailQueue.add(SEND_EMAIL_JOB, msg);
    }
  } catch (err) {
    console.log(err);
  }
};
