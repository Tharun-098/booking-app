import express from 'express';
import { getProfile, googleLogin, login, logout, registerUser } from '../controller/authController.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const authRouter=express.Router();

authRouter.post('/google',googleLogin);
authRouter.post('/login',login);
authRouter.post('/register',registerUser);
authRouter.get('/logout',logout);
//authRouter.get('/refresh',refreshAccessToken);
authRouter.get('/profile',authMiddleware,roleMiddleware('patient'),getProfile);

export default authRouter;