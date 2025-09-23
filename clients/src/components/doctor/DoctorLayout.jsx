import React from 'react';
import SideBar from './SideBar';
import { Outlet } from 'react-router-dom';
import Footer from '../Footer';
const DoctorLayout = () => {
  return (
          <div className="flex flex-col sm:flex-row h-screen">
  <SideBar />

  <div className="flex flex-col flex-1 bg-gray-100 sm:ml-[25%] sm:mt-0">
    <main className="flex-1 sm:p-6 p-2 overflow-y-scroll scrollbar-hide">
      <Outlet />
    </main>
    <Footer className="mt-auto fixed bottom-0" />
  </div>
</div>
  )
}

export default DoctorLayout;