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
import {Server} from 'socket.io';
import http from 'http';
const app=express();
const port=process.env.PORT || 3500;
const server=http.createServer(app);
const allowedOrigins=[/*"http://localhost:5173",*/"https://booking-app-v3hw-pc15yu4o1-tharuns-projects-49537103.vercel.app"];
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
export const onlineUsers={};
export const io=new Server(server,{
  cors:{
    origin:allowedOrigins,
  methods:["GET","POST"],
  credentials:true
}});
io.on('connection',(socket)=>{
   console.log("User connected:", socket.id);

  socket.on("register_user", (userId) => {
    onlineUsers[userId]=socket.id;
    console.log("Registered:", userId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    for (const userId in onlineUsers) {
      if (onlineUsers[userId] === socket.id) delete onlineUsers.userId; 
        //onlineUsers.delete(userId);
    }
})
})
if (process.env.NODE_ENV !== "production") {
  server.listen(port, () => {
    console.log(`Server running locally at http://localhost:${port}`);
  });
}

export default app;

 