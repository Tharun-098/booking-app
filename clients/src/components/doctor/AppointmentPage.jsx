import React, { useContext, useEffect, useState } from "react";
import { Filter, User, Calendar,Check,X, CheckCheck } from "lucide-react";
import { DataContext } from "../../context/DataContext";
import { toast } from "react-toastify";
import {motion} from "framer-motion";
const AppointmentPage = () => {
  const { axios, accessToken } = useContext(DataContext);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [appointments, setAppointments] = useState([]);
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          "/api/appointment/getAllAppointments",
          {
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (data.success) {
          setAppointments(data.appointments);
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchAppointments();
  }, []);
  const handleUpdate = async (id, status) => {
  try {
    const { data } = await axios.put(
      `/api/appointment/update-status/${id}`,
      { status },
      {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (data.success) {
      setAppointments((prev) =>
        prev.map((app) =>
          app._id === id ? { ...app, status: status } : app
        )
      );
      toast.success(data.message);
    } else {
      toast.warning(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
};
  const filteredAppointments = appointments.filter((appoint) => {
  const matchesName = search
    ? appoint.patient.username.toLowerCase().includes(search.toLowerCase().trim())
    : true;

  const matchesStatus = status
    ? appoint.status.toLowerCase() === status.toLowerCase()
    : true;

  return matchesName && matchesStatus;
});
  const totalAppointment = appointments.filter(
    (appoint) => appoint.status != "completed"
  ).length;
  const pendingAppointment = appointments.filter(
    (appoint) => appoint.status === "pending"
  ).length;
  const rejectedAppointment = appointments.filter(
    (appoint) => appoint.status === "cancelled"
  ).length;
  const confirmedAppointment = appointments.filter(
    (appoint) => appoint.status === "confirmed"
  ).length;
  return (
    <div className="p-3">
      <h1 className="font-semibold md:text-2xl ">Appointment Mangement</h1>
      <div className="grid md:grid-cols-2 gap-2">
        <motion.div className="flex items-center justify-between bg-white p-3 rounded-lg mt-2" 
        initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut"} }>
          <div>
            <h1 className="font-semibold text-gray-700 mt-2 text-lg">
              Total Appointments
            </h1>
            <h1 className="font-semibold mt-1 text-lg">{totalAppointment}</h1>
          </div>
          <div className="w-3 h-3 rounded-full bg-blue-500" />
        </motion.div>
        <motion.div className="flex items-center justify-between bg-white p-3 rounded-lg mt-2"
          initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut"} }>
          <div>
            <h1 className="font-semibold text-gray-700 mt-2 text-lg">
              Pending Appointments
            </h1>
            <h1 className="font-semibold mt-2 text-lg">{pendingAppointment}</h1>
          </div>
          <div className="w-3 h-3 rounded-full bg-orange-500" />
        </motion.div>
        <motion.div className="bg-white flex items-center justify-between p-3 rounded-lg mt-1" initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut"} }>
          <div>
            <h1 className="font-semibold text-gray-700 mt-2 text-lg">
              Confirmed Appointments
            </h1>
            <h1 className="font-semibold mt-2 text-lg">
              {confirmedAppointment}
            </h1>
          </div>
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </motion.div>
        <motion.div className="bg-white p-3 rounded-lg mt-2 flex items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut"} }>
          <div>
            <h1 className="font-semibold text-gray-700  mt-2 text-lg">
              Rejected Appointments
            </h1>
            <h1 className="font-semibold mt-2 text-lg">
              {rejectedAppointment}
            </h1>
          </div>
          <div className="w-3 h-3 rounded-full bg-red-500" />
        </motion.div>
      </div>
      <div className="my-3 flex justify-between md:flex-row flex-col gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-xl md:w-[75%] w-full p-2 bg-gray-900 text-white"
          placeholder="enter the name"
        />
        <div className="flex-1">
          <div className="relative">
            <Filter className="w-8 h-8 p-1 absolute left-0 bottom-1" />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border p-2 rounded px-6 text-sm outline-0  border-gray-400 max-w-full w-full"
            >
              <option value="">Select Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">rejected</option>
              <option value="completed">completed</option>
            </select>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {filteredAppointments?.map((appoint, index) => (
          <div className="bg-white rounded-xl p-4 shadow-md my-2 flex justify-between items-center" key={index}>
            <div>

            <div className="flex items-center gap-2 mb-2">
              <User className="w-5 h-5 text-gray-600" />
              <div>
                <h4 className="font-semibold text-gray-800">
                  {appoint.patient.username}
                </h4>
                <p className="text-gray-500 text-xs">{appoint.patient.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-700 text-sm mb-1">
              <Calendar className="w-4 h-4" />
              {new Date(appoint.appointmentDates).toLocaleDateString(
                  "en-CA"
                )}{" "}
              {appoint.time}
            </div>
            <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 mb-2">
              {appoint.typeOfAppointment}
            </span>
            <p className="text-gray-800 text-sm mb-1">
              {appoint.reason ? appoint.reason : "Not Mentioned"}
            </p>
            <p className="text-green-600 font-medium text-sm">
              {appoint.status}
            </p>
            </div>
            <div>
                {appoint.status==="pending" && (
                    <div className="flex gap-3">
                        <Check className="bg-green-500 text-white rounded-full p-1 w-6 h-6 md:w-8 md:h-8" onClick={()=>handleUpdate(appoint._id,"confirmed")}/>
                        <X className="bg-red-500 text-black rounded-full p-1 w-6 h-6 md:w-8 md:h-8" onClick={()=>handleUpdate(appoint._id,"cancelled")}/>
                    </div>
                )}
                {appoint.status==="confirmed" && (
                  <CheckCheck className="bg-blue-500 text-black rounded-full p-1 w-6 h-6 md:w-8 md:h-8" onClick={()=>handleUpdate(appoint._id,"completed")}/>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentPage;
