import React, { useContext,useRef, useState } from "react";
import photo from "../../assets/pexels-photo-4173251.webp";
import { DataContext } from "../../context/DataContext";
import { Camera, Clock, LocationEdit, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {toast} from 'react-toastify'
import { motion } from "framer-motion";
const Profile = () => {
  const navigate=useNavigate()
  const { setDoctor,doctor,axios,accessToken } = useContext(DataContext);
  const [edit, setEdit] = React.useState(false);
  const [preview,setPreview]=useState(undefined);
  const imageRef=useRef();
  const [formData, setFormData] = useState({
    name: doctor?.username || "",
    email: doctor?.email || "",
    specialization: doctor?.specialization || "",
    location: {
      HospitalName: doctor?.location?.HospitalName || "",
      roomNo: doctor?.location?.roomNo || "",
      city: doctor?.location?.city || "",
    },
    experience: doctor?.experience || "",
    consultationFees: doctor?.consultationFees || "",
    picture:doctor?.picture||"",
  });
  const handleChange = (e) => {
  const { name, value } = e.target;
  
  if (name.startsWith("location.")) {
    const key = name.split(".")[1];
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [key]: value,
      },
    }));
  } else {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }
};

  const handleImageClick=()=>{
    imageRef.current.click();
  }
  const handleImageUpload=(e)=>{
    const file=e.target.files[0];
    if(file){
      const imgUrl=URL.createObjectURL(file);
      setPreview(imgUrl);
      setFormData((prev)=>({...prev,picture:file}));
    }
  }
  const handleUpdate=async(e)=>{
    try {
      const formDatas=new FormData();
      formDatas.append('name',formData.name)
      formDatas.append('email',formData.email)
      formDatas.append('specialization',formData.specialization)
      formDatas.append('experience',formData.experience)
      formDatas.append('consultationFees',formData.consultationFees)
      formDatas.append('picture',formData.picture)
      formDatas.append('location[HospitalName]', formData.location.HospitalName || "");
formDatas.append('location[roomNo]', formData.location.roomNo || "");
formDatas.append('location[city]', formData.location.city || "");

      const {data}=await axios.put('/api/doctor/updateData',formDatas,{
        headers:{
          Authorization:`Bearer ${accessToken}`
        }
      });
      if(data.success){
        toast.success(data.message);
        setEdit(false);
        setDoctor(data.user)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  const handleLogout=async()=>{
    try {
      const {data}=await axios.post('/api/doctor/logout',{});
      if(data.success){
        setDoctor(null);
        navigate('/');
        toast.success(data.message);
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
  return (
    <div className="">
      <div className="flex justify-between">
        <h1 className="font-bold text-xl">Doctor Profile</h1>
        {!edit ? (
          <button
            className="bg-blue-500 p-2 text-white font-semibold rounded-lg"
            onClick={() => setEdit(true)}
          >
            Edit profile
          </button>
        ) : (
          <div className="flex gap-2 items-center">
            <button
              className="bg-blue-500 p-2 text-white font-semibold rounded-lg"
              onClick={() => setEdit(false)}
            >
              cancel
            </button>
            <button
              className="bg-blue-500 p-2 text-white font-semibold rounded-lg"
              onClick={handleUpdate}
            >
              Save button
            </button>
          </div>
        )}
      </div>
      <motion.div className="mt-4 bg-white p-4 rounded-lg" initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut"} }>
        <div className="mx-auto text-center flex flex-col justify-center items-center">
          {doctor?.picture ? (
            <div className="relative">
            <img
              src={preview || formData?.picture }
              alt="Doctor"
              className="rounded-full w-36 h-36 object-cover"
              />
            <Camera className="absolute bottom-0 right-3 h-8 w-8 text-black bg-blue-500 p-1 rounded-full" onClick={edit ? handleImageClick: undefined}/>
            <input type="file" accept="image/*" name="picture" ref={imageRef} className="absolute bottom-0 left-0 hidden" onChange={handleImageUpload}/>
            </div>
          ) : (
            <img
              src={photo}
              alt="Fallback"
              className="rounded-full w-30 h-30 object-cover"
            />
          )}

          {edit ? (
            <div className="w-full">
              <input
                type="text"
                value={formData.name}
                onChange={handleChange}
                name="name"
                className="text-center w-full border border-gray-300 rounded-lg p-2 focus:ring-2 text-sm mt-2 focus:ring-blue-500 outline-0"
              />
              <input
                type="text"
                value={formData.specialization}
                onChange={handleChange}
                name="specialization"
                className="text-center w-full border border-gray-300 mt-2 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-0"
              />
            </div>
          ) : (
            <div>
              <h1 className="font-bold mt-2">{doctor?.username}</h1>
              <p className="mt-2 font-semibold">{doctor?.specialization}</p>
            </div>
          )}
          {edit ? (
            <div className="w-full">
              <input
                type="text"
                value={formData.email}
                onChange={handleChange}
                name="email"
                className="text-center w-full border border-gray-300 rounded-lg p-2 focus:ring-2 text-sm mt-2 focus:ring-blue-500 outline-0"
              />
              <input
                type="text"
                name="location.HospitalName"
                value={formData.location.HospitalName}
                onChange={handleChange}
                placeholder="Hospital Name"
                className="w-full border border-gray-300 rounded-lg p-2 mt-2 text-sm focus:ring-2 focus:ring-blue-500 outline-0"
              />
              <input
                type="text"
                name="location.roomNo"
                value={formData.location.roomNo}
                onChange={handleChange}
                placeholder="Room No"
                className="w-full border border-gray-300 rounded-lg p-2 mt-2 text-sm focus:ring-2 focus:ring-blue-500 outline-0"
              />
              <input
                type="text"
                name="location.city"
                value={formData.location.city}
                onChange={handleChange}
                placeholder="City"
                className="w-full border border-gray-300 rounded-lg p-2 mt-2 text-sm focus:ring-2 focus:ring-blue-500 outline-0"
              />
            </div>
          ) : (
            <div className="mt-2">
              <p className="flex gap-2 mb-2 text-sm word-wrap">
                <Mail className="text-gray-400" />
                {doctor?.email}
              </p>
              <p className="flex gap-2 text-sm">
                <LocationEdit className="text-gray-400" />
                {doctor?.location?.roomNo} {doctor?.location?.HospitalName}{" "}
                {doctor?.location?.city}
              </p>
            </div>
          )}
        </div>
      </motion.div>
      <div className="mt-4 bg-white p-4 rounded-lg">
        <h1 className="font-bold mt-2">Professional Experience</h1>
        <h2 className="mt-2 font-semibold">Experience</h2>
        {edit ? (
          <input
            type="text"
            value={formData.experience}
            onChange={handleChange}
            name="experience"
            className="text-center w-full border border-gray-300 mt-2 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-0"
          />
        ) : (
          <p className="mt-2">
            {doctor?.experience > 1
              ? `${doctor.experience} years`
              : `${doctor.experience} year`}
          </p>
        )}
        <h2 className="mt-2 font-semibold">Consultation Fees</h2>
        {edit ? (
          <input
            type="text"
            value={formData.consultationFees}
            onChange={handleChange}
            name="consultationFees"
            className="text-center w-full border border-gray-300 mt-2 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-0"
          />
        ) : (
          <p className="mt-2">${doctor?.consultationFees}</p>
        )}
        <h2 className="mt-2 font-semibold">Languages</h2>
        <p className="mt-2">English,Tamil,hindi</p>
        <h2 className="mt-2 font-semibold">Certifications</h2>
        <p className="mt-2">Certification in {doctor?.specialization}</p>
      </div>
      <motion.div className="mt-4 bg-white p-4 rounded-lg" initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut"} }>
        <h1 className="font-bold mt-2 flex gap-2 items-center mb-2">
          <Clock className="text-blue-500" />
          Weekly Schedule
        </h1>
        <p className="mt-2 flex justify-between font-semibold items-center">
          Monday{" "}
          <span className="text-gray-400 font-extralight">
            09:00 AM-06:00 PM
          </span>
        </p>
        <hr className="mt-2 text-gray-100" />
        <p className="mt-2 flex justify-between font-semibold items-center">
          Tuesday{" "}
          <span className="text-gray-400 font-extralight">
            09:00 AM-06:00 PM
          </span>
        </p>
        <hr className="mt-2 text-gray-100" />
        <p className="mt-2 flex justify-between items-center font-semibold">
          Wednesday{" "}
          <span className="text-gray-400 font-extralight">
            09:00 AM-06:00 PM
          </span>
        </p>
        <hr className="mt-2 text-gray-100" />
        <p className="mt-2 flex justify-between font-semibold items-center">
          Thursday{" "}
          <span className="text-gray-400 font-extralight">
            09:00 AM-06:00 PM
          </span>
        </p>
        <hr className="mt-2 text-gray-100" />
        <p className="mt-2 flex justify-between font-semibold items-center">
          Friday{" "}
          <span className="text-gray-400 font-extralight">
            09:00 AM-06:00 PM
          </span>
        </p>
        <hr className="mt-2 text-gray-100" />
        <p className="mt-2 flex justify-between font-semibold items-center">
          Saturday{" "}
          <span className="text-gray-400 font-extralight">
            09:00 AM-06:00 PM
          </span>
        </p>
      </motion.div>
        <button onClick={handleLogout} className="bg-blue-500 rounded-lg w-50 text-center text-white mt-3 active:bg-blue-400 transition-1 hover:bg-blue-400 mx-auto block p-2">
          Logout
        </button>
    </div>
  );
};

export default Profile;
