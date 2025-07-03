import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET|| "your_jwt_secret_key";  
export default async function authMiddleware(req, res, next) {
    //Grab the token from authorization header
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({success: false, message: "Unauthorized access"});
    }

    const token = authHeader.split(' ')[1];

    //Verify & attach user object  
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(payload.id).select('-password');
        if(!user) {
            return res.status(401).json({success: false, message: "Unauthorized access"});
        }
        req.user = user; 
        next();
    }
    catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({success: false, message: "Unauthorized access"});
    }
}