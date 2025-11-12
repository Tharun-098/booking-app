import {motion} from 'framer-motion'
import React, { useContext, useEffect, useState } from "react";
import avatar from "../../assets/download.png"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit3,
  Save,
  X,
  User2,
} from "lucide-react";
import { DataContext } from "../../context/DataContext";
import { toast } from 'react-toastify';

const Profile = () => {
  const { navigate,user,axios,accessToken,setAccessToken,setUser,setIsLogged } = useContext(DataContext);
  const [isEditing, setIsEditing] = useState(false);
  const [animation, setAnimation] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.username || "",
    email: user?.email || "",
    phone: user?.phone || "",
    gender: user?.gender || "",
    dob: user?.dob || "",
    address: user?.address || "",
    picture: user?.picture || "",
  });
  const [previewImage, setPreviewImage] = useState(undefined);
  
  useEffect(()=>{
    setAnimation(true);
  },[]);

  const handleEdit = () => setIsEditing(true);
  
  const handleCancel = () => {
    setFormData({
      name: user?.username || "",
      email: user?.email || "",
      phone: user?.phone || "",
      gender: user?.gender || "",
      dob: user?.dob || "",
      address: user?.address || "",
      picture: user?.picture || "",
    });
    setPreviewImage(user?.picture || "");
    setIsEditing(false);
  };


const handleSave = async () => {
  try {
    const formdatas=new FormData();
    formdatas.append("name", formData.name);
    formdatas.append("email", formData.email);
    formdatas.append("phone", formData.phone);
    formdatas.append("gender", formData.gender);
    formdatas.append("dob", formData.dob);
    formdatas.append("address", formData.address);
    if(formData.picture){
      formdatas.append("picture",formData.picture);
    }
    const { data } = await axios.put(
      "/api/user/update", 
      formdatas,{
        headers: { Authorization: `Bearer ${accessToken}` ,
        "Content-Type": "multipart/form-data",
  }});

    if (data.success) {
      toast.success(data.message);
      setIsEditing(false);
      setPreviewImage(undefined)
    } else {
      toast.error(data.message || "Update failed");
    }
  } catch (err) {
    toast.error("Error saving profile:", err);
  }
};

  const handleInputChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Handle image upload (preview only, not backend)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setFormData((prev) => ({ ...prev, picture: file })); // file stored in state
    }
  };
   
  const userLogout=async()=>{
    try {
      const {data}=await axios.get('/api/auth/logout');
      if(data.success){
        toast.success(data.message);
        setUser(undefined);
        setIsLogged(false);
        setAccessToken(null);
        navigate('/');
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  return (
    <div className="min-h-screen p-6 bg-gray-100">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
        <p className="text-gray-600">
          Manage your personal information and preferences
        </p>
      </div>

      {/* Profile Card */}
      <motion.div className="bg-white shadow-md rounded-2xl p-3"
      initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut"} }>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
               {/* {formData.picture? */}
              <img 
                src={ previewImage || formData.picture || avatar}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"/>
              {/* />:<User size={50} className='rounded-full text-gray-500 p-2 bg-gray-300'/>} */}
              {isEditing && (
                <>
                  <label
                    htmlFor="fileUpload"
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full shadow cursor-pointer hover:bg-blue-700 transition"
                  >
                    <Edit3 size={14} />
                  </label>
                  <input
                    id="fileUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {formData.name || "No Name"}
              </h2>
            </div>
          </div>

          <div className="mt-4 sm:mt-0 flex gap-3">
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 bg-blue-600 text-white sm:px-4 px-2 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <Edit3 size={16} />
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="flex items-center sm:gap-2 gap-1 bg-gray-200 text-gray-800 sm:px-4 px-2 py-1 rounded-lg hover:bg-gray-300 transition"
                >
                  <X size={16} />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center sm:gap-2 gap-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  <Save size={16} />
                  Save Changes
                </button>
              </>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1">
                <User size={16} className="text-gray-500" />
                Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-800">{formData.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1">
                <Mail size={16} className="text-gray-500" />
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-800">{formData.email}</p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1">
                <User2 size={16} className="text-gray-500" />
                Gender
              </label>
              {isEditing ? (
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              ) : (
                <p className="text-gray-800 capitalize">
                  {formData.gender || "Not specified"}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1">
                <Phone size={16} className="text-gray-500" />
                Phone
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-800">
                  {formData.phone || "Not provided"}
                </p>
              )}
            </div>

            {/* DOB */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1">
                <Calendar size={16} className="text-gray-500" />
                Date of Birth
              </label>
              {isEditing ? (
                <input
                  type="date"
                  name="dob"
                  value={formData.dob || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-800">
                  {formData.dob
                    ? new Date(formData.dob).toLocaleDateString()
                    : "Not provided"}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1">
                <MapPin size={16} className="text-gray-500" />
                Address
              </label>
              {isEditing ? (
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-800">
                  {formData.address || "Not provided"}
                </p>
              )}
            </div>
          </div>
            <div className="text-center mt-5 mb-5">
                <button className="w-1/2 mx-auto bg-blue-400 p-2 rounded-lg hover:scale-90" onClick={userLogout}>Logout</button>
            </div>
        </div>
      </motion.div>
      </div>
  );
};

export default Profile;
