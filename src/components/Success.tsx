import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // التأكد من حالة الدفع من الرابط
    const queryParams = new URLSearchParams(location.search);
    const isSuccess = queryParams.get('success') === 'true';

    if (isSuccess) {
      // 1. توليد بيانات التذكرة (Mock Data للمناقشة)
      const ticketData = {
        ticketId: "SK-" + Math.floor(Math.random() * 90000 + 10000),
        trainName: "قطار توربيني - إكسبريس",
        userName: "Guest User",
        date: new Date().toLocaleDateString('ar-EG'),
        seat: "A" + Math.floor(Math.random() * 50 + 1),
        price: "150 EGP",
        from: "القاهرة",
        to: "الإسكندرية"
      };
      
      // 2. حفظ التذكرة في المتصفح عشان صفحة MyBookings تقرأها
      localStorage.setItem("lastTicket", JSON.stringify(ticketData));

      // 3. التحويل التلقائي لصفحة التذاكر بعد 3 ثواني
      setTimeout(() => {
        navigate('/My');
      }, 3000);
    }
  }, [location, navigate]);

  const queryParams = new URLSearchParams(location.search);
  const isSuccess = queryParams.get('success') === 'true';

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-[#1a1a1a]">
      {isSuccess ? (
        <div className="text-center">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce">
            <i className="fa-solid fa-check text-white text-5xl"></i>
          </div>
          <h1 className="text-4xl font-bold text-black dark:text-white mb-2">نجحت عملية الدفع!</h1>
          <p className="text-gray-500 text-lg">جاري إعداد تذكرتك وتحويلك لحسابك...</p>
        </div>
      ) : (
        <div className="text-center">
          <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <i className="fa-solid fa-xmark text-white text-5xl"></i>
          </div>
          <h1 className="text-4xl font-bold text-black dark:text-white mb-2">فشلت عملية الدفع</h1>
          <p className="text-gray-500 text-lg">لم يتم سحب أي مبالغ من حسابك.</p>
          <button 
            onClick={() => navigate('/payment')}
            className="mt-8 px-10 py-3 bg-[#b30606] text-white rounded-2xl font-bold text-xl hover:scale-105 transition-all shadow-xl"
          >
            جرب مرة أخرى
          </button>
        </div>
      )}
    </div>
  );
};

export default Success;