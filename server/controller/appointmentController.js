import dotenv from 'dotenv';
dotenv.config();
import Doctor from "../models/doctor.js";
import moment from "moment";
import Appointment from "../models/appointments.js";
import Notification from '../models/notification.js';
import Stripe from 'stripe';
const stripe=new Stripe(process.env.STRIPE_API_KEY)

export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().select("-password");
    return res.json({ success: true, doctors });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const placeAppointment = async (req, res) => {
  try {
    const { doctor, patient, appointmentDate, time } = req.body;

    if (!doctor || !patient || !appointmentDate || !time) {
      return res.json({ success: false, message: "All fields are required" });
    }
    
    const dateStr = moment(appointmentDate).utc().format("YYYY-MM-DD");
    console.log("Normalized Date String:", dateStr);
    console.log(appointmentDate);

    // Normalize time (always stored as h:mm A)
    const formattedTime = moment(time, ["HH:mm", "h:mm A"]).format("h:mm A");
    console.log("Normalized Time:", formattedTime);

    // Check doctor
    const doctorDoc = await Doctor.findById(doctor);
    if (!doctorDoc) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    // Find the slot by comparing date string + time
    const slot = doctorDoc.availableSlots
      .find((s) => moment(s.date).utc().format("YYYY-MM-DD") === dateStr)
      ?.times.find((t) => t.time === formattedTime);
    console.log(slot);
    doctorDoc.availableSlots.forEach((s) => {
      console.log(
        "DB Slot Date:",
        s.date,
        "=>",
        moment(s.date).format("YYYY-MM-DD")
      );
      s.times.forEach((t) => {
        console.log("DB Slot Time:", `"${t.time}"`);
      });
    });

    console.log("Looking for Date:", dateStr, "Time:", `"${formattedTime}"`);

    if (!slot) {
      return res.json({ success: false, message: "Time slot not found" });
    }
    if(slot.isBooked) {
      return res.json({
        success: false,
        message: "This slot is already booked",
      });
    }

    // Create appointment
    const appointment = await Appointment.create({
      doctor,
      patient,
      appointmentDates: moment(appointmentDate), 
      time: formattedTime,
    });
    console.log(appointment)   
    const dateOnlyUTC = moment(appointmentDate).utc().startOf("day").toDate();
    console.log(dateOnlyUTC);
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Consultation with ${doctorDoc.username}`,
            },
            unit_amount: (doctorDoc.consultationFees + 5) * 100, // convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:5173/user/dashboard/records?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/payment-cancel`,
      metadata: {
        appointmentId: appointment._id.toString(),
      },
    });
    console.log("stripe session",session)
    const notificationMessage=`Your appointment with Dr. ${doctorDoc.username} on ${new Date(appointmentDate).toLocaleString()} has been booked successfully.`
    await Notification.create({
      user:patient,
      title:'Appointment Booked',
      message:notificationMessage,
      type:'appointment',
      read:false
    })
    return res.json({
      success: true,
      message: "Appointment booked successfully",
      appointment,
      url:session.url
    });
  } catch (error) {
    console.error("Error placing appointment:", error);
    return res.json({ success: false, message: error.message });
  }
};
export const stripeWebhook = async (req, res) => {
  console.log('webhook run')
   try {
     const sig = req.headers["stripe-signature"];
     const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

     if (event.type === "checkout.session.completed") {
       const session = event.data.object;
       const appointmentId = session.metadata.appointmentId;
       console.log("appointmentId",appointmentId)
       await Appointment.findByIdAndUpdate(appointmentId, { paymentStatus: "paid" });

       // Also mark doctor’s slot as booked
       const appointment = await Appointment.findById(appointmentId);
       const formattedTime = appointment.time;
       const dateOnlyUTC = moment(appointment.appointmentDates).utc().startOf("day").toDate();

       await Doctor.findByIdAndUpdate(
         appointment.doctor,
         {
           $set: { "availableSlots.$[dateElem].times.$[timeElem].isBooked": true },
         },
         {
           arrayFilters: [
             { "dateElem.date": dateOnlyUTC },
             { "timeElem.time": formattedTime },
           ],
         }
       );
     }

     res.json({ received: true });
   } catch (error) {
     console.error("Webhook error:", error);
     res.status(400).send(`Webhook Error: ${error.message}`);
    }
  };
  export const getAppointmentsByUser=async(req,res)=>{
    try {
      const userId=req.user._id;
      const appointments=await Appointment.find({patient:userId}).populate('doctor','username specialization location').sort({appointmentDates:-1});
      console.log(appointments);
      return res.json({success:true,appointments});
    } catch (error) {
    return res.json({success:false,message:error.message});
  }
}