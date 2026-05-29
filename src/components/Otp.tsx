import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import bgImage from '../assets/packground.jpg';

interface VerifyResponse {
  success: boolean;
  msg: string;
}

const VerifyOTP: React.FC = () => {
  const [otp, setOtp] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();

  // الحصول على الإيميل من الـ State
  const stateEmail = (location.state as { email?: string })?.email || "";
  
  // حفظ الإيميل في LocalStorage كخطة بديلة لو الصفحة حصل لها Refresh
  const [email, setEmail] = useState<string>(stateEmail);

  useEffect(() => {
    if (stateEmail) {
      localStorage.setItem('pendingEmail', stateEmail);
      setEmail(stateEmail);
    } else {
      const savedEmail = localStorage.getItem('pendingEmail');
      if (savedEmail) {
        setEmail(savedEmail);
      } else {
        // لو مفيش إيميل خالص، يرجع يسجل من الأول
        navigate("/signup");
      }
    }
  }, [stateEmail, navigate]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    // التأكد من وجود البيانات قبل الإرسال لمنع "Missing fields"
    if (!email) {
      setError("Email is missing. Please sign up again.");
      return;
    }
    if (otp.length < 6) {
      setError("Please enter the 6-digit code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // إرسال البيانات للسيرفر (تأكد من الحروف الصغيرة email و otp)
      const response = await axios.post<VerifyResponse>('https://trainbookingapp.fly.dev/api/v1/email/verifyOTP', {
        email: email.trim(),
        otp: otp.trim()
      });

      if (response.data.success) {
        localStorage.removeItem('pendingEmail'); // تنظيف الداتا بعد النجاح
        alert("Email verified successfully!");
        navigate("/login");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        // لو السيرفر رد بـ "Missing fields" هنشوف تفاصيلها هنا
        console.error("Full Error:", err.response?.data);
        const serverData = err.response?.data as { msg?: string };
        setError(serverData?.msg || "Verification failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-cover bg-center flex justify-center items-center font-sans mt-16" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="bg-black/40 backdrop-blur-sm w-full min-h-screen flex justify-center items-center p-4">
        <div className="w-full max-w-[400px] bg-white p-8 rounded-[30px] shadow-2xl text-center">
          <h2 className="text-3xl font-black text-[#b32121] mb-2">Verify Email</h2>
          <p className="text-gray-600 mb-6 text-sm text-center">
            Verify code for: <br/> <strong>{email}</strong>
          </p>

          {error && <div className="text-red-500 mb-4 text-xs font-bold bg-red-50 p-2 rounded">{error}</div>}

          <form onSubmit={handleVerify} className="flex flex-col gap-4">
            <input
              type="text"
              maxLength={6}
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
              className="w-full text-center text-2xl tracking-[10px] font-bold px-4 py-3 rounded-xl border-2
               border-[#b32121]/30 focus:border-[#b32121] outline-none text-black transition-all"
              required
            />

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-4 bg-[#b32121] text-white font-bold rounded-xl mt-2 hover:bg-red-700 transition-colors
                 ${loading ? 'opacity-50' : ''}`}
            >
              {loading ? "VERIFYING..." : "CONFIRM"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;