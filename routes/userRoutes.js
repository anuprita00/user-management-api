const express = require("express");
//  Used to hash and compare passwords securely.
const bcrypt = require("bcryptjs");
//  Used to generate and verify JWT tokens for authentication.
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const authenticate = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const user = require("../models/user");
// Express Router to define API routes separately.
const router = express.Router();

//Register User (Any user can register)
router.post("/register", async (req,res) => {
    const {name, email, password, role} = req.body;

    let user = await User.findOne({ email });// Check if user already exists
    if(user){
        return res.status(400).json({message: "User already exists"});        
    }

    const hashedPassword = await bcrypt.hash(password, 10);// Hash password
    user = new User({name, email, password:hashedPassword, role});// Create new user
    // console.log(user);
    await user.save();//save in database

    res.json({message:"User registered Sucessfully"});
   // Admins must be created manually or through an admin-only API.
});

//Login User (Any user can log in)
router.post("/login", async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});

    if(!user || !(await bcrypt.compare(password, user.password))){
        return res.status(400).json({message:"Invalid Credentials"});
    }
//This code is used to generate a JWT (JSON Web Token) after a user successfully logs in.
    const token = jwt.sign({userId: user._id, role:user.role}, process.env.JWT_SECRET, {
        //unique identifier of user,secret key user to encrypt the token
        expiresIn: "1h",//token expires in 1hr
    });

    //token send to client
    res.json({token});
});


// Admin-only: Get all users
router.get("/", authenticate, authorize(["admin"]) ,async (req, res) => {
    const users = await User.find();
    //console.log(users);
    res.json({message:"welcome Admin",users});

//Only "admin" users can fetch all users.
// Regular users will receive a 403 Forbidden error.

});

// Get One User (User can access own data, Admin can access any)
router.get("/:id", authenticate, async (req, res) => {
    if(req.user.role !== "admin" && req.user.userId != req.params.id){
        return res.status(403).json({message:"Forbidden: You can only access your own data"});
    }

    const user = await User.findById(req.params.id);
    if(!user) return res.status(404).json({message:"user not found"});

    res.json(user);
})

// Update User (User can update own profile, Admin can update any)
router.put("/:id", authenticate, async (req, res) => {
    if(req.user.role !== "admin" && req.user.userId !== req.params.id){
        return res.status(403).json({message:"Forbidden: You can only access your own data"});
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});
    if(!updatedUser) return res.status(404).json({message:"User not found"});

    res.json(updatedUser);
})

// Delete User (Admin only)
router.delete("/:id", authenticate, authorize(["admin"]), async (req, res) => {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if(!deletedUser) return res.status(404).json({message:"User not found"});

    res.json({message: "User deleted successfully"});
})

module.exports = router;