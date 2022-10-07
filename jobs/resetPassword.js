const bcrypt = require("bcryptjs");
const userModel = require("../models/user.models");

module.exports.resetPass = async (infos) => {
  try {
    const salt = await bcrypt.genSalt(16);
    const hashedNewPass = await bcrypt.hash(infos.password, salt);

    await userModel.findOneAndUpdate(
      { email: infos.email },
      { password: hashedNewPass },
      { new: true, runValidators: true }
    );
  } catch (err) {
    console.log(err);
  }
};
