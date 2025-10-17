import mongoDB from "../../server/config/db.js";
import { addDailyAvailableSlots } from "../../server/config/automationDate.js";

export default async function handler(req, res) {
  const { secret } = req.query;

  // Secure route: only allow if secret matches
  if (secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    await mongoDB(); // connect to DB
    const result = await addDailyAvailableSlots(); // run automation

    res.status(200).json({
      success: true,
      message: "Automation executed successfully",
      data: result,
    });
  } catch (error) {
    console.error("❌ Cron API Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
}