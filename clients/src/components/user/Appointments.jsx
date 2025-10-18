import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import {
  Search,
  Funnel,
  Award,
  LocationEdit,
  Star,
  MoveLeft,
  MoveRight,
  Calendar,
  Clock,
} from "lucide-react";
import { useContext } from "react";
import { DataContext } from "../../context/DataContext";
const Appointments = () => {
  const {
    user,
    setIsDoctorSelect,
    doctorSelect,
    isTimeSelect,
    setIsTimeSelect,
    isConfirm,
    setIsConfirm,
    axios
  } = useContext(DataContext);
  const [specialization, setSpecialization] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [doctors, setDoctors] = React.useState([]);
  const [selectTime, setSelectTime] = React.useState("");
  const [selectedDoctor, setSelectedDoctor] = React.useState(undefined);
  const [selectedDate, setSelectedDate] = useState(new Date());;
  const formattedDate = new Date(Date.UTC(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate()
  )
);
  console.log(selectedDate);
  console.log(formattedDate.toISOString());
  console.log(selectTime);
  const prevMonth = () => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
  };
  const afterMonth = () => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 1);
      return newDate;
    });
  };
  useEffect(()=>{
    const fetchDoctors=async()=>{
      try {
        const {data}=await axios.get('/api/appointment/get-all-doctors');
        if(data.success){
          console.log(data)
          setDoctors(data.doctors);
          console.log(data.doctors);
        }
      } catch (error) {
        console.log(error.message)
      }
    }
    fetchDoctors();
  },[])

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
    doctor.username.toLowerCase().includes(search.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(search.toLowerCase());
    
    const matchesSpecialization =
    specialization === "" ||
    doctor.specialization.toLowerCase() === specialization.toLowerCase();
    
    return matchesSearch && matchesSpecialization;
  });
  console.log(filteredDoctors);
  const slotsForDate =
  selectedDoctor?.availableSlots.find((slot) => {
    const slotDate = new Date(slot.date);
    return (
      slotDate.getUTCFullYear() === formattedDate.getUTCFullYear() &&
      slotDate.getUTCMonth() === formattedDate.getUTCMonth() &&
      slotDate.getUTCDate() === formattedDate.getUTCDate()
    );
  })?.times || [];
  
  console.log(slotsForDate);
  
  const handleAppointDoctors=async()=>{
        try {
          const {data}=await axios.post('/api/appointment/appoint-doctors',{
            doctor:selectedDoctor._id,
            patient:user._id,
            appointmentDate:formattedDate,
            time:selectTime
          })
          if(data.success){
            console.log(data.message);
            window.location.href=data.url;
          }
          else{
            console.log(data.message);
          }
        } catch (error) {
          console.log(error.message);
        }
      }
      console.log(doctors)
  return (
    <div>
      <h1 className="text-2xl font-bold text-center">Book An Appointments</h1>
      <p className="text-gray-400 text-md text-center pt-2">
        Find and book appointments with top-rated doctors
      </p>
      <div className="flex justify-center md:gap-10 gap-5 mt-10">
        <div className="flex flex-col items-center justify-center gap-2">
          <p
            className={`rounded-full p-5 flex items-center justify-center w-5 h-5 bg-blue-500 text-white border-0`}
          >
            1
          </p>
          <p>select Doctor</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p
            className={`rounded-full p-5 flex items-center justify-center w-5 h-5 ${
              !isTimeSelect ? "bg-gray-300" : "bg-blue-500"
            } text-white border-0`}
          >
            2
          </p>
          <p className="text-gray-900 font-semibold text-center text-sm md:text-md">
            Choose Time
          </p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p
            className={`rounded-full p-5 flex items-center justify-center w-5 h-5 ${
              !isConfirm ? "bg-gray-300" : "bg-blue-500"
            } text-white border-0`}
          >
            3
          </p>
          <p className="text-gray-900 font-semibold text-center text-sm md:text-md">
            Confirm
          </p>
        </div>
      </div>
      {doctorSelect ? (
        <>
          <div className="flex gap-5 justify-center items-center mt-5 flex-col md:flex-row">
            <div className="relative md:flex-1 w-full">
              <Search className="w-5 h-5 absolute top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="search doctors or specialists"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="p-2 pl-6 w-full bg-white rounded-lg text-gray-400"
              />
            </div>
            <div className="relative w-full md:w-60">
              <Funnel className="absolute w-5 h-5 text-gray-400 top-2.5" />
              <select
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="rounded-md p-2 bg-white outline-0 border-0 text-gray-400 pl-6 w-full"
              >
                <option value="">Select specialization</option>
                <option value="cardiologist">Cardiologist</option>
                <option value="dermatologist">Dermatologist</option>
                <option value="neurologist">Neurologist</option>
                <option value="pediatrician">Pediatrician</option>
                <option value="psychiatrist">Psychiatrist</option>
                <option value="orthopedic">Orthopedic</option>
                <option value="gynecologist">Gynecologist</option>
                <option value="dentist">Dentist</option>
                <option value="general-physician">General Physician</option>
                <option value="surgeon">Surgeon</option>
                <option value="ophthalmologist">Ophthalmologist</option>
                <option value="ent">ENT Specialist</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col items-center gap-8 mt-9">
            {filteredDoctors.map((doctor, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                key={index}
                className="hover:-translate-y-4 group relative bg-white shadow-md rounded-2xl p-5 md:w-1/2 w-full flex flex-col gap-3 hover:shadow-lg transition border-2 border-gray-400 hover:border-blue-600
  before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 
             before:h-[4px] before:bg-gradient-to-r before:from-blue-500 before:to-green-500
             before:origin-center before:scale-x-0 before:transition-transform before:duration-300 
             hover:before:scale-x-100 overflow-hidden"
                onClick={() => {
                  setIsTimeSelect(true);
                  setIsDoctorSelect(false);
                  setSelectedDoctor(doctor);
                }}
              >
                {/* Doctor Image */}
                <div className="flex justify-between">
                  <img
                    src={doctor.picture}
                    alt={doctor.username}
                    className="w-22 h-22 rounded-full object-cover border"
                  />
                  <div className="text-white px-2 py-0 bg-green-600  rounded-xl flex items-center gap-2 max-h-8">
                    <Star className="w-4 h-4 inline" />
                    <p className="inline">{doctor.averageRating}</p>
                  </div>
                </div>

                {/* Doctor Info */}
                <div className="">
                  <p className="text-lg font-semibold">{doctor.username}</p>
                  <p className="text-sm text-blue-500 font-semibold">
                    {doctor.specialization}
                  </p>
                </div>

                {/* Experience + Location */}
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center gap-3 mt-2">
                    <Award className="w-5 h-5 text-blue-500" />
                    <p>{doctor.experience} years experience</p>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <LocationEdit className="w-5 h-5 text-blue-500" />
                    <p>
                      {doctor?.location?.city}, {doctor?.location?.state}
                    </p>
                  </div>
                </div>

                {/* Consultation Fee */}
                <div className="mt-2 border-t border-gray-300 pt-2 flex justify-between items-center">
                  <div>
                    <p className="text-lg font-bold text-black">
                      ${doctor.consultationFees}
                    </p>
                    <p className="text-gray-500 text-sm">Consultation</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Next Date</p>
                    <p className="text-gray-400 text-sm">
                      {doctor.availableSlots[0].date.split("T")[0]}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        ""
      )}
      {isTimeSelect && !isConfirm && (
        <>
          <div className="bg-white border-1 border-gray-300 rounded-lg p-10 mt-10 w-full">
            <p
              className="text-blue-500 flex gap-2 text-sm font-semibold hover:text-blue-300 cursor-pointer"
              onClick={() => {
                setIsTimeSelect(false);
                setIsDoctorSelect(true);
                setSelectedDoctor(undefined);
              }}
            >
              <MoveLeft className="w-5 h-5" />
              Back to Doctor{" "}
            </p>
            <div className="flex gap-5 mt-5">
              <img
                src={selectedDoctor.picture}
                className="w-20 h-20 rounded-full"
              />
              <div className="flex flex-col gap-1">
                <h1 className="text-black font-semibold text-lg">
                  {selectedDoctor.username}
                </h1>
                <p className="text-blue-400">{selectedDoctor.specialization}</p>
                <p className="text-sm text-gray-500 m-auto  flex items-center gap-1">
                  <LocationEdit className="w-5 h-5" />{" "}
                  {selectedDoctor?.location?.city},{selectedDoctor?.location?.state}
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-2 md:flex-row flex-col">
            <div className="bg-white border-1 border-gray-300 rounded-lg pt-5 p-5 mt-10 md:w-1/3 w-full">
              <h1 className="inline font-semibold">Select Date</h1>
              <div className="bg-gray-100 flex justify-between p-5 mt-5 rounded-lg items-center">
                <button onClick={prevMonth}>
                  <MoveLeft className="w-5 h-5 text-blue-300" />
                </button>
                <p className="font-semibold text-center">
                  {selectedDate.toLocaleDateString("en-us", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <button onClick={afterMonth}>
                  <MoveRight className="w-5 h-5 text-blue-300" />
                </button>
              </div>
            </div>
            <div className="bg-white border-1 border-gray-300 rounded-lg pt-5 p-5 mt-10 w-full flex-1">
              <h1 className="font-semibold mb-5">Available times</h1>
              {slotsForDate.map((slot, index) => (
                <button
                  key={index}
                  disabled={slot.isBooked}
                  onClick={() => {
                    setSelectTime(slot.time);
                    setIsConfirm(true);
                  }}
                  className={`p-2 rounded-lg border text-sm font-medium transition m-2.5 
                ${
                  slot.isBooked
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : selectTime === slot.time
                    ? "bg-blue-500 text-white border-blue-600"
                    : "bg-white text-gray-700 hover:bg-blue-100 border-gray-300"
                }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
      {isConfirm && (
        <>
          <p
            className="text-blue-500 flex gap-2 text-sm font-semibold hover:text-blue-300 cursor-pointer"
            onClick={() => {
              setIsConfirm(false);
            }}
          >
            <MoveLeft className="w-5 h-5" />
            Back to availability
          </p>
          <h1 className="text-xl font-semibold py-6">Confirm Appointment</h1>
          <div className="flex gap-2 md:flex-row flex-col">
            <div className="bg-white border-1 border-gray-400 rounded-lg p-7 flex-1">
              <h1 className="font-semibold text-lg">Doctor Information</h1>
              <div className="w-full h-0.5 bg-gray-300 my-2"></div>
              <div className="flex gap-2">
                <img
                  src={selectedDoctor.picture}
                  className="w-22 h-22 rounded-full object-cover border"
                />
                <div>
                  <h1 className="text-black font-semibold text-lg">
                    {selectedDoctor.username}
                  </h1>
                  <p className="text-blue-400">
                    {selectedDoctor.specialization}
                  </p>
                  <div className="text-gray-400 py-0  rounded-xl flex items-center gap-2 max-h-8">
                    <Star className="w-4 h-4 inline text-green-500" />
                    <p className="inline">{selectedDoctor.averageRating}</p>.
                    <p>{selectedDoctor.experience} years experience</p>
                  </div>
                </div>
              </div>
              <h1 className="font-semibold text-lg">Appointment Details</h1>
              <div className="w-full h-0.5 bg-gray-300 my-2"></div>
              <p className="bg-gray-100 p-5 rounded-lg text-black flex gap-2">
                <Calendar className="text-blue-500" />
                {selectedDate.toLocaleDateString("en-us", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <p className="bg-gray-100 p-5 rounded-lg text-black flex gap-2 my-3">
                <Clock className="text-blue-500" />
                {selectTime}
              </p>
              <p className="bg-gray-100 p-5 rounded-lg text-black flex gap-2 my-3">
                <LocationEdit className="text-blue-500" />
                {selectedDoctor.location.city},{selectedDoctor.location.state}
              </p>
              <h1 className="font-semibold text-lg">Payment summary</h1>
              <div className="w-full h-0.5 bg-gray-300 my-2"></div>
              <p className="flex justify-between font-light py-2">
                Consultation Fees{" "}
                <span className="font-medium">
                  ${selectedDoctor.consultationFees}
                </span>
              </p>
              <p className="flex justify-between font-light py-2">
                Booking Fees <span className="font-medium">$5</span>
              </p>
              <div className="w-full h-0.5 bg-gray-300 my-2"></div>
              <p className="flex justify-between font-semibold py-2">
                Total Amount{" "}
                <span className="font-medium">
                  ${Number(selectedDoctor.consultationFees) + 5}
                </span>
              </p>
            </div>
            <div onClick={handleAppointDoctors} className="bg-white border-1 border-gray-400 rounded-lg p-7 text-center md:w-1/3 w-full h-1/2">
              <div className="bg-green-400 text-white p-6 rounded-lg">
                <p>Confirm Appointment</p>
                <p className="text-gray-200">
                  you will receive a confirmation email and SMS with appointment
                  details.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Appointments;
