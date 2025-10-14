import mongoose from "mongoose";
import { addDailyAvailableSlots } from "./automationDate";
const mongoDB=async()=>{
    try {
        mongoose.connection.on('connected',()=>{
            console.log("Database is connected");
        })
        await mongoose.connect(process.env.MONGODB_URL);
        addDailyAvailableSlots();
    } catch (error) {
        console.log(error.message);
    }
};

export default mongoDB;