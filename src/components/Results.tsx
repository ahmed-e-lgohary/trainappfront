import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { FiltersType } from './BookTickets';

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
  currentFilters?: FiltersType;
}

const Results: React.FC<ResultsProps> = ({ data }) => {
  const navigate = useNavigate();

  const backupFrom = localStorage.getItem("departureCity") || "Cairo Central Station";
  const backupTo = localStorage.getItem("destinationCity") || "Aswan Station";

  const handleViewSeats = (train: Train) => {
    localStorage.setItem("from", train.from && train.from !== "N/A" ? train.from : backupFrom);
    localStorage.setItem("to", train.to && train.to !== "N/A" ? train.to : backupTo);
    localStorage.setItem("departureTime", train.fromTime !== "N/A" ? train.fromTime : "14:00");
    localStorage.setItem("arrivalTime", train.toTime !== "N/A" ? train.toTime : "02:00");
    localStorage.setItem("selectedPrice", train.price);
    localStorage.setItem("selectedTrainName", train.name);
    localStorage.setItem("selectedClass", train.class);

    navigate(`/seats/${train.id}`);
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-red-50 dark:bg-red-900/10 rounded-3xl shadow-sm border border-red-100 dark:border-red-900/30 mt-5 font-sans transition-all">
        <svg className="w-16 h-16 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="text-red-800 dark:text-red-400 font-bold text-xl">No trains found</p>
        <p className="text-md text-gray-500 mt-2">Try adjusting your filters to see more results.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-['Cairo'] max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
      {data.map((train, index) => (
        <div key={`${train.id}-${train.class}-${index}`} className="bg-[#1e1e1e] text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-center gap-6 border border-gray-800 transition-all hover:border-gray-700">

          {/* 1. اسم القطار والتفاصيل */}
          <div className="flex-1">
            <h3 className="text-[35px] font-bold text-red-600 mb-1 px-1">{train.name}</h3>
            <div className="flex items-center gap-3 text-gray-400 px-1">
              <span className="text-sm font-semibold text-amber-500 uppercase tracking-wider">
                {train.class}
              </span>
              <span className="w-1.5 h-1.5 bg-gray-600 rounded-full"></span>
              <span className="text-sm">{train.duration}</span>
            </div>
          </div>

          {/* 2. المحطات والوقت */}
          <div className="flex items-center gap-6 md:gap-10 text-center flex-[2]">
            <div>
              <p className="text-2xl font-black">
                {train.fromTime !== "N/A" ? train.fromTime : "14:00"}
              </p>
              <p className="text-sm font-bold text-gray-300 mt-1 uppercase">
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
              <p className="text-2xl font-black">
                {train.toTime !== "N/A" ? train.toTime : "02:00"}
              </p>
              <p className="text-sm font-bold text-gray-300 mt-1 uppercase">
                {train.to && train.to !== "N/A" ? train.to : backupTo}
              </p>
            </div>
          </div>

          {/* 3. السعر وزر الحجز */}
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[30px] font-black text-white">
                {train.price}
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