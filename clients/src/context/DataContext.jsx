import { useEffect, useState, createContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

axios.defaults.baseURL = "https://booking-app-livid-two.vercel.app";
//axios.defaults.baseURL = "http://localhost:4000";
axios.defaults.withCredentials = true;

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [doctorSelect, setIsDoctorSelect] = useState(true);
  const [isTimeSelect, setIsTimeSelect] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [doctorIsLogged, setDoctorIsLogged] = useState(false);
  const [user, setUser] = useState(undefined);
  const [doctor, setDoctor] = useState(undefined);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const refreshAccessToken = async () => {
    try {
      const { data } = await axios.get("/api/token/refresh");
      if (!data.success) throw new Error("Token refresh failed");

      const token = data.accessToken;
      const role = data.role;

      setAccessToken(token);

      const profileEndpoint =
        role === "doctor" ? "/api/doctor/profile" : "/api/auth/profile";

      const { data: profile } = await axios.get(profileEndpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (profile.success) {
        if (role === "doctor") {
          setDoctor(profile.user);
          setDoctorIsLogged(true);
        } else {
          setUser(profile.user);
          setIsLogged(true);
        }
      } else {
        throw new Error("Profile fetch failed");
      }
    } catch (err) {
      console.log("Refresh failed:", err.message);
      setUser(undefined);
      setDoctor(undefined);
      setAccessToken(null);
      setIsLogged(false);
      setDoctorIsLogged(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Refresh token once on mount
    refreshAccessToken();
  }, []);
  console.log(user);
  return (
    <DataContext.Provider
      value={{
        isLogged,
        setIsLogged,
        doctorIsLogged,
        setDoctorIsLogged,
        user,
        setUser,
        doctor,
        setDoctor,
        accessToken,
        setAccessToken,
        navigate,
        refreshAccessToken,
        loading,
        axios,
        doctorSelect,
        setIsDoctorSelect,
        isTimeSelect,
        setIsTimeSelect,
        isConfirm,
        setIsConfirm,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
