// dailyAvailableSlots.js
import cron from "node-cron";
import Doctor from "../models/doctor.js";

// Generate time slots dynamically (like your frontend logic)
const generateTimeSlots = (startHour = 9, endHour = 18) => {
  const slots = [];
  for (let hour = startHour; hour < endHour; hour++) {
    const displayHour = hour > 12 ? hour - 12 : hour;
    const suffix = hour >= 12 ? "PM" : "AM";

    slots.push({ time: `${displayHour}:00 ${suffix}`, isBooked: false });
    slots.push({ time: `${displayHour}:30 ${suffix}`, isBooked: false });
  }
  return slots;
};

export const addDailyAvailableSlots = () => {
  // Run every day at midnight UTC
  cron.schedule("0 0 * * *", async () => {
    console.log("⏰ Running daily available slots job...");

    try {
      const doctors = await Doctor.find();

      const today = new Date();
      today.setUTCHours(0, 0, 0, 0); // normalize to midnight UTC

      for (const doctor of doctors) {
        // Check if today's date already exists
        const exists = doctor.availableSlots.some(
          (slot) => slot.date.toISOString() === today.toISOString()
        );

        if (!exists) {
          // Add new slot with dynamically generated times
          doctor.availableSlots.push({
            date: today,
            times: generateTimeSlots(9, 18), // 9AM to 6PM
          });

          await doctor.save();
        }
      }

      console.log("Today's available slots added for all doctors.");
    } catch (err) {
      console.error("Error adding daily available slots:", err);
    }
  });
};
