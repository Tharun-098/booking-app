import express from 'express';
import { googleLogin,login,registerUser,logout,getProfile, doctorDataUploader } from '../controller/doctorController.js';
import { authMiddleware,roleMiddleware } from '../middleware/auth.js';
import { getDoctorsData,getPatientData } from '../controller/doctorData.js';
import { upload } from '../config/multer.js';
const doctorRouter=express.Router();

doctorRouter.post('/google',googleLogin);
doctorRouter.post('/login',login);
doctorRouter.post('/register',registerUser);
doctorRouter.post('/logout',logout);
doctorRouter.get('/profile',authMiddleware,roleMiddleware(['doctor']),getProfile);
doctorRouter.get('/getData',authMiddleware,getDoctorsData);
doctorRouter.get('/getPatientData',authMiddleware,getPatientData);
doctorRouter.put('/updateData',upload.single('picture'),authMiddleware,doctorDataUploader);

export default doctorRouter;