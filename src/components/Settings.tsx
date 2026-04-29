import React, { useEffect, useState } from "react";

const Settings = () => {
  const [enabled, setEnabled] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved === "true"; 
  });

  const [isArabic, setIsArabic] = useState(() => {
    const savedLang = localStorage.getItem("language");
    return savedLang === "ar";
  });

  // قاموس الكلمات (عشان يترجم فعلياً)
  const translations = {
    en: {
      title: "Settings",
      darkMode: "Dark Mode",
      language: "Language",
      statusOn: "On",
      statusOff: "Off",
      langName: "English"
    },
    ar: {
      title: "الإعدادات",
      darkMode: "الوضع الليلي",
      language: "اللغة",
      statusOn: "تشغيل",
      statusOff: "إيقاف",
      langName: "العربية"
    }
  };

  const t = isArabic ? translations.ar : translations.en;

  useEffect(() => {
    if (enabled) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [enabled]);

  useEffect(() => {
    if (isArabic) {
      document.dir = "rtl";
      localStorage.setItem("language", "ar");
    } else {
      document.dir = "ltr";
      localStorage.setItem("language", "en");
    }
  }, [isArabic]);

  return (
    <div className="w-[75%] m-auto mt-16 transition duration-300 h-[100vh]">
      <h1 className="text-[35px] font-bold dark:text-white mb-5">{t.title}</h1>
      
      <div className="flex items-center justify-between pt-10">
        <h2 className="text-[30px] font-bold !text-[#5f5f5f] dark:text-white">
          {t.darkMode}
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-sm !text-black dark:text-white">
            {enabled ? t.statusOn : t.statusOff}
          </span>
          <div
            onClick={() => setEnabled((prev) => !prev)}
            className={`w-[50px] h-[20px] border-[2px] rounded-full cursor-pointer flex items-center px-[2px] transition duration-300 ${enabled ? "bg-green-500 border-green-500" : "bg-gray-300 border-gray-600"}`}
          >
            <div className={`w-[18px] h-[16px] bg-white rounded-full transition duration-300 ${enabled ? "translate-x-[26px]" : "translate-x-0"}`}></div>
          </div>
        </div>
      </div>
      
      <div className="w-full h-[1px] bg-[#ccc] mt-4 dark:bg-gray-600"></div>

      <div className="flex items-center justify-between pt-5">
        <h2 className="text-[30px] font-bold !text-[#5f5f5f] dark:text-white mt-5">
          {t.language}
        </h2>
        <div className="flex items-center gap-3 mt-5">
          <span className="text-sm !text-black dark:text-white">
            {t.langName}
          </span>
          <div
            onClick={() => setIsArabic((prev) => !prev)}
            className={`w-[50px] h-[20px] border-[2px] rounded-full cursor-pointer flex items-center px-[2px] transition duration-300 ${isArabic ? "bg-[#b30606] border-[#b30606]" : "bg-gray-300 border-gray-600"}`}
          >
            <div className={`w-[18px] h-[16px] bg-white rounded-full transition duration-300 ${isArabic ? "translate-x-[26px]" : "translate-x-0"}`}></div>
          </div>
        </div>
      </div>

      <div className="w-full h-[1.5px] bg-[#ccc] mt-4 dark:bg-gray-600"></div>
    </div>
  );
};

export default Settings;