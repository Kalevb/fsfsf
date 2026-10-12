import React from 'react';

export default function Loading({ message = 'กำลังดึงข้อมูลจากศูนย์สืบสวนคดีฉ้อโกงออนไลน์...' }) {
  return (
    <div className="ofic-card p-10 flex flex-col items-center justify-center text-center my-4">
      <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-[#2563EB] animate-spin mb-4"></div>
      <p className="text-[#1E3A8A] font-medium text-base">{message}</p>
      <p className="text-slate-500 text-xs mt-1">ระบบกำลังเชื่อมต่อฐานข้อมูล Firebase Realtime Database</p>
    </div>
  );
}
