import User from "../models/user.js";
import cloudinary from "cloudinary";

export const updateProfile = async (req, res) => {
  try {
    
    const userId = req.user._id;
     console.log("req.body:", req.body);
    console.log("req.file:", req.file);
    console.log("req.user:", req.user);
    const { name, email, gender, phone, address, dob } = req.body;

    if (!name && !email && !gender && !phone && !address && !dob) {
      return res.json({
        success: false,
        message: "No details provided to update",
      });
    }

    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (gender) updateFields.gender = gender;
    if (phone) updateFields.phone = phone;
    if (address) updateFields.address = address;
    if (dob) updateFields.dob = dob;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profiles",
        resource_type: "image",
      });
      updateFields.picture = result.secure_url;  // only save the URL string
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true }
    ).select("-password"); 

    if (!updatedUser) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating profile",
    });
  }
};


//THE FLOW IS THAT MULTER MIDDLEWARE EXTRACT THE FILE FROM PICTURE AND MODIFY THE REQUEST AS REQ.FILE TO STORE THE PICTURE INSTEAD OF FORMDATA.PICTURE USAGE
