import React, { useRef, useEffect, useState } from 'react'; 
import { useTranslation } from "react-i18next";
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import axios from 'axios';
import type { MyBookingsProps } from "./types";

interface TicketInfo {
  ticketId: string;
  trainName: string;
  userName: string;
  date: string;
  seat: string;
  price: string;
  from: string;
  to: string;
}

const MyBookings: React.FC<MyBookingsProps> = ({ onBack, theme }) => {
  const { t } = useTranslation();
  const ticketRef = useRef<HTMLDivElement>(null);

  const [ticketData, setTicketData] = useState<TicketInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        setLoading(true);
        // استبدل هذا الرابط برابط الـ API الخاص بك
        const response = await axios.get('https://api.example.com/user/last-ticket');
        
        if (response.data) {
          setTicketData(response.data);
          setError(null);
        }
      } catch (err) {
        console.error("API Error:", err);
        // محاولة جلب آخر بيانات مخزنة محلياً في حالة فشل الـ API
        const saved = localStorage.getItem("lastTicket");
        if (saved) {
          setTicketData(JSON.parse(saved));
        } else {
          setError("لا توجد بيانات تذكرة متاحة حالياً");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTicketData();
  }, []);

  const handleDownloadPDF = async () => {
    const element = ticketRef.current;
    if (!element || !ticketData) return;

    try {
      // إعدادات محسنة لضمان جودة التصوير وتفادي أخطاء المكتبة
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: theme === 'dark' ? '#252525' : '#f5f5f5',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // إضافة التذكرة للـ PDF مع ترك مساحة بسيطة من الأعلى
      pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, imgHeight);
      pdf.save(`ENR-Ticket-${ticketData.ticketId}.pdf`);
    } catch (err) {
      console.error("PDF Download Error:", err);
      alert("حدث خطأ أثناء استخراج ملف الـ PDF، يرجى المحاولة مرة أخرى.");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ENR Ticket',
          text: `تذكرة قطار ENR - من ${ticketData?.from} إلى ${ticketData?.to}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share failed:", err);
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center dark:bg-[#1a1a1a]">
      <div className="text-center dark:text-white text-2xl font-bold animate-pulse">
        جاري جلب بيانات التذكرة...
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen mt-16 ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Header */}
      <div className="bg-red-800 text-[35px] p-[25px] text-white font-bold relative flex justify-center items-center">
        <span>{t("Your ticket")}</span>
        {onBack && (
          <button className="absolute left-[30px]" onClick={onBack}>
            <i className="fa-solid fa-arrow-left"></i>
          </button>
        )}
      </div>

      {ticketData ? (
        <>
          {/* Ticket Card Container */}
          <div ref={ticketRef} className="max-w-[1170px] mx-auto bg-[#f5f5f5] dark:bg-[#252525] rounded-[30px] overflow-hidden mt-10 border border-[#9c2121a8] shadow-[inset_0_0_5px_1px_#e56510]">
            <div className="bg-[#c70505fc] p-[50px_20px] text-white text-center">
              <div className="text-[30px] font-bold italic">ENR Tickets</div>
              <div className="flex justify-between items-center mt-12 px-10 text-[25px]">
                <span>{ticketData.from}</span>
                <i className="fa-solid fa-arrow-right"></i>
                <span>{ticketData.to}</span>
              </div>
            </div>

            <div className="border-y-[3px] border-dashed border-black dark:border-white m-[50px_30px] flex justify-center py-10">
              <QRCodeSVG value={ticketData.ticketId} size={150} />
            </div>

            <div className="mx-[30px] space-y-2 pb-10">
              <div className="flex justify-between font-bold text-[22px] py-4 border-b dark:border-gray-700">
                <span className="text-[#877878]">{t("Passenger Name")}</span>
                <span className="dark:text-white">{ticketData.userName}</span>
                <span className="text-red-600 font-sans">{t("train_ar")}</span>
              </div>
              <div className="flex justify-between font-bold text-[22px] py-4 border-b dark:border-gray-700">
                <span className="text-[#877878]">{t("train")}</span>
                <span className="dark:text-white">{ticketData.trainName}</span>
                <span className="text-red-600 font-sans">{t("train_ar")}</span>
              </div>
              <div className="flex justify-between font-bold text-[22px] py-4 border-b dark:border-gray-700">
                <span className="text-[#877878]">{t("Date / Seat")}</span>
                <span className="dark:text-white">
                    {`${ticketData.date} | ${ticketData.seat}`}
                </span>
                <span className="text-red-600 font-sans">{t("train_ar")}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="max-w-[1170px] mx-auto m-10 flex justify-center gap-6 pb-10">
            <button 
              onClick={handleDownloadPDF} 
              className="bg-[#c70505fc] text-white p-4 rounded-xl flex-1 text-2xl font-bold transition-transform active:scale-95 shadow-lg"
            >
              {t("download")}
            </button>
            <button 
              onClick={handleShare} 
              className="bg-black text-white p-4 rounded-xl flex-1 text-2xl font-bold transition-transform active:scale-95 shadow-lg"
            >
              {t("share")}
            </button>
          </div>
        </>
      ) : (
        <div className="text-center mt-20 p-10 bg-gray-100 dark:bg-[#2d2d2d] mx-auto max-w-md rounded-xl shadow-md">
            <p className="text-gray-500 dark:text-gray-400 text-xl font-bold italic">{error}</p>
        </div>
      )}
    </div>
  );
};

export default MyBookings;