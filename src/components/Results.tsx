import React from 'react';
import { useNavigate } from 'react-router-dom';

export type Train = {
  id: string;
  name: string;
  class: string;
  from: string;
  to: string;
  fromTime: string;
  toTime: string;
  duration: string;
  price: string;   
};

interface ResultsProps {
  data: Train[];
  // أضفنا هذا الجزء لنتمكن من قراءة الدرجة المختارة من الفلتر في صفحة الـ Booking
  currentFilters?: { class: string }; 
}

const Results: React.FC<ResultsProps> = ({ data, currentFilters }) => {
  const navigate = useNavigate();

  // جلب أسماء المحطات من السيرش كاحتياطي
  const backupFrom = localStorage.getItem("departureCity") || "From";
  const backupTo = localStorage.getItem("destinationCity") || "To";

  // دالة لتحديد الدرجة التي ستظهر (الفلتر له الأولوية لإصلاح مشكلة Economic)
  const getDisplayClass = (trainClass: string) => {
    if (currentFilters?.class && currentFilters.class !== "") {
      return currentFilters.class;
    }
    return trainClass;
  };

  const handleViewSeats = (train: Train) => {
    const finalClass = getDisplayClass(train.class);
    
    localStorage.setItem("from", train.from !== "N/A" ? train.from : backupFrom);
    localStorage.setItem("to", train.to !== "N/A" ? train.to : backupTo);
    localStorage.setItem("departureTime", train.fromTime);
    localStorage.setItem("arrivalTime", train.toTime);
    localStorage.setItem("selectedPrice", train.price);
    localStorage.setItem("selectedTrainName", train.name);
    localStorage.setItem("selectedClass", finalClass); 
    
    navigate(`/seats/${train.id}`);
  };

  if (data.length === 0) {
    return (
      <div className="text-center p-10 bg-white dark:bg-[#252525] rounded-2xl shadow-lg mt-5">
        <p className="text-gray-500 dark:text-gray-400 font-bold">No trains found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-11">
      {data.map((train) => (
        <div key={train.id} className="bg-[#1e1e1e] text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-center gap-6 border border-gray-800">
          
          {/* 1. اسم القطار والتفاصيل */}
          <div className="flex-1">
            <h3 className="text-[35px] font-bold text-red-600 mb-1 ">{train.name}</h3>
            <div className="flex items-center gap-3 text-gray-400">
              {/* عرض الدرجة المختارة فعلياً من الفلتر */}
              <span className="text-sm font-bold text-amber-500 uppercase">
                {getDisplayClass(train.class)}
              </span>
              <span className="w-1.5 h-1.5 bg-gray-600 rounded-full"></span>
              <span className="text-sm">{train.duration}</span>
            </div>
          </div>

          {/* 2. المحطات والوقت (المركز) */}
          <div className="flex items-center gap-6 md:gap-10 text-center flex-[2]">
            <div>
              <p className="text-2xl font-black">{train.fromTime}</p>
              <p className="text-[22px] font-bold text-gray-300 mt-1 uppercase">
                {train.from && train.from !== "N/A" ? train.from : backupFrom}
              </p>
            </div>
            
            <div className="flex flex-col items-center min-w-[80px]">
              <div className="w-full h-[2px] bg-gray-600 relative">
                <div className="absolute -top-1 left-0 w-2.5 h-2.5 rounded-full bg-red-600"></div>
                <div className="absolute -top-1 right-0 w-2.5 h-2.5 rounded-full border-2 border-red-600 bg-[#1e1e1e]"></div>
              </div>
            </div>

            <div>
              <p className="text-2xl font-black">{train.toTime}</p>
              <p className="text-[22px] font-bold text-gray-300 mt-1 uppercase">
                {train.to && train.to !== "N/A" ? train.to : backupTo}
              </p>
            </div>
          </div>

          {/* 3. السعر وزر الحجز */}
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[30px] font-black text-white">
                {train.price && train.price !== "0" ? train.price : "150"} 
                <span className="text-[18px] ml-1 text-gray-300 font-normal">EGP</span>
              </p>
            </div>
            
            <button 
              onClick={() => handleViewSeats(train)}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-2xl font-bold transition-all active:scale-95"
            >
              View Seats
            </button>
          </div>

        </div>
      ))}
    </div>
  );
};

export default Results;