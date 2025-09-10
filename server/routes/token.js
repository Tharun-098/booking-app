import express from 'express';
import { refreshAccessToken } from '../controller/refreshAccessToken.js';
const tokenRouter=express.Router();

tokenRouter.get('/refresh',refreshAccessToken);
export default tokenRouter;