const userModel = require("../models/user.models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Login = async (req, res) =>
{
   try
   {
        const existUsername = await userModel.findOne({username : req.body.username});
        if(!existUsername)
        {
            return res.status(422).json("Username doesnt exist!");
        }

        const verifiedPassword = await bcrypt.compare(req.body.password, existUsername.password);
        if(!verifiedPassword)
        {
            return res.status(422).json("Wrong Password!");
        }

        const token = jwt.sign(
            {_id : existUsername._id, username : existUsername.username, email : existUsername.email},
            "ahawamdp",
            {expiresIn : "2 days"}
        );

        return res.status(200).json(token);
   }
   catch(err)
   {
        return res.status(500).json(err);
   }
}

const Register = async (req, res) =>
{
   try
   {
        const existEmail = await userModel.findOne({email : req.body.email});
        if(existEmail)
        {
            return res.status(422).json("Email exist!");
        }

        const existUser = await userModel.findOne({username : req.body.username});
        if(existUser)
        {
            return res.status(422).json("username exist!");
        }

        const salt = await bcrypt.genSalt(16);
        const hashPass = await bcrypt.hash(req.body.password, salt);
        
        const newUser = new userModel({
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            username : req.body.username,
            email : req.body.email,
            password: hashPass,
        });

        const saveUser = await newUser.save();
        return res.status(200).json(saveUser);
   }
   catch(err)
   {
        return res.status(500).json(err);
   }
}

module.exports.Register = Register;
module.exports.Login = Login;