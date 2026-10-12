// โครงสร้างหลักของหน้าภายในระบบ (Sidebar + Topbar + พื้นที่เนื้อหาสีน้ำเงินอ่อนตัดขาว + Footer)
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AppShell({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#EAF2FF]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title={title} onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
        <footer className="py-4 px-6 bg-[#1E3A8A] text-blue-100 text-xs flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 ศูนย์สืบสวนคดีฉ้อโกงออนไลน์ (Online Fraud Investigation Center)</span>
          <span>สายด่วนแจ้งเหตุฉุกเฉิน AOC 1441 ตลอด 24 ชั่วโมง</span>
        </footer>
      </div>
    </div>
  );
}
