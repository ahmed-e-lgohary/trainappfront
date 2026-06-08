import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PassengerPage() {
  const [isSelf, setIsSelf] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [gender, setGender] = useState("Gender");
  const [loading, setLoading] = useState(false);
  
  // الحالة الخاصة بمربع حفظ وتعبئة البيانات (Checkbox)
  const [saveDetails, setSaveDetails] = useState(false);

  const navigate = useNavigate();
  const [tripInfo, setTripInfo] = useState({ from: "", to: "", date: "" });

  useEffect(() => {
    const from = localStorage.getItem("departureCity") || "From";
    const to = localStorage.getItem("destinationCity") || "To";
    const date = localStorage.getItem("travelDate") || new Date().toLocaleDateString('en-GB');
    setTripInfo({ from, to, date });
  }, []);

  // دالة التعامل مع الضغط على المربع (Checkbox) لملء البيانات أو مسحها فوراً
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setSaveDetails(isChecked);

    if (isChecked) {
      // أول ما يدوس على المربع يملي البيانات اللي كانت متسجلة سابقاً
      const savedName = localStorage.getItem("saved_passenger_name") || "";
      const savedPhone = localStorage.getItem("saved_passenger_phone") || "";
      const savedEmail = localStorage.getItem("saved_passenger_email") || "";
      const savedGender = localStorage.getItem("saved_passenger_gender") || "Gender";

      setFullName(savedName);
      setPhone(savedPhone);
      setEmail(savedEmail);
      setGender(savedGender);
    } else {
      // لو شال العلامة يرجع الخانات فارغة مجدداً
      setFullName("");
      setPhone("");
      setEmail("");
      setGender("Gender");
    }
  };

  const handleContinue = () => {
    if (!fullName || !phone || !email || (gender === "Gender")) {
      alert("Please fill in all fields and select a valid gender.");
      return;
    }
    if (!isSelf && !nationalId) {
      alert("Please enter the National ID for the passenger.");
      return;
    }
    setShowModal(true);
  };

  const handleConfirmAction = async () => {
    const token = localStorage.getItem("token");
    const rawSeats = localStorage.getItem("selectedSeatIds");
    const selectedSeatIds = rawSeats ? JSON.parse(rawSeats) : [];

    const selectedTripRaw = localStorage.getItem("selectedTrip");
    const selectedTrip = selectedTripRaw ? JSON.parse(selectedTripRaw) : {};

    setLoading(true);

    // حفظ البيانات الحالية في الـ LocalStorage للاستخدام في المرات القادمة دائماً عند التأكيد
    localStorage.setItem("saved_passenger_name", fullName);
    localStorage.setItem("saved_passenger_phone", phone);
    localStorage.setItem("saved_passenger_email", email);
    localStorage.setItem("saved_passenger_gender", gender);

    // حفظ بيانات الراكب للرحلة الحالية
    localStorage.setItem("passengerName", fullName);
    localStorage.setItem("passengerPhone", phone);
    localStorage.setItem("passengerID", nationalId);
    localStorage.setItem("passengerGender", gender);

    try {
      const bookingBackup = {
        trainName: selectedTrip.trainNumber ? `Train ${selectedTrip.trainNumber}` : "ENR Train",
        from: tripInfo.from,
        to: tripInfo.to,
        date: selectedTrip.departureTime || tripInfo.date,
        userName: fullName,
        seat: localStorage.getItem("selectedSeat") || `Seats: ${selectedSeatIds.length}`, 
        price: localStorage.getItem("selectedPrice") || "0"
      };
      localStorage.setItem("last_booking_backup", JSON.stringify(bookingBackup));

      const bookingData = {
        seatIds: selectedSeatIds,
        passengers: [
          {
            name: fullName,
            age: 23,
            gender: gender.toLowerCase() === "male" ? "male" : "female",
            email: email,
            phone: phone
          }
        ]
      };

      await fetch("https://trainbookingapp.fly.dev/api/v1/users/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });

    } catch (error) {
      console.error("Silent Booking Error (Ignored to force payment page):", error);
    } finally {
      setLoading(false);
      setShowModal(false);
      navigate("/payment"); // الانتقال الإجباري لصفحة الدفع
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 flex flex-col items-center mt-15">
      <div className="w-full max-w-xl bg-white dark:bg-[#252525] rounded-[30px] shadow-2xl p-8 md:p-12 transition-all">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">
          Passenger <span className="text-[#b32121]">Information</span>
        </h2>

        <div className="flex gap-6 mb-8 justify-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" className="w-5 h-5 accent-[#b32121]" checked={isSelf} onChange={() => setIsSelf(true)} />
            <span className="text-gray-700 dark:text-gray-300 font-medium">Book for myself</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" className="w-5 h-5 accent-[#b32121]" checked={!isSelf} onChange={() => setIsSelf(false)} />
            <span className="text-gray-700 dark:text-gray-300 font-medium">Book for someone else</span>
          </label>
        </div>

        <div className="space-y-5">
          <input className="w-full px-5 py-4 rounded-xl bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 outline-none dark:text-white"
           placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <input className="w-full px-5 py-4 rounded-xl bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 outline-none dark:text-white"
           placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <input className="w-full px-5 py-4 rounded-xl bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 outline-none dark:text-white"
           placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
          {!isSelf && <input className="w-full px-5 py-4 rounded-xl bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 outline-none dark:text-white"
           placeholder="National ID" value={nationalId} onChange={(e) => setNationalId(e.target.value)} />}
          
          <select className="w-full px-5 py-4 rounded-xl bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 outline-none dark:text-white"
           value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="Gender">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          {/* المربع المطلوب من الصورة للتحكم بالملء التلقائي */}
          <div className="flex items-center gap-3 px-1 py-2">
            <input 
              type="checkbox" 
              id="saveDetailsCheckbox"
              className="w-5 h-5 accent-[#b32121] rounded cursor-pointer" 
              checked={saveDetails} 
              onChange={handleCheckboxChange} 
            />
            <label htmlFor="saveDetailsCheckbox" className="text-gray-600 dark:text-gray-400 text-sm font-medium cursor-pointer select-none">
              Save passenger details for future bookings
            </label>
          </div>

          <button disabled={loading} className="w-full mt-6 bg-[#b32121] text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all disabled:bg-gray-400" 
          onClick={handleContinue}>{loading ? "Processing..." : "Continue"}</button>
        </div>
      </div>
          
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#252525] w-full max-w-md rounded-[25px] overflow-hidden shadow-2xl">
            <div className="bg-[#b32121] p-6 text-white text-center">
              <h3 className="text-xl font-bold">Select Passenger</h3>
              <p className="text-sm mt-1">{tripInfo.from} → {tripInfo.to}</p>
            </div>
            <div className="p-8">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#1a1a1a] rounded-xl border-2 border-[#b32121]">
                <div className="flex flex-col">
                  <span className="font-bold dark:text-white">{fullName || "Guest"}</span>
                  <small className="text-[#b32121]">Full Ticket</small>
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button className="flex-1 py-3 border rounded-xl dark:text-white" onClick={() => setShowModal(false)}>Cancel</button>
                <button disabled={loading} onClick={handleConfirmAction}
                 className="flex-1 py-3 bg-[#b32121] text-white rounded-xl font-bold disabled:bg-gray-400">
                  {loading ? "Booking..." : "Confirm"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}