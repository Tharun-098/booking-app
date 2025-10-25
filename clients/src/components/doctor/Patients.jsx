import { Filter } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../../context/DataContext";
import {User} from 'lucide-react';
import { motion } from "framer-motion";
const Patients = () => {
    const {axios,accessToken}=useContext(DataContext)
    const [search,setSearch]=useState(null);
    const [status,setStatus]=useState(null);
    const [appointments,SetAppointments]=useState([]);
    const [patientCount,SetPatientCount]=useState(undefined);
    useEffect(()=>{
        const fetchAppointment=async()=>{
            try {
                const {data}=await axios.get('/api/doctor/getPatientData',{
                    headers:{
                        Authorization:`Bearer ${accessToken}`
                    }
                })
                if(data.success){
                    SetAppointments(data.patientData);
                    SetPatientCount(data.completedCount)
                }
                else{
                    console.log(data.message);
                }
            } catch (error) {
                console.log(error.message)
            }
        }
        fetchAppointment();
    },[])
    console.log(patientCount)
    const filteredAppointments = appointments.filter((appoint) => {
  const matchesName = search
    ? appoint.patient.username.toLowerCase().includes(search.toLowerCase().trim())
    : true;

  const matchesStatus = status
    ? appoint.status.toLowerCase() === status.toLowerCase()
    : true;

  return matchesName && matchesStatus;
});

    return (
    <div className="p-3">
      <h1 className="font-semibold md:text-2xl ">Patient Mangement</h1>
      <motion.div className="bg-white p-3 rounded-lg mt-2" initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut"} }>
        <h1 className="font-semibold text-gray-700 mt-2 text-lg">
          Total Patients
        </h1>
        <h1 className="font-semibold mt-2 text-lg">{patientCount}</h1>
      </motion.div>
      <div className="my-2 flex justify-between md:flex-row flex-col gap-2">
        <input type="text" value={search} onChange={(e)=>setSearch(e.target.value)} className="rounded-xl md:w-[75%] w-full p-2 bg-gray-900 text-white" placeholder="enter the name"/>
        <div className="flex-1">
            <div className="relative">
            <Filter className="w-8 h-8 p-1 absolute left-0 bottom-1"/>
            <select
                value={status}
                onChange={(e) =>
                    setStatus(e.target.value)
                }
                className="border p-2 rounded px-6 text-sm outline-0  border-gray-400 max-w-full w-full"
              >
                <option value="">Select Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="rejected">rejected</option>
                <option value="completed">completed</option>
              </select>
        </div>
                </div>
      </div>
      <div>
        {filteredAppointments.map((appoint,index)=>(
          <motion.div key={index} className="flex py-3 md:px-4 px-1 bg-white rounded-lg border-1 border-gray-200 my-2 justify-between" 
          initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut"} }>
            <div className="flex gap-2 items-center justify-center">
            <User className="w-10 h-10 bg-blue-200 text-blue-600 rounded-full p-2"/>
            <div>
                <h1 className="font-semibold  md:text-md text-sm mb-2">{appoint.patient.username}</h1>
                <p className="md:text-sm text-[10px]">{appoint.reason?appoint.reason:'Not mentioned'}</p>
            </div>
            </div>
            <div>
                <p className="mb-2 text-sm flex items-center gap-1">{appoint.typeOfAppointment} <span className={appoint.status=="completed"?'bg-green-500 px-2 py-1 md:text-sm text-[10px] rounded-xl':'bg-red-500 px-2 py-1 md:text-sm text-[10px] rounded-xl'}>{appoint.status}</span></p>
                <p className="font-semibold text-[12px] text-right">Last Visit : <span className="font-light text-[12px]">{new Date(appoint.appointmentDates).toLocaleDateString('en-CA')}</span></p>
            </div>
          </motion.div>          
        ))}
      </div>
    </div>
  );
};

export default Patients;
