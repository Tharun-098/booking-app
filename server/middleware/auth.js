import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Doctor from "../models/doctor.js";

// Auth Middleware: verifies JWT and attaches user to req
export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ success: false, message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
    
    // Try to find in User collection
    let user = await User.findById(decoded.id).select("-password");
    // If not found in User, check Doctor collection
    if (!user) {
      user = await Doctor.findById(decoded.id).select("-password");
    }

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

// Role Middleware: restricts access based on role(s)
export const roleMiddleware = (roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ success: false, message: "Not authenticated" });
  if (!roles.includes(req.user.role)) return res.status(403).json({ success: false, message: "Forbidden" });
  next();
};
