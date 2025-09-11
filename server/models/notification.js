import mongoose from 'mongoose';

const notificationSchema=new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ["appointment", "payment", "reminder"], required: true },
    read: { type: Boolean, default: false }
},
{timestampstrue}
)

const Notification=mongoose.models['notification'] || mongoose.model('notification',notificationSchema)

export default Notification;