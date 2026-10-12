// แถบด้านบน (Topbar) แสดงชื่อหน้า การแจ้งเตือนแบบ Realtime และปุ่มแฮมเบอร์เกอร์บนมือถือ
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { markNotificationAsRead } from '../../services/userService';
import { formatThaiDate } from '../../utils/format';

export default function Topbar({ onOpenSidebar, title = 'ศูนย์สืบสวนคดีฉ้อโกงออนไลน์' }) {
  const { user, notifications } = useAuth();
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleNotificationClick = async (notif) => {
    if (user?.uid && notif.notificationId) {
      await markNotificationAsRead(user.uid, notif.notificationId);
    }
    setShowNotifDropdown(false);
    if (notif.caseId) {
      navigate(`/cases/${notif.caseId}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-blue-200 px-4 lg:px-8 h-16 flex items-center justify-between gap-4 shadow-xs">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="lg:hidden w-10 h-10 rounded-xl bg-blue-50 text-[#1E3A8A] border border-blue-200 flex items-center justify-center text-xl cursor-pointer"
          aria-label="เปิดเมนูนำทาง"
        >
          <i className="bi bi-list"></i>
        </button>

        <div className="flex items-center gap-2.5 min-w-0">
          <span className="hidden sm:inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-[#1E3A8A]">
            <i className="bi bi-shield-check"></i>
          </span>
          <h1 className="text-base sm:text-lg font-bold text-[#1E3A8A] truncate m-0">
            {title}
          </h1>
        </div>
      </div>

      {/* ด้านขวา: ปุ่มแจ้งเตือน + โปรไฟล์ */}
      <div className="flex items-center gap-3 shrink-0">
        {user?.role === 'victim' && (
          <Link
            to="/victim/submit-case"
            className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1E3A8A] text-white text-xs font-medium no-underline transition-colors shadow-xs"
          >
            <i className="bi bi-plus-circle"></i>
            <span>แจ้งเหตุคดีใหม่</span>
          </Link>
        )}

        {/* กระดิ่งแจ้งเตือน Realtime */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifDropdown((prev) => !prev)}
            className="relative w-10 h-10 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#1E3A8A] border border-blue-200 flex items-center justify-center cursor-pointer transition-colors"
            title="การแจ้งเตือน"
          >
            <i className="bi bi-bell-fill text-base"></i>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-blue-200 overflow-hidden z-50">
              <div className="bg-[#1E3A8A] text-white px-4 py-3 flex items-center justify-between">
                <span className="font-semibold text-sm flex items-center gap-2">
                  <i className="bi bi-bell"></i>
                  <span>การแจ้งเตือนล่าสุด ({notifications.length})</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowNotifDropdown(false)}
                  className="text-blue-200 hover:text-white text-sm"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">
                    ยังไม่มีรายการแจ้งเตือนใหม่
                  </div>
                ) : (
                  notifications.map((n) => (
                    <button
                      key={n.notificationId}
                      type="button"
                      onClick={() => handleNotificationClick(n)}
                      className={`w-full text-left p-3.5 hover:bg-blue-50/80 transition-colors block cursor-pointer ${
                        !n.isRead ? 'bg-blue-50/40' : 'bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-xs text-[#1E3A8A]">{n.title}</span>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          {formatThaiDate(n.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 mb-0 line-clamp-2">{n.message}</p>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* ข้อมูลบัญชีผู้ใช้ */}
        <Link
          to={user?.role === 'victim' ? '/victim/profile' : '/officer/settings'}
          className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl bg-blue-50/70 hover:bg-blue-100/80 border border-blue-200 text-[#1E3A8A] no-underline transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-[#1E3A8A] text-white flex items-center justify-center font-semibold text-xs">
            {(user?.name || 'U').slice(0, 1)}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-[#111827] leading-tight">
              {user?.name || 'ผู้ใช้งาน'}
            </div>
            <div className="text-[10px] text-blue-700 leading-tight">
              {user?.role === 'admin'
                ? 'ผู้ดูแลระบบ'
                : user?.role === 'officer'
                  ? 'เจ้าหน้าที่สืบสวน'
                  : 'ผู้เสียหาย'}
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
}
