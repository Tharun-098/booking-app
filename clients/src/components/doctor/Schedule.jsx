import { Clock, Plus, PlusIcon, Save } from "lucide-react";
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
const Schedule = () => {
  const [date, setDate] = useState(new Date());
  const [appointment, setAppointment] = useState([]);
  const [slots, setSlots] = useState([]);
  const [save, setSave] = useState(false);
  const handleDate = (date) => {
    setDate(date);
  };
  const backendDate = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  ).toISOString();
  useEffect(() => {
    const timeArray = (startHour, endHour) => {
      const timeSlots = [];
      for (let hour = startHour; hour < endHour; hour++) {
        const displayHour = hour > 12 ? hour - 12 : hour;
        const suffix = hour >= 12 ? "PM" : "AM";
        timeSlots.push({ time: `${displayHour}:00 ${suffix}`, isBooked: false });
        timeSlots.push({ time: `${displayHour}:30 ${suffix}`, isBooked: false });
      }
      setSlots(timeSlots);
    };
    timeArray(9, 18);
  }, []);
  console.log(slots);
  console.log(date.toISOString());
  console.log(backendDate);
  return (
    <div className="p-3">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold md:text-2xl ">Schedule Mangement</h1>
        {!save? <button onClick={()=>setSave(true)} className="bg-blue-500 p-1 md:p-2 text-sm  text-white rounded-lg flex  items-center font-semibold">
          <Plus className="" />
          Add Appointment
        </button>:
        <button onClick={()=>setSave(false)} className="bg-blue-500 p-1 md:p-2 text-sm  text-white rounded-lg flex  items-center font-semibold">
          <Save className=""/>
          save
        </button>}
      </div>
      <div className="flex justify-between gap-3 mt-2 flex-col md:flex-row">
        <div className="flex-1">
          <Calendar
            className="bg-white text-center rounded-lg border-1 border-white outline-0"
            onClickDay={handleDate}
            value={date}
          />
        </div>
        <div className="bg-white p-2 rounded-lg flex flex-col shadow-gray-600 shadow-lg">
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
              appointment ? "flex items-center justify-center flex-1" : "flex-1"
            }
          >
            {appointment.length==0 ? (
              <div className="grid justify-items-center">
                <Clock className="text-black bg-gray-200 w-16 h-16 p-5 rounded-full" />
                <h2>No appointments scheduled</h2>
              </div>
            ):null}
          </div>
        </div>
        
      </div>
      <div className="bg-white p-4 rounded-lg mt-5 grid md:grid-cols-3 gap-4 ">
          {slots?.map((times) => (
            <div className="border-3 border-gray-500 rounded-lg decoration-1 border-dashed p-3">
              <div className="flex justify-between text-gray-500 items-center ">
                <h1 className="text-black font-semibold">{times.time}</h1>
                <PlusIcon />
              </div>
              <p className="text-gray-500">{times.isBooked ? "Not Available" : "Available"}</p>
            </div>
          ))}
        </div>
    </div>
  );
};

export default Schedule;
