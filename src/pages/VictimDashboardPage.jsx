// แดชบอร์ดผู้เสียหาย (/victim/dashboard) แสดงภาพรวมคดีของตนเองและการแจ้งเตือนแบบ Realtime
import React from 'react';
import { Link } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import Loading from '../components/common/Loading';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import CaseCard from '../components/cases/CaseCard';
import { useAuth } from '../hooks/useAuth';
import { useCases } from '../hooks/useCases';
import { formatCurrency, formatThaiDate } from '../utils/format';

export default function VictimDashboardPage() {
  const { user, notifications } = useAuth();
  const { cases, loading, error, reload } = useCases(user?.uid);

  const totalDamage = cases.reduce((sum, c) => sum + (Number(c.damageAmount) || 0), 0);
  const activeCount = cases.filter(
    (c) => c.status === 'pending' || c.status === 'investigating' || c.status === 'evidence_review'
  ).length;
  const closedCount = cases.filter((c) => c.status === 'closed').length;

  return (
    <AppShell title="แดชบอร์ดผู้เสียหาย (Victim Dashboard)">
      {/* แบนเนอร์หัวข้อสีน้ำเงินเข้มตัดกับพื้นหลัง */}
      <div className="ofic-page-banner mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-blue-100 text-xs mb-2">
            <i className="bi bi-shield-lock-fill"></i>
            <span>ระบบติดตามและรับแจ้งเหตุสำหรับประชาชน</span>
          </div>
          <h2 className="text-2xl font-bold m-0">สวัสดีคุณ {user?.name || 'ผู้เสียหาย'}</h2>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 mb-0">
            ตรวจสอบสถานะการสืบสวน อัปโหลดพยานหลักฐานเพิ่มเติม และติดตามความคืบหน้าคดีของท่านแบบเรียลไทม์
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/victim/submit-case"
            className="px-5 py-3 rounded-xl bg-white text-[#1E3A8A] hover:bg-blue-50 font-bold text-sm no-underline inline-flex items-center gap-2 shadow-lg"
          >
            <i className="bi bi-plus-circle-fill text-[#2563EB]"></i>
            <span>แจ้งเหตุคดีใหม่ (5 ขั้นตอน)</span>
          </Link>
          <Link
            to="/victim/track-status"
            className="px-5 py-3 rounded-xl bg-blue-800/80 hover:bg-blue-700 text-white border border-blue-400/40 font-medium text-sm no-underline inline-flex items-center gap-2"
          >
            <i className="bi bi-search"></i>
            <span>ค้นหา/ติดตามสถานะ</span>
          </Link>
        </div>
      </div>

      {/* การ์ดสถิติของคดีผู้เสียหาย 4 ช่อง */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="ofic-card-blue p-5 flex items-center justify-between">
          <div>
            <div className="text-xs text-blue-200">คดีที่ท่านแจ้งทั้งหมด</div>
            <div className="text-3xl font-bold mt-1 tabular-nums">{cases.length}</div>
            <div className="text-[11px] text-blue-200 mt-1">รายการในระบบ</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center text-2xl">
            <i className="bi bi-folder2-open"></i>
          </div>
        </div>

        <div className="ofic-card p-5 border-blue-200 flex items-center justify-between bg-white">
          <div>
            <div className="text-xs font-semibold text-slate-500">กำลังดำเนินการสืบสวน</div>
            <div className="text-3xl font-bold text-[#2563EB] mt-1 tabular-nums">{activeCount}</div>
            <div className="text-[11px] text-slate-500 mt-1">อยู่ระหว่างตรวจสอบ</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#2563EB] flex items-center justify-center text-2xl">
            <i className="bi bi-hourglass-split"></i>
          </div>
        </div>

        <div className="ofic-card p-5 border-blue-200 flex items-center justify-between bg-white">
          <div>
            <div className="text-xs font-semibold text-slate-500">คลี่คลาย / ปิดคดีแล้ว</div>
            <div className="text-3xl font-bold text-emerald-600 mt-1 tabular-nums">
              {closedCount}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">ส่งสำนวนเสร็จสิ้น</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl">
            <i className="bi bi-check-circle-fill"></i>
          </div>
        </div>

        <div className="ofic-card p-5 border-blue-200 flex items-center justify-between bg-white">
          <div>
            <div className="text-xs font-semibold text-slate-500">มูลค่าความเสียหายรวม</div>
            <div className="text-xl font-bold text-[#1E3A8A] mt-1 tabular-nums">
              {formatCurrency(totalDamage)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">ยอดรวมทุกคดีของท่าน</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-2xl">
            <i className="bi bi-cash-stack"></i>
          </div>
        </div>
      </div>

      {/* เนื้อหาหลัก 2 ฝั่ง: รายการคดีของฉัน + การแจ้งเตือนล่าสุด */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4">
          <div className="ofic-card p-5 bg-white border-blue-200">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-blue-100">
              <h3 className="text-base font-bold text-[#1E3A8A] m-0 flex items-center gap-2">
                <i className="bi bi-file-earmark-medical-fill text-[#2563EB]"></i>
                <span>รายการคดีฉ้อโกงออนไลน์ของท่าน</span>
              </h3>
              <Link
                to="/victim/track-status"
                className="text-xs font-semibold text-[#2563EB] hover:underline no-underline"
              >
                ดูทั้งหมด <i className="bi bi-arrow-right"></i>
              </Link>
            </div>

            {loading ? (
              <Loading />
            ) : error ? (
              <ErrorState message={error} onRetry={reload} />
            ) : cases.length === 0 ? (
              <EmptyState
                title="ยังไม่มีประวัติการแจ้งเหตุคดีของท่าน"
                description="หากท่านตกเป็นผู้เสียหายจากคดีฉ้อโกงออนไลน์ สามารถยื่นแบบฟอร์มแจ้งเหตุ 5 ขั้นตอนได้ทันที"
                actionLabel="แจ้งเหตุคดีฉ้อโกงตอนนี้"
                actionTo="/victim/submit-case"
              />
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {cases.map((caseItem) => (
                  <CaseCard key={caseItem.caseId} caseItem={caseItem} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ขวา: แจ้งเตือนความคืบหน้าและคำแนะนำ */}
        <div className="lg:col-span-4 space-y-6">
          <div className="ofic-card p-5 bg-white border-blue-200">
            <h3 className="text-base font-bold text-[#1E3A8A] m-0 mb-4 pb-3 border-b border-blue-100 flex items-center gap-2">
              <i className="bi bi-bell-fill text-[#2563EB]"></i>
              <span>การแจ้งเตือนความคืบหน้าล่าสุด</span>
            </h3>

            <div className="space-y-3">
              {notifications.map((n) => (
                <div
                  key={n.notificationId}
                  className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#1E3A8A]">{n.title}</span>
                    <span className="text-[10px] text-slate-500">
                      {formatThaiDate(n.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 mt-1 mb-2 leading-relaxed">{n.message}</p>
                  {n.caseId && (
                    <Link
                      to={`/cases/${n.caseId}`}
                      className="text-[11px] font-semibold text-[#2563EB] hover:underline no-underline"
                    >
                      เปิดดูรายละเอียดคดี <i className="bi bi-arrow-right"></i>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* การ์ดน้ำเงินแนะนำขั้นตอนหลังแจ้งเหตุ */}
          <div className="ofic-card-blue p-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <i className="bi bi-shield-fill-exclamation text-2xl text-amber-300"></i>
              <h4 className="font-bold text-sm m-0">ข้อแนะนำสำหรับผู้เสียหาย</h4>
            </div>
            <ul className="text-xs text-blue-100 space-y-2 pl-4 m-0">
              <li>เก็บหลักฐานสลิปโอนเงินฉบับจริงที่มี QR Code สำหรับตรวจสอบ</li>
              <li>ห้ามโอนเงินเพิ่มตามคำขู่หรือคำหลอกลวงว่าเป็นการปลดล็อกระบบเด็ดขาด</li>
              <li>สามารถแนบไฟล์หลักฐานเพิ่มเติมในหน้ารายละเอียดคดีได้ตลอด 24 ชม.</li>
            </ul>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
