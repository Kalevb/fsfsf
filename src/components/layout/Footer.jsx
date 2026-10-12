// ส่วนท้ายเว็บไซต์ (Footer) ตรงตาม Wireframe Home 100% (4 คอลัมน์ พื้นหลังสีน้ำเงินเข้มทางการ)
import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#0B2154] text-white border-t border-blue-800">
      <div className="max-w-[1320px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-blue-800/80">
          {/* คอลัมน์ 1: โลโก้และคำอธิบายหน่วยงาน */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#2563EB] flex items-center justify-center font-bold text-lg text-white shadow-md">
                OF
              </div>
              <div>
                <div className="font-bold text-base text-white">
                  ศูนย์สืบสวนคดีฉ้อโกงออนไลน์
                </div>
                <div className="text-xs text-blue-200">
                  Online Fraud Investigation Center
                </div>
              </div>
            </div>
            <p className="text-xs text-blue-200/90 leading-relaxed max-w-sm">
              หน่วยงานภายใต้การกำกับของสำนักงานตำรวจแห่งชาติ
              มุ่งมั่นในการป้องกันและปราบปรามอาชญากรรมทางเทคโนโลยี
              เพื่อความปลอดภัยของประชาชน
            </p>
            <div className="flex items-center gap-2.5 pt-1">
              <a
                href="#social-fb"
                onClick={(e) => e.preventDefault()}
                className="w-9 h-9 rounded-lg bg-blue-900/70 border border-blue-700 flex items-center justify-center text-blue-200 hover:bg-[#2563EB] hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <i className="bi bi-facebook"></i>
              </a>
              <a
                href="#social-x"
                onClick={(e) => e.preventDefault()}
                className="w-9 h-9 rounded-lg bg-blue-900/70 border border-blue-700 flex items-center justify-center text-blue-200 hover:bg-[#2563EB] hover:text-white transition-colors"
                aria-label="X Twitter"
              >
                <i className="bi bi-twitter-x"></i>
              </a>
              <a
                href="#social-yt"
                onClick={(e) => e.preventDefault()}
                className="w-9 h-9 rounded-lg bg-blue-900/70 border border-blue-700 flex items-center justify-center text-blue-200 hover:bg-[#2563EB] hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <i className="bi bi-youtube"></i>
              </a>
              <a
                href="#social-line"
                onClick={(e) => e.preventDefault()}
                className="w-9 h-9 rounded-lg bg-blue-900/70 border border-blue-700 flex items-center justify-center text-blue-200 hover:bg-[#2563EB] hover:text-white transition-colors text-[10px] font-bold"
                aria-label="LINE"
              >
                LINE
              </a>
            </div>
          </div>

          {/* คอลัมน์ 2: เมนูลัด */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-semibold text-sm text-white">เมนูลัด</h4>
            <ul className="space-y-2 text-xs text-blue-200 list-disc list-inside">
              <li>
                <Link to="/" className="hover:text-white no-underline text-blue-200">
                  หน้าแรก
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white no-underline text-blue-200">
                  เกี่ยวกับระบบ
                </Link>
              </li>
              <li>
                <Link to="/victim/submit-case" className="hover:text-white no-underline text-blue-200">
                  คำถามที่พบบ่อย (FAQ)
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white no-underline text-blue-200">
                  นโยบายความเป็นส่วนตัว
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white no-underline text-blue-200">
                  เงื่อนไขการใช้งาน
                </Link>
              </li>
            </ul>
          </div>

          {/* คอลัมน์ 3: ข้อมูลติดต่อ */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-semibold text-sm text-white">ข้อมูลติดต่อ</h4>
            <div className="space-y-2.5 text-xs text-blue-200">
              <div className="flex items-start gap-2.5">
                <i className="bi bi-geo-alt-fill text-blue-400 mt-0.5"></i>
                <span>
                  สำนักงานตำรวจแห่งชาติ ถ.พระราม 1 แขวงปทุมวัน เขตปทุมวัน กรุงเทพฯ 10330
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <i className="bi bi-telephone-fill text-blue-400"></i>
                <span>สายด่วน 1441 (24 ชม.)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <i className="bi bi-envelope-fill text-blue-400"></i>
                <span>support@ofic.police.go.th</span>
              </div>
            </div>
          </div>

          {/* คอลัมน์ 4: ดาวน์โหลดแอป */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-semibold text-sm text-white">ดาวน์โหลดแอป</h4>
            <p className="text-xs text-blue-200 leading-relaxed">
              ติดตามสถานะคดีได้ง่ายขึ้น ผ่านแอปพลิเคชันมือถือ
            </p>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 pt-1">
              <div className="px-3.5 py-2 rounded-lg bg-black/80 border border-slate-700 flex items-center gap-2.5">
                <i className="bi bi-apple text-xl text-white"></i>
                <div className="leading-tight">
                  <div className="text-[9px] text-slate-300">Download on the</div>
                  <div className="text-xs font-semibold text-white">App Store</div>
                </div>
              </div>
              <div className="px-3.5 py-2 rounded-lg bg-black/80 border border-slate-700 flex items-center gap-2.5">
                <i className="bi bi-google-play text-lg text-emerald-400"></i>
                <div className="leading-tight">
                  <div className="text-[9px] text-slate-300">GET IT ON</div>
                  <div className="text-xs font-semibold text-white">Google Play</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 text-center text-xs text-blue-300">
          © 2026 ศูนย์สืบสวนคดีฉ้อโกงออนไลน์ (OFIC) สงวนลิขสิทธิ์ทุกประการ
        </div>
      </div>
    </footer>
  );
}
