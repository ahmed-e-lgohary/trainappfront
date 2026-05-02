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

const serverStations: string[] = [
  "Cairo ", "Giza", "Bashtil", "Assiut", "Sohag", "Alexandria",
  "Luxor", "Aswan", "Benha", "Qena", "Nag Hammadi", 
  "Mallawi", "Minya", "Tahta", "Girga", "Edfu"
];

const SearchBar = ({ onSearch }: Props) => {
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [date, setDate] = useState<string>("");

  const handleSearch = () => {
    if (!from || !to || !date) {
      alert("Please fill in all fields");
      return;
    }

    // --- التعديل: حفظ بيانات البحث للوصول إليها في التذكرة ---
    localStorage.setItem("departureCity", from);
    localStorage.setItem("destinationCity", to);
    localStorage.setItem("travelDate", date);

    onSearch({ from, to, date, classType: "First Class" });
  };

  return (
    <div className="bg-red-900 p-5 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-center shadow-xl">
      <input
        list="stations"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        placeholder="From"
        className="p-3 rounded-lg bg-white outline-none w-full md:w-auto text-gray-800"
      />
      <div className="w-[40px] h-[40px] rounded-[50%] bg-red-600 flex items-center justify-center text-white shrink-0"> 
        <FaArrowRight/>
      </div>
      <input
        list="stations"
        value={to}
        onChange={(e) => setTo(e.target.value)}
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
          <option key={i} value={station} />
        ))}
      </datalist>
    </div>
  );
};

export default SearchBar;