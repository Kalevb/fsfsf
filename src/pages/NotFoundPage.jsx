// หน้าไม่พบหน้าที่ค้นหา (404 Not Found)
import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F2359] via-[#1E3A8A] to-[#2563EB] flex items-center justify-center p-6">
      <div className="ofic-card max-w-lg w-full p-8 sm:p-10 text-center bg-white space-y-5">
        <div className="w-20 h-20 rounded-3xl bg-blue-100 text-[#1E3A8A] flex items-center justify-center text-4xl mx-auto">
          <i className="bi bi-Compass"></i>
        </div>
        <div>
          <div className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">
            ERROR 404 • PAGE NOT FOUND
          </div>
          <h1 className="text-2xl font-bold text-[#111827] mt-1">
            ไม่พบหน้าที่คุณกำลังค้นหา
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            ลิงก์ที่คุณเข้าถึงอาจถูกย้ายหรือไม่มีอยู่ในแผนผังเว็บไซต์ (Sitemap) ของศูนย์สืบสวนคดีฉ้อโกงออนไลน์
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link to="/" className="ofic-btn ofic-btn-primary">
            <i className="bi bi-house-door-fill"></i>
            <span>กลับสู่หน้าหลัก (Landing)</span>
          </Link>
          <Link to="/login" className="ofic-btn ofic-btn-outline">
            <i className="bi bi-lock-fill"></i>
            <span>เข้าสู่ระบบ</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
