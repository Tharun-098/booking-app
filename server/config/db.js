// import mongoose from "mongoose";
// import { addDailyAvailableSlots } from "../config/automationDate.js";
// const mongoDB=async()=>{
//     try {
//         console.log("Mongo URI exists:", !!process.env.MONGODB_URL);
//         mongoose.connection.on('connected',()=>{
//             console.log("Database is connected");
//         })
//         await mongoose.connect(process.env.MONGODB_URL);
//         addDailyAvailableSlots();
//     } catch (error) {
//         console.log(error.message);
//     }
// };

// export default mongoDB;
import mongoose from "mongoose";
import { addDailyAvailableSlots } from "../config/automationDate.js";

let isConnected = false;

const mongoDB = async () => {
    if (isConnected) return;

    mongoose.set('bufferCommands', false); // fail fast instead of silently queueing

    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            serverSelectionTimeoutMS: 10000,
        });
        isConnected = true;
        console.log("Database is connected");
        addDailyAvailableSlots();
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        throw error;
    }
};

export default mongoDB;