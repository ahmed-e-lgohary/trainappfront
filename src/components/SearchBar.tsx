import { useState, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import api from "./Api";

export type SearchData = {
  from: string;
  to: string;
  date: string;
  classType: string;
};

type Props = {
  onSearch: (data: SearchData) => void;
};

type Station = {
  _id: string;
  name: string;
  displayName?: string;
};

const SearchBar = ({ onSearch }: Props) => {
  const [fromStations, setFromStations] = useState<Station[]>([]);
  const [toStations, setToStations] = useState<Station[]>([]);

  const [fromName, setFromName] = useState<string>("");
  const [toName, setToName] = useState<string>("");
  const [date, setDate] = useState<string>("");

  // Fetch 'From' stations on component mount
  useEffect(() => {
    api.get("/users/stations")
      .then(res => {
        if (res.data.success) {
          setFromStations(res.data.data);
        }
      })
      .catch(err => console.error("Error fetching stations:", err));
  }, []);

  // Fetch valid 'To' destinations when 'fromName' changes
  useEffect(() => {
    if (!fromName) {
      setToStations([]);
      return;
    }

    const selectedFrom = fromStations.find(
      s => (s.displayName || s.name) === fromName.trim()
    );

    if (selectedFrom) {
      api.get(`/users/destinations?from=${selectedFrom._id}`)
        .then(res => {
          if (res.data.success) {
            setToStations(res.data.data);
          }
        })
        .catch(err => console.error("Error fetching destinations:", err));
    } else {
      setToStations([]);
    }
  }, [fromName, fromStations]);

  // حساب الحد الأدنى والأقصى للتاريخ (18 يوم كحد أقصى)
  const getMinMaxDates = () => {
    const today = new Date();
    const formatDate = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    const minDate = formatDate(today);
    const max = new Date();
    max.setDate(today.getDate() + 18);
    const maxDate = formatDate(max);
    return { minDate, maxDate };
  };

  const { minDate, maxDate } = getMinMaxDates();

  const handleSearch = () => {
    if (!fromName || !toName || !date) {
      alert("Please fill in all fields");
      return;
    }

    const fromStation = fromStations.find(s => (s.displayName || s.name) === fromName.trim());
    const toStation = toStations.find(s => (s.displayName || s.name) === toName.trim());

    if (!fromStation || !toStation) {
      alert("Please select a valid station from the list");
      return;
    }

    localStorage.setItem("departureCity", fromName);
    localStorage.setItem("destinationCity", toName);
    localStorage.setItem("travelDate", date);

    onSearch({ 
      from: fromStation._id, 
      to: toStation._id, 
      date, 
      classType: "First Class" 
    });
  };

  return (
    <div className="bg-red-900 p-5 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-center shadow-xl">
      <input
        list="from-stations"
        value={fromName}
        onChange={(e) => {
          setFromName(e.target.value);
          // Reset 'to' when 'from' changes to prevent invalid state
          setToName(""); 
        }}
        placeholder="From"
        className="p-3 rounded-lg bg-white outline-none w-full md:w-auto text-gray-800"
      />
      <div className="w-[40px] h-[40px] rounded-[50%] bg-red-600 flex items-center justify-center text-white shrink-0"> 
        <FaArrowRight/>
      </div>
      <input
        list="to-stations"
        value={toName}
        onChange={(e) => setToName(e.target.value)}
        placeholder="To"
        className="p-3 rounded-lg bg-white outline-none w-full md:w-auto text-gray-800"
        disabled={!fromName || toStations.length === 0}
      />
      <input
        type="date"
        value={date}
        min={minDate}
        max={maxDate}
        onChange={(e) => setDate(e.target.value)}
        className="p-3 rounded-lg bg-white px-8 outline-none w-full md:w-auto text-gray-800"
      />
      <button
        onClick={handleSearch}
        className="bg-red-600 text-white px-10 rounded-lg py-2 text-[20px] font-semibold hover:bg-red-700 transition-all disabled:opacity-50"
        disabled={!fromName || !toName || !date}
      >
        Search
      </button>

      <datalist id="from-stations">
        {fromStations.map((station, i) => (
          <option key={i} value={station.displayName || station.name} />
        ))}
      </datalist>
      
      <datalist id="to-stations">
        {toStations.map((station, i) => (
          <option key={i} value={station.displayName || station.name} />
        ))}
      </datalist>
    </div>
  );
};

export default SearchBar;