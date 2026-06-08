import React from 'react';
import type { FiltersType } from './BookTickets'; 

type Props = {
  filters: FiltersType;
  setFilters: React.Dispatch<React.SetStateAction<FiltersType>>;
};

const Filters = ({ filters, setFilters }: Props) => {
  const classes = ["VIP", "First Class", "Second Class"];

  return (
    <div className="bg-red-900 p-5 rounded-xl text-white w-[250px] mb-10 shadow-lg font-['Cairo']">
      <h2 className="text-xl font-bold mb-4 border-b border-red-800 pb-2">Filters</h2>

      <div className="space-y-3">
        <p className="font-semibold text-gray-300 text-sm">Select Train Class:</p>
        
        {/* زر لإلغاء الفلتر وعرض كل القطارات */}
        <label className="flex items-center cursor-pointer space-x-2 bg-red-950/40 p-2 rounded-lg hover:bg-red-950/80 transition-all">
          <input
            type="radio"
            name="trainClass"
            checked={filters.class === ""}
            onChange={() => setFilters({ ...filters, class: "" })}
            className="accent-amber-400 h-4 w-4"
          />
          <span className="ml-2 text-sm">All Classes</span>
        </label>

        {classes.map((type) => (
          <label key={type} className="flex items-center cursor-pointer space-x-2 bg-red-950/40 p-2 rounded-lg hover:bg-red-950/80 transition-all">
            <input
              type="radio"
              name="trainClass"
              checked={filters.class.trim().toLowerCase() === type.trim().toLowerCase()}
              onChange={() => setFilters({ ...filters, class: type })}
              className="accent-amber-400 h-4 w-4"
            />
            <span className="ml-2 text-sm">{type}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default Filters;