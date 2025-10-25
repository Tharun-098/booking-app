import { Clock, Plus, PlusIcon, Save } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import Calendar from "react-calendar";
import { DataContext } from "../../context/DataContext";
import "react-calendar/dist/Calendar.css";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
const Schedule = () => {
  const { axios, accessToken } = useContext(DataContext);
  const [date, setDate] = useState(new Date());
  const [appointment, setAppointment] = useState([]);
  const [slots, setSlots] = useState([]);
  const [patients, setPatients] = useState([]);
  const [times, setTimes] = useState(null);
  const [load, setLoad] = useState(false);
  const [edit, setEdit] = useState(false);
  const [formData, setFormData] = useState({
    patient: "",
    reason: "",
    typeOfAppointment: "Consultation",
  });
  const handleDate = (date) => {
    setDate(date);
  };
  const backendDate = date.toLocaleDateString("en-CA"); // gives "2025-10-15"
  useEffect(() => {
    const timeArray = (startHour, endHour) => {
      const timeSlots = [];
      for (let hour = startHour; hour < endHour; hour++) {
        const displayHour = hour > 12 ? hour - 12 : hour;
        const suffix = hour >= 12 ? "PM" : "AM";
        timeSlots.push({
          time: `${displayHour}:00 ${suffix}`,
          isBooked: false,
        });
        timeSlots.push({
          time: `${displayHour}:30 ${suffix}`,
          isBooked: false,
        });
      }
      setSlots(timeSlots);
    };
    timeArray(9, 18);
  }, []);
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          `/api/appointment/getAppointmentsByDate/${backendDate}`,
          {
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (data.success) {
          setAppointment(data.appointments);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchPatients = async () => {
      try {
        const { data } = await axios.get(`/api/user/getAllUsers`, {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        });
        if (data.success) {
          setPatients(data.uniquePatients);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchAppointments();
    fetchPatients();
  }, [date]);
  useEffect(() => {
    if (slots.length === 0) return;
    const updatedSlots = slots.map((slot) => {
      const isBooked = appointment.some(
        (appoint) => appoint.time === slot.time
      );
      return { ...slot, isBooked };
    });
    setSlots(updatedSlots);
  }, [appointment]);
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoad(true);
    try {
      const newAppointment = {
        ...formData,
        date: backendDate, // "YYYY-MM-DD"
        times, // selected from slots
      };

      const { data } = await axios.post(
        "/api/appointment/create",
        newAppointment,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setFormData({
          patient: "",
          reason: "",
          typeOfAppointment: "Consultation",
        });
        setTimes("");
        setAppointment((prev) => [...prev, data.appointment]);
      } else {
        toast.error(data.message || "Failed to create appointment.");
      }
    } catch (error) {
      toast.error(error);
      //alert("Error creating appointment");
    } finally {
      setLoad(false);
    }
  };

  console.log(slots);
  console.log(times);
  console.log(appointment);
  console.log(date.toISOString());
  console.log(backendDate);
  console.log(patients);
  console.log(date);
  return (
    <div className="p-3">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold md:text-2xl ">Schedule Mangement</h1>
          {!edit ?(<button
          onClick={()=>{setEdit(true)}}
            className="bg-blue-500 p-1 md:p-2 text-sm  text-white rounded-lg flex  items-center font-semibold"
          >
            <Plus className="" />
            Add Appointment
          </button>
        ) : (
          <button
            onClick={() =>{setTimes("");setEdit(false);toast.info("Appointment creation successful")}}
            className="bg-blue-500 p-1 md:p-2 text-sm  text-white rounded-lg flex  items-center font-semibold"
          >
            <Save className="" />
            save
          </button>
        )}
      </div>
      <div className="flex justify-between gap-3 mt-2 flex-col md:flex-row">
        <div className="flex-1">
          <Calendar
            className="bg-white text-center rounded-lg border-1 border-white outline-0"
            onClickDay={handleDate}
            value={date}
          />
        </div>
        <div className="bg-white p-2 rounded-lg flex flex-col shadow-gray-600 shadow-lg max-h-[500px]">
          <h1 className="text-md font-semibold">
            Scheduled for{" "}
            {date.toLocaleDateString("en-us", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h1>
          <div
            className={
              appointment.length == 0
                ? "flex items-center justify-center flex-1"
                : "flex-1"
            }
          >
            {appointment.length == 0 ? (
              <div className="grid justify-items-center">
                <Clock className="text-black bg-gray-200 w-16 h-16 p-5 rounded-full" />
                <h2>No appointments scheduled</h2>
              </div>
            ) : (
              appointment.map((appoint, index) => (
                <div key={index} className="border-3 border-gray-500 rounded-lg decoration-1 border-dashed p-1 mt-1 text-sm">
                  <div
                    className="flex justify-between text-gray-500 items-center "
                  >
                    <h1 className="text-black font-semibold">{appoint.time}</h1>
                    <p>{appoint.typeOfAppointment}</p>
                  </div>
                  <p className="text-gray-500">{appoint.status}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {!times && (
        <div className="bg-white p-4 rounded-lg mt-5 grid md:grid-cols-3 gap-4 ">
          {slots?.map((times, index) => (
            <div
              className="border-3 border-gray-500 rounded-lg decoration-1 border-dashed p-3"
              key={index}
            >
              <div className="flex justify-between text-gray-500 items-center ">
                <h1 className="text-black font-semibold">{times.time}</h1>
                <PlusIcon
                  onClick={() => {
                    if (!times.isBooked) {
                      setTimes(times.time);
                    }
                  }}
                  className={
                    times.isBooked
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }
                />
              </div>
              <p className="text-gray-500">
                {times.isBooked ? "Not Available" : "Available"}
              </p>
            </div>
          ))}
        </div>
      )}
      {times && edit && (
        <motion.div className="bg-white p-4 rounded-lg mt-5" initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut"} }>
          <h2 className="font-semibold mb-2">
            Add Appointment for{" "}
            {date?.toLocaleString("en-us", {
              weekday: "short",
              year: "numeric",
              month: "short",
            })}{" "}
            {times}
          </h2>
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-3">
            <div>
              <label>Patient</label>
              <select
                required
                value={formData.patient}
                onChange={(e) =>
                  setFormData({ ...formData, patient: e.target.value })
                }
                className="border p-1 rounded w-full"
              >
                <option value="">Select Patient</option>
                {patients.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.username}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Type of Appointment</label>
              <select
                value={formData.typeOfAppointment}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    typeOfAppointment: e.target.value,
                  })
                }
                className="border p-1 rounded w-full"
              >
                <option value="Consultation">Consultation</option>
                <option value="Check up">Check up</option>
                <option value="Follow up">Follow up</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>

            <div>
              <label>Reason</label>
              <input
                type="text"
                placeholder="Enter reason"
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                className="border p-1 rounded w-full"
              />
            </div>

            <button
              type="submit"
              disabled={load}
              className={`w-full py-2 px-4 rounded-md text-white font-semibold 
    ${
      load ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
    }`}
            >
              {load ? "Saving..." : "Save Appointment"}
            </button>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default Schedule;
