// หน้าติดตามสถานะคดีของผู้เสียหาย (/victim/track-status)
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import Loading from '../components/common/Loading';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import StatusBadge from '../components/common/StatusBadge';
import { useAuth } from '../hooks/useAuth';
import { useCases } from '../hooks/useCases';
import { CASE_TYPES, CASE_STATUSES } from '../utils/constants';
import { formatCurrency, formatThaiDate } from '../utils/format';

export default function TrackStatusPage() {
  const { user } = useAuth();
  const { cases, loading, error, reload } = useCases(user?.uid);

  const [searchCode, setSearchCode] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredCases = cases.filter((c) => {
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    const kw = searchCode.trim().toLowerCase();
    const matchKw =
      !kw ||
      (c.caseCode && c.caseCode.toLowerCase().includes(kw)) ||
      (c.description && c.description.toLowerCase().includes(kw));
    return matchStatus && matchKw;
  });

  return (
    <AppShell title="ติดตามสถานะคดี (Track Status)">
      <div className="ofic-page-banner mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold m-0">ติดตามสถานะความคืบหน้าคดี</h2>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 mb-0">
            ตรวจสอบขั้นตอนการดำเนินงานของพนักงานสอบสวนและประวัติความเคลื่อนไหว (Case Timeline)
          </p>
        </div>
        <Link
          to="/victim/submit-case"
          className="px-5 py-2.5 rounded-xl bg-white text-[#1E3A8A] font-bold text-sm no-underline inline-flex items-center gap-2 shadow-md"
        >
          <i className="bi bi-plus-circle-fill text-[#2563EB]"></i>
          <span>แจ้งเหตุคดีใหม่</span>
        </Link>
      </div>

      {/* แถบค้นหารหัสคดีและตัวกรองสถานะ */}
      <div className="ofic-card-tinted p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-7">
            <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5">
              <i className="bi bi-search mr-1"></i>
              ค้นหาด้วยรหัสคดี หรือคำสำคัญในรายละเอียด
            </label>
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="กรอกรหัสคดี เช่น CASE-2026-001..."
              className="ofic-input"
            />
          </div>
          <div className="md:col-span-5">
            <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5">
              <i className="bi bi-funnel mr-1"></i>
              กรองตามสถานะคดี
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="ofic-select"
            >
              <option value="all">ทุกสถานะคดี ({cases.length})</option>
              {Object.values(CASE_STATUSES).map((st) => (
                <option key={st.key} value={st.key}>
                  {st.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : filteredCases.length === 0 ? (
        <EmptyState
          title="ไม่พบรายการคดีที่ค้นหา"
          description="กรุณาตรวจสอบรหัสคดีอีกครั้ง หรือยื่นแจ้งเหตุคดีใหม่หากยังไม่ได้ส่งเรื่อง"
          actionLabel="ล้างการค้นหา"
          onAction={() => {
            setSearchCode('');
            setStatusFilter('all');
          }}
        />
      ) : (
        <div className="space-y-4">
          {filteredCases.map((c) => {
            const typeInfo = CASE_TYPES[c.caseType] || { name: c.caseType };
            const stepProgress =
              c.status === 'pending'
                ? 25
                : c.status === 'evidence_review'
                  ? 55
                  : c.status === 'investigating'
                    ? 80
                    : c.status === 'closed'
                      ? 100
                      : 100;

            return (
              <div
                key={c.caseId}
                className="ofic-card p-6 bg-white border-blue-200 hover:border-blue-400 transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-blue-100">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-[#1E3A8A]">{c.caseCode}</span>
                      <StatusBadge status={c.status} />
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      ประเภท: <strong>{typeInfo.name}</strong> • วันที่เกิดเหตุ:{' '}
                      {formatThaiDate(c.incidentDate)}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-slate-500">มูลค่าความเสียหาย</div>
                    <div className="text-lg font-bold text-[#1E3A8A] tabular-nums">
                      {formatCurrency(c.damageAmount)}
                    </div>
                  </div>
                </div>

                {/* แถบความคืบหน้าการสืบสวน */}
                <div className="py-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#1E3A8A] mb-1.5">
                    <span>ความคืบหน้าการดำเนินการสืบสวน</span>
                    <span className="tabular-nums">{stepProgress}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-blue-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        c.status === 'rejected'
                          ? 'bg-red-600'
                          : c.status === 'closed'
                            ? 'bg-emerald-600'
                            : 'bg-[#2563EB]'
                      }`}
                      style={{ width: `${stepProgress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="text-xs text-slate-600">
                    <i className="bi bi-person-badge text-[#2563EB] mr-1.5"></i>
                    พนักงานสอบสวนผู้รับผิดชอบ:{' '}
                    <strong className="text-slate-900">
                      {c.assignedOfficerName || 'อยู่ระหว่างมอบหมายเจ้าหน้าที่'}
                    </strong>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Link
                      to={`/cases/${c.caseId}/timeline`}
                      className="ofic-btn ofic-btn-outline h-10 px-4 text-xs"
                    >
                      <i className="bi bi-clock-history"></i>
                      <span>ดูไทม์ไลน์คดี</span>
                    </Link>
                    <Link
                      to={`/cases/${c.caseId}`}
                      className="ofic-btn ofic-btn-primary h-10 px-4 text-xs"
                    >
                      <i className="bi bi-folder2-open"></i>
                      <span>ดูรายละเอียดและหลักฐาน</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
