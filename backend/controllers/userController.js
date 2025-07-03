import User from '../models/userModel.js';
import validator from 'validator';
import bycrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
const TOKEN_EXPIRY = '24h';

const createToken = (userId) => {
    return jwt.sign({id: userId}, JWT_SECRET, {expiresIn: TOKEN_EXPIRY});
}
// Register a new user

export async function registerUser(req, res) {
    const {name, email, password} = req.body;

    if(!name || !email || !password) {
        return res.status(400).json({sucsses: false, message: "Please fill all the fields"});
    }
    if(!validator.isEmail(email)) {
        return res.status(400).json({sucsses: false, message: "Please enter a valid email"});
    }
    if(password.length < 6) {
        return res.status(400).json({sucsses: false, message: "Password must be at least 6 characters long"});
    }

    try {
        if(await User.findOne({email})) {
            return res.status(400).json({sucsses: false, message: "User already exists"});
        }

        const hashed = await bycrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashed
        });
        const token = createToken(user._id);

        res.status(201).json({sucsses: true, token, user:{id:user._id, name:user.name, email:user.email}});
    }
    catch (error) {
        console.log(error);
        res.status(500).json({sucsses: false, message: "Sever error, please try again later"});
    }

}

// Login funtion 

export async function loginUser(req, res) {
    const {email, password } = req.body; 
    if(!email || !password) {
        return res.status(400).json({sucsses: false, message: "Please fill all the fields"});
    }

    try {
        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({sucsses: false, message: "User does not exist"});
        }
        const match = await bycrypt.compare(password, user.password);
        
        if(!match) {
            return res.status(400).json({sucsses: false, message: "Invalid credentials"});
        }
        const token = createToken(user._id);
        res.json({sucsses: true, token, user:{id:user._id, name:user.name, email:user.email}});

    }

    catch (error) {
        console.log(error);
        res.status(500).json({sucsses: false, message: "Sever error, please try again later"});
    }
}

//GET Current User 
export async function getCurrentUser(req, res) {
    try {
        const user = await User.findById(req.user.id).select("name email");
        if(!user) {
            return res.status(404).json({sucsses: false, message: "User not found"});
        }
        res.json({sucsses: true, user});
    }
    catch (error) {
        console.log(error);
        res.status(500).json({sucsses: false, message: "Server error, please try again later"});
    }
}

//Update User Profile 
export async function updateUserProfile(req, res) {
    const {name, email} = req.body; 

    if(!name || !email) {
        return res.status(400).json({sucsses: false, message: "Valid name and email are required"});
    }

    try {
        const exist = await User.findOne({email, _id: {$ne: req.user.id}});
        if(exist) {
            return res.status(400).json({sucsses: false, message: "Email already exists"});
        }
        const user = await User.findByIdAndUpdate(req.user.id, {name, email}, {new: true}).select("name email");
        res.json({sucsses: true, user});
    }
    catch (error) {
        console.log(error);
        res.status(500).json({sucsses: false, message: "Server error, please try again later"});
    } 
}
// Change Password
export async function updatePassword(req, res) {
    const {oldPassword, newPassword} = req.body;
    if(!oldPassword || !newPassword) {
        return res.status(400).json({sucsses: false, message: "Please fill all the fields"});
    }
    if(newPassword.length < 6) {
        return res.status(400).json({sucsses: false, message: "Password must be at least 6 characters long"});
    }
    try {
        const user = await User.findById(req.user.id).select("password");
        if(!user) {
            return res.status(404).json({sucsses: false, message: "User not found"});
        }

        const match = await bycrypt.compare(oldPassword, user.password);
        if(!match) {
            return res.status(400).json({sucsses: false, message: "Old password is incorrect"});
        }
        user.password = await bycrypt.hash(newPassword, 10);
        await user.save();
        res.json({sucsses: true, message: "Password changed successfully"});
    }
    catch (error) {
        console.log(error);
        res.status(500).json({sucsses: false, message: "Server error, please try again later"});
    }
}


