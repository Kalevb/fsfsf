// หน้ารายงานสถิติและส่งออกไฟล์ CSV (/officer/reports) พร้อมบันทึกประวัติลง node `reports`
import React, { useState, useEffect, useMemo } from 'react';
import AppShell from '../components/layout/AppShell';
import Loading from '../components/common/Loading';
import { useAuth } from '../hooks/useAuth';
import { useCases } from '../hooks/useCases';
import {
  getReportHistory,
  generateAndDownloadCsvReport
} from '../services/reportService';
import { CASE_TYPES } from '../utils/constants';
import { formatCurrency, formatThaiDate } from '../utils/format';

export default function ReportsPage() {
  const { user, showToast } = useAuth();
  const { cases, loading } = useCases();

  const [reportTitle, setReportTitle] = useState(
    'รายงานสรุปสถิติคดีฉ้อโกงออนไลน์ ประจำเดือนตุลาคม 2569'
  );
  const [dateRangeStart, setDateRangeStart] = useState('2026-07-01');
  const [dateRangeEnd, setDateRangeEnd] = useState('2026-10-31');
  const [typeFilter, setTypeFilter] = useState('all');
  const [reportHistory, setReportHistory] = useState([]);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    getReportHistory().then(setReportHistory);
  }, []);

  // กรองคดีตามช่วงวันที่ที่เลือก
  const filteredCasesForReport = useMemo(() => {
    return cases.filter((c) => {
      if (typeFilter !== 'all' && c.caseType !== typeFilter) return false;
      const d = c.incidentDate || '';
      if (dateRangeStart && d < dateRangeStart) return false;
      if (dateRangeEnd && d > dateRangeEnd) return false;
      return true;
    });
  }, [cases, dateRangeStart, dateRangeEnd, typeFilter]);

  const totalDamageInPeriod = filteredCasesForReport.reduce(
    (sum, c) => sum + (Number(c.damageAmount) || 0),
    0
  );

  const handleGenerateCsv = async (e) => {
    e.preventDefault();
    if (filteredCasesForReport.length === 0) {
      showToast('ไม่พบข้อมูลคดีในช่วงวันที่ที่เลือก กรุณาปรับช่วงวันที่ใหม่', 'warning');
      return;
    }

    setGenerating(true);
    try {
      const newRecord = await generateAndDownloadCsvReport({
        title: reportTitle,
        dateRangeStart,
        dateRangeEnd,
        casesList: filteredCasesForReport,
        actorUser: user
      });
      setReportHistory((prev) => [newRecord, ...prev]);
      showToast('สร้างและดาวน์โหลดรายงาน CSV สำเร็จ พร้อมบันทึกประวัติลงฐานข้อมูล', 'success');
    } catch (err) {
      showToast(err.message || 'ไม่สามารถสร้างรายงานได้', 'error');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <AppShell title="รายงานสถิติและการส่งออกข้อมูล (Reports)">
      <div className="ofic-page-banner mb-6">
        <h2 className="text-2xl font-bold m-0">ระบบออกรายงานสรุปคดีฉ้อโกงออนไลน์ (CSV Export)</h2>
        <p className="text-xs sm:text-sm text-blue-100 mt-1 mb-0">
          กำหนดช่วงวันที่และประเภทคดีเพื่อประมวลผลรายงานสถิติ ดาวน์โหลดเป็นไฟล์ CSV และบันทึกประวัติลงฐานข้อมูล
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ซ้าย: ฟอร์มสร้างรายงาน */}
        <div className="lg:col-span-5">
          <form
            onSubmit={handleGenerateCsv}
            className="ofic-card p-6 bg-white border-blue-200 space-y-4"
          >
            <h3 className="text-base font-bold text-[#1E3A8A] m-0 pb-3 border-b border-blue-100 flex items-center gap-2">
              <i className="bi bi-file-earmark-arrow-down-fill text-[#2563EB]"></i>
              <span>กำหนดเงื่อนไขการสร้างรายงาน</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                ชื่อรายงานสรุป
              </label>
              <input
                type="text"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                required
                className="ofic-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                  ตั้งแต่วันที่
                </label>
                <input
                  type="date"
                  value={dateRangeStart}
                  onChange={(e) => setDateRangeStart(e.target.value)}
                  className="ofic-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                  ถึงวันที่
                </label>
                <input
                  type="date"
                  value={dateRangeEnd}
                  onChange={(e) => setDateRangeEnd(e.target.value)}
                  className="ofic-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                ประเภทคดีที่ต้องการรวมในรายงาน
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="ofic-select"
              >
                <option value="all">รวมทุกประเภทคดีฉ้อโกง</option>
                {Object.values(CASE_TYPES).map((tp) => (
                  <option key={tp.code} value={tp.code}>
                    {tp.name}
                  </option>
                ))}
              </select>
            </div>

            {/* สรุปจำนวนคดีที่จะอยู่ในไฟล์ CSV */}
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-1.5 text-xs">
              <div className="font-bold text-[#1E3A8A]">ข้อมูลตัวอย่างที่จะส่งออก:</div>
              <div className="flex justify-between">
                <span className="text-slate-600">จำนวนคดีที่พบในช่วงเวลา:</span>
                <strong className="text-[#1E3A8A] tabular-nums">
                  {filteredCasesForReport.length} คดี
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">มูลค่าความเสียหายรวม:</span>
                <strong className="text-red-600 tabular-nums">
                  {formatCurrency(totalDamageInPeriod)}
                </strong>
              </div>
            </div>

            <button
              type="submit"
              disabled={generating || loading}
              className="ofic-btn ofic-btn-primary w-full"
            >
              <i className="bi bi-download"></i>
              <span>
                {generating ? 'กำลังสร้างไฟล์ CSV...' : 'สร้างและดาวน์โหลดไฟล์ CSV'}
              </span>
            </button>
          </form>
        </div>

        {/* ขวา: ประวัติการสร้างรายงานในระบบ (reports node) */}
        <div className="lg:col-span-7">
          <div className="ofic-card p-6 bg-white border-blue-200">
            <h3 className="text-base font-bold text-[#1E3A8A] m-0 mb-4 pb-3 border-b border-blue-100 flex items-center gap-2">
              <i className="bi bi-clock-history text-[#2563EB]"></i>
              <span>ประวัติการออกรายงานในฐานข้อมูล ({reportHistory.length} รายการ)</span>
            </h3>

            {loading ? (
              <Loading />
            ) : (
              <div className="space-y-3">
                {reportHistory.map((rep) => (
                  <div
                    key={rep.reportId}
                    className="p-4 rounded-2xl bg-[#F8FAFF] border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-[#1E3A8A] text-white text-[10px] font-bold">
                          {rep.fileFormat || 'CSV'}
                        </span>
                        <h4 className="font-bold text-sm text-[#1E3A8A] m-0">{rep.title}</h4>
                      </div>
                      <div className="text-xs text-slate-600">
                        ช่วงวันที่ข้อมูล: {rep.dateRangeStart} ถึง {rep.dateRangeEnd} • จำนวน{' '}
                        <strong>{rep.totalCasesIncluded || 12} คดี</strong>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        ออกรายงานโดย: {rep.generatedBy} • เมื่อ{' '}
                        {formatThaiDate(rep.createdAt, true)}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        generateAndDownloadCsvReport({
                          title: rep.title,
                          dateRangeStart: rep.dateRangeStart,
                          dateRangeEnd: rep.dateRangeEnd,
                          casesList: cases,
                          actorUser: user
                        })
                      }
                      className="ofic-btn ofic-btn-outline h-10 px-4 text-xs shrink-0 bg-white"
                    >
                      <i className="bi bi-cloud-arrow-down"></i>
                      <span>ดาวน์โหลดซ้ำ</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
