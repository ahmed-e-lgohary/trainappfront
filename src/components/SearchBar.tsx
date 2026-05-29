import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";

export type SearchData = {
  from: string;
  to: string;
  date: string;
  classType: string;
};

type Props = {
  onSearch: (data: SearchData) => void;
};

// تم تحديث الـ IDs والأسماء لتطابق ملف Trips2.txt تماماً
const serverStations = [
  { name: "Cairo Central Station", id: "6a07f72d5175f779df23d173" },
  { name: "Aswan Station", id: "6a07f72d5175f779df23d18b" },
  { name: "Sohag", id: "69e9bc1f9781f85ddaf3d26d" },
  { name: "Akhmim", id: "69e9bc1f9781f85ddaf3d26e" },
  { name: "Kom Ombo", id: "69e9bb519781f85ddaf3d240" },
  { name: "Deir Mawas", id: "69e9bb519781f85ddaf3d230" },
  { name: "Mallawi", id: "69e9bb519781f85ddaf3d22f" },
  { name: "Tahta", id: "69e9bb519781f85ddaf3d235" },
  { name: "Assiut", id: "69e9bb519781f85ddaf3d231" },
  { name: "Abnoub", id: "69e9bb519781f85ddaf3d232" },
  { name: "Manfalut", id: "69e9bb519781f85ddaf3d233" },
  { name: "Giza", id: "69e9bbf49781f85ddaf3d24a" },
  { name: "Bashtil", id: "69e9bbf49781f85ddaf3d249" },
  { name: "Ismailia", id: "69e9bbf49781f85ddaf3d260" },
  { name: "Port Said", id: "69e9bbf49781f85ddaf3d261" },
  { name: "Luxor", id: "69e9bc1f9781f85ddaf3d274" },
  { name: "Edfu", id: "69e9bc1f9781f85ddaf3d276" }
];

const SearchBar = ({ onSearch }: Props) => {
  const [fromName, setFromName] = useState<string>("");
  const [toName, setToName] = useState<string>("");
  const [date, setDate] = useState<string>("");

  const handleSearch = () => {
    if (!fromName || !toName || !date) {
      alert("Please fill in all fields");
      return;
    }
    const fromStation = serverStations.find(s => s.name === fromName.trim());
    const toStation = serverStations.find(s => s.name === toName.trim());

    if (!fromStation || !toStation) {
      alert("Please select a valid station from the list");
      return;
    }

    localStorage.setItem("departureCity", fromName);
    localStorage.setItem("destinationCity", toName);
    localStorage.setItem("travelDate", date);

    onSearch({ 
      from: fromStation.id, 
      to: toStation.id, 
      date, 
      classType: "First Class" 
    });
  };

  return (
    <div className="bg-red-900 p-5 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-center shadow-xl">
      <input
        list="stations"
        value={fromName}
        onChange={(e) => setFromName(e.target.value)}
        placeholder="From"
        className="p-3 rounded-lg bg-white outline-none w-full md:w-auto text-gray-800"
      />
      <div className="w-[40px] h-[40px] rounded-[50%] bg-red-600 flex items-center justify-center text-white shrink-0"> 
        <FaArrowRight/>
      </div>
      <input
        list="stations"
        value={toName}
        onChange={(e) => setToName(e.target.value)}
        placeholder="To"
        className="p-3 rounded-lg bg-white outline-none w-full md:w-auto text-gray-800"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="p-3 rounded-lg bg-white px-8 outline-none w-full md:w-auto text-gray-800"
      />
      <button
        onClick={handleSearch}
        className="bg-red-600 text-white px-10 rounded-lg py-2 text-[20px] font-semibold hover:bg-red-700 transition-all"
      >
        Search
      </button>
      <datalist id="stations">
        {serverStations.map((station, i) => (
          <option key={i} value={station.name} />
        ))}
      </datalist>
    </div>
  );
};

export default SearchBar;