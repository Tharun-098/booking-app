import Doctor from "../models/doctor.js";

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

// ✅ Export function to be triggered manually (not with node-cron)
export const addDailyAvailableSlots = async () => {
  console.log("⏰ Running daily available slots job...");

  try {
    const doctors = await Doctor.find();

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    for (const doctor of doctors) {
      const exists = doctor.availableSlots.some(
        (slot) => slot.date.toISOString() === today.toISOString()
      );

      if (!exists) {
        doctor.availableSlots.push({
          date: today,
          times: generateTimeSlots(9, 18),
        });
        await doctor.save({{ validateBeforeSave: false }});
      }
    }

    console.log("✅ Today's available slots added for all doctors.");
    return { success: true, message: "Slots added successfully" };
  } catch (err) {
    console.error("❌ Error adding daily available slots:", err);
    return { success: false, message: err.message };
  }
};
