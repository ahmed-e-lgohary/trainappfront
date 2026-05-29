import React from 'react';
import type { FiltersType } from './BookTickets'; 

type Props = {
  filters: FiltersType;
  setFilters: React.Dispatch<React.SetStateAction<FiltersType>>;
};

const Filters = ({ filters, setFilters }: Props) => {
  return (
    <div className="bg-red-900 p-5 rounded-xl text-white w-[250px] mb-10">
      <h2 className="text-xl mb-4">Filters</h2>

      <div>
        <p>Class</p>
        {/* المصفوفة مطابقة تماماً لمحتويات وفصل الكروت */}
        {["VIP", "First Class", "Second Class"].map((type) => (
          <label key={type} className="block">
            <input
              type="checkbox"
              checked={filters.class === type}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFilters({
                  ...filters,
                  class: e.target.checked ? type : ""
                })
              }
            />
            <span className="ml-2 ">{type}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default Filters;