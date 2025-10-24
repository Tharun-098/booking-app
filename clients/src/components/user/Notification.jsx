import React from 'react'
import { useContext } from 'react'
import { DataContext } from '../../context/DataContext'

const Notification = () => {
    const {notification}=useContext(DataContext);
    console.log(notification);
    return (
    <div className='p-4'>
      <h1 className='text-xl font-semibold'>Notifications</h1>
      {notification?.map((notify,index)=>(
        <div key={index} className='bg-white p-4 my-2 rounded-b-lg'>
            <p className='font-sans'>{notify.message}</p>
        </div>
      ))}
    </div>
  )
}

export default Notification
