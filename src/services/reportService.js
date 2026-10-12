// บริการสร้างรายงานสรุปคดีและดาวน์โหลดไฟล์ CSV ฝั่ง Client พร้อมบันทึกประวัติลง node `reports`
import { ref, get, set } from 'firebase/database';
import { db } from './firebase';
import { CASE_TYPES, CASE_STATUSES } from '../utils/constants';

const DEFAULT_REPORTS = [
  {
    reportId: 'rep_001',
    generatedBy: 'ร.ต.อ. พิทักษ์ สันติราษฎร์',
    title: 'รายงานสรุปสถิติคดีฉ้อโกงออนไลน์ ประจำไตรมาส 3/2569',
    dateRangeStart: '2026-07-01',
    dateRangeEnd: '2026-09-30',
    fileFormat: 'CSV',
    totalCasesIncluded: 10,
    totalDamageIncluded: 1499300,
    createdAt: '2026-10-01T10:00:00Z'
  },
  {
    reportId: 'rep_002',
    generatedBy: 'พ.ต.อ. ธนากร ศรีสุวรรณ',
    title: 'รายงานผลการตรวจจับบัญชีม้าและเครือข่ายคดีซ้ำ ตุลาคม 2569',
    dateRangeStart: '2026-07-01',
    dateRangeEnd: '2026-10-09',
    fileFormat: 'CSV',
    totalCasesIncluded: 12,
    totalDamageIncluded: 2121300,
    createdAt: '2026-10-09T09:00:00Z'
  }
];

/**
 * ดึงประวัติการสร้างรายงานทั้งหมด
 */
export async function getReportHistory() {
  try {
    const snap = await get(ref(db, 'reports'));
    if (snap.exists()) {
      const list = Object.values(snap.val());
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return list;
    }
  } catch {
    // fallback
  }

  const saved = localStorage.getItem('ofic_reports_history');
  if (saved) return JSON.parse(saved);
  return DEFAULT_REPORTS;
}

/**
 * สร้างไฟล์ CSV รองรับภาษาไทย (ใส่ UTF-8 BOM) และดาวน์โหลดลงเครื่องทันที พร้อมบันทึกประวัติลง Firebase
 */
export async function generateAndDownloadCsvReport({
  title,
  dateRangeStart,
  dateRangeEnd,
  casesList,
  actorUser
}) {
  const headers = [
    'รหัสคดี',
    'ประเภทคดี',
    'ชื่อผู้เสียหาย',
    'เบอร์โทรผู้เสียหาย',
    'วันที่เกิดเหตุ',
    'มูลค่าความเสียหาย (บาท)',
    'สถานะคดี',
    'ชื่อผู้ต้องสงสัย/บัญชีม้า',
    'เบอร์โทรผู้ต้องสงสัย',
    'เลขบัญชีธนาคารคนร้าย',
    'เจ้าหน้าที่ผู้รับผิดชอบ'
  ];

  const rows = casesList.map((c) => {
    const suspects = c.suspects ? Object.values(c.suspects) : [];
    const mainSuspect = suspects[0] || {};
    const typeName = CASE_TYPES[c.caseType]?.name || c.caseType;
    const statusName = CASE_STATUSES[c.status]?.label || c.status;

    return [
      c.caseCode,
      `"${typeName}"`,
      `"${c.victimName || '-'}"`,
      `"${c.victimPhone || '-'}"`,
      c.incidentDate || '-',
      c.damageAmount || 0,
      `"${statusName}"`,
      `"${mainSuspect.name || '-'}"`,
      `"${mainSuspect.phone || '-'}"`,
      `"${mainSuspect.bankAccountNumber || '-'}"`,
      `"${c.assignedOfficerName || '-'}"`
    ].join(',');
  });

  // ใส่ BOM \uFEFF เพื่อให้เปิดใน Microsoft Excel แล้วภาษาไทยไม่เพี้ยน
  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute(
    'download',
    `OFIC_Report_${dateRangeStart || 'all'}_to_${dateRangeEnd || 'now'}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  // บันทึกประวัติรายงานลง node `reports`
  const reportId = `rep_${Date.now()}`;
  const totalDamageIncluded = casesList.reduce(
    (sum, item) => sum + (Number(item.damageAmount) || 0),
    0
  );

  const newReportRecord = {
    reportId,
    generatedBy: actorUser?.name || 'เจ้าหน้าที่สืบสวน',
    title: title || `รายงานสรุปคดีฉ้อโกงออนไลน์ (${dateRangeStart} ถึง ${dateRangeEnd})`,
    dateRangeStart: dateRangeStart || '2026-07-01',
    dateRangeEnd: dateRangeEnd || '2026-10-09',
    fileFormat: 'CSV',
    totalCasesIncluded: casesList.length,
    totalDamageIncluded,
    createdAt: new Date().toISOString()
  };

  const currentHistory = await getReportHistory();
  const updatedHistory = [newReportRecord, ...currentHistory];
  localStorage.setItem('ofic_reports_history', JSON.stringify(updatedHistory));

  try {
    await set(ref(db, `reports/${reportId}`), newReportRecord);
  } catch {
    // stored locally
  }

  return newReportRecord;
}
