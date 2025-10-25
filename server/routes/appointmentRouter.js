import express from 'express';
import { getAllDoctors, placeAppointment,getAppointmentsByUser,addAppointment,allAppointments, updateAppointment } from '../controller/appointmentController.js';
import { authMiddleware } from '../middleware/auth.js';
import { getAppointmentByDate } from '../controller/doctorData.js';
const appointmentRouter=express.Router();
appointmentRouter.get('/get-all-doctors',getAllDoctors);
appointmentRouter.get('/getAllAppointments',authMiddleware,allAppointments);
appointmentRouter.get('/get-all-appointments',authMiddleware,getAppointmentsByUser);
appointmentRouter.post('/appoint-doctors',placeAppointment);
appointmentRouter.get('/getAppointmentsByDate/:backendDate',authMiddleware,getAppointmentByDate)
appointmentRouter.post('/create',authMiddleware,addAppointment)
appointmentRouter.put('/update-status/:id',updateAppointment)
export default appointmentRouter;