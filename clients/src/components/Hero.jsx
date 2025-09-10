import { useContext } from "react";
import photo from "../assets/pexels-photo-4173251.webp";
import { DataContext } from "../context/DataContext";
const Hero = () => {
    const {navigate}=useContext(DataContext);
  return (
    <div>
      <section class="relative bg-gradient-to-br from-slate-50 to-slate-200 min-h-screen flex items-center pt-28 pb-20">
        <div class="container mx-auto px-6 lg:px-12">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div class="text-center lg:text-left">
              <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-800 mb-6">
                Book Your Doctor Appointment
                <span class="relative text-blue-600 inline-block">
                  Instantly
                  <span class="absolute inset-x-0 -bottom-1 h-2 bg-blue-200 rounded-md -z-10"></span>
                </span>
              </h1>

              <p class="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
                Connect with qualified healthcare professionals in your area.
                Schedule appointments, manage your health records, and get the
                care you deserve.
              </p>
              <div class="flex flex-wrap gap-4 justify-center lg:justify-start">
                <button
                  id="bookNow"
                  class="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg text-lg shadow-md hover:bg-blue-700 hover:-translate-y-1 transition"
                  onClick={()=>navigate('/user/Login')}
                >
                  Book Appointment
                </button>
                <button
                  id="learnMore"
                  class="px-8 py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg text-lg hover:bg-blue-600 hover:text-white hover:-translate-y-1 transition"
                  onClick={()=>navigate('/doctor/login')}
                >
                  Book your patients
                </button>
              </div>
            </div>

            <div class="relative">
              <img
                src={photo}
                alt="Doctor consultation"
                class="w-full h-[500px] object-cover rounded-2xl shadow-2xl transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
