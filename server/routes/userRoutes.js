import express from 'express';
import { updateProfile } from '../controller/userController.js';
import { authMiddleware } from '../middleware/auth.js';
import { upload } from '../config/multer.js';

const userRouter=express.Router();

userRouter.put('/update',upload.single('picture'),authMiddleware,updateProfile);

export default userRouter;