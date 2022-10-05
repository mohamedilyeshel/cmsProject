const userModel = require("../models/user.models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const isEmail = require("validator/lib/isEmail");
const Redis = require("ioredis");
const { emailQueue } = require("../queues/emailQueue");
const {
  REGISTER_NEW_USER,
  FORGOT_PASSWORD_JOB,
  RESET_PASSWORD,
} = require("../constants/constants");
require("dotenv").config();

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

const Login = async (req, res) => {
  let existUser = null;
  try {
    if (isEmail(req.body.loginInfo)) {
      existUser = await userModel.findOne({ email: req.body.loginInfo });
    } else {
      existUser = await userModel.findOne({ username: req.body.loginInfo });
    }

    if (!existUser) {
      return res.status(401).json("Wrong Email/Password");
    }

    const verifiedPassword = await bcrypt.compare(
      req.body.password,
      existUser.password
    );

    if (!verifiedPassword) {
      return res.status(401).json("Wrong Email/Password");
    }

    const token = jwt.sign(
      {
        _id: existUser._id,
        username: existUser.username,
        email: existUser.email,
        isAdmin: existUser.isAdmin,
      },
      process.env.TOKEN_KEY,
      { expiresIn: "2 days" }
    );

    existUser.lastLogin = Date.now();
    existUser.save();

    return res.status(200).json(token);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const Register = async (req, res) => {
  try {
    const existEmail = await userModel.findOne({ email: req.body.email });
    if (existEmail) {
      return res.status(422).json("Email exist!");
    }

    const existUser = await userModel.findOne({ username: req.body.username });
    if (existUser) {
      return res.status(422).json("username exist!");
    }

    await emailQueue.add(REGISTER_NEW_USER, req.body);

    return res
      .status(202)
      .json(
        "Account is created check your email to verify the account and login"
      );
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports.verifyEmail = async (req, res) => {
  try {
    if (!req.query.code) {
      return res.status(401).json("You need to enter the code");
    }

    // const validAccount = jwt.verify(
    //   req.query.token,
    //   process.env.VERIFY_EMAIL_TOKEN_PASS
    // );

    const validAccount = await redis.get(req.query.code);

    if (!validAccount) {
      return res.status(403).json("Invalid Code, please request another code");
    }

    await redis.del(req.query.code);

    const userVerified = await userModel.findByIdAndUpdate(
      validAccount,
      { isEmailVerified: true },
      { new: true }
    );

    return res.status(200).json(userVerified);
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports.forgotPassword = async (req, res) => {
  try {
    if (!req.body.email) {
      return res.status(400).json("An email should be entered");
    }

    await emailQueue.add(FORGOT_PASSWORD_JOB, req.body);

    return res
      .status(200)
      .json(
        "a reset password email have been sent to you, if the email exists"
      );
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports.resetPassword = async (req, res) => {
  try {
    if (!req.body.code || !req.body.password) {
      return res.status(400).json("Code or password not sended");
    }

    // verifyToken = jwt.verify(
    //   req.body.token,
    //   process.env.FORGOT_EMAIL_TOKEN_PASS
    // );

    const verifyCode = await redis.get(req.body.code);

    if (!verifyCode) {
      return res.status(403).json("Invalid Code please request another code");
    }

    await redis.del(req.body.code);

    const infos = {
      id: verifyCode,
      password: req.body.password,
    };

    await emailQueue.add(RESET_PASSWORD, infos);

    return res.status(202).json("New password is added");
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports.Register = Register;
module.exports.Login = Login;
