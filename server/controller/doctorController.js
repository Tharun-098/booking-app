import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import Doctor from "../models/doctor.js";
const client = new OAuth2Client(process.env.CLIENT_ID);
//create tokens
const createTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_ACCESS_TOKEN, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_TOKEN, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

//Google Login
export const googleLogin = async (req, res) => {
  try {
    console.log("Request body:", req.body);
console.log("Token received:", req.body.token);

    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();

    let user = await Doctor.findOne({ email: payload.email });
    if (!user) {
      user = await Doctor.create({
        googleId: payload.sub,
        username: payload.name,
        email: payload.email,
        picture: payload.picture,
      });
    }

    const { accessToken, refreshToken } = createTokens(user._id);

    // Send refresh token in httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ success:true,message: "Login success", user, accessToken });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success:false,message: "Google login failed" });
  }
};

// Normal Login 
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.json({ success:false,message: "Missing credentials" });
    
    const user = await Doctor.findOne({ email });
    if (!user) return res.json({ success:false,message: "User not found" });
    if(!user.password){
      return res
        .json({ success: false, message: "Please login with Google" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.json({ success:false,message: "Invalid password" });

    const { accessToken, refreshToken } = createTokens(user._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ success:true,message: "Login successful", user, accessToken });
  } catch (error) {
    console.error(error);
    res.json({ success:false,message: error.message });
  }
};

//Register
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.json({ success:false,message: "Missing details" });

    const existUser = await Doctor.findOne({ email });
    if (existUser) return res.json({ success:false,message: "User already exists" });

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await Doctor.create({ username, email, password: hashPassword });

    const { accessToken, refreshToken } = createTokens(newUser._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ success:true,message: "Registered successfully", newUser, accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success:false,message: error.message });
  }
};


//Logout 
export const logout = async (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  });
  res.json({ message: "Logged out successfully" });
};

// Get Profile 
export const getProfile=async(req,res)=>{
  try{
    if (!req.user) return res.status(404).json({ success:false, message:"User not found" });
    res.json({ success:true, user: req.user });
  }catch(error){
    console.error(error);
    res.json({ success: false, message: error.message });

  }
}
    // //Refresh Access Token 
    // export const refreshAccessToken = async (req, res) => {
    //   try {
    //     const token = req.cookies.refreshToken;
    //     if (!token) return res.status(401).json({ success:false,message: "No refresh token" });
    
    //     const decoded = jwt.verify(token, process.env.JWT_REFRESH_TOKEN);
    //     const user = await Doctor.findById(decoded.id);
    //     if (!user) return res.status(404).json({success:false, message: "User not found" });
    
    //     const accessToken = jwt.sign({ id: user._id }, process.env.JWT_ACCESS_TOKEN, { expiresIn: "15m" });
    //     res.json({ accessToken });
    //   } catch (error) {
    //     console.error(error);
    //     res.status(401).json({ success:false,message: "Invalid refresh token" });
    //   }
    // };