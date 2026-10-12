// หน้าไทม์ไลน์ความเคลื่อนไหวของคดี (/cases/:caseId/timeline)
// แสดงประวัติทุกขั้นตอนตั้งแต่แจ้งเหตุ อัปโหลดหลักฐาน ตรวจสอบหลักฐาน และอนุญาตให้เจ้าหน้าที่เพิ่มเหตุการณ์ใหม่ได้
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import Loading from '../components/common/Loading';
import ErrorState from '../components/common/ErrorState';
import StatusBadge from '../components/common/StatusBadge';
import TimelineItem from '../components/cases/TimelineItem';
import { useAuth } from '../hooks/useAuth';
import { useCase } from '../hooks/useCase';
import { addTimelineEvent } from '../services/caseService';

export default function CaseTimelinePage() {
  const { caseId } = useParams();
  const { user, showToast } = useAuth();
  const { caseData, timelineList, loading, error, reload } = useCase(caseId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState('investigationNote');
  const [submitting, setSubmitting] = useState(false);

  const isOfficerOrAdmin = user?.role === 'officer' || user?.role === 'admin';

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showToast('กรุณากรอกหัวข้อและรายละเอียดความคืบหน้า', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      await addTimelineEvent(
        caseId,
        {
          title: title.trim(),
          description: description.trim(),
          eventType
        },
        user
      );
      setTitle('');
      setDescription('');
      showToast('เพิ่มบันทึกเหตุการณ์ลงในไทม์ไลน์คดีเรียบร้อยแล้ว', 'success');
      reload();
    } catch (err) {
      showToast(err.message || 'ไม่สามารถบันทึกไทม์ไลน์ได้', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AppShell title="ไทม์ไลน์ความเคลื่อนไหวของคดี (Case Timeline)">
        <Loading />
      </AppShell>
    );
  }

  if (error || !caseData) {
    return (
      <AppShell title="ไทม์ไลน์ความเคลื่อนไหวของคดี (Case Timeline)">
        <ErrorState message={error || 'ไม่พบข้อมูลคดี'} onRetry={reload} />
      </AppShell>
    );
  }

  return (
    <AppShell title={`ไทม์ไลน์คดี ${caseData.caseCode}`}>
      <div className="ofic-page-banner mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="px-3 py-1 rounded-full bg-white/15 text-xs text-blue-100">
              {caseData.caseCode}
            </span>
            <StatusBadge status={caseData.status} />
          </div>
          <h2 className="text-2xl font-bold m-0">ประวัติความเคลื่อนไหวของคดี (Case Timeline)</h2>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 mb-0">
            บันทึกเหตุการณ์ทุกขั้นตอนตามลำดับเวลาเพื่อความโปร่งใสและตรวจสอบได้
          </p>
        </div>

        <Link
          to={`/cases/${caseId}`}
          className="px-4 py-2.5 rounded-xl bg-white text-[#1E3A8A] font-bold text-xs sm:text-sm no-underline inline-flex items-center gap-2 shadow-md shrink-0"
        >
          <i className="bi bi-folder2-open text-[#2563EB]"></i>
          <span>กลับหน้ารายละเอียดคดี</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ซ้าย: รายการไทม์ไลน์ทั้งหมด */}
        <div className={isOfficerOrAdmin ? 'lg:col-span-7' : 'lg:col-span-12'}>
          <div className="ofic-card p-6 sm:p-8 bg-white border-blue-200">
            <h3 className="text-base font-bold text-[#1E3A8A] m-0 mb-6 pb-3 border-b border-blue-100 flex items-center gap-2">
              <i className="bi bi-clock-history text-[#2563EB]"></i>
              <span>ลำดับเหตุการณ์และการดำเนินการ ({timelineList.length} รายการ)</span>
            </h3>

            <div>
              {timelineList.map((item, idx) => (
                <TimelineItem
                  key={item.logId}
                  item={item}
                  isLast={idx === timelineList.length - 1}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ขวา: ฟอร์มเพิ่มเหตุการณ์ในไทม์ไลน์สำหรับเจ้าหน้าที่ */}
        {isOfficerOrAdmin && (
          <div className="lg:col-span-5">
            <form
              onSubmit={handleAddEvent}
              className="ofic-card p-6 bg-white border-blue-300 space-y-4"
            >
              <h3 className="text-base font-bold text-[#1E3A8A] m-0 pb-3 border-b border-blue-100 flex items-center gap-2">
                <i className="bi bi-plus-circle-fill text-[#2563EB]"></i>
                <span>เพิ่มบันทึกเหตุการณ์ในไทม์ไลน์</span>
              </h3>

              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                  ประเภทเหตุการณ์
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="ofic-select"
                >
                  <option value="investigationNote">บันทึกการสืบสวน (Investigation Note)</option>
                  <option value="evidenceVerified">การตรวจพิสูจน์หลักฐาน</option>
                  <option value="duplicateDetected">การเชื่อมโยงเครือข่ายบัญชีม้า</option>
                  <option value="statusChanged">การประสานงานธนาคาร / อายัดบัญชี</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                  หัวข้อเหตุการณ์ <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="เช่น ประสานธนาคารอายัดบัญชีปลายทางเรียบร้อยแล้ว"
                  className="ofic-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                  รายละเอียดการดำเนินการ <span className="text-red-600">*</span>
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="ระบุรายละเอียดความคืบหน้าเพื่อให้ผู้เสียหายและทีมสืบสวนรับทราบ..."
                  className="ofic-textarea"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="ofic-btn ofic-btn-primary w-full"
              >
                <i className="bi bi-send-plus-fill"></i>
                <span>{submitting ? 'กำลังบันทึก...' : 'บันทึกเหตุการณ์ลงไทม์ไลน์'}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </AppShell>
  );
}
