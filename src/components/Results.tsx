import React from 'react';
import { useNavigate } from 'react-router-dom';

export type Train = {
  tripId: string; 
  trainNumber: number;
  trainType: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;   
};

interface ResultsProps {
  data: Train[];
}

const Results: React.FC<ResultsProps> = ({ data }) => {
  const navigate = useNavigate();

  const handleViewSeats = (train: Train) => {
    // حفظ البيانات الأساسية للرحلة كنسخة احتياطية
    localStorage.setItem("selectedTrip", JSON.stringify(train));
    
    localStorage.setItem("selectedTrainName", `Train ${train.trainNumber}`);
    localStorage.setItem("selectedTrainPrice", train.price.toString()); 
    navigate(`/seats/${train.tripId}`);
  };

  if (data.length === 0) {
    return <p className="text-center text-gray-500 mt-10">No trains available for the selected criteria.</p>;
  }

  return (
    <div className="space-y-6">
      {data.map((train) => (
        <div key={train.tripId} className="bg-white dark:bg-[#252525] p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-xl transition-shadow">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-red-600 mb-2">Train {train.trainNumber}</h3>
            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
              <span className="font-semibold">{train.trainType}</span>
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span>{train.duration}</span>
            </div>
          </div>

          <div className="flex items-center gap-8 text-center">
            <div>
              <p className="text-xl font-bold dark:text-white">{train.departureTime}</p>
              <p className="text-sm text-white text-[20px] font-semibold uppercase">{train.from}</p>
            </div>
            <div className="text-red-600">
              <i className="fa-solid fa-train"></i>
              <div className="w-16 h-[2px] bg-gray-200 mt-1"></div>
            </div>
            <div>
              <p className="text-xl font-bold dark:text-white">{train.arrivalTime}</p>
              <p className="text-sm text-white text-[20px] font-semibold uppercase">{train.to}</p>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <p className="text-xl font-bold text-amber-600 mb-1">{train.price} EGP</p>
            <button 
              onClick={() => handleViewSeats(train)}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold transition-transform active:scale-95"
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