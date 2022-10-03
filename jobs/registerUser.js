const userModel = require("../models/user.models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { emailQueue } = require("../queues/emailQueue");
const { SEND_EMAIL_JOB } = require("../constants/constants");
require("dotenv").config();

module.exports.registerAccount = async (req) => {
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

    const token = jwt.sign(
      {
        id: saveUser._id,
        email: saveUser.email,
        username: saveUser.username,
      },
      process.env.VERIFY_EMAIL_TOKEN_PASS,
      { expiresIn: "1h" }
    );

    const msg = {
      from: process.env.TRANSPORTER_EMAIL, // sender address
      to: saveUser.email, // list of receivers
      subject: "Verify Account ✔", // Subject line
      text: `Here is your token to verify the account : ${token}`, // plain text body
    };

    await emailQueue.add(SEND_EMAIL_JOB, msg);
  } catch (err) {
    console.log(err);
  }
};
