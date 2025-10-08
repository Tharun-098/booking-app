import React from 'react'
import { NavLink } from 'react-router-dom';
import { Calendar, Clock, LayoutDashboard, Settings, User, Users } from 'lucide-react';
const SideBar = () => {
    const linkClasses = ({ isActive }) =>
    `flex items-center gap-2 md:px-4 md:py-3 py-2 rounded-r-lg font-medium transition-colors 
     ${isActive 
        ? "bg-white text-blue-700 shadow-sm border-2 border-l-green-600" 
        : "text-white hover:bg-blue-500/40"}`;
    return (
    <>
      <div className="hidden sm:flex sm:flex-col h-screen fixed bg-blue-700 sm:w-1/4 py-2.5 pt-8 pr-1 ">
        <NavLink to="/doctor" className={linkClasses}>
          <LayoutDashboard/>
          <p>DashBoard</p>
        </NavLink>

        <NavLink to="/user/dashboard/records" className={linkClasses}>
          <User/>
          <p>Profile</p>
        </NavLink>

        <NavLink to="/user/dashboard/appointments" className={linkClasses}>
          <Calendar/>
          <p>Appointments</p>
        </NavLink>

        <NavLink to="/user/dashboard/notifications" className={linkClasses}>
          <Users/>
          <p>Patients</p>
        </NavLink>
        <NavLink to="/user/dashboard/notifications" className={linkClasses}>
          <Clock/>
          <p>Schedule</p>
        </NavLink>
        <NavLink to="/user/dashboard/notifications" className={linkClasses}>
          <Settings/>
          <p>Settings</p>
        </NavLink>
      </div>

      {/* Bottom Navbar (visible on small screens only) */}
      <div className="sm:hidden relative bg-blue-700 flex justify-around w-full">
        <NavLink to="/user/dashboard/dashboard" className={linkClasses}>
          <LayoutDashboard/>
        </NavLink>
        <NavLink to="/user/dashboard/records" className={linkClasses}>
          <User/>
        </NavLink>
        <NavLink to="/user/dashboard/appointments" className={linkClasses}>
          <Calendar/>
        </NavLink>
        <NavLink to="/user/dashboard/notifications" className={linkClasses}>
          <Users/>
        </NavLink>
        <NavLink to="/user/dashboard/notifications" className={linkClasses}>
          <Clock/>
        </NavLink>
        <NavLink to="/user/dashboard/notifications" className={linkClasses}>
          <Settings/>
        </NavLink>
      </div>
    </>
  )
}

export default SideBar
