// แดชบอร์ดเจ้าหน้าที่ (/officer/dashboard) แสดงสถิติจาก stats node, กราฟ 3 รูปแบบ, และตารางคดีพร้อมค้นหา/กรอง/เรียงลำดับ/แบ่งหน้า
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import Loading from '../components/common/Loading';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import SearchFilterBar from '../components/common/SearchFilterBar';
import Pagination from '../components/common/Pagination';
import CaseTable from '../components/cases/CaseTable';
import StatusChart from '../components/charts/StatusChart';
import CaseTypeChart from '../components/charts/CaseTypeChart';
import TrendChart from '../components/charts/TrendChart';
import { useCases } from '../hooks/useCases';
import { analyzeDuplicateCases } from '../services/duplicateService';
import { formatCurrency } from '../utils/format';

export default function OfficerDashboardPage() {
  const { cases, loading, error, reload } = useCases();

  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // คำนวณตัวเลขสถิติและรายการซ้ำ
  const duplicateGroups = useMemo(() => analyzeDuplicateCases(cases), [cases]);
  const totalDamage = useMemo(
    () => cases.reduce((sum, c) => sum + (Number(c.damageAmount) || 0), 0),
    [cases]
  );
  const pendingReviewCount = useMemo(
    () =>
      cases.filter(
        (c) => c.status === 'pending' || c.status === 'evidence_review'
      ).length,
    [cases]
  );

  // ค้นหา กรอง และเรียงลำดับคดี
  const filteredCases = useMemo(() => {
    const kw = keyword.trim().toLowerCase();

    const list = cases.filter((c) => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (typeFilter !== 'all' && c.caseType !== typeFilter) return false;
      if (!kw) return true;

      const suspects = c.suspects ? Object.values(c.suspects) : [];
      const suspectMatch = suspects.some(
        (s) =>
          (s.name && s.name.toLowerCase().includes(kw)) ||
          (s.phone && s.phone.includes(kw)) ||
          (s.bankAccountNumber && s.bankAccountNumber.includes(kw))
      );

      return (
        (c.caseCode && c.caseCode.toLowerCase().includes(kw)) ||
        (c.victimName && c.victimName.toLowerCase().includes(kw)) ||
        (c.victimPhone && c.victimPhone.includes(kw)) ||
        suspectMatch
      );
    });

    if (sortBy === 'damage_desc') {
      list.sort((a, b) => (Number(b.damageAmount) || 0) - (Number(a.damageAmount) || 0));
    } else if (sortBy === 'damage_asc') {
      list.sort((a, b) => (Number(a.damageAmount) || 0) - (Number(b.damageAmount) || 0));
    } else {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return list;
  }, [cases, keyword, statusFilter, typeFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredCases.length / pageSize));
  const paginatedCases = filteredCases.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleResetFilters = () => {
    setKeyword('');
    setStatusFilter('all');
    setTypeFilter('all');
    setSortBy('newest');
    setCurrentPage(1);
  };

  return (
    <AppShell title="แดชบอร์ดเจ้าหน้าที่สืบสวน (Officer Dashboard)">
      {/* แบนเนอร์หัวข้อสีน้ำเงินเข้ม */}
      <div className="ofic-page-banner mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs text-blue-100 mb-2">
            <i className="bi bi-shield-shaded"></i>
            <span>ศูนย์ปฏิบัติการสืบสวนและวิเคราะห์อาชญากรรมทางเทคโนโลยี</span>
          </span>
          <h2 className="text-2xl font-bold m-0">
            ระบบบริหารจัดการคดีและวิเคราะห์ความเชื่อมโยง
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 mb-0">
            ติดตามสถิติคดีฉ้อโกงออนไลน์ ตรวจสอบหลักฐาน และตรวจจับเครือข่ายบัญชีม้าซ้ำแบบเรียลไทม์
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/officer/duplicates"
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm no-underline inline-flex items-center gap-2 shadow-md"
          >
            <i className="bi bi-fingerprint"></i>
            <span>ตรวจพบกลุ่มคดีซ้ำ ({duplicateGroups.length} กลุ่ม)</span>
          </Link>
          <Link
            to="/officer/reports"
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-blue-50 text-[#1E3A8A] font-bold text-xs sm:text-sm no-underline inline-flex items-center gap-2 shadow-md"
          >
            <i className="bi bi-file-earmark-spreadsheet-fill text-[#2563EB]"></i>
            <span>ออกรายงาน CSV</span>
          </Link>
        </div>
      </div>

      {/* การ์ดสถิติ 4 ช่อง */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="ofic-card-blue p-5 flex items-center justify-between">
          <div>
            <div className="text-xs text-blue-200">จำนวนคดีทั้งหมดในระบบ</div>
            <div className="text-3xl font-bold mt-1 tabular-nums">{cases.length}</div>
            <div className="text-[11px] text-blue-200 mt-1">ดึงข้อมูลจาก Realtime DB</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center text-2xl">
            <i className="bi bi-folder-fill"></i>
          </div>
        </div>

        <div className="ofic-card p-5 bg-white border-blue-200 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500">รอตรวจสอบหลักฐาน/รับเรื่อง</div>
            <div className="text-3xl font-bold text-amber-600 mt-1 tabular-nums">
              {pendingReviewCount}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">ต้องดำเนินการเร่งด่วน</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-2xl">
            <i className="bi bi-file-earmark-check"></i>
          </div>
        </div>

        <div className="ofic-card p-5 bg-white border-blue-200 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500">กลุ่มผู้ต้องสงสัย/บัญชีซ้ำ</div>
            <div className="text-3xl font-bold text-red-600 mt-1 tabular-nums">
              {duplicateGroups.length}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">เครือข่ายบัญชีม้าเดียวกัน</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center text-2xl">
            <i className="bi bi-diagram-3-fill"></i>
          </div>
        </div>

        <div className="ofic-card p-5 bg-white border-blue-200 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500">มูลค่าความเสียหายรวม</div>
            <div className="text-xl font-bold text-[#1E3A8A] mt-1 tabular-nums">
              {formatCurrency(totalDamage)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">สะสมทุกคดี</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#1E3A8A] flex items-center justify-center text-2xl">
            <i className="bi bi-cash-coin"></i>
          </div>
        </div>
      </div>

      {/* กราฟวิเคราะห์สถิติ 3 ช่อง (StatusChart, CaseTypeChart, TrendChart) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="ofic-card p-5 bg-white border-blue-200">
          <h3 className="text-sm font-bold text-[#1E3A8A] m-0 mb-4 pb-2.5 border-b border-blue-100 flex items-center gap-2">
            <i className="bi bi-pie-chart-fill text-[#2563EB]"></i>
            <span>สัดส่วนคดีตามสถานะการสืบสวน</span>
          </h3>
          <StatusChart cases={cases} />
        </div>

        <div className="ofic-card p-5 bg-white border-blue-200">
          <h3 className="text-sm font-bold text-[#1E3A8A] m-0 mb-4 pb-2.5 border-b border-blue-100 flex items-center gap-2">
            <i className="bi bi-bar-chart-fill text-[#2563EB]"></i>
            <span>จำนวนคดีจำแนกตามประเภทภัยออนไลน์</span>
          </h3>
          <CaseTypeChart cases={cases} />
        </div>

        <div className="ofic-card p-5 bg-white border-blue-200">
          <h3 className="text-sm font-bold text-[#1E3A8A] m-0 mb-4 pb-2.5 border-b border-blue-100 flex items-center gap-2">
            <i className="bi bi-graph-up-arrow text-[#2563EB]"></i>
            <span>แนวโน้มมูลค่าความเสียหายรายเดือน</span>
          </h3>
          <TrendChart cases={cases} />
        </div>
      </div>

      {/* แถบค้นหา กรอง และตารางรายการคดีทั้งหมด */}
      <SearchFilterBar
        keyword={keyword}
        onKeywordChange={(val) => {
          setKeyword(val);
          setCurrentPage(1);
        }}
        statusFilter={statusFilter}
        onStatusChange={(val) => {
          setStatusFilter(val);
          setCurrentPage(1);
        }}
        typeFilter={typeFilter}
        onTypeChange={(val) => {
          setTypeFilter(val);
          setCurrentPage(1);
        }}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onReset={handleResetFilters}
      />

      <div className="ofic-card p-6 bg-white border-blue-200">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h3 className="text-base font-bold text-[#1E3A8A] m-0 flex items-center gap-2">
            <i className="bi bi-table text-[#2563EB]"></i>
            <span>รายการคดีฉ้อโกงออนไลน์ทั้งหมด ({filteredCases.length} คดี)</span>
          </h3>
          <span className="text-xs text-slate-500">
            คลิกที่รหัสคดีหรือปุ่ม &ldquo;เปิดดูคดี&rdquo; เพื่อตรวจสอบหลักฐานและเปลี่ยนสถานะ
          </span>
        </div>

        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : filteredCases.length === 0 ? (
          <EmptyState
            title="ไม่พบคดีที่ตรงกับเงื่อนไขการค้นหา"
            description="ลองเปลี่ยนคำค้นหา หรือกดปุ่มล้างตัวกรองเพื่อดูคดีทั้งหมด"
            actionLabel="ล้างตัวกรองทั้งหมด"
            onAction={handleResetFilters}
          />
        ) : (
          <>
            <CaseTable cases={paginatedCases} showVictimColumn={true} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredCases.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </AppShell>
  );
}
