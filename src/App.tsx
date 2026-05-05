import { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
// import axios from "axios";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Book from "./components/BookTickets";
import MyBookings from "./components/MyBookings";
import Settings from "./components/Settings";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Chair from "./components/Chair";
import Payment from "./components/Payment";
import PassengerPage from "./components/PassengerInfo";
import Success from "./components/Success";
import VerifyOTP from "./components/VerifyOTP";
function App() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<string>("light");
  const [loading, setLoading] = useState<boolean>(true);

  // التحقق من الثيم عند التحميل
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.body.className = savedTheme;
    setLoading(false);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.body.className = newTheme;
  };

  const toggleLang = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
  };

  if (loading) return null;

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/book" element={<Book />} />
        
        {/* مسار الكراسي - تأكد إنك بتبعت الـ id من صفحة الحجز */}
        <Route path="/seats/:id" element={<Chair />} /> 
        
        <Route path="/passenger" element={<PassengerPage />} />
        <Route path="/success" element={<Success />} />
        
        {/* صفحة حجوزاتي - خليناها مفتوحة ومستقلة */}
        <Route 
          path="/my" 
          element={<MyBookings theme={theme} onBack={() => navigate(-1)} />} 
        />

        <Route path="/settings" element={<Settings />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign" element={<SignUp />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route 
          path="/payment" 
          element={
            <Payment 
              theme={theme} 
              toggleTheme={toggleTheme} 
              toggleLang={toggleLang} 
            />
          } 
        />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;