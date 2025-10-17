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
      status:'confirmed'
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
export const getAppointmentByDate = async (req, res) => {
  try {
    const { backendDate } = req.params; // YYYY-MM-DD format from frontend
    const doctorId = req.user._id; // assuming user is logged in
    console.log(doctorId)
    // Convert to start and end of the day in UTC
    const date = new Date(`${backendDate}T00:00:00Z`);
    console.log(date)
    const appointments = await Appointment.find({
      doctor: doctorId,
      appointmentDates: { $eq: date},
      status: "confirmed",
    }).populate("patient", "username email");
      return res.json({ success: true, appointments });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPatientData=async(req,res)=>{
  try {
    const doctorId=req.user;
    const patientData = await Appointment.find({ doctor: doctorId })
      .populate("patient", "username email")
      .sort({ appointmentDates: 1 });
    const patientDataLength = await Appointment.aggregate([
      {
        $match: {
          doctor: doctorId,
          status: "completed",
        },
      },
      {
        $group: {
          _id: null,
          totalAppointments: { $sum: 1 },
        },
      },
    ]);
    const completedCount =
      patientDataLength.length > 0 ? patientDataLength[0].totalAppointments : 0;
    if(!patientData){
      res.json({success:false,message:"No Patients are found"});
    }
    res.json({success:true,patientData,completedCount})
  } catch (error) {
    res.json({success:false,message:error.message})
  }
}