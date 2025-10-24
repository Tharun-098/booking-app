import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // reference to the patient
      required: true,
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "appointment", // optional: related appointment
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } 
);

const Notifications = mongoose.models["notification"]||mongoose.model("notification", notificationSchema);

export default Notifications;
