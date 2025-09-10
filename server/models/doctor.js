import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    googleId: { type: String, default: null },
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    },
    availableSlots: [
      {
        date: { type: Date, required: true }, // which day doctor is available
        times: [
          {
            time: { type: String, required: true }, // e.g., "10:00 AM"
            isBooked: { type: Boolean, default: false }, // track slot status
          },
        ],
      },
    ],
    picture: String,
    specialization: { type: String }, // e.g., cardiologist, tutor, etc.
    isApproved: { type: Boolean, default: false }, // admin approves doctor
    role: { type: String, enum: ["doctor"], default: "doctor" },
    location: {
      HospitalNo:String,
      street:String,
      city: String,
      state: String,
      country: String,
    },

    experience: { type: Number, default: 0 }, // in years
    consultationFees: { type: Number, default: 0 },

    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Doctor =
  mongoose.models["doctor"] || mongoose.model("doctor", doctorSchema);

export default Doctor;
