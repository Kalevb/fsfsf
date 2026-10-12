// หน้าแจ้งเตือนไม่มีสิทธิ์เข้าถึง (/403 Forbidden)
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ForbiddenPage() {
  const { user } = useAuth();
  const backPath = user
    ? user.role === 'victim'
      ? '/victim/dashboard'
      : '/officer/dashboard'
    : '/';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F2359] via-[#1E3A8A] to-[#2563EB] flex items-center justify-center p-6">
      <div className="ofic-card max-w-lg w-full p-8 sm:p-10 text-center bg-white space-y-5">
        <div className="w-20 h-20 rounded-3xl bg-red-100 text-red-600 flex items-center justify-center text-4xl mx-auto">
          <i className="bi bi-shield-slash-fill"></i>
        </div>
        <div>
          <div className="text-xs font-bold text-red-600 uppercase tracking-wider">
            ERROR 403 • FORBIDDEN
          </div>
          <h1 className="text-2xl font-bold text-[#111827] mt-1">
            คุณไม่มีสิทธิ์เข้าถึงหน้านี้
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            หน้านี้ถูกจำกัดสิทธิ์เฉพาะบทบาทผู้ใช้งานที่ได้รับอนุญาตตามโครงสร้างความปลอดภัยของศูนย์สืบสวนคดีฉ้อโกงออนไลน์
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link to={backPath} className="ofic-btn ofic-btn-primary">
            <i className="bi bi-speedometer2"></i>
            <span>กลับสู่แดชบอร์ดของคุณ</span>
          </Link>
          <Link to="/" className="ofic-btn ofic-btn-outline">
            <i className="bi bi-house-door"></i>
            <span>หน้าแรก</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
