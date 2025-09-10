import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Doctor from "../models/doctor.js";

export const refreshAccessToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) 
      return res.status(401).json({ success: false, message: "No refresh token" });

    // Decode token without verification first to get user ID
    const decoded = jwt.decode(token);
    if (!decoded?.id) 
      return res.status(401).json({ success: false, message: "Invalid token" });

    // Check both collections
    let user = await User.findById(decoded.id) || await Doctor.findById(decoded.id);
    if (!user) 
      return res.status(404).json({ success: false, message: "User not found" });

    // Create new access token
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_ACCESS_TOKEN,
      { expiresIn: "15m" }
    );

    res.json({ success: true, accessToken, role: user.role });

  } catch (error) {
    console.error(error);
    res.status(401).json({ success: false, message: "Invalid refresh token" });
  }
};
