const userModel = require("../models/user.models");
const bcrypt = require("bcryptjs");

const createUser = async (req, res) => 
{
    const userR = req.body.verifiedUser;
    if(userR.userRole !== "A")
    {
        return res.status(403).json("You don't have the access to do this");
    }

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
        fullName : req.body.fullName ,
        username : req.body.username ,
        email : req.body.email ,
        password: hashPass ,
        birthDate : req.body.birthDate ,
        profilePic : req.body.profilePic ,
        userRole : req.body.userRole
	});

	try 
    {
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
    const userR = req.body.verifiedUser;
    if(userR.userRole !== "A")
    {
        return res.status(403).json("You don't have the access to do this");
    }

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
    const userR = req.body.verifiedUser;
    if(userR.userRole !== "A")
    {
        return res.status(403).json("You don't have the access to do this");
    }

	const id = req.params.userId;
	try 
    {
		const user = await userModel.findById(id);
		return res.status(200).json(user);
	} 
    catch (err) 
    {
		return res.status(500).json(err);
	}
};

const deleteUser = async (req, res) => 
{
    const userR = req.body.verifiedUser;
    if(userR.userRole !== "A")
    {
        return res.status(403).json("You don't have the access to do this");
    }

	const id = req.params.userId;
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
    const userR = req.body.verifiedUser;
    if(userR.userRole !== "A")
    {
        return res.status(403).json("You don't have the access to do this");
    }

	const id = req.params.userId;
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