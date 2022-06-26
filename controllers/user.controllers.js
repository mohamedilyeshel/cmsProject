const userModel = require("../models/user.models");
const bcrypt = require("bcryptjs");

const createUser = async (req, res) => 
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
    catch (err)
    {
		return res.status(500).json(err);
	}
};

const getUsers = async (req, res) => 
{
	try
    {
		const users = await userModel.find();
		return res.status(200).json(users);
	} 
    catch (err) 
    {
		return res.status(500).json(err);
	}
};

const getUser = async (req, res) =>
{
	try 
    {
		return res.status(200).json(req.user);
	} 
    catch (err) 
    {
		return res.status(500).json(err);
	}
};

const deleteUser = async (req, res) => 
{
	const id = req.user._id;
	try 
    {
		const user = await userModel.findByIdAndDelete(id);
		return res.status(200).json(user);
	} 
    catch (err) 
    {
		return res.status(500).json(err);
	}
};

const updateUser = async (req, res) => 
{
	const id = req.user._id;
	try 
    {
		const user = await userModel.findByIdAndUpdate(id, req.body, {
			new: true,
		});
		return res.status(200).json(user);
	} 
    catch (err) 
    {
		return res.status(500).json(err);
	}
};

module.exports.createUser = createUser;
module.exports.getUser = getUser;
module.exports.getUsers = getUsers;
module.exports.deleteUser = deleteUser;
module.exports.updateUser = updateUser;