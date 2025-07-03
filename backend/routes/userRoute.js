import express from 'express';
import { getCurrentUser, loginUser, registerUser, updatePassword, updateUserProfile } from '../controllers/userController.js';
import authMiddleware from '../middleware/auth.js';

const userRouter = express.Router();

//Public routes
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

//Private routes
userRouter.get('/me', authMiddleware, getCurrentUser);
userRouter.put('/profile',authMiddleware, updateUserProfile)
userRouter.put('/password', authMiddleware, updatePassword);

export default userRouter;
