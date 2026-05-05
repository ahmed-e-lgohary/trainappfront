import React, { useRef, useEffect, useState } from 'react'; 
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useNavigate } from 'react-router-dom';

interface SeatInfo {
  number: number;
}

interface BookingData {
  _id: string;
  totalPrice?: number;
  createdAt?: string;
  seats?: SeatInfo[];
  passengers?: { name: string }[];
  tripId?: {
    departureTime?: string;
    trainId?: { name: string };
    from?: { name: string };
    to?: { name: string };
  };
}

interface TicketData {
  ticketId: string;
  trainName: string;
  userName: string;
  date: string;
  seat: string;
  price: string;
  from: string;
  to: string;
  isBackup?: boolean;
}

interface MyBookingsProps {
  theme: string;
  onBack?: () => void;
}

const MyBookings = ({ theme, onBack }: MyBookingsProps) => {
  const navigate = useNavigate();
  const ticketRef = useRef<HTMLDivElement>(null);
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadFromBackup = () => {
    const backupRaw = localStorage.getItem("last_booking_backup");
    
    // جلب رقم الكرسي من صفحة الكراسي (selectedSeat) والتاريخ من صفحة البحث (travelDate)
    const storedSeatText = localStorage.getItem("selectedSeat") || "Assigned"; 
    const travelDate = localStorage.getItem("travelDate") || "TBD";

    if (backupRaw) {
      const data = JSON.parse(backupRaw);
      setTicketData({
        ticketId: "CONF-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        trainName: data.trainName,
        userName: data.userName,
        date: travelDate, 
        seat: storedSeatText, 
        price: data.price,
        from: data.from,
        to: data.to,
        isBackup: true
      });
    }
  };

  const fetchLastBooking = async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("https://trainbookingapp.fly.dev/api/v1/users/bookings", {
        method: "GET",
        headers: { 
          "Authorization": `Bearer ${token}`, 
          "Content-Type": "application/json",
          "Cache-Control": "no-cache" 
        }
      });
      
      const resData = await response.json();
      const bookings = resData.data || resData.bookings || [];

      if (resData.success && Array.isArray(bookings) && bookings.length > 0) {
        const sorted = bookings.sort((a: BookingData, b: BookingData) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        
        const last = sorted[0];
        setTicketData({
          ticketId: last._id,
          trainName: last.tripId?.trainId?.name || "ENR Train",
          userName: last.passengers?.[0]?.name || "Passenger",
          date: last.tripId?.departureTime 
            ? new Date(last.tripId.departureTime).toLocaleDateString('en-GB') 
            : (localStorage.getItem("travelDate") || "TBD"),
          seat: last.seats?.map((s: SeatInfo) => `Seat ${s.number}`).join(", ") || "N/A",
          price: last.totalPrice?.toString() || "0",
          from: last.tripId?.from?.name || "Departure",
          to: last.tripId?.to?.name || "Arrival",
          isBackup: false
        });
      } else {
        loadFromBackup();
      }
    } catch (err) {
      console.error("API Error:", err);
      loadFromBackup();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLastBooking();
  }, []);

  const handleDownloadPDF = async () => {
    if (!ticketRef.current || !ticketData) return;
    const canvas = await html2canvas(ticketRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: theme === 'dark' ? '#252525' : '#f5f5f5'
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(imgData, 'PNG', 10, 10, 190, (canvas.height * 190) / canvas.width);
    pdf.save(`Ticket-${ticketData.ticketId}.pdf`);
  };

  const handleShare = async () => {
    if (navigator.share && ticketData) {
      try {
        await navigator.share({
          title: 'ENR Train Ticket',
          text: `Ticket for ${ticketData.userName}\nFrom: ${ticketData.from} To: ${ticketData.to}\nDate:
           ${ticketData.date}\nSeat: ${ticketData.seat}`,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      alert("Sharing is not supported on this browser.");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center dark:bg-[#1a1a1a]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
    </div>
  );

  if (!ticketData) return (
    <div className="min-h-screen flex flex-col items-center justify-center dark:bg-[#1a1a1a] p-10 text-center">
      <i className="fa-solid fa-ticket-simple text-6xl text-gray-300 mb-6"></i>
      <h2 className="text-2xl font-bold dark:text-white">No active bookings found</h2>
      <button onClick={() => { setLoading(true); fetchLastBooking(); }} className="mt-6 bg-red-700
       text-white px-10 py-4 rounded-2xl font-bold">REFRESH DATA</button>
    </div>
  );

  return (
    <div className={`min-h-screen mt-16 ${theme === 'dark' ? 'dark bg-[#1a1a1a]' : 'bg-white'}`}>
      <div className="bg-red-800 text-[35px] p-[25px] text-white font-bold
       text-center flex justify-between items-center px-10">
        <button onClick={onBack} className="text-white text-2xl">
          <i className="fa-solid fa-chevron-left"></i></button>
        <span className="flex-grow">Ticket Details</span>
        <div className="w-8"></div> 
      </div>

      <div className="p-4 pb-20">
        <div className="max-w-[1170px] mx-auto">
          <div ref={ticketRef} className="bg-[#f5f5f5] dark:bg-[#252525] rounded-[30px]
           overflow-hidden mt-10 border border-[#9c2121a8] shadow-xl">
            <div className="bg-[#c70505fc] p-[50px_20px] text-white text-center">
              <div className="text-[30px] font-bold italic uppercase">ENR Tickets</div>
              <div className="flex justify-between items-center mt-12 px-10 text-[25px]">
                <span className="uppercase font-black">{ticketData.from}</span>
                <i className="fa-solid fa-arrow-right"></i>
                <span className="uppercase font-black">{ticketData.to}</span>
              </div>
            </div>

            <div className="border-y-[3px] border-dashed border-black
             dark:border-white m-[50px_30px] flex justify-center py-10">
              <QRCodeSVG value={ticketData.ticketId} size={150} includeMargin={true} />
            </div>

            <div className="mx-[30px] space-y-2 pb-10">
              <div className="flex justify-between font-bold text-[20px] py-4 border-b dark:border-gray-700">
                <span className="text-[#ff2121] text-[20px] font-bold uppercase text-sm">Passenger :</span>
                <span className="dark:text-white uppercase">{ticketData.userName}</span>
              </div>
              <div className="flex justify-between font-bold text-[20px] py-4 border-b dark:border-gray-700">
                <span className="text-[#ff2121] text-[20px] font-bold uppercase text-sm">Train Info :</span>
                <span className="dark:text-white">{ticketData.trainName}</span>
              </div>
              <div className="flex justify-between font-bold text-[20px] py-4 border-b dark:border-gray-700">
                <span className="text-[#ff2121] text-[20px] font-bold uppercase text-sm">Date :</span>
                <span className="dark:text-white">{ticketData.date} </span>
              </div>
              <div className="flex justify-between font-bold text-[20px] py-4 border-b dark:border-gray-700">
                <span className="text-[#ff2121] text-[20px] font-bold uppercase text-sm">Seat :</span>
                <span className="dark:text-white">{ticketData.seat}</span>
              </div>
              <div className="flex justify-between font-bold text-[20px] py-4">
                <span className="text-[#ff2121] text-[20px] font-bold uppercase text-sm">Total Price :</span>
                <span className="dark:text-white text-green-600 font-black">{ticketData.price} EGP</span>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col md:flex-row justify-center gap-6">
            <button onClick={handleDownloadPDF} className="flex-1 bg-[#c70505fc] text-white p-5 rounded-2xl
             text-xl font-bold flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-transform">
              <i className="fa-solid fa-file-pdf"></i> Download PDF
            </button>
            <button onClick={handleShare} className="flex-1 bg-black text-white p-5 rounded-2xl text-xl font-bold
             flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-transform">
              <i className="fa-solid fa-share-nodes"></i> Share Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBookings;