import express from 'express';
import { getAllUsers, updateProfile ,getAllNotification,notificationReadmarks} from '../controller/userController.js';
import { authMiddleware } from '../middleware/auth.js';
import { upload } from '../config/multer.js';

const userRouter=express.Router();

userRouter.put('/update',upload.single('picture'),authMiddleware,updateProfile);
userRouter.get('/getAllUsers',authMiddleware,getAllUsers);
userRouter.get('/getAllNotifications',authMiddleware,getAllNotification);
userRouter.put('/update-notification/read/:notId',authMiddleware,notificationReadmarks);

export default userRouter;