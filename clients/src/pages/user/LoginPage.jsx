import React, { useState } from "react";
import { Users, CheckCircle, Star } from "lucide-react";
import doctorimage from "../../assets/doctor.webp";
import { GoogleLogin } from "@react-oauth/google";
import Navbar from "../../components/Navbar";
import Footer from '../../components/Footer'
import { DataContext } from "../../context/DataContext";
import { useContext } from "react";
import { toast } from "react-toastify";
const LoginPage = () => {
  const {setIsLogged,navigate,setAccessToken,setUser,axios}=useContext(DataContext)
  const [tab, setTab] = useState("login");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password,setPassword] = useState("");
  const handleGoogleSuccess = async (credentialResponse) => {
    console.log("Google credential response:", credentialResponse);
    try {
      const res = await axios.post(
        "api/auth/google",
        { token: credentialResponse.credential },
        { headers: { "Content-Type": "application/json" },withCredentials: true }
      );
      console.log("User logged in:", res.data.user);
      setIsLogged(true);
      setAccessToken(res.data.accessToken)
      setUser(res.data.user)
      toast.success(res.data.message);
      navigate('/user/dashboard');
    } catch (error) {
      toast.error("Google login error:", error.message);
    }
  };
  
  const handleGoogleError = () => {
    toast.error("Google login failed");
  };
  
  const handleLogin=async(e)=>{
    e.preventDefault();
    try {
      const {data}=await axios.post('/api/auth/login',{email,password});
      if(data.success){
        console.log(data.message);
        setEmail("");
        setPassword("");
        setIsLogged(true);
        setAccessToken(data.accessToken);
        setUser(data.user)
        toast.success(data.message);
        navigate('/user/dashboard');
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
  const handleregister=async(e)=>{
    e.preventDefault();
    try {
      const {data}=await axios.post('/api/auth/register',{username,email,password});
      if(data.success){
        console.log(data.message);
        setAccessToken(data.accessToken)
        setIsLogged(true);
        setUser(data.newUser)
        toast.success(data.message);
        navigate('/user/dashboard');
        setUserName("");
        setEmail("");
        setPassword("");
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar/>
      <div className="flex justify-center items-center min-h-screen flex-wrap">
        <div className="max-w-4xl flex flex-col md:flex-row gap-6 md:gap-10 items-center px-3">
          <div className="py-10 md:w-1/2 w-full relative">
            <img src={doctorimage} className="h-auto w-full rounded-2xl" />
            <div className="absolute bottom-10 top-10 bg-black/40 flex flex-col justify-end p-6 text-white rounded-2xl">
              <h1 className="text-2xl font-bold mb-2">Book Expert Consultations</h1>
              <p className="text-gray-200 mb-2">
                Connect with qualified doctors and tutors for personalized sessions
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Users size={18} className="text-blue-400" />
                  Trusted by 50K+ patients
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-400" />
                  1000+ specialists
                </li>
                <li className="flex items-center gap-2">
                  <Star size={18} className="text-yellow-400" />
                  4.8/5 patient satisfaction
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white p-10 rounded-lg md:w-1/2 w-full">
            <h1 className="text-center font-bold text-2xl">Get Started</h1>
            <p className="text-gray-400 mt-2 text-center">
              Book appointments with doctors and tutors
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

            <form className="space-y-4" onSubmit={tab==="register"?handleregister:handleLogin}>
              {tab === "register" && (
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e)=>setUserName(e.target.value)}
                  className="w-full bg-gray-100 px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              )}
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                className="w-full px-4 py-4 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <input
                type="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
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
            {/* <button className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Continue with Google
            </button> */}
          </div>

        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default LoginPage;
