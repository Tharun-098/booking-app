import React from 'react'
import { Calendar} from "lucide-react";
import {useNavigate } from 'react-router-dom';
const Navbar = () => {
  const navigate=useNavigate()
  return (
      <div className="flex items-center gap-2 p-4 md:pl-7 pl-4 bg-white shadow-md sticky top-0 z-999">
        <div className='flex gap-2 items-center' onClick={()=>navigate('/')}>
        <Calendar className="text-blue-700 font-bold md:w-10 md:h-10 w-7 h-7" />
        <h1 className="font-bold md:text-2xl text-xl cursor-pointer" onClick={()=>navigate("/")}>BookEasy</h1>
        </div>
      </div>
  )
}

export default Navbar
