const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    fullName : {type : String, required : true},
    username : {type : String, unique : true, index : true, required : true},
    email : {type : String, required : true},
    password: {type : String, required : true, minlength : 8, maxlength : 1024},
    birthDate : {type : Date, required : true},
    profilePic : {type : String},
    userRole : {type : String}
}, {timestamps : true});

module.exports = mongoose.model("User", UserSchema);