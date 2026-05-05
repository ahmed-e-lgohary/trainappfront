import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Seat from "./Seats"; 

interface APISeat {
  seatId: string;
  number: number;
  status: string;
  price: number;
  row: number;
  position: string;
}

export default function Chair(): React.ReactElement {
  const navigate = useNavigate();
  const { tripId } = useParams<{ tripId: string }>();
  const [seats, setSeats] = useState<APISeat[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const pricePerSeat = Number(localStorage.getItem("selectedTrainPrice")) || 0;

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const token = localStorage.getItem('token');
        const idToUse = tripId || "69ea74eec2277ffb0258eafd";
        
        const response = await fetch(`https://trainbookingapp.fly.dev/api/v1/users/trips/${idToUse}/seats`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const resData = await response.json();
        if (resData.success && resData.data.seats) {
          setSeats(resData.data.seats);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSeats();
  }, [tripId]);

  const toggleSeat = (num: number): void => {
    const seat = seats.find(s => s.number === num);
    if (!seat || seat.status === "booked") return;
    setSelected(prev => prev.includes(num) ? prev.filter(s => s !== num) : [...prev, num]);
  };

  const handleConfirm = () => {
    if (selected.length === 0) return;

    const selectedFullIds = seats
      .filter(s => selected.includes(s.number))
      .map(s => s.seatId);

    const seatsString = selected.sort((a, b) => a - b).map(s => `Seat ${s}`).join(", ");
    
    localStorage.setItem("selectedSeatIds", JSON.stringify(selectedFullIds));
    localStorage.setItem("selectedSeat", `COACH 01 - ${seatsString}`);
    localStorage.setItem("selectedPrice", (selected.length * pricePerSeat).toString());

    navigate("/passenger");
  };

  const renderRows = () => {
    const rows: React.ReactElement[] = [];
    const groupedSeats: { [key: number]: APISeat[] } = {};
    
    seats.forEach(seat => {
      const r = seat.row || 1;
      if (!groupedSeats[r]) groupedSeats[r] = [];
      groupedSeats[r].push(seat);
    });

    Object.keys(groupedSeats).sort((a, b) => Number(a) - Number(b)).forEach((rowNum) => {
      const rowSeats = groupedSeats[Number(rowNum)].sort((a, b) => a.number - b.number);
      rows.push(
        <div key={rowNum} className="flex items-center justify-between mb-2 w-full max-w-[350px] mx-auto">
          <div className="flex gap-1">
            {rowSeats.slice(0, 2).map(s => (
              <Seat key={s.seatId} number={s.number} status={s.status === "booked" ? "booked" : selected.includes(s.number) ? "selected" : "available"} onClick={() => toggleSeat(s.number)} />
            ))}
          </div>
          <div className="text-[10px] text-gray-300 font-bold uppercase rotate-90">Aisle</div>
          <div className="flex gap-1">
            {rowSeats.slice(2, 4).map(s => (
              <Seat key={s.seatId} number={s.number} status={s.status === "booked" ? "booked" : selected.includes(s.number) ? "selected" : "available"} onClick={() => toggleSeat(s.number)} />
            ))}
          </div>
        </div>
      );
    });
    return rows;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-['Cairo'] mt-15">
      <header className="bg-red-800 text-white p-6 rounded-b-[30px] shadow-lg">
        <div className="flex justify-between items-center">
          <button onClick={() => navigate(-1)} className="p-2 bg-white/10 rounded-full">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <h1 className="text-xl font-black italic">COACH 01</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <div className="w-full max-w-md m-auto py-10 bg-white mt-2 flex justify-center items-center px-4">
          <div className="flex items-center"><div className="w-5 h-5 bg-white border border-gray-700"></div><h2 className="ml-2 mr-6">Available</h2></div>
          <div className="flex items-center"><div className="w-5 h-5 bg-red-600 border border-gray-700"></div><h2 className="ml-2 mr-6">Selected</h2></div>
          <div className="flex items-center"><div className="w-5 h-5 bg-black border border-gray-700"></div><h2 className="ml-2">Booked</h2></div>
      </div>

      <div className="flex-grow overflow-y-auto p-4 bg-gray-50/50 mt-4 shadow-inner">
        <div className="flex flex-col items-center">
           {loading ? <div className="mt-10 font-bold text-gray-400">Loading Seats...</div> : renderRows()}
        </div>
      </div>

      <div className="p-6 bg-white border-t border-gray-100 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm font-bold text-gray-300">Selected: <span className="text-[#b32121]">{selected.length}</span></div>
          <div className="text-xl font-black">{selected.length * pricePerSeat} EGP</div>
        </div>
        <button disabled={selected.length === 0} onClick={handleConfirm} className="w-full py-4 bg-[#b32121] disabled:bg-gray-300 text-white font-black rounded-2xl shadow-xl transition-all active:scale-95 uppercase">Confirm Booking</button>
      </div>
    </div>
  );
}