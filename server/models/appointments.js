import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctor", 
      required: true,
    },
    appointmentDates: {
      type: Date, 
      required: true,
    },
    time: {
      type: String, // e.g., "10:00 AM"
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
    },
    typeOfAppointment:{type:String,enum:["Consultation","Check up","Follow up"],default:"Consultation"},
    reason:{type:String}
  },
  { timestamps: true }
);
const Appointment =
  mongoose.models["appointment"] || mongoose.model("appointment", appointmentSchema);

export default Appointment;