import React, { useState } from 'react'
import SearchBar from './SearchBar'
import Filters from './Filters'
import Results, { type Train } from './Results'
import img from "../assets/WhatsApp Image9 2026-04-01 at 7.14.56 AM.jpeg"

export type FiltersType = { 
  class: string; 
  time: string; 
};

interface APITrip {
  tripId: string;
  trainNumber: number;
  trainType: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
}

const BookTickets: React.FC = () => {
  const [results, setResults] = useState<Train[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FiltersType>({ class: '', time: '' });

  const handleSearch = async (searchParams: { from: string; to: string; date: string }) => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');
    
    try {
      const formattedDate = searchParams.date
        .replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString())
        .replace(/\//g, '-');

      const query = new URLSearchParams({
        from: searchParams.from, 
        to: searchParams.to,     
        date: formattedDate
      }).toString();

      const response = await fetch(`https://trainbookingapp.fly.dev/api/v1/users/trips/search?${query}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        const mappedResults: Train[] = resData.data.trips.map((trip: APITrip) => ({
          tripId: trip.tripId,
          trainNumber: trip.trainNumber,
          trainType: trip.trainType,
          from: trip.from,
          to: trip.to,
          departureTime: trip.departureTime,
          arrivalTime: trip.arrivalTime,
          duration: trip.duration,
          price: trip.price
        }));
        
        setResults(mappedResults);
      } else {
        throw new Error(resData.msg || "Invalid station IDs");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = results.filter((train) => 
    filters.class === "" || train.trainType.toLowerCase().includes(filters.class.toLowerCase())
  );

  return (
    <div>
      <div className='w-full h-[100vh] shadow-2xl flex items-end justify-center bg-cover bg-center mt-16' style={{ backgroundImage: `url(${img})` }}>
        <h2 className='text-white text-center sm:text-[65px] text-[25px] font-semibold mb-10'>
          Easy Search <span className='text-amber-300'>for Your Trip</span>
        </h2>
      </div>

      <div className="w-[80%] m-auto mt-15">
        <SearchBar onSearch={handleSearch} />
        
        <div className="flex flex-col md:flex-row gap-6 mt-15">
          <div className="md:w-1/4">
            <Filters filters={filters} setFilters={setFilters} />
          </div>
          
          <div className="flex-1 mb-5">
            {loading && <div className="text-center mt-10">Loading...</div>}
            {error && <div className="text-red-500 text-center mt-10 bg-red-100 p-4 rounded-lg">{error}</div>}
            {!loading && <Results data={filteredResults} />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookTickets;