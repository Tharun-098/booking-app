import express from 'express';
import { getAllDoctors, placeAppointment } from '../controller/appointmentController.js';
const appointmentRouter=express.Router();
appointmentRouter.get('/get-all-doctors',getAllDoctors);
appointmentRouter.post('/appoint-doctors',placeAppointment);
export default appointmentRouter;