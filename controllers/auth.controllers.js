const userModel = require("../models/user.models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const isEmail = require("validator/lib/isEmail");
const { transporter } = require("../utils/nodemailer");
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
      return res.status(401).json("User not found");
    }

    const verifiedPassword = await bcrypt.compare(
      req.body.password,
      existUser.password
    );
    if (!verifiedPassword) {
      return res.status(422).json("Wrong Password!");
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

    const salt = await bcrypt.genSalt(16);
    const hashPass = await bcrypt.hash(req.body.password, salt);

    const newUser = new userModel({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      email: req.body.email,
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

    await transporter.sendMail(msg);

    return res.status(202).json("Account is created with no problems");
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

    const existUser = await userModel.findOne(
      { email: req.body.email },
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

      await transporter.sendMail(msg);
    }

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
    if (!req.body.token || !req.body.password) {
      return res.status(400).json("Token or password not valid");
    }

    const verifyToken = jwt.verify(
      req.body.token,
      process.env.FORGOT_EMAIL_TOKEN_PASS
    );

    const salt = await bcrypt.genSalt(16);
    const hashedNewPass = await bcrypt.hash(req.body.password, salt);

    await userModel.findByIdAndUpdate(
      verifyToken.id,
      { password: hashedNewPass },
      { new: true, runValidators: true }
    );

    return res.status(201).json("New password is added");
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports.Register = Register;
module.exports.Login = Login;
