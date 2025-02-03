const mongoose = require("mongoose");
const { type } = require("os");

const UserSchema = new mongoose.Schema({
    name:{ 
        type: String,
        required: true
    },
    email:{
        type: String,
        required:true,
        unique:true
    },
    password:{
        type: String,
        required:true,
    },
    role:{
        type:String,
        enum:["user","admin"], //Users can have "user" or "admin" roles.
        default: "user"// Default role is "user".
    }
})

module.exports = mongoose.model("User",UserSchema);