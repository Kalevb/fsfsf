// หน้ารายละเอียดและตรวจสอบหลักฐานรายชิ้น (/cases/:caseId/evidence/:evidenceId) ตาม User Flow Flow 2
// เจ้าหน้าที่สามารถกด Verified (ยืนยันหลักฐาน) หรือ Rejected (ปฏิเสธหลักฐาน) พร้อมบันทึกหมายเหตุ และอัปเดตเข้าไทม์ไลน์อัตโนมัติ
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import Loading from '../components/common/Loading';
import StatusBadge from '../components/common/StatusBadge';
import { useAuth } from '../hooks/useAuth';
import { useCase } from '../hooks/useCase';
import {
  getSingleEvidence,
  verifyEvidenceItem
} from '../services/evidenceService';
import { formatCurrency, formatThaiDate } from '../utils/format';

export default function EvidenceDetailPage() {
  const { caseId, evidenceId } = useParams();
  const { user, showToast } = useAuth();
  const navigate = useNavigate();
  const { caseData, loading: caseLoading } = useCase(caseId);

  const [evidence, setEvidence] = useState(null);
  const [loadingEvd, setLoadingEvd] = useState(true);
  const [noteInput, setNoteInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isOfficerOrAdmin = user?.role === 'officer' || user?.role === 'admin';

  useEffect(() => {
    setLoadingEvd(true);
    getSingleEvidence(caseId, evidenceId)
      .then((item) => {
        setEvidence(item);
        setNoteInput(item?.note || '');
      })
      .finally(() => setLoadingEvd(false));
  }, [caseId, evidenceId]);

  const handleVerifyDecision = async (decisionStatus) => {
    if (!evidence) return;
    setSubmitting(true);
    try {
      const updated = await verifyEvidenceItem(
        caseId,
        evidence.evidenceId,
        {
          status: decisionStatus,
          note:
            noteInput ||
            (decisionStatus === 'verified'
              ? 'ตรวจสอบหลักฐานถูกต้องครบถ้วน'
              : 'หลักฐานไม่ชัดเจน กรุณาแนบไฟล์ใหม่')
        },
        user
      );
      setEvidence(updated);
      showToast(
        decisionStatus === 'verified'
          ? 'ยืนยันความถูกต้องของหลักฐาน (Verified) และบันทึกไทม์ไลน์เรียบร้อยแล้ว'
          : 'ปฏิเสธหลักฐาน (Rejected) และแจ้งเตือนผู้เสียหายเรียบร้อยแล้ว',
        decisionStatus === 'verified' ? 'success' : 'warning'
      );
    } catch (err) {
      showToast(err.message || 'เกิดข้อผิดพลาดในการบันทึกผลตรวจสอบหลักฐาน', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (caseLoading || loadingEvd) {
    return (
      <AppShell title="ตรวจสอบพยานหลักฐานรายชิ้น (Evidence Detail)">
        <Loading />
      </AppShell>
    );
  }

  return (
    <AppShell title={`รายละเอียดหลักฐาน ${evidence?.evidenceId || evidenceId}`}>
      {/* แบนเนอร์หัวข้อ */}
      <div className="ofic-page-banner mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-white/15 text-xs text-blue-100">
              รหัสคดี: {caseData?.caseCode || caseId}
            </span>
            <StatusBadge status={evidence?.verificationStatus} type="evidence" />
          </div>
          <h2 className="text-2xl font-bold m-0">
            ตรวจสอบพยานหลักฐานดิจิทัล: {evidence?.fileName}
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 mb-0">
            อัปโหลดเมื่อ: {formatThaiDate(evidence?.uploadedAt, true)} • เส้นทางจัดเก็บ:{' '}
            {evidence?.storagePath}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to={`/cases/${caseId}`}
            className="px-4 py-2.5 rounded-xl bg-white text-[#1E3A8A] font-bold text-xs sm:text-sm no-underline inline-flex items-center gap-2 shadow-md"
          >
            <i className="bi bi-arrow-left"></i>
            <span>กลับหน้ารายละเอียดคดี</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ซ้าย (7 คอลัมน์): ตัวอย่างไฟล์หลักฐานจำลองสลิปโอนเงิน/แชทที่คมชัด ไม่ใช่ภาพแตก */}
        <div className="lg:col-span-7">
          <div className="ofic-card p-6 bg-white border-blue-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-blue-100">
              <h3 className="text-base font-bold text-[#1E3A8A] m-0 flex items-center gap-2">
                <i className="bi bi-eye-fill text-[#2563EB]"></i>
                <span>ตัวอย่างเอกสาร / สลิปหลักฐานดิจิทัล</span>
              </h3>
              <span className="text-xs text-slate-500">{evidence?.fileType}</span>
            </div>

            {/* กรอบแสดงตัวอย่างหลักฐานดิจิทัล */}
            <div className="rounded-2xl bg-gradient-to-br from-[#0F2359] via-[#1E3A8A] to-[#1D4ED8] p-6 sm:p-8 text-white shadow-inner">
              <div className="max-w-md mx-auto bg-white text-slate-900 rounded-2xl p-6 shadow-2xl border border-blue-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#1E3A8A] text-white flex items-center justify-center font-bold">
                      OF
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#1E3A8A]">
                        หลักฐานธุรกรรมอิเล็กทรอนิกส์
                      </div>
                      <div className="text-[11px] text-slate-500">{evidence?.fileName}</div>
                    </div>
                  </div>
                  <i className="bi bi-qr-code text-3xl text-[#1E3A8A]"></i>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">รหัสอ้างอิงคดี:</span>
                    <strong className="text-[#1E3A8A]">{caseData?.caseCode}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">ผู้แจ้ง / ผู้โอน:</span>
                    <strong>{caseData?.victimName}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">จำนวนเงินตามสำนวน:</span>
                    <strong className="text-red-600 tabular-nums">
                      {formatCurrency(caseData?.damageAmount)}
                    </strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">สถานะการตรวจพิสูจน์:</span>
                    <StatusBadge status={evidence?.verificationStatus} type="evidence" />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-[11px] text-[#1E3A8A] flex items-center gap-2">
                  <i className="bi bi-shield-lock-fill text-[#2563EB]"></i>
                  <span>จัดเก็บในระบบ Firebase Storage เข้ารหัสปลอดภัย</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ขวา (5 คอลัมน์): แผงการตรวจสอบหลักฐานของเจ้าหน้าที่ (VerificationPanel ตาม Flow 2) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="ofic-card p-6 bg-white border-blue-200 space-y-4">
            <h3 className="text-base font-bold text-[#1E3A8A] m-0 pb-3 border-b border-blue-100 flex items-center gap-2">
              <i className="bi bi-patch-check-fill text-[#2563EB]"></i>
              <span>ผลการตรวจสอบความถูกต้องของหลักฐาน</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200">
                <div className="text-slate-500 mb-1">สถานะปัจจุบัน:</div>
                <StatusBadge status={evidence?.verificationStatus} type="evidence" />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-slate-500 mb-1">หมายเหตุการตรวจสอบล่าสุด:</div>
                <div className="font-medium text-slate-800">{evidence?.note || '-'}</div>
                {evidence?.verifiedBy && (
                  <div className="text-[11px] text-blue-700 mt-1.5">
                    ตรวจสอบโดย: {evidence.verifiedBy}
                  </div>
                )}
              </div>
            </div>

            {isOfficerOrAdmin ? (
              <div className="pt-3 border-t border-blue-100 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                    บันทึกความเห็นของพนักงานสอบสวนประกอบการตรวจสอบหลักฐาน
                  </label>
                  <textarea
                    rows={3}
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    placeholder="ระบุผลการตรวจสอบ เช่น สลิปโอนเงินตรงกับบัญชีม้าเป้าหมาย..."
                    className="ofic-textarea"
                  />
                </div>

                {/* ปุ่ม Verified และ Rejected ตาม User Flow Flow 2 */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleVerifyDecision('verified')}
                    className="ofic-btn ofic-btn-success w-full text-xs font-bold"
                  >
                    <i className="bi bi-check-circle-fill"></i>
                    <span>ยืนยันหลักฐาน (Verified)</span>
                  </button>

                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleVerifyDecision('rejected')}
                    className="ofic-btn ofic-btn-danger w-full text-xs font-bold"
                  >
                    <i className="bi bi-x-circle-fill"></i>
                    <span>ปฏิเสธหลักฐาน (Rejected)</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/cases/${caseId}/timeline`)}
                  className="ofic-btn ofic-btn-outline w-full text-xs"
                >
                  <i className="bi bi-clock-history"></i>
                  <span>ไปที่หน้าไทม์ไลน์คดี (Case Timeline)</span>
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-[#1E3A8A]">
                <i className="bi bi-info-circle-fill mr-1.5 text-[#2563EB]"></i>
                เจ้าหน้าที่กำลังตรวจสอบพยานหลักฐานชิ้นนี้ หากสถานะเปลี่ยนเป็น Verified หรือ Rejected ระบบจะแจ้งเตือนให้ท่านทราบทันที
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
