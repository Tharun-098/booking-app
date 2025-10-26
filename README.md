The Booking App is a full-featured appointment scheduling system built using the MERN Stack (MongoDB, Express.js, React, Node.js).
It is designed for doctors to efficiently manage appointments, users, and payments — all within a single, modern web platform.
The platform provides role-based dashboards where users can book and track appointments, and admins (doctors) can manage schedules, approve or reject bookings, and view payment details.
This project focuses on real-world usability, security, and responsiveness — featuring image uploads, JWT authentication and cloud deployment.

https://booking-app-thhd.vercel.app

Features:
User Features:
Register & Login – Create an account or log in securely using JWT authentication and Google OAuth sign-in

Book Appointments – Choose a doctor, date, and time to confirm an appointment

Track Status – View confirmed, pending, or cancelled appointments in the dashboard and get notified about status updates

Profile Management – Edit profile information (name, email, phone, gender, date of birth, address)

Profile Picture Upload – Upload or update a profile image (Multer + Cloudinary)

Secure Access – Access only personal data and appointment history

Doctor Features

Appointment Management – View all booking requests and confirmed appointments

Approve / Reject Bookings – Manage appointment requests in real time

Availability Control – Set available dates and time slots

User Communication – Notify users about booking updates (email or in-app notifications)

Payment Tracking – Check users’ payment statuses (paid/unpaid)

Profile Update – Edit profile details and upload a professional photo

Tech Stack:
Frontend:
React.js
Tailwind CSS
Axios
React Router DOM
React Toastify
chart Js
Framer-motion
lucide-react
react-calendar

Backend:
Node.js
Express.js
MongoDB (Mongoose)
Multer (Image Upload)
Cloudinary (Image Hosting)
JWT (Authentication)
Google Oauth
web socket
stripe 
open ai
nodecron

Deployment:
Frontend: Vercel
Backend: Vercel (API)
