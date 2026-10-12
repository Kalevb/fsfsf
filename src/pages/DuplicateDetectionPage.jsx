// หน้าตรวจจับรายการซ้ำระหว่างคดี (/officer/duplicates) ตาม User Flow Flow 3
// ดึงเบอร์โทร เลขบัญชี และเว็บไซต์ของผู้ต้องสงสัยทุกคดีมาเทียบกัน จัดกลุ่ม และบันทึกลง duplicateMatches
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import Loading from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import { useAuth } from '../hooks/useAuth';
import { useCases } from '../hooks/useCases';
import {
  analyzeDuplicateCases,
  saveDuplicateReviewNote
} from '../services/duplicateService';
import { formatCurrency, formatThaiDate } from '../utils/format';

export default function DuplicateDetectionPage() {
  const { user, showToast } = useAuth();
  const { cases, loading } = useCases();

  const [matchTypeFilter, setMatchTypeFilter] = useState('all');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [reviewNoteInput, setReviewNoteInput] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const sensitivity = user?.settings?.duplicateSensitivity || 'high';
  const duplicateGroups = useMemo(
    () => analyzeDuplicateCases(cases, sensitivity),
    [cases, sensitivity]
  );

  const filteredGroups = useMemo(() => {
    if (matchTypeFilter === 'all') return duplicateGroups;
    return duplicateGroups.filter((g) => g.matchType === matchTypeFilter);
  }, [duplicateGroups, matchTypeFilter]);

  const handleOpenNoteModal = (group) => {
    setSelectedGroup(group);
    setReviewNoteInput(group.reviewNote || '');
  };

  const handleSaveReviewNote = async () => {
    if (!selectedGroup) return;
    setSavingNote(true);
    try {
      await saveDuplicateReviewNote(
        selectedGroup.matchId,
        selectedGroup,
        reviewNoteInput,
        user
      );
      showToast('บันทึกผลการตรวจสอบและข้อสรุปคดีซ้ำลงฐานข้อมูลเรียบร้อยแล้ว', 'success');
      setSelectedGroup(null);
    } catch (err) {
      showToast(err.message || 'ไม่สามารถบันทึกผลได้', 'error');
    } finally {
      setSavingNote(false);
    }
  };

  return (
    <AppShell title="ตรวจจับรายการซ้ำระหว่างคดี (Duplicate Detection)">
      {/* แบนเนอร์หัวข้อ */}
      <div className="ofic-page-banner mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs text-blue-100 mb-2">
            <i className="bi bi-fingerprint"></i>
            <span>ระบบเชื่อมโยงเครือข่ายอาชญากรรมออนไลน์ (Cross-Case Correlation)</span>
          </span>
          <h2 className="text-2xl font-bold m-0">
            ตรวจจับรายการซ้ำ (เบอร์โทร / เลขบัญชีม้า / เว็บไซต์ปลอม)
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 mb-0">
            ระบบเปรียบเทียบข้อมูลผู้ต้องสงสัยจากทุกคดีโดยอัตโนมัติ เพื่อหาความเชื่อมโยงของกลุ่มมิจฉาชีพเดียวกัน
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-blue-950/60 border border-blue-400/30 text-right shrink-0">
          <div className="text-xs text-blue-200">กลุ่มความเชื่อมโยงที่พบ</div>
          <div className="text-2xl font-bold text-amber-300 tabular-nums">
            {duplicateGroups.length} กลุ่มเครือข่าย
          </div>
        </div>
      </div>

      {/* ตัวกรองประเภทข้อมูลที่ซ้ำ */}
      <div className="ofic-card-tinted p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { key: 'all', label: 'ทั้งหมด', icon: 'bi-grid-fill' },
            { key: 'bank_account', label: 'เลขบัญชีธนาคารซ้ำ', icon: 'bi-bank2' },
            { key: 'phone', label: 'เบอร์โทรศัพท์ซ้ำ', icon: 'bi-telephone-fill' },
            { key: 'website', label: 'URL เว็บไซต์ซ้ำ', icon: 'bi-globe2' }
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setMatchTypeFilter(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                matchTypeFilter === tab.key
                  ? 'bg-[#1E3A8A] text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-blue-200 hover:bg-blue-50'
              }`}
            >
              <i className={`bi ${tab.icon}`}></i>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="text-xs text-[#1E3A8A] font-medium">
          ระดับความไวในการตรวจจับ:{' '}
          <span className="px-2.5 py-1 rounded-lg bg-blue-100 font-bold uppercase">
            {sensitivity}
          </span>
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : filteredGroups.length === 0 ? (
        <EmptyState
          icon="bi-fingerprint"
          title="ไม่พบรายการซ้ำในหมวดหมู่นี้"
          description="ระบบยังไม่พบข้อมูลผู้ต้องสงสัยที่ซ้ำกันตามตัวกรองที่เลือก"
        />
      ) : (
        <div className="space-y-6">
          {filteredGroups.map((group) => (
            <div
              key={group.matchId}
              className="ofic-card overflow-hidden border-blue-300 bg-white"
            >
              {/* หัวการ์ดกลุ่มรายการซ้ำ สีน้ำเงินเข้ม */}
              <div className="bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] px-6 py-4 text-white flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center text-2xl">
                    <i
                      className={`bi ${
                        group.matchType === 'bank_account'
                          ? 'bi-bank2'
                          : group.matchType === 'phone'
                            ? 'bi-telephone-inbound-fill'
                            : 'bi-globe'
                      }`}
                    ></i>
                  </div>
                  <div>
                    <div className="text-xs text-blue-200 font-medium">{group.matchLabel}</div>
                    <div className="text-lg font-bold flex items-center gap-2">
                      <span>{group.matchValue}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-red-500 text-white text-xs">
                        ซ้ำ {group.cases.length} คดี
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-blue-200">มูลค่าความเสียหายรวมในกลุ่มนี้</div>
                  <div className="text-xl font-bold text-amber-300 tabular-nums">
                    {formatCurrency(group.totalDamage)}
                  </div>
                </div>
              </div>

              {/* รายละเอียดผู้ต้องสงสัยและตารางคดีที่เชื่อมโยงกัน */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs">
                  <div>
                    <span className="text-slate-500">ชื่อผู้ต้องสงสัย/บัญชีม้า:</span>{' '}
                    <strong className="text-[#1E3A8A] text-sm block mt-0.5">
                      {group.suspectName}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500">เบอร์โทรศัพท์ที่เชื่อมโยง:</span>{' '}
                    <strong className="text-slate-900 text-sm block mt-0.5 tabular-nums">
                      {group.suspectPhone}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500">เลขบัญชีธนาคารที่เชื่อมโยง:</span>{' '}
                    <strong className="text-slate-900 text-sm block mt-0.5 tabular-nums">
                      {group.bankAccountNumber}
                    </strong>
                  </div>
                </div>

                {/* รายการคดีที่เกี่ยวข้อง (Case A, Case B, Case C ตาม User Flow 3) */}
                <div>
                  <div className="text-xs font-bold text-[#1E3A8A] mb-2.5">
                    รายการคดีที่พบข้อมูลตรงกัน ({group.cases.length} คดี):
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    {group.cases.map((c) => (
                      <div
                        key={c.caseId}
                        className="p-4 rounded-xl bg-[#F8FAFF] border border-blue-200 flex flex-col justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="font-bold text-sm text-[#1E3A8A]">
                              {c.caseCode}
                            </span>
                            <StatusBadge status={c.status} />
                          </div>
                          <div className="text-xs text-slate-600">
                            ผู้เสียหาย: <strong>{c.victimName}</strong>
                          </div>
                          <div className="text-xs text-slate-500">
                            วันที่เกิดเหตุ: {formatThaiDate(c.incidentDate)}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-blue-100 flex items-center justify-between">
                          <span className="font-bold text-xs text-[#1E3A8A] tabular-nums">
                            {formatCurrency(c.damageAmount)}
                          </span>
                          <Link
                            to={`/cases/${c.caseId}`}
                            className="px-3 py-1 rounded-lg bg-[#2563EB] hover:bg-[#1E3A8A] text-white text-xs font-medium no-underline"
                          >
                            เปิดดู Case Detail
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* บันทึกผลการตรวจสอบและปุ่มแก้ไขข้อสรุป */}
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="text-xs text-slate-800">
                    <span className="font-bold text-[#1E3A8A] block mb-0.5">
                      <i className="bi bi-journal-check mr-1"></i>
                      บันทึกผลตรวจสอบและข้อสรุปของเจ้าหน้าที่:
                    </span>
                    {group.reviewNote}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenNoteModal(group)}
                    className="ofic-btn ofic-btn-outline h-10 px-4 text-xs shrink-0 bg-white"
                  >
                    <i className="bi bi-pencil-square"></i>
                    <span>บันทึกผลตรวจสอบ</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal บันทึกผลตรวจสอบคดีซ้ำลง node duplicateMatches */}
      <Modal
        isOpen={Boolean(selectedGroup)}
        onClose={() => setSelectedGroup(null)}
        title={`บันทึกผลตรวจสอบคดีซ้ำ: ${selectedGroup?.matchValue || ''}`}
        footer={
          <>
            <button
              type="button"
              onClick={() => setSelectedGroup(null)}
              className="ofic-btn ofic-btn-outline h-10 px-4 text-xs"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={handleSaveReviewNote}
              disabled={savingNote}
              className="ofic-btn ofic-btn-primary h-10 px-5 text-xs"
            >
              <i className="bi bi-check2-circle"></i>
              <span>{savingNote ? 'กำลังบันทึก...' : 'บันทึกผลลงฐานข้อมูล'}</span>
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-[#1E3A8A]">
            <div>
              <strong>ผู้ต้องสงสัย:</strong> {selectedGroup?.suspectName}
            </div>
            <div>
              <strong>จำนวนคดีที่เชื่อมโยง:</strong> {selectedGroup?.cases?.length || 0} คดี
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#111827] mb-1.5">
              ข้อสรุปผลการวิเคราะห์และการดำเนินการสืบสวนขยายผล
            </label>
            <textarea
              rows={4}
              value={reviewNoteInput}
              onChange={(e) => setReviewNoteInput(e.target.value)}
              placeholder="ระบุแนวทางการรวมสำนวนคดี หรือการประสานอายัดบัญชีธนาคาร..."
              className="ofic-textarea"
            />
          </div>
        </div>
      </Modal>
    </AppShell>
  );
}
