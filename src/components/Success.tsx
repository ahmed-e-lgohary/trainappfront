import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const isSuccess = queryParams.get('success') === 'true';

    if (isSuccess) {
      const from = localStorage.getItem("departureCity") || "غير محدد";
      const to = localStorage.getItem("destinationCity") || "غير محدد";
      const train = localStorage.getItem("selectedTrainName") || "قطار ENR";
      const date = localStorage.getItem("travelDate") || "غير محدد";
      const seat = localStorage.getItem("selectedSeat") || "A1";
      const price = localStorage.getItem("selectedPrice") || "150";


      const name = localStorage.getItem("passengerName") || "Guest User";
      const ticketData = {
        ticketId: "ENR-" + Math.floor(Math.random() * 90000 + 10000),
        trainName: train,
        userName: name,
        date: date,
        seat: seat,
        price: `${price} EGP`,
        from: from,
        to: to
      };
      
      // حفظ البيانات النهائية لصفحة MyBookings
      localStorage.setItem("lastTicket", JSON.stringify(ticketData));

      // التحويل التلقائي لصفحة التذاكر بعد 3 ثواني
      setTimeout(() => {
        navigate('/my');
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
          <h1 className="text-4xl font-bold text-black dark:text-white mb-2">Payment Successful !</h1>
          <p className="text-gray-500 text-lg">Preparing your ticket and redirecting you to your account...</p>
        </div>
      ) : (
        <div className="text-center">
          <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <i className="fa-solid fa-xmark text-white text-5xl"></i>
          </div>
          <h1 className="text-4xl font-bold text-black dark:text-white mb-2">فشلت عملية الدفع</h1>
          <p className="text-gray-500 text-lg">No money has been withdrawn from your account.</p>
          <button 
            onClick={() => navigate('/payment')}
            className="mt-8 px-10 py-3 bg-[#b30606] text-white rounded-2xl font-bold text-xl hover:scale-105 transition-all shadow-xl"
          >
           Please try again
          </button>
        </div>
      )}
    </div>
  );
};

export default Success;