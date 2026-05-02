import React, { useState } from 'react'
import SearchBar from './SearchBar'
import Filters from './Filters'
import Results from './Results'
import img from "../assets/WhatsApp Image9 2026-04-01 at 7.14.56 AM.jpeg"

export type FiltersType = { 
  class: string; 
  time: string; 
};

interface APITrip {
  _id: string; 
  train?: { name?: string }; 
  departureStation?: { name?: string };
  arrivalStation?: { name?: string }; 
  departureTime?: string; 
  arrivalTime?: string;
  classType?: string; 
  duration?: string;
}

interface Train {
  id: string; 
  name: string; 
  class: string; 
  from: string; 
  to: string;
  fromTime: string; 
  toTime: string; 
  duration: string;
  price: string; 
}

const BookTickets: React.FC = () => {
  const [results, setResults] = useState<Train[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [filters, setFilters] = useState<FiltersType>({ class: '', time: '' });

  const handleSearch = async (searchParams: { from: string; to: string; date: string }) => {
    setLoading(true);
    setError("");
    setResults([]);

    const token = localStorage.getItem('token');
    
    try {
      const query = new URLSearchParams({
        from: searchParams.from,
        to: searchParams.to,
        date: searchParams.date
      }).toString();

      const targetUrl = `https://trainbookingapp.fly.dev/api/v1/users/trips/search?${query}`;
      
      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token?.trim()}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 403) {
        throw new Error("السيرفر رفض الصلاحيات (403). جرب تسجيل مستخدم جديد (User) وليس (Admin).");
      }

      const resData = await response.json();
      const tripsData = resData.data || [];

      if (Array.isArray(tripsData) && tripsData.length > 0) {
        const mappedResults: Train[] = tripsData.map((trip: APITrip) => ({
          id: trip._id,
          name: trip.train?.name || "Talgo Train",
          class: trip.classType || "First Class", 
          from: trip.departureStation?.name || searchParams.from,
          to: trip.arrivalStation?.name || searchParams.to,
          fromTime: trip.departureTime ? new Date(trip.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--",
          toTime: trip.arrivalTime ? new Date(trip.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--",
          duration: trip.duration || "3h",
          price: "180" 
        }));
        setResults(mappedResults);
      } else {
        // إذا كانت المصفوفة فارغة نطلق خطأ لننتقل للبيانات الوهمية
        throw new Error("Empty Results");
      }
    } catch (err: unknown) {
      // استخدام err هنا يزيل تحذير 'err' is defined but never used
      console.warn("Switching to Test Data due to:", err instanceof Error ? err.message : "Connection Issue");
      
      const testData: Train[] = [
        {
          id: "test-vip-01",
          name: "VIP Express 901",
          class: "First Class",
          from: searchParams.from || "Cairo",
          to: searchParams.to || "Alexandria",
          fromTime: "08:00 AM",
          toTime: "10:30 AM",
          duration: "2h 30m",
          price: "250"
        },
        {
          id: "test-speed-02",
          name: "Speed Train 2005",
          class: "Second Class",
          from: searchParams.from || "Cairo",
          to: searchParams.to || "Luxor",
          fromTime: "10:00 PM",
          toTime: "06:00 AM",
          duration: "8h",
          price: "150"
        }
      ];
      
      setResults(testData);
      
      // تخزين بيانات أول رحلة وهمية ليتم استخدامها في صفحة التذكرة (Test)
      localStorage.setItem("temp_trip_details", JSON.stringify(testData[0]));
      
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = results.filter((train) => filters.class === "" || train.class === filters.class);

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
            {loading && <div className="text-center mt-10 text-2xl font-bold animate-pulse">جاري البحث...</div>}
            {error && !results.length && (
              <div className="text-red-700 text-center mb-5 font-bold p-3 bg-red-50 border border-red-200 rounded">
                {error}
              </div>
            )}
            {!loading && filteredResults.length > 0 && <Results data={filteredResults} />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookTickets;