// หน้าแรก (Landing Page) สร้างตรงตามรูป Wireframe Home.png 100% ทุกองค์ประกอบ
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import { useAuth } from '../hooks/useAuth';
import { getSystemStats } from '../services/caseService';

export default function LandingPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalReported: 12458,
    resolvedCases: 7895,
    resolvedPercentage: 63.4,
    recoveredDamageMillions: 256.42,
    avgProcessingDays: 18
  });

  useEffect(() => {
    getSystemStats()
      .then((res) => {
        if (res?.landingStats) {
          setStats(res.landingStats);
        }
      })
      .catch(() => {});
  }, []);

  const submitRoute = user
    ? user.role === 'victim'
      ? '/victim/submit-case'
      : '/officer/dashboard'
    : '/login';

  const trackRoute = user
    ? user.role === 'victim'
      ? '/victim/track-status'
      : '/officer/dashboard'
    : '/login';

  return (
    <div className="min-h-screen flex flex-col bg-[#EAF2FF]">
      {/* 1. Top Navigation Bar ตาม Wireframe Home */}
      <header className="bg-white border-b border-blue-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-6">
          {/* โลโก้ OF + ชื่อระบบ */}
          <Link to="/" className="flex items-center gap-3.5 no-underline shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-[#1E3A8A] bg-gradient-to-br from-[#2563EB] to-[#1E3A8A] text-white flex items-center justify-center font-bold text-xl shadow-md">
              OF
            </div>
            <div>
              <div className="text-lg font-bold text-[#111827] leading-tight">
                ศูนย์สืบสวนคดีฉ้อโกงออนไลน์
              </div>
              <div className="text-xs text-slate-500 leading-tight mt-0.5">
                Online Fraud Investigation Center
              </div>
            </div>
          </Link>

          {/* ลิงก์เมนูตรงกลาง 3 รายการ + ปุ่มเข้าสู่ระบบขวาสุด */}
          <div className="flex items-center gap-6 lg:gap-8">
            <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
              <a
                href="#top"
                className="text-[#2563EB] font-semibold flex items-center gap-1.5 no-underline"
              >
                <i className="bi bi-house-door-fill"></i>
                <span>หน้าแรก</span>
              </a>
              <a
                href="#about-cases"
                className="text-slate-600 hover:text-[#1E3A8A] flex items-center gap-1.5 no-underline transition-colors"
              >
                <i className="bi bi-shield-check"></i>
                <span>เกี่ยวกับระบบ</span>
              </a>
              <a
                href="#contact-footer"
                className="text-slate-600 hover:text-[#1E3A8A] flex items-center gap-1.5 no-underline transition-colors"
              >
                <i className="bi bi-envelope"></i>
                <span>ติดต่อเรา</span>
              </a>
            </nav>

            {user ? (
              <Link
                to={user.role === 'victim' ? '/victim/dashboard' : '/officer/dashboard'}
                className="ofic-btn ofic-btn-primary h-11 px-5 text-sm shadow-md"
              >
                <i className="bi bi-speedometer2"></i>
                <span>ไปที่แดชบอร์ด</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="ofic-btn ofic-btn-primary h-11 px-6 text-sm shadow-md"
              >
                <i className="bi bi-lock-fill"></i>
                <span>เข้าสู่ระบบ</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section + แถบสถิติ + ส่วนเนื้อหาหลัก */}
      <main id="top" className="flex-1 landing-hero-bg pb-14">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
          {/* Hero 2 คอลัมน์ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-10">
            {/* ซ้าย: ข้อความและปุ่ม CTA */}
            <div className="lg:col-span-6 space-y-5">
              {/* แถบ ปลอดภัย • เชื่อถือได้ • เป็นความลับ */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-blue-200 text-xs font-medium text-[#1E3A8A] shadow-2xs">
                <i className="bi bi-shield-check text-[#2563EB]"></i>
                <span>ปลอดภัย</span>
                <span className="text-blue-400">•</span>
                <span>เชื่อถือได้</span>
                <span className="text-blue-400">•</span>
                <span>เป็นความลับ</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold leading-[1.22] tracking-tight m-0">
                <span className="text-[#0F2359] block">แจ้งเหตุคดีฉ้อโกงออนไลน์</span>
                <span className="text-[#1D4ED8] block mt-1">ได้ง่ายและปลอดภัย</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl m-0">
                ศูนย์กลางในการรับแจ้ง ตรวจสอบ และติดตามคดีฉ้อโกงออนไลน์
                <br className="hidden sm:inline" />
                โดยทีมผู้เชี่ยวชาญ เพื่อให้คุณได้รับความช่วยเหลืออย่างรวดเร็ว
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to={submitRoute}
                  className="ofic-btn ofic-btn-primary px-7 h-12 text-base font-semibold shadow-lg"
                >
                  <i className="bi bi-pencil-square"></i>
                  <span>แจ้งเหตุตอนนี้</span>
                </Link>

                <Link
                  to={trackRoute}
                  className="ofic-btn ofic-btn-outline px-7 h-12 text-base font-semibold bg-white"
                >
                  <i className="bi bi-graph-up"></i>
                  <span>ติดตามสถานะคดี</span>
                </Link>
              </div>
            </div>

            {/* ขวา: ภาพประกอบ Cyber Security Laptop & Shield ตาม Wireframe */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-[560px] py-4">
                {/* ฉากวงกลมเรืองแสงด้านหลัง */}
                <div className="w-full rounded-[26px] bg-gradient-to-br from-[#1E3A8A]/10 via-[#2563EB]/15 to-blue-200/40 p-6 sm:p-8 border border-blue-200/80 relative overflow-hidden">
                  {/* โล่โปร่งแสงด้านขวาตามภาพ */}
                  <div className="absolute -right-6 top-6 text-blue-300/35 text-[140px] leading-none pointer-events-none select-none">
                    <i className="bi bi-shield-lock-fill"></i>
                  </div>

                  {/* ตัวจำลองหน้าจอ Laptop + โล่แม่กุญแจ + มือถือตรวจสอบ */}
                  <div className="relative z-10 flex items-end justify-center gap-3 pt-4 pb-2">
                    {/* กล่องข้อความแจ้งเตือนซ้ายบน */}
                    <div className="hidden sm:flex absolute left-2 top-0 bg-[#1D4ED8] text-white px-3.5 py-2 rounded-xl shadow-lg items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-white"></span>
                      <span className="w-2 h-2 rounded-full bg-white"></span>
                      <span className="w-2 h-2 rounded-full bg-white"></span>
                    </div>

                    {/* บัตรโปรไฟล์จำลองด้านซ้ายของจอ */}
                    <div className="hidden sm:flex flex-col gap-2 bg-white p-3.5 rounded-2xl shadow-lg border border-blue-100 w-36 -mr-6 mb-10 z-20">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#1D4ED8] text-white flex items-center justify-center text-sm">
                          <i className="bi bi-person-fill"></i>
                        </div>
                        <div className="flex-1 space-y-1.5">
                          <div className="h-2 bg-blue-200 rounded-full w-full"></div>
                          <div className="h-2 bg-blue-100 rounded-full w-2/3"></div>
                        </div>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full w-full"></div>
                    </div>

                    {/* หน้าจอแล็ปท็อปตรงกลาง */}
                    <div className="w-64 sm:w-72 bg-[#0F2359] rounded-t-2xl p-3 border-4 border-[#1E293B] shadow-2xl relative">
                      <div className="bg-gradient-to-br from-[#1E3A8A] via-[#1D4ED8] to-[#0F2359] rounded-xl h-44 flex items-center justify-center relative overflow-hidden border border-blue-400/30">
                        {/* โล่และแม่กุญแจกลางจอ */}
                        <div className="w-24 h-28 rounded-2xl bg-gradient-to-b from-blue-400/30 to-blue-900/80 border-2 border-blue-200 flex items-center justify-center shadow-inner">
                          <i className="bi bi-lock-fill text-white text-4xl"></i>
                        </div>
                      </div>
                      <div className="h-3 bg-slate-300 rounded-b-xl -mx-6 mt-2 border-t border-slate-400"></div>
                    </div>

                    {/* สมาร์ทโฟนและแว่นขยายด้านขวา */}
                    <div className="w-24 sm:w-28 bg-white rounded-2xl p-2.5 border-4 border-[#1E293B] shadow-xl -ml-4 mb-2 z-20 relative">
                      {/* ป้ายสามเหลี่ยมเตือนด้านบน */}
                      <div className="absolute -top-7 right-1 bg-white text-[#1E3A8A] w-10 h-10 rounded-xl shadow-md border border-blue-100 flex items-center justify-center font-bold text-lg">
                        <i className="bi bi-exclamation-triangle-fill text-[#2563EB]"></i>
                      </div>
                      <div className="bg-blue-50 rounded-xl h-32 flex flex-col items-center justify-center p-2 border border-blue-100">
                        <div className="w-12 h-12 rounded-xl bg-[#1D4ED8] text-white flex items-center justify-center text-xl shadow-xs">
                          <i className="bi bi-shield-check"></i>
                        </div>
                        <div className="w-12 h-1.5 bg-blue-200 rounded-full mt-3"></div>
                        <div className="w-8 h-1.5 bg-blue-100 rounded-full mt-1.5"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. แถบสถิติ 4 ช่อง (KPI Strip) ตรงตาม Wireframe Home */}
          <div className="ofic-card p-6 sm:p-7 mb-8 border-blue-200 bg-white">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:divide-x lg:divide-slate-200">
              {/* สถิติ 1 */}
              <div className="flex items-center gap-4 lg:pr-4">
                <div className="w-14 h-14 rounded-2xl bg-[#1D4ED8] text-white flex items-center justify-center text-2xl shrink-0 shadow-md">
                  <i className="bi bi-file-earmark-text"></i>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-700">จำนวนคดีที่รับแจ้ง</div>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-2xl sm:text-3xl font-bold text-[#0F2359] tabular-nums">
                      {stats.totalReported.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-600">คดี</span>
                  </div>
                  <div className="text-[11px] text-slate-500">สะสมทั้งหมด</div>
                </div>
              </div>

              {/* สถิติ 2 */}
              <div className="flex items-center gap-4 lg:px-6">
                <div className="w-14 h-14 rounded-2xl bg-[#1D4ED8] text-white flex items-center justify-center text-2xl shrink-0 shadow-md">
                  <i className="bi bi-shield-check"></i>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-700">คดีที่คลี่คลายแล้ว</div>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-2xl sm:text-3xl font-bold text-[#0F2359] tabular-nums">
                      {stats.resolvedCases.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-600">คดี</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    คิดเป็น {stats.resolvedPercentage}%
                  </div>
                </div>
              </div>

              {/* สถิติ 3 */}
              <div className="flex items-center gap-4 lg:px-6">
                <div className="w-14 h-14 rounded-2xl bg-[#1D4ED8] text-white flex items-center justify-center text-2xl shrink-0 shadow-md">
                  <i className="bi bi-coin"></i>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-700">
                    มูลค่าความเสียหายที่ติดตามคืน
                  </div>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-2xl sm:text-3xl font-bold text-[#0F2359] tabular-nums">
                      {stats.recoveredDamageMillions}
                    </span>
                    <span className="text-xs text-slate-600">ล้านบาท</span>
                  </div>
                  <div className="text-[11px] text-slate-500">สะสมทั้งหมด</div>
                </div>
              </div>

              {/* สถิติ 4 */}
              <div className="flex items-center gap-4 lg:pl-6">
                <div className="w-14 h-14 rounded-2xl bg-[#1D4ED8] text-white flex items-center justify-center text-2xl shrink-0 shadow-md">
                  <i className="bi bi-stopwatch"></i>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-700">
                    ระยะเวลาเฉลี่ยในการดำเนินการ
                  </div>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-2xl sm:text-3xl font-bold text-[#0F2359] tabular-nums">
                      {stats.avgProcessingDays}
                    </span>
                    <span className="text-xs text-slate-600">วัน</span>
                  </div>
                  <div className="text-[11px] text-slate-500">ต่อ 1 คดี</div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. แถวล่าง 3 กล่อง: ประเภทคดีที่รองรับ + ขั้นตอนการใช้งาน + การ์ดสีน้ำเงินเข้มขวาสุด */}
          <div id="about-cases" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* ซ้าย (5 คอลัมน์): ประเภทคดีที่รองรับ */}
            <div className="lg:col-span-5 ofic-card p-6 bg-white border-blue-200 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-base font-bold text-[#1E3A8A] mb-4">
                <i className="bi bi-person-Vcard text-[#2563EB]"></i>
                <span>ประเภทคดีที่รองรับ</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 flex-1">
                {/* การ์ด 1: Call Center Scam */}
                <div className="p-4 rounded-2xl bg-[#F8FAFF] border border-blue-200/80 flex flex-col justify-between hover:border-blue-400 transition-colors">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#1D4ED8] flex items-center justify-center text-xl mb-3">
                      <i className="bi bi-headset"></i>
                    </div>
                    <h3 className="text-xs font-bold text-[#1E3A8A] mb-1.5">
                      Call Center Scam
                    </h3>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      แก๊งคอลเซ็นเตอร์ หลอกลวงทางโทรศัพท์ อ้างเป็นเจ้าหน้าที่ หลอกให้โอนเงิน
                    </p>
                  </div>
                  <Link
                    to={submitRoute}
                    className="text-[11px] font-semibold text-[#2563EB] hover:text-[#1E3A8A] no-underline inline-flex items-center gap-1 mt-3"
                  >
                    <span>ดูรายละเอียด</span>
                    <i className="bi bi-arrow-right"></i>
                  </Link>
                </div>

                {/* การ์ด 2: Investment Scam */}
                <div className="p-4 rounded-2xl bg-[#F8FAFF] border border-blue-200/80 flex flex-col justify-between hover:border-blue-400 transition-colors">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#1D4ED8] flex items-center justify-center text-xl mb-3">
                      <i className="bi bi-graph-up-arrow"></i>
                    </div>
                    <h3 className="text-xs font-bold text-[#1E3A8A] mb-1.5">
                      Investment Scam
                    </h3>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      หลอกลงทุน ผ่านแพลตฟอร์มปลอม สัญญาผลตอบแทนสูงผิดปกติ
                    </p>
                  </div>
                  <Link
                    to={submitRoute}
                    className="text-[11px] font-semibold text-[#2563EB] hover:text-[#1E3A8A] no-underline inline-flex items-center gap-1 mt-3"
                  >
                    <span>ดูรายละเอียด</span>
                    <i className="bi bi-arrow-right"></i>
                  </Link>
                </div>

                {/* การ์ด 3: Online Shopping Scam */}
                <div className="p-4 rounded-2xl bg-[#F8FAFF] border border-blue-200/80 flex flex-col justify-between hover:border-blue-400 transition-colors">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#1D4ED8] flex items-center justify-center text-xl mb-3">
                      <i className="bi bi-cart3"></i>
                    </div>
                    <h3 className="text-xs font-bold text-[#1E3A8A] mb-1.5">
                      Online Shopping Scam
                    </h3>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      หลอกขายสินค้า/บริการออนไลน์ ไม่ได้รับสินค้า ไม่ได้รับบริการ
                    </p>
                  </div>
                  <Link
                    to={submitRoute}
                    className="text-[11px] font-semibold text-[#2563EB] hover:text-[#1E3A8A] no-underline inline-flex items-center gap-1 mt-3"
                  >
                    <span>ดูรายละเอียด</span>
                    <i className="bi bi-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>

            {/* กลาง (4 คอลัมน์): ขั้นตอนการใช้งาน 1-2-3-4 */}
            <div className="lg:col-span-4 ofic-card p-6 bg-white border-blue-200 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-base font-bold text-[#1E3A8A] mb-4">
                <i className="bi bi-diagram-3 text-[#2563EB]"></i>
                <span>ขั้นตอนการใช้งาน</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 flex-1 items-stretch">
                {[
                  {
                    num: '1',
                    icon: 'bi-person',
                    title: 'ลงทะเบียน',
                    desc: 'สร้างบัญชีผู้ใช้งาน เพื่อยืนยันตัวตน'
                  },
                  {
                    num: '2',
                    icon: 'bi-file-earmark-text',
                    title: 'แจ้งเหตุ',
                    desc: 'กรอกข้อมูลเหตุการณ์ อย่างละเอียด'
                  },
                  {
                    num: '3',
                    icon: 'bi-cloud-arrow-up',
                    title: 'แนบหลักฐาน',
                    desc: 'อัปโหลดเอกสาร/หลักฐาน ที่เกี่ยวข้อง'
                  },
                  {
                    num: '4',
                    icon: 'bi-search',
                    title: 'ติดตามสถานะ',
                    desc: 'ติดตามความคืบหน้าของคดี ได้ตลอดเวลา'
                  }
                ].map((step) => (
                  <div
                    key={step.num}
                    className="p-3 rounded-2xl bg-[#F8FAFF] border border-blue-200/80 text-center flex flex-col items-center justify-between"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#1D4ED8] text-white text-xs font-bold flex items-center justify-center mb-2 shadow-2xs">
                      {step.num}
                    </div>
                    <div className="text-2xl text-[#1D4ED8] my-1">
                      <i className={`bi ${step.icon}`}></i>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#111827] mt-1">{step.title}</div>
                      <p className="text-[10px] text-slate-500 leading-snug mt-1 mb-0">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ขวาสุด (3 คอลัมน์): การ์ดสีน้ำเงินเข้ม CTA เริ่มแจ้งเหตุ */}
            <div className="lg:col-span-3 ofic-card-blue p-6 flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/30 flex items-center justify-center text-2xl text-white shrink-0">
                  <i className="bi bi-shield-check"></i>
                </div>
                <div>
                  <div className="text-xs text-blue-200 font-medium">
                    ร่วมสร้างสังคมออนไลน์ที่ปลอดภัย
                  </div>
                  <h3 className="text-base font-bold text-white leading-snug mt-1 mb-0">
                    แจ้งเหตุวันนี้ เพื่อปกป้องคุณ และคนที่คุณรัก
                  </h3>
                </div>
              </div>

              <div className="pt-6 text-center">
                <Link
                  to={submitRoute}
                  className="w-full py-3 px-5 rounded-xl bg-white hover:bg-blue-50 text-[#1E3A8A] font-bold text-sm inline-flex items-center justify-center gap-2 no-underline shadow-lg transition-transform hover:-translate-y-0.5"
                >
                  <i className="bi bi-pencil-square text-[#2563EB]"></i>
                  <span>เริ่มแจ้งเหตุ</span>
                </Link>
                <div className="text-[11px] text-blue-200 mt-2.5">ใช้เวลาเพียงไม่กี่นาที</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 5. Footer ตาม Wireframe Home */}
      <div id="contact-footer">
        <Footer />
      </div>
    </div>
  );
}
