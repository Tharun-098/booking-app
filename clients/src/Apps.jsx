import './App.css'
import { Routes, Route } from 'react-router-dom'
import { useContext } from 'react'
import { DataContext } from './context/DataContext'
import { Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/user/LoginPage'
import DoctorLoginPage from './pages/doctor/DoctorLoginPage'
import UserDashboard from './pages/user/Dashboard'
import DoctorDashboard from './pages/doctor/DashBoard'
import ProtectedRoute from './components/ProtectedRoute'
import Profile from './components/user/Profile'
import Notifications from './components/user/Notifications'
import Records from './components/user/Records'
import Appointments from './components/user/Appointments'
import Profiles from './components/doctor/Profile'
import DashBoard from './components/doctor/DashBoard'
function Apps() {
  const { isLogged, doctor,doctorIsLogged, user, loading } = useContext(DataContext);
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-b-blue-500 rounded-full animate-spin"></div>
          <span className="text-blue-500 font-semibold text-lg">Checking session...</span>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Homepage */}
      <Route
        path="/"
        element={
          user ? <Navigate to="/user/dashboard" replace /> :
          doctor ? <Navigate to="/doctor/dashboard" replace /> :
          <HomePage />
        }
      />

      {/* User Routes */}
      <Route path="/user/login" element={<ProtectedRoute isAllowed={!user} redirectTo="/user/dashboard"><LoginPage /></ProtectedRoute>} />
      <Route path="/user/dashboard" element={<ProtectedRoute isAllowed={isLogged && user} redirectTo="/user/login"><UserDashboard /></ProtectedRoute>} />
       
      <Route
        path="/user/dashboard"
        element={
          <ProtectedRoute isAllowed={isLogged && user} redirectTo="/">
            <UserDashboard />
          </ProtectedRoute>
       }
      >
        <Route index element={<Profile />} /> {/* default inside dashboard */}
        <Route path="profile" element={<Profile />} />
        <Route path="records" element={<Records />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>


      {/* Doctor Routes */}
      <Route path="/doctor/login" element={<ProtectedRoute isAllowed={!doctor} redirectTo="/doctor/dashboard"><DoctorLoginPage /></ProtectedRoute>} />
      {/* <Route path="/doctor/dashboard" element={<ProtectedRoute isAllowed={doctorIsLogged && doctor} redirectTo="/doctor/login"><DoctorDashboard /></ProtectedRoute>} /> */}
      <Route path="/doctor/dashboard"  element={<ProtectedRoute isAllowed={doctorIsLogged && doctor} redirectTo="/doctor/login"><DoctorDashboard /></ProtectedRoute>} >
        <Route index element={<DashBoard/>}/>
        <Route path='profile' element={<Profiles/>}/>  
      </Route>
    </Routes>
  );
}

export default Apps;
