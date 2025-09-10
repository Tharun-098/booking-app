import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, unique: true, sparse: true },
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    },
    picture: String,
    role: { type: String, enum: ["patient"], default: "patient" },
    phone: { type: String},
    gender: { type: String, enum: ["male", "female", "other"]},
    dob: { type: Date},
    address: {String}
  },
  { timestamps: true }
);

const User = mongoose.models["user"] || mongoose.model("user", userSchema);

export default User;
