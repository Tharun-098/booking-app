import { useEffect, useState, createContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {io} from 'socket.io-client';
import { toast } from "react-toastify";
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
  const [notification, setNotification] = useState([]);
  const [socket, setSocket] = useState(null);
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
    if (!user) return;

    const newSocket = io("http://localhost:4000", {
      withCredentials: true,
    });

    newSocket.emit("register_user", user._id);

    newSocket.on("appointment_status", (data) => {
      console.log("Received notification:", data);
      setNotification((prev) => [data, ...prev]);
      toast.info(data.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
  if (!user || !accessToken) return;

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get("/api/user/getAllNotifications", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (data.success) {
        setNotification((prev)=>[...data.notifications,...prev]);
        const unread = data.notifications.filter((n) => !n.isRead);

          
          for (const note of unread) {
            toast.info(note.message)
            await axios.put(
              `/api/user/update-notification/read/${note._id}`,
              {},
              { headers: { Authorization: `Bearer ${accessToken}` } }
            );
          }
        }
    }catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
};

  fetchNotifications();
}, [user, accessToken]);

  useEffect(() => {
    refreshAccessToken();
  }, []);
  console.log(doctor);
  console.log(accessToken);
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
        notification,
        socket
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
