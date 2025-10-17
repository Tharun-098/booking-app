import express from 'express';
import { getAllDoctors, placeAppointment,getAppointmentsByUser,addAppointment } from '../controller/appointmentController.js';
import { authMiddleware } from '../middleware/auth.js';
import { getAppointmentByDate } from '../controller/doctorData.js';
const appointmentRouter=express.Router();
appointmentRouter.get('/get-all-doctors',getAllDoctors);
appointmentRouter.get('/get-all-appointments',authMiddleware,getAppointmentsByUser);
appointmentRouter.post('/appoint-doctors',placeAppointment);
appointmentRouter.get('/getAppointmentsByDate/:backendDate',authMiddleware,getAppointmentByDate)
appointmentRouter.post('/create',authMiddleware,addAppointment)
export default appointmentRouter;