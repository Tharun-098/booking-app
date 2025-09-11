import {motion} from 'framer-motion';
import React from 'react'
import { useContext } from 'react';
import { useEffect,useState} from 'react';
import {DataContext} from '../../context/DataContext';
import { Calendar, Clock, LocationEditIcon } from 'lucide-react';
const Records = () => {
  const {axios,accessToken}=useContext(DataContext)
  const [records,setRecords]=React.useState([]);
const [showAll, setShowAll] = useState(false);
  useEffect(()=>{
    const fetchRecords=async()=>{
      try {
        const {data}=await axios.get('/api/appointment/get-all-appointments',{
          headers:{Authorization:`Bearer ${accessToken}`}
        }
        )
        if(data.success){
          setRecords(data.appointments)
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchRecords();
  },[])
  console.log(records);
  const displayedRecords = showAll ? records : records.slice(0, 2);
  return (
    <div className='flex flex-col gap-10'>
      <h1 className='font-semibold text-xl'>Upcoming Appointments</h1>
      <div className=''>
        {displayedRecords.map((record,index)=>(
          <motion.div 
           initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
          key={index} className="hover:-translate-y-4 group relative bg-white shadow-md rounded-2xl p-5 w-full flex flex-col gap-1 hover:shadow-lg transition border-2 border-gray-400 
  before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 
             before:h-[4px] before:bg-gradient-to-r before:from-blue-500 before:to-green-500
             before:origin-center before:scale-x-100 before:transition-transform before:duration-300 
              overflow-hidden mt-8">
                <h1 className='font-semibold text-xl mb-0'>{record.doctor.username}</h1>
                <p className='text-blue-500 font-bold mt-0'>{record.doctor.specialization}</p>
                <div className='flex flex-col gap-1'>
                  <p className='flex gap-1 items-center mt-2'><Calendar className='w-5 h-5 text-blue-500'/> <span className='text-sm text-gray-600'>
                    {new Date(record.appointmentDates).toLocaleDateString('en-us',{
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}</span>
                    </p>
                  <p className='flex gap-1 items-center mt-2'><Clock className='w-5 h-5 text-blue-500'/> <span className='text-sm text-gray-600'>
                    {record.time}
                  </span>
                  </p>
                  <p className='flex gap-1 items-center mt-2'><LocationEditIcon className='w-5 h-5 text-blue-500'/> <span className='text-sm text-gray-600'>
                    {record.doctor.location.HospitalName},{record.doctor.location.roomNo}
                  </span>
                  </p>
                </div>
            </motion.div>
        ))}
        </div>
      {
        !showAll && 
      <button onClick={()=>setShowAll(true)} className='text-right font-semibold pr-4'>See all</button>
      }
      {
        showAll && 
      <button onClick={()=>setShowAll(false)} className='text-right font-semibold pr-4'>close all</button>
      }
      {records.filter(record=>record.status==='completed').map((record,index)=>(
        <div>

        <h1 className='font-semibold text-xl'>Completed Appointments</h1>
        <div key={index} className="hover:-translate-y-4 group relative bg-white shadow-md rounded-2xl p-5 w-full flex flex-col gap-1 hover:shadow-lg transition border-2 border-gray-400 
  before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 
  before:h-[4px] before:bg-gradient-to-r before:from-blue-500 before:to-green-500
  before:origin-center before:scale-x-100 before:transition-transform before:duration-300 
              overflow-hidden mt-8">
                <h1 className='font-semibold text-xl mb-0'>{record.doctor.username}</h1>
                <p className='text-blue-500 font-bold mt-0'>{record.doctor.specialization}</p>
                <div className='flex flex-col gap-1'>
                  <p className='flex gap-1 items-center mt-2'><Calendar className='w-5 h-5 text-blue-500'/> <span className='text-sm text-gray-600'>
                    {new Date(record.appointmentDates).toLocaleDateString('en-us',{
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}</span>
                    </p>
                  <p className='flex gap-1 items-center mt-2'><Clock className='w-5 h-5 text-blue-500'/> <span className='text-sm text-gray-600'>
                    {record.time}
                  </span>
                  </p>
                  <p className='flex gap-1 items-center mt-2'><LocationEditIcon className='w-5 h-5 text-blue-500'/> <span className='text-sm text-gray-600'>
                    {record.doctor.location.HospitalName},{record.doctor.location.roomNo}
                  </span>
                  </p>
                </div>
            </div>
                    </div>
      ))}
    </div>
  )
}
export default Records;
