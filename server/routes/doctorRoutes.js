import express from 'express';
import { googleLogin,login,registerUser,logout,getProfile } from '../controller/doctorController.js';
import { authMiddleware,roleMiddleware } from '../middleware/auth.js';
import { getDoctorsData } from '../controller/doctorData.js';
const doctorRouter=express.Router();

doctorRouter.post('/google',googleLogin);
doctorRouter.post('/login',login);
doctorRouter.post('/register',registerUser);
doctorRouter.post('/logout',logout);
//doctorRouter.get('/refresh',refreshAccessToken);
doctorRouter.get('/profile',authMiddleware,roleMiddleware(['doctor']),getProfile);
doctorRouter.get('/getData',authMiddleware,getDoctorsData);

export default doctorRouter;