import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const isSuccess = queryParams.get('success') === 'true';

    if (isSuccess) {
      const from = localStorage.getItem("departureCity") || "Cairo Central Station";
      const to = localStorage.getItem("destinationCity") || "Aswan Station";
      const train = localStorage.getItem("selectedTrainName") || "Express Train";
      const date = localStorage.getItem("travelDate") || "N/A";
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

      // عرض البوب أب بدل ما نحوله تلقائي
      setShowPopup(true);
    }
  }, [location]);

  const queryParams = new URLSearchParams(location.search);
  const isSuccess = queryParams.get('success') === 'true';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-[#1a1a1a] relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
         <i className="fa-solid fa-train text-[300px] text-gray-500"></i>
      </div>

      {isSuccess ? (
        showPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm px-4">
            <div className="bg-white dark:bg-[#252525] p-10 rounded-[40px] shadow-2xl flex flex-col items-center text-center transform scale-100 animate-fade-in-up w-full max-w-md border border-gray-100 dark:border-gray-800">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/40 animate-bounce">
                <i className="fa-solid fa-check text-white text-5xl"></i>
              </div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-3">Payment Successful!</h1>
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-8 font-medium">Your ticket has been booked successfully and is ready.</p>
              
              <button 
                onClick={() => navigate('/my')}
                className="w-full py-4 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-bold text-xl rounded-2xl shadow-xl shadow-red-600/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
              >
                <i className="fa-solid fa-ticket"></i>
                View Ticket
              </button>
            </div>
          </div>
        )
      ) : (
        <div className="bg-white dark:bg-[#252525] p-10 rounded-[40px] shadow-2xl flex flex-col items-center text-center w-full max-w-md z-10 border border-gray-100 dark:border-gray-800 px-4 mx-4">
          <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/40">
            <i className="fa-solid fa-xmark text-white text-5xl"></i>
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-3">Payment Failed</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-8 font-medium">No money has been withdrawn from your account.</p>
          <button 
            onClick={() => navigate('/payment')}
            className="w-full py-4 bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-bold text-xl rounded-2xl shadow-xl transition-all hover:scale-[1.02] active:scale-95"
          >
           Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default Success;