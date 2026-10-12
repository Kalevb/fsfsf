// เมนูด้านข้าง (Sidebar) สีน้ำเงินเข้มทางการ รองรับทั้งผู้เสียหาย เจ้าหน้าที่ และแอดมิน
import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const victimMenus = [
    {
      to: '/victim/dashboard',
      icon: 'bi-grid-1x2-fill',
      label: 'แดชบอร์ดผู้เสียหาย'
    },
    {
      to: '/victim/submit-case',
      icon: 'bi-file-earmark-plus-fill',
      label: 'แจ้งเหตุคดีฉ้อโกง (5 ขั้นตอน)'
    },
    {
      to: '/victim/track-status',
      icon: 'bi-search',
      label: 'ติดตามสถานะคดี'
    },
    {
      to: '/victim/profile',
      icon: 'bi-person-Lines-fill',
      label: 'ข้อมูลส่วนตัว / โปรไฟล์'
    }
  ];

  const officerMenus = [
    {
      to: '/officer/dashboard',
      icon: 'bi-speedometer2',
      label: 'แดชบอร์ดเจ้าหน้าที่'
    },
    {
      to: '/officer/duplicates',
      icon: 'bi-fingerprint',
      label: 'ตรวจจับรายการซ้ำ'
    },
    {
      to: '/officer/victims',
      icon: 'bi-people-fill',
      label: 'รายชื่อผู้เสียหายทั้งหมด'
    },
    {
      to: '/officer/reports',
      icon: 'bi-bar-chart-line-fill',
      label: 'รายงานสถิติ (CSV)'
    },
    {
      to: '/officer/settings',
      icon: 'bi-sliders',
      label: 'ตั้งค่าระบบและโปรไฟล์'
    }
  ];

  if (user?.role === 'admin') {
    officerMenus.push({
      to: '/officer/users',
      icon: 'bi-person-gear',
      label: 'จัดการผู้ใช้งาน (Admin)'
    });
  }

  const menus = user?.role === 'victim' ? victimMenus : officerMenus;

  const handleLogoutClick = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      {/* ฉากหลังมืดบนมือถือเวลาเปิดเมนูแฮมเบอร์เกอร์ */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[280px] bg-gradient-to-b from-[#0F2359] via-[#1E3A8A] to-[#172E6E] text-white flex flex-col justify-between shrink-0 transition-transform duration-200 shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* โลโก้และชื่อระบบตาม Wireframe */}
          <div className="p-5 border-b border-blue-800/80 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 text-white no-underline">
              <div className="w-11 h-11 rounded-xl bg-[#2563EB] border border-blue-400/40 flex items-center justify-center font-bold text-lg shadow-md shrink-0">
                OF
              </div>
              <div>
                <div className="font-bold text-sm leading-tight">
                  ศูนย์สืบสวนคดีฉ้อโกงออนไลน์
                </div>
                <div className="text-[11px] text-blue-200 leading-tight mt-0.5">
                  Online Fraud Investigation Center
                </div>
              </div>
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden text-blue-200 hover:text-white text-xl"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          {/* ป้ายสถานะผู้ใช้งาน */}
          <div className="px-5 py-4 bg-blue-950/50 border-b border-blue-800/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600/40 border border-blue-400/50 flex items-center justify-center text-lg">
                <i
                  className={`bi ${
                    user?.role === 'victim' ? 'bi-person-check-fill' : 'bi-shield-shaded'
                  }`}
                ></i>
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold truncate">{user?.name || 'ผู้ใช้งาน'}</div>
                <div className="text-xs text-blue-300 truncate">
                  {user?.role === 'admin'
                    ? 'ผู้ดูแลระบบ (Admin)'
                    : user?.role === 'officer'
                      ? 'เจ้าหน้าที่สืบสวน (Officer)'
                      : 'ประชาชน / ผู้เสียหาย (Victim)'}
                </div>
              </div>
            </div>
          </div>

          {/* รายการเมนูนำทางตาม Sitemap */}
          <nav className="p-4 space-y-1.5">
            <div className="px-3 py-1.5 text-[11px] font-semibold text-blue-300 uppercase tracking-wider">
              เมนูระบบหลัก
            </div>
            {menus.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all no-underline ${
                    isActive
                      ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-950/50 border border-blue-400/40'
                      : 'text-blue-100 hover:bg-blue-800/60 hover:text-white'
                  }`
                }
              >
                <i className={`bi ${item.icon || 'bi-circle'} text-base`}></i>
                <span>{item.label}</span>
              </NavLink>
            ))}

            <div className="pt-4 mt-4 border-t border-blue-800/70">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-blue-300 uppercase tracking-wider">
                ทางลัด
              </div>
              <Link
                to="/"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-blue-200 hover:bg-blue-800/60 hover:text-white no-underline"
              >
                <i className="bi bi-house-door"></i>
                <span>กลับหน้าแรก (Landing)</span>
              </Link>
            </div>
          </nav>
        </div>

        {/* ส่วนท้าย Sidebar สายด่วน & ออกจากระบบ */}
        <div className="p-4 border-t border-blue-800/80 bg-blue-950/40 space-y-3">
          <div className="p-3 rounded-xl bg-blue-900/60 border border-blue-700/60 text-xs">
            <div className="font-semibold text-blue-200 flex items-center gap-1.5">
              <i className="bi bi-telephone-outbound-fill text-amber-400"></i>
              <span>สายด่วน AOC 1441</span>
            </div>
            <div className="text-blue-300 mt-0.5">ศูนย์ปฏิบัติการแก้ไขปัญหาอาชญากรรมออนไลน์ 24 ชม.</div>
          </div>

          <button
            type="button"
            onClick={handleLogoutClick}
            className="w-full py-2.5 px-4 rounded-xl bg-red-600/90 hover:bg-red-600 text-white text-sm font-medium flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <i className="bi bi-box-arrow-right"></i>
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </aside>
    </>
  );
}
