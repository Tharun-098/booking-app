import dotenv from 'dotenv';
dotenv.config();
import bodyparser from 'body-parser';
import express from 'express';
import cors from "cors";
import cookieParser from 'cookie-parser';
import mongoDB from './config/db.js';
import authRouter from './routes/authRoutes.js';
import doctorRouter from './routes/doctorRoutes.js';
import tokenRouter from './routes/token.js';
import userRouter from './routes/userRoutes.js';
import connectCloudinary from './config/cloud.js';
import appointmentRouter from './routes/appointmentRouter.js';
import { getChatResponse } from './controller/openaiController.js';
import { stripeWebhook } from './controller/appointmentController.js';
const app=express();
const port=process.env.PORT || 3500;
const allowedOrigins=["http://localhost:5173"];
app.post('/api/payment/webhook',
    bodyparser.raw({ type: "application/json" }),
    stripeWebhook)
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:allowedOrigins,credentials:true}))
app.get('/',(req,res)=>{
    res.send("Server is running");
})
app.use('/api/auth',authRouter);
app.use('/api/doctor',doctorRouter);
app.use('/api/token',tokenRouter);
app.use('/api/user',userRouter);
app.use('/api/appointment',appointmentRouter);
app.post('/api/openai',getChatResponse);
mongoDB();
connectCloudinary();
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server running locally at http://localhost:${port}`);
  });
}

export default app;

 