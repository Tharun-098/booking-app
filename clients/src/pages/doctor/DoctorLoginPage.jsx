import React, { useState, useContext } from "react";
import { Users, CheckCircle, Star } from "lucide-react";
import patientimage from "../../assets/pexels-edward-jenner-4031816 (1).jpg";
import { GoogleLogin } from "@react-oauth/google";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { DataContext } from "../../context/DataContext";

const DoctorLoginPage = () => {
  const { navigate, setDoctorIsLogged, setDoctor, setAccessToken, axios} =
    useContext(DataContext);

  const [tab, setTab] = useState("login");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Google Login
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const { data } = await axios.post('/api/doctor/google',
        // "https://booking-app-livid-two.vercel.app/api/doctor/google",
        { token: credentialResponse.credential },
        { headers: { "Content-Type": "application/json" } }
      );

      if (data.success) {
        setAccessToken(data.accessToken);
        setDoctorIsLogged(true);
        setDoctor(data.user);
        navigate("/doctor/dashboard");
      }
    } catch (err) {
      console.error("Google login error:", err);
    }
  };
  
  const handleGoogleError = () => {
    console.log("Google login failed");
  };
  
  // Normal login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:4000/api/doctor/login", {
        email,
        password,
      });
      
      if (data.success) {
        setAccessToken(data.accessToken);
        setDoctorIsLogged(true);
        setDoctor(data.user);
        setEmail("");
        setPassword("");
        navigate("/doctor/dashboard");
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  
  // Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/doctor/register",
        { username, email, password }
      );
      
      if (data.success) {
        // 1️⃣ Update context first
        setAccessToken(data.accessToken);
        setDoctorIsLogged(true);
        setDoctor(data.newUser)
        
        // 3️⃣ Clear input fields
        setUserName("");
        setEmail("");
        setPassword("");
        setTimeout(() => {
          navigate("/doctor/dashboard");
      }, 50);
    } else {
      console.log(data.message);
    }
  } catch (error) {
    console.log(error.message);
  }
};


  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex justify-center items-center min-h-screen flex-wrap">
        <div className="max-w-4xl flex flex-col md:flex-row gap-6 md:gap-10 items-center px-3">
          {/* Left Image */}
          <div className="py-10 md:w-1/2 w-full relative">
            <img src={patientimage} className="h-auto w-full rounded-2xl" />
            <div className="absolute bottom-10 top-10 bg-black/40 flex flex-col justify-end p-6 text-white rounded-2xl">
              <h1 className="text-2xl font-bold mb-2">Book your patients</h1>
              <p className="text-gray-200 mb-2">
                Access your schedule, manage appointments, and connect with patients
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Users size={18} className="text-blue-400" />
                  Trusted by 50K+ patients
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-400" />
                  Manage appointments efficiently
                </li>
                <li className="flex items-center gap-2">
                  <Star size={18} className="text-yellow-400" />
                  4.8/5 patient satisfaction
                </li>
              </ul>
            </div>
          </div>

          {/* Right Form */}
          <div className="bg-white p-10 rounded-lg md:w-1/2 w-full">
            <h1 className="text-center font-bold text-2xl">Get Started</h1>
            <p className="text-gray-400 mt-2 text-center">
              Book appointments with your patients
            </p>

            <div className="flex mb-6 bg-gray-100 rounded-lg p-1 mt-5">
              <button
                onClick={() => setTab("login")}
                className={`w-1/2 py-2 rounded-lg text-sm font-medium transition ${
                  tab === "login"
                    ? "bg-white shadow text-blue-600"
                    : "text-gray-500"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setTab("register")}
                className={`w-1/2 py-2 rounded-lg text-sm font-medium transition ${
                  tab === "register"
                    ? "bg-white shadow text-blue-600"
                    : "text-gray-500"
                }`}
              >
                Register
              </button>
            </div>

            <form
              className="space-y-4"
              onSubmit={tab === "register" ? handleRegister : handleLogin}
            >
              {tab === "register" && (
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-gray-100 px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              )}
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-4 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                {tab === "login" ? "Sign In" : "Sign Up"}
              </button>
            </form>

            <div className="my-6 flex items-center">
              <hr className="flex-1 border-gray-300" />
              <span className="px-2 text-gray-400 text-sm">or</span>
              <hr className="flex-1 border-gray-300" />
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap={false}
                type="standard"
                size="large"
                text="signin_with"
                width="100"
                locale="en"
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DoctorLoginPage;
