import Appointment from "../models/appointments.js";

export const getDoctorsData = async (req, res) => {
  try {
    const { user } = req;
    console.log(user);
    const userId = user._id;
    const startOfToday = new Date();
    startOfToday.setUTCHours(0, 0, 0, 0);
    console.log(typeof startOfToday);
    const appointmentToday = await Appointment.find({
      doctor: userId,
      appointmentDates: { $eq: startOfToday },
    }).sort({ AppointmentDates: -1 });
    console.log(appointmentToday);
    const totalappointment=await Appointment.find({doctor:userId,status:'completed'});
    const pendingAppointment=await Appointment.find({doctor:userId,status:'pending'});
    const appointmentuserdetails=await Appointment.find({doctor:userId,$or:[{status:'pending'} ,{status:'confirmed'}]}).populate('patient','username');
    const result = await Appointment.aggregate([
      {
    $match: { status: "completed" },
  },
      {
        $group: {
          _id: { year: { $year: "$appointmentDates" }, month: { $month: "$appointmentDates" } },
          totalAppointments: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }, // sort chronologically
      },
    ]);
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const monthlyData = Array(12).fill(0);
    result.forEach((item) => {
      monthlyData[item._id.month - 1] = item.totalAppointments;
    });
    return res.json({ success: true,information:{appointmentToday,totalappointment,pendingAppointment,appointmentuserdetails,chartData: { months, monthlyData }}});
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
