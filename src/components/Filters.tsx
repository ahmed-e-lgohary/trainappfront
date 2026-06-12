import React, { useState, useEffect } from 'react';
import type { FiltersType } from './BookTickets'; 

type Props = {
  filters: FiltersType;
  setFilters: React.Dispatch<React.SetStateAction<FiltersType>>;
};

const Filters = ({ filters, setFilters }: Props) => {
  const classes = ["VIP", "First Class", "Second Class"];
  const times = ["Morning", "Afternoon", "Night"];

  const [localFilters, setLocalFilters] = useState<FiltersType>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleClassChange = (c: string) => {
    const newClasses = localFilters.classes.includes(c)
      ? localFilters.classes.filter(item => item !== c)
      : [...localFilters.classes, c];
    setLocalFilters({ ...localFilters, classes: newClasses });
  };

  const handleTimeChange = (t: string) => {
    const newTimes = localFilters.times.includes(t)
      ? localFilters.times.filter(item => item !== t)
      : [...localFilters.times, t];
    setLocalFilters({ ...localFilters, times: newTimes });
  };

  const handleApply = () => {
    setFilters(localFilters);
  };

  return (
    <div className="bg-[#801c1c] p-6 rounded-md text-white w-[250px] mb-10 shadow-lg font-sans">
      <h2 className="text-xl font-normal mb-6">Filters</h2>

      <div className="mb-6">
        <h3 className="font-semibold text-white mb-3 text-sm">Class</h3>
        <div className="space-y-2">
          {classes.map((type) => (
            <label key={type} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localFilters.classes.includes(type)}
                onChange={() => handleClassChange(type)}
                className="w-4 h-4 rounded-sm border-gray-300 text-blue-600 focus:ring-blue-500 bg-white"
              />
              <span className="ml-3 text-sm font-light">{type}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-white mb-3 text-sm">Time of Day</h3>
        <div className="space-y-2">
          {times.map((time) => (
            <label key={time} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localFilters.times.includes(time)}
                onChange={() => handleTimeChange(time)}
                className="w-4 h-4 rounded-sm border-gray-300 text-blue-600 focus:ring-blue-500 bg-white"
              />
              <span className="ml-3 text-sm font-light">{time}</span>
            </label>
          ))}
        </div>
      </div>

      <button 
        onClick={handleApply}
        className="mt-8 w-full bg-white text-[#801c1c] font-semibold py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default Filters;