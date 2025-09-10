// import { Calendar, User,Bell, Plus } from "lucide-react";
// import React, { useContext } from "react";
// import { DataContext } from "../../context/DataContext";

// const SideBar = () => {
//     const {navigate}=useContext(DataContext);
//     return (
//   <div className="h-screen fixed  bg-blue-700 sm:w-1/4 max-w-1/2 py-2.5  pt-8 sm:pl-4 pl-1 pr-1">
//     <div onClick={()=>navigate('/user/dashboard/profile')} className="cursor-pointer flex items-center sm:gap-2 gap-1 mb-8 text-white sm:text-xl text-sm">
//         <User/>
//         <p>Profile</p>
//     </div>
//     <div onClick={()=>navigate('/user/dashboard/records')} className="cursor-pointer flex items-center  sm:gap-2 gap-1 mb-8 text-white sm:text-xl text-sm">
//         <Calendar/>
//         <p>Records</p>
//     </div>
//     <div onClick={()=>navigate('/user/dashboard/appointments')} className="cursor-pointer flex items-center sm:gap-2 gap-1 mb-8 text-white sm:text-xl text-sm">
//         <Plus/>
//         <p>Appiontments</p>
//     </div>
//     <div onClick={()=>navigate('/user/dashboard/notifications')} className="cursor-pointer flex items-center  sm:gap-2 gap-1 mb-8 text-white sm:text-xl text-sm">
//         <Bell/>
//         <p>Notifications</p>
//     </div>
//   </div>
//   );
// };

// export default SideBar;
import { Calendar, User, Bell, Plus } from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";

const SideBar = () => {
  const linkClasses = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-3 rounded-r-lg font-medium transition-colors 
     ${isActive 
        ? "bg-white text-blue-700 shadow-sm border-2 border-l-green-600" 
        : "text-white hover:bg-blue-500/40"}`;

  return (
    <>
      {/* Vertical Sidebar (visible on sm+ screens) */}
      <div className="hidden sm:flex sm:flex-col h-screen fixed bg-blue-700 sm:w-1/4 py-2.5 pt-8 pr-1 ">
        <NavLink to="/user/dashboard/profile" className={linkClasses}>
          <User />
          <p>Profile</p>
        </NavLink>

        <NavLink to="/user/dashboard/records" className={linkClasses}>
          <Calendar />
          <p>Records</p>
        </NavLink>

        <NavLink to="/user/dashboard/appointments" className={linkClasses}>
          <Plus />
          <p>Appointments</p>
        </NavLink>

        <NavLink to="/user/dashboard/notifications" className={linkClasses}>
          <Bell />
          <p>Notifications</p>
        </NavLink>
      </div>

      {/* Bottom Navbar (visible on small screens only) */}
      <div className="sm:hidden relative bg-blue-700 flex justify-around py-2">
        <NavLink to="/user/dashboard/profile" className={linkClasses}>
          <User />
        </NavLink>

        <NavLink to="/user/dashboard/records" className={linkClasses}>
          <Calendar />
        </NavLink>

        <NavLink to="/user/dashboard/appointments" className={linkClasses}>
          <Plus />
        </NavLink>

        <NavLink to="/user/dashboard/notifications" className={linkClasses}>
          <Bell />
        </NavLink>
      </div>
    </>
  );
};

export default SideBar;
