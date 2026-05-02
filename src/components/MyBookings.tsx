import React, { useRef, useEffect, useState } from 'react'; 
import { useTranslation } from "react-i18next";
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface MyBookingsProps {
  theme: string;
  onBack?: () => void | Promise<void>;
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
}

const MyBookings = ({ theme, onBack }: MyBookingsProps) => {
  const { t } = useTranslation();
  const ticketRef = useRef<HTMLDivElement>(null);
  const [ticketData, setTicketData] = useState<TicketData | null>(null);

  useEffect(() => {
    const from = localStorage.getItem("departureCity") || "From";
    const to = localStorage.getItem("destinationCity") || "To";
    const train = localStorage.getItem("selectedTrainName") || "ENR Train";
    const date = localStorage.getItem("travelDate") || "Not Set";
    const seat = localStorage.getItem("selectedSeat") || "Pending";
    const price = localStorage.getItem("selectedPrice") || "150";
    const name = localStorage.getItem("passengerName") || "Guest";

    setTicketData({
      ticketId: "ENR-" + Math.floor(100000 + Math.random() * 900000),
      trainName: train,
      userName: name,
      date: date,
      seat: seat,
      price: price,
      from: from,
      to: to
    });
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
    const width = 190;
    const height = (canvas.height * width) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 10, 10, width, height);
    pdf.save(`Ticket-${ticketData.ticketId}.pdf`);
  };

  // دالة الشير
  const handleShare = async () => {
    if (navigator.share && ticketData) {
      try {
        await navigator.share({
          title: 'ENR Train Ticket',
          text: `Ticket for ${ticketData.userName}\nTrain: ${ticketData.trainName}\nFrom: ${ticketData.from} To: ${ticketData.to}\nDate: ${ticketData.date}\nSeat: ${ticketData.seat}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      alert("Sharing is not supported on this browser");
    }
  };

  if (!ticketData) return null;

  return (
    <div className={`min-h-screen mt-16 ${theme === 'dark' ? 'dark bg-[#1a1a1a]' : 'bg-white'}`}>
      <div className="bg-red-800 text-[35px] p-[25px] text-white font-bold text-center flex justify-between items-center px-10">
        <button onClick={onBack} className="text-white text-2xl">
           <i className="fa-solid fa-chevron-left"></i>
        </button>
        <span className="flex-grow">{t("Your ticket")}</span>
        <div className="w-8"></div> 
      </div>

      <div className="p-4">
        <div className="max-w-[1170px] mx-auto">
          <div ref={ticketRef} className="bg-[#f5f5f5] dark:bg-[#252525] rounded-[30px] overflow-hidden mt-10 border border-[#9c2121a8] shadow-xl">
            <div className="bg-[#c70505fc] p-[50px_20px] text-white text-center">
              <div className="text-[30px] font-bold italic">ENR Tickets</div>
              <div className="flex justify-between items-center mt-12 px-10 text-[25px]">
                <span className="uppercase">{ticketData.from}</span>
                <i className="fa-solid fa-arrow-right"></i>
                <span className="uppercase">{ticketData.to}</span>
              </div>
            </div>

            <div className="border-y-[3px] border-dashed border-black dark:border-white m-[50px_30px] flex justify-center py-10">
              <QRCodeSVG value={ticketData.ticketId} size={150} />
            </div>

            <div className="mx-[30px] space-y-2 pb-10">
              <div className="flex justify-between font-bold text-[22px] py-4 border-b dark:border-gray-700">
                <span className="text-[#877878]">Passenger Name</span>
                <span className="dark:text-white uppercase">{ticketData.userName}</span>
              </div>
              <div className="flex justify-between font-bold text-[22px] py-4 border-b dark:border-gray-700">
                <span className="text-[#877878]">Train Name</span>
                <span className="dark:text-white">{ticketData.trainName}</span>
              </div>
              <div className="flex justify-between font-bold text-[22px] py-4 border-b dark:border-gray-700">
                <span className="text-[#877878]">Date / Seat</span>
                <span className="dark:text-white">{ticketData.date} | {ticketData.seat}</span>
              </div>
              <div className="flex justify-between font-bold text-[22px] py-4 border-b dark:border-gray-700">
                <span className="text-[#877878]">Price</span>
                <span className="dark:text-white text-green-600 font-extrabold">{ticketData.price} EGP</span>
              </div>
            </div>
          </div>

          {/* الأزرار جنب بعض */}
          <div className="m-10 flex flex-col md:flex-row justify-center gap-6 pb-10">
            <button 
              onClick={handleDownloadPDF}
              className="flex-1 bg-[#c70505fc] text-white p-4 rounded-xl text-2xl font-bold flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg"
            >
              <i className="fa-solid fa-download"></i> {t("Download")}
            </button>

            <button 
              onClick={handleShare}
              className="flex-1 bg-black text-white p-4 rounded-xl text-2xl font-bold flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg"
            >
              <i className="fa-solid fa-share-nodes"></i> {t("Share")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBookings;