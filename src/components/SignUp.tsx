import React, { useState, useRef } from 'react';
import bgImage from '../assets/packground.jpg'; 
import { useNavigate } from 'react-router-dom';

const SignUp: React.FC = () => {
  const [showPass, setShowPass] = useState<boolean>(false);
  const [showConfirmPass, setShowConfirmPass] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false); 
  const navigate = useNavigate();

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const confirmPassRef = useRef<HTMLInputElement>(null);

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    nextField: React.RefObject<HTMLInputElement | null> | null
  ): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextField && nextField.current) {
        nextField.current.focus();
      }
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const password = passRef.current?.value || "";
    const confirmPassword = confirmPassRef.current?.value || "";

    if (password !== confirmPassword) {
      alert("كلمات السر غير متطابقة!");
      return;
    }

    setLoading(true);

    const userData = {
      name: nameRef.current?.value,
      email: emailRef.current?.value,
      password: password,
      passwordConfirm: confirmPassword,
      phone: phoneRef.current?.value,
    };

    try {
      const response = await fetch('https://trainbookingapp.fly.dev/api/v1/email/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userAccount", "true");
        alert("تم إنشاء الحساب بنجاح!");
        navigate("/passenger");
      } else {
        // حل مشكلة الـ any هنا عن طريق تحديد نوع الخطأ بوضوح
        let errorMessage = data.message || "تأكد من البيانات";
        
        if (data.errors) {
            // تحويل الـ errors لمصفوفة واستخراج الرسائل بدون any
            errorMessage = Object.values(data.errors)
                .map((err) => (err as { message: string }).message)
                .join("\n");
        }
        
        alert(`فشل التسجيل:\n${errorMessage}`);
        console.error("Server Response:", data);
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "حدث خطأ في الاتصال";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex justify-center items-center font-sans mt-16"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="bg-black/40 backdrop-blur-sm w-full min-h-screen flex justify-center items-center p-4">
        <div className="w-full max-w-[450px] bg-white p-8 rounded-[30px] shadow-2xl">
          
          <div className="text-center mb-8">
            <h1 className="text-6xl font-black text-[#b32121] my-4">ENR</h1>
            <p className="text-[10px] font-bold tracking-[4px] text-black border-t border-black mt-[-10px] pt-1">TICKETS</p>
          </div>

          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create Account</h2>

          <form className="flex flex-col gap-4" onSubmit={handleRegister}>
            <input
              ref={nameRef}
              type="text"
              placeholder="Full Name"
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-[#b32121]/30 focus:border-[#b32121] outline-none text-black bg-white transition-all"
              onKeyDown={(e) => handleKeyPress(e, emailRef)}
            />

            <input
              ref={emailRef}
              type="email"
              placeholder="Email Address"
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-[#b32121]/30 focus:border-[#b32121] outline-none text-black bg-white transition-all"
              onKeyDown={(e) => handleKeyPress(e, phoneRef)}
            />

            <input
              ref={phoneRef}
              type="tel"
              placeholder="Phone Number"
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-[#b32121]/30 focus:border-[#b32121] outline-none text-black bg-white transition-all"
              onKeyDown={(e) => handleKeyPress(e, passRef)}
            />

            <div className="relative">
              <input
                ref={passRef}
                type={showPass ? "text" : "password"}
                placeholder="Password (min 8 chars)"
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-[#b32121]/30 focus:border-[#b32121] outline-none text-black bg-white transition-all"
                onKeyDown={(e) => handleKeyPress(e, confirmPassRef)}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-3 text-xl">
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>

            <div className="relative">
              <input
                ref={confirmPassRef}
                type={showConfirmPass ? "text" : "password"}
                placeholder="Confirm Password"
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-[#b32121]/30 focus:border-[#b32121] outline-none text-black bg-white transition-all"
                onKeyDown={(e) => handleKeyPress(e, null)}
              />
              <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-4 top-3 text-xl">
                {showConfirmPass ? "🙈" : "👁️"}
              </button>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-4 bg-[#b32121] text-white font-bold rounded-xl mt-2 hover:bg-red-700 transition-colors shadow-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? "REGISTERING..." : "REGISTER"}
            </button>
            
            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account? <span 
              onClick={() => navigate("/login")}
              className="text-[#b32121] font-bold cursor-pointer hover:underline">Login</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;