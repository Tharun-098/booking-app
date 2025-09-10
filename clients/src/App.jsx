import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { DataContext } from './context/DataContext'

import HomePage from './pages/HomePage'
import LoginPage from './pages/user/LoginPage'
import DoctorLoginPage from './pages/doctor/DoctorLoginPage'
import UserDashboard from './pages/user/Dashboard'
import DoctorDashboard from './pages/doctor/DashBoard'

function App() {
  const { isLogged, doctorIsLogged, doctor, user, loading } = useContext(DataContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          <span className="text-blue-500 font-semibold text-lg">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
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
        <Route
          path="/user/login"
          element={!user ? <LoginPage /> : <Navigate to="/user/dashboard" replace />}
        />
        <Route
          path="/user/dashboard"
          element={isLogged && user ? <UserDashboard /> : <Navigate to="/user/login" replace />}
        />

        {/* Doctor Routes */}
        <Route
          path="/doctor/login"
          element={!doctor ? <DoctorLoginPage /> : <Navigate to="/doctor/dashboard" replace />}
        />
        <Route
          path="/doctor/dashboard"
          element={doctorIsLogged && doctor ? <DoctorDashboard /> : <Navigate to="/doctor/login" replace />}
        />

      </Routes>
    </div>
  );
}

export default App;
