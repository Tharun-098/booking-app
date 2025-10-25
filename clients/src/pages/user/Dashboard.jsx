import React from 'react'
import Navbar from '../../components/Navbar'

import UserLayout from '../../components/user/UserLayout'
import ChatBotWidget from '../../components/ChatBotWidget'

const Dashboard = () => {
  return (
    <div>
      <Navbar/>
      <UserLayout/>
      <ChatBotWidget/>
    </div>
  )
}

export default Dashboard