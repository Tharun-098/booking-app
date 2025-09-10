import express from 'express';
import { getAllDoctors, placeAppointment,getAppointmentsByUser } from '../controller/appointmentController.js';
import { authMiddleware } from '../middleware/auth.js';
const appointmentRouter=express.Router();
appointmentRouter.get('/get-all-doctors',getAllDoctors);
appointmentRouter.get('/get-all-appointments',authMiddleware,getAppointmentsByUser);
appointmentRouter.post('/appoint-doctors',placeAppointment);
export default appointmentRouter;