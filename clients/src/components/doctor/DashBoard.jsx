import React, { useContext, useState } from "react";
import { DataContext } from "../../context/DataContext";
import { Calendar, Clock, DollarSign, Users } from "lucide-react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { useEffect } from "react";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend 
);
const DashBoard = () => {
  const { doctor, axios, accessToken } = useContext(DataContext);
  const [datas, setDatas] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get("/api/doctor/getData", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (data.success) {
        setDatas(data.information);
      } else {
        setDatas(data.message);
      }
    };
    fetchData();
  }, []);
  console.log(datas);
  console.log(datas?.chartData?.months);

  const today = new Date();
  const currentMonth = today.getMonth(); // 0-based
  const month = datas?.chartData?.months.slice(0, currentMonth + 1);
  const monthlyData = datas?.chartData?.monthlyData.slice(0, currentMonth + 1);
  const chartDatas = {
    labels: month,
    datasets: [
      {
        label: "Appointments",
        data: monthlyData,
        borderColor: "blue",
        backgroundColor: "rgba(0,0,255,0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };
  const lineChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Monthly Completed Appointments",
      },
      legend: { position: "top" },
    },
  };
  const todayAppointments = datas?.appointmentuserdetails?.filter((appt) => {
    const apptDate = new Date(appt.appointmentDates);
    return apptDate.toDateString() === today.toDateString();
  });

  console.log(todayAppointments);
  let revenue = datas?.totalappointment?.length * doctor.consultationFees;
  console.log(revenue);

  return (
    <div>
      <div className="rounded-lg bg-blue-700 text-white p-4">
        <h1 className="font-semibold text-lg">
          Welcome Back {doctor.username}
        </h1>
        <p className="text-sm">
          You have {datas?.appointmentToday?.length} appointments today and{" "}
          {datas?.pendingAppointment?.length} pending approval today
        </p>
      </div>
      <div className="mt-3 grid lg:grid-cols-2  gap-3">
        <div className="flex justify-between items-center mt-4 bg-white p-4 rounded-lg shadow-gray-500/50 shadow-sm">
          <div>
            <h1 className="font-bold text-gray-700 mt-2 text-lg">
              Today Appointments
            </h1>
            <h1 className="font-semibold mt-2 text-lg">
              {datas?.appointmentToday?.length}
            </h1>
          </div>
          <div className=" bg-blue-100 flex items-center justify-center rounded-lg p-2">
            <Calendar className="text-blue-500 w-5 h-5" />
          </div>
        </div>
        <div className="flex justify-between items-center mt-4 bg-white p-4 rounded-lg shadow-gray-500/50 shadow-sm">
          <div>
            <h1 className="font-bold text-gray-700 mt-2 text-lg">
              Total Patients
            </h1>
            <h1 className="font-semibold mt-2 text-lg">
              {datas?.totalappointment?.length}
            </h1>
          </div>
          <div className=" bg-green-100 flex items-center justify-center rounded-lg p-2">
            <Users className="text-green-500 w-5 h-5" />
          </div>
        </div>
        <div className="flex justify-between items-center mt-4 bg-white p-4 rounded-lg shadow-gray-500/50 shadow-sm">
          <div>
            <h1 className="font-bold text-gray-700 mt-2 text-lg">
              Pending Approval
            </h1>
            <h1 className="font-semibold mt-2 text-lg">
              {datas?.pendingAppointment?.length}
            </h1>
          </div>
          <div className=" bg-orange-100 flex items-center justify-center rounded-lg p-2">
            <Clock className="text-orange-500 w-5 h-5" />
          </div>
        </div>
        <div className="flex justify-between items-center mt-4 bg-white p-4 rounded-lg shadow-gray-500/50 shadow-sm">
          <div>
            <h1 className="font-bold text-gray-700 mt-2 text-lg">
              Monthly Revenue
            </h1>
            <h1 className="font-semibold mt-2 text-lg">${revenue}</h1>
          </div>
          <div className=" bg-purple-100 flex items-center justify-center rounded-lg p-2">
            <DollarSign className="text-purple-500 w-5 h-5" />
          </div>
        </div>
      </div>
      {datas?.chartData && (
        <div className="bg-white p-4 rounded-lg mt-4">
          <Line
            data={chartDatas}
            options={lineChartOptions}
            style={{ maxWidth: "100%" }}
          />
        </div>
      )}
      <div className="bg-white p-4 rounded-lg mt-4">
        <h1 className="font-semibold text-lg">Todays Schedule</h1>
        {todayAppointments?.map((data) => (
          <div className="bg-gray-100 p-4 rounded-lg my-4 flex justify-between">
            <div>
              <h1 className="font-semibold">{data.patient.username}</h1>
              <h1 className="font-semibold">{data.typeOfAppointment}</h1>
            </div>
            <div>
              <h2 className="font-medium text-sm">{data.time}</h2>
              <p className="text-sm">{data.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashBoard;
