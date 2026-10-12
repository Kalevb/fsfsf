// หน้ารายละเอียดคดีแบบเต็ม (/cases/:caseId) รองรับทั้งผู้เสียหายและเจ้าหน้าที่
// ผู้เสียหายสามารถอัปโหลดหลักฐานเพิ่มได้, เจ้าหน้าที่สามารถเปลี่ยนสถานะคดี มอบหมายงาน และไปหน้าตรวจสอบหลักฐานได้
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import Loading from '../components/common/Loading';
import ErrorState from '../components/common/ErrorState';
import StatusBadge from '../components/common/StatusBadge';
import EvidenceList from '../components/cases/EvidenceList';
import TimelineItem from '../components/cases/TimelineItem';
import { useAuth } from '../hooks/useAuth';
import { useCase } from '../hooks/useCase';
import { updateCaseStatusAndAssignment } from '../services/caseService';
import { uploadEvidenceFile } from '../services/evidenceService';
import { CASE_TYPES, CASE_STATUSES } from '../utils/constants';
import { formatCurrency, formatThaiDate } from '../utils/format';
import { validateEvidenceFile } from '../utils/validators';

export default function CaseDetailPage() {
  const { caseId } = useParams();
  const { user, showToast } = useAuth();
  const { caseData, evidenceList, timelineList, loading, error, reload } = useCase(caseId);

  const [newStatus, setNewStatus] = useState('');
  const [officerName, setOfficerName] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadNote, setUploadNote] = useState('');

  const isOfficerOrAdmin = user?.role === 'officer' || user?.role === 'admin';

  const handleUpdateCaseStatus = async (e) => {
    e.preventDefault();
    const targetStatus = newStatus || caseData.status;
    setUpdatingStatus(true);
    try {
      await updateCaseStatusAndAssignment(
        caseId,
        {
          newStatus: targetStatus,
          assignedOfficerName: officerName || caseData.assignedOfficerName,
          note: statusNote
        },
        user
      );
      setStatusNote('');
      showToast('อัปเดตสถานะคดีและบันทึกไทม์ไลน์เรียบร้อยแล้ว', 'success');
      reload();
    } catch (err) {
      showToast(err.message || 'ไม่สามารถอัปเดตสถานะคดีได้', 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleUploadMoreEvidence = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileErr = validateEvidenceFile(file);
    if (fileErr) {
      showToast(fileErr, 'error');
      return;
    }

    setUploadingFile(true);
    try {
      await uploadEvidenceFile(caseId, file, uploadNote || 'อัปโหลดหลักฐานเพิ่มเติม', user);
      setUploadNote('');
      showToast('อัปโหลดไฟล์หลักฐานเพิ่มเติมเข้าสู่ระบบเรียบร้อยแล้ว', 'success');
      reload();
    } catch (err) {
      showToast(err.message || 'อัปโหลดหลักฐานไม่สำเร็จ', 'error');
    } finally {
      setUploadingFile(false);
    }
  };

  if (loading) {
    return (
      <AppShell title="รายละเอียดสำนวนคดี (Case Detail)">
        <Loading />
      </AppShell>
    );
  }

  if (error || !caseData) {
    return (
      <AppShell title="รายละเอียดสำนวนคดี (Case Detail)">
        <ErrorState message={error || 'ไม่พบข้อมูลคดี'} onRetry={reload} />
      </AppShell>
    );
  }

  const typeInfo = CASE_TYPES[caseData.caseType] || {
    name: caseData.caseType,
    nameEn: caseData.caseType
  };
  const suspects = caseData.suspects ? Object.values(caseData.suspects) : [];

  return (
    <AppShell title={`รายละเอียดคดี ${caseData.caseCode}`}>
      {/* แบนเนอร์หัวข้อคดี */}
      <div className="ofic-page-banner mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-2">
              <span className="px-3 py-1 rounded-full bg-white/15 text-xs font-semibold text-blue-100">
                รหัสสำนวน: {caseData.caseCode}
              </span>
              <StatusBadge status={caseData.status} />
            </div>
            <h2 className="text-2xl font-bold m-0">{typeInfo.name}</h2>
            <p className="text-xs sm:text-sm text-blue-100 mt-1 mb-0">
              ผู้เสียหาย: {caseData.victimName} • วันที่เกิดเหตุ:{' '}
              {formatThaiDate(caseData.incidentDate)} • พนักงานสอบสวน:{' '}
              {caseData.assignedOfficerName || 'ร.ต.อ. พิทักษ์ สันติราษฎร์'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={`/cases/${caseId}/timeline`}
              className="px-4 py-2.5 rounded-xl bg-white text-[#1E3A8A] font-bold text-xs sm:text-sm no-underline inline-flex items-center gap-2 shadow-md"
            >
              <i className="bi bi-clock-history text-[#2563EB]"></i>
              <span>ดูไทม์ไลน์คดีแบบเต็ม</span>
            </Link>
            <Link
              to={isOfficerOrAdmin ? '/officer/dashboard' : '/victim/dashboard'}
              className="px-4 py-2.5 rounded-xl bg-blue-800/80 hover:bg-blue-700 text-white border border-blue-400/40 text-xs sm:text-sm no-underline inline-flex items-center gap-2"
            >
              <i className="bi bi-arrow-left"></i>
              <span>กลับหน้าแดชบอร์ด</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ซ้าย (8 คอลัมน์): ข้อมูลเหตุการณ์ ผู้ต้องสงสัย และรายการหลักฐาน */}
        <div className="lg:col-span-8 space-y-6">
          {/* กล่อง 1: ข้อมูลเหตุการณ์และความเสียหาย */}
          <div className="ofic-card p-6 bg-white border-blue-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-blue-100">
              <h3 className="text-base font-bold text-[#1E3A8A] m-0 flex items-center gap-2">
                <i className="bi bi-file-earmark-text-fill text-[#2563EB]"></i>
                <span>รายละเอียดพฤติการณ์แห่งคดี</span>
              </h3>
              <div className="text-right">
                <span className="text-xs text-slate-500 mr-2">มูลค่าความเสียหาย:</span>
                <span className="text-lg font-bold text-red-600 tabular-nums">
                  {formatCurrency(caseData.damageAmount)}
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed bg-blue-50/50 p-4 rounded-xl border border-blue-100 m-0">
              {caseData.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">สถานที่ / ช่องทางเกิดเหตุ</span>
                <strong className="text-slate-900 mt-0.5 block">
                  {caseData.incidentLocation || 'ช่องทางออนไลน์'}
                </strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">การแจ้งความสถานีตำรวจ</span>
                <strong className="text-slate-900 mt-0.5 block">
                  {caseData.policeReportFiled
                    ? `แจ้งแล้ว (${caseData.policeReportNumber || 'มีใบแจ้งความ'})`
                    : 'แจ้งผ่านศูนย์ออนไลน์ OFIC'}
                </strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">อัปเดตข้อมูลล่าสุด</span>
                <strong className="text-slate-900 mt-0.5 block tabular-nums">
                  {formatThaiDate(caseData.updatedAt, true)}
                </strong>
              </div>
            </div>
          </div>

          {/* กล่อง 2: ข้อมูลผู้ต้องสงสัย / บัญชีม้า */}
          <div className="ofic-card p-6 bg-white border-blue-200 space-y-4">
            <h3 className="text-base font-bold text-[#1E3A8A] m-0 pb-3 border-b border-blue-100 flex items-center gap-2">
              <i className="bi bi-person-bounding-box text-[#2563EB]"></i>
              <span>ข้อมูลผู้ต้องสงสัย / บัญชีม้าที่ใช้รับโอนเงิน</span>
            </h3>

            {suspects.map((s, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs"
              >
                <div>
                  <span className="text-slate-500">ชื่อผู้ต้องสงสัย / ชื่อบัญชี:</span>
                  <div className="font-bold text-sm text-[#1E3A8A] mt-0.5">{s.name || '-'}</div>
                </div>
                <div>
                  <span className="text-slate-500">หมายเลขโทรศัพท์คนร้าย:</span>
                  <div className="font-bold text-sm text-slate-900 mt-0.5 tabular-nums">
                    {s.phone || '-'}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">ธนาคารและเลขที่บัญชี:</span>
                  <div className="font-bold text-sm text-[#2563EB] mt-0.5 tabular-nums">
                    {s.bankName || 'ธนาคารพาณิชย์'} • {s.bankAccountNumber || '-'}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">เว็บไซต์ / โซเชียลมีเดียคนร้าย:</span>
                  <div className="font-semibold text-slate-800 mt-0.5 truncate">
                    {s.websiteUrl || s.socialMedia || '-'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* กล่อง 3: รายการพยานหลักฐาน (EvidenceList) + ปุ่มอัปโหลดเพิ่ม */}
          <div className="ofic-card p-6 bg-white border-blue-200 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-blue-100">
              <h3 className="text-base font-bold text-[#1E3A8A] m-0 flex items-center gap-2">
                <i className="bi bi-folder-check text-[#2563EB]"></i>
                <span>ไฟล์พยานหลักฐานประกอบคดี ({evidenceList.length} รายการ)</span>
              </h3>

              <label className="ofic-btn ofic-btn-outline h-10 px-4 text-xs cursor-pointer">
                <i className="bi bi-cloud-arrow-up-fill"></i>
                <span>{uploadingFile ? 'กำลังอัปโหลด...' : 'แนบหลักฐานเพิ่มเติม'}</span>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf,.mp4"
                  onChange={handleUploadMoreEvidence}
                  disabled={uploadingFile}
                  className="hidden"
                />
              </label>
            </div>

            <EvidenceList caseId={caseId} evidenceItems={evidenceList} />
          </div>
        </div>

        {/* ขวา (4 คอลัมน์): แผงจัดการสำหรับเจ้าหน้าที่ + ไทม์ไลน์ย่อ */}
        <div className="lg:col-span-4 space-y-6">
          {isOfficerOrAdmin && (
            <form
              onSubmit={handleUpdateCaseStatus}
              className="ofic-card p-6 bg-white border-blue-300 space-y-4"
            >
              <div className="pb-3 border-b border-blue-100">
                <span className="text-[11px] font-bold text-[#2563EB] uppercase">
                  สำหรับเจ้าหน้าที่สืบสวน
                </span>
                <h3 className="text-base font-bold text-[#1E3A8A] m-0 mt-0.5">
                  ปรับปรุงสถานะและมอบหมายคดี
                </h3>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                  เปลี่ยนสถานะคดี
                </label>
                <select
                  value={newStatus || caseData.status}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="ofic-select"
                >
                  {Object.values(CASE_STATUSES).map((st) => (
                    <option key={st.key} value={st.key}>
                      {st.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                  พนักงานสอบสวนผู้รับผิดชอบ
                </label>
                <select
                  value={officerName || caseData.assignedOfficerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  className="ofic-select"
                >
                  <option value="ร.ต.อ. พิทักษ์ สันติราษฎร์">
                    ร.ต.อ. พิทักษ์ สันติราษฎร์ (OFIC-1042)
                  </option>
                  <option value="พ.ต.ท. วรพล ปราบปราม">
                    พ.ต.ท. วรพล ปราบปราม (OFIC-1018)
                  </option>
                  <option value="พ.ต.อ. ธนากร ศรีสุวรรณ">
                    พ.ต.อ. ธนากร ศรีสุวรรณ (OFIC-0001)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                  บันทึกผลการดำเนินงาน (จะแสดงในไทม์ไลน์)
                </label>
                <textarea
                  rows={3}
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="ระบุรายละเอียดการสืบสวน เช่น ออกหมายเรียกพยาน หรืออายัดบัญชีแล้ว..."
                  className="ofic-textarea"
                />
              </div>

              <button
                type="submit"
                disabled={updatingStatus}
                className="ofic-btn ofic-btn-primary w-full text-sm"
              >
                <i className="bi bi-check2-circle"></i>
                <span>
                  {updatingStatus ? 'กำลังบันทึกสถานะ...' : 'บันทึกการเปลี่ยนสถานะคดี'}
                </span>
              </button>
            </form>
          )}

          {/* ไทม์ไลน์ล่าสุดของคดี */}
          <div className="ofic-card p-6 bg-white border-blue-200">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-blue-100">
              <h3 className="text-base font-bold text-[#1E3A8A] m-0 flex items-center gap-2">
                <i className="bi bi-clock-history text-[#2563EB]"></i>
                <span>ความเคลื่อนไหวล่าสุด</span>
              </h3>
              <Link
                to={`/cases/${caseId}/timeline`}
                className="text-xs font-semibold text-[#2563EB] hover:underline no-underline"
              >
                ดูทั้งหมด
              </Link>
            </div>

            <div>
              {timelineList.slice(-3).map((item, idx, arr) => (
                <TimelineItem
                  key={item.logId}
                  item={item}
                  isLast={idx === arr.length - 1}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
