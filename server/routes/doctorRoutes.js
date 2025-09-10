import express from 'express';
import { googleLogin,login,registerUser,logout,getProfile } from '../controller/doctorController.js';
import { authMiddleware,roleMiddleware } from '../middleware/auth.js';
const doctorRouter=express.Router();

doctorRouter.post('/google',googleLogin);
doctorRouter.post('/login',login);
doctorRouter.post('/register',registerUser);
doctorRouter.post('/logout',logout);
//doctorRouter.get('/refresh',refreshAccessToken);
doctorRouter.get('/profile',authMiddleware,roleMiddleware(['doctor']),getProfile);

export default doctorRouter;