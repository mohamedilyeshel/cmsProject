const userModel = require("../models/user.models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const isEmail = require("validator/lib/isEmail");
const { emailQueue } = require("../queues/emailQueue");
const {
  REGISTER_NEW_USER,
  FORGOT_PASSWORD_JOB,
  RESET_PASSWORD,
} = require("../constants/constants");
require("dotenv").config();

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
    if (!req.query.token) {
      return res.status(401).json("Invalid Token");
    }

    const validAccount = jwt.verify(
      req.query.token,
      process.env.VERIFY_EMAIL_TOKEN_PASS
    );

    const userVerified = await userModel.findByIdAndUpdate(
      validAccount.id,
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
  let verifyToken;
  try {
    if (!req.body.token || !req.body.password) {
      return res.status(400).json("Token or password not sended");
    }

    verifyToken = jwt.verify(
      req.body.token,
      process.env.FORGOT_EMAIL_TOKEN_PASS
    );
  } catch (err) {
    return res.status(403).json("Invalid Token");
  }

  try {
    const infos = {
      id: verifyToken.id,
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
