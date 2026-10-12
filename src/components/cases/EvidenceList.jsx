// รายการหลักฐานประกอบคดี พร้อมลิงก์ไปหน้าตรวจสอบหลักฐานรายชิ้น (/cases/:caseId/evidence/:evidenceId)
import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';
import { formatThaiDate } from '../../utils/format';

export default function EvidenceList({ caseId, evidenceItems = [] }) {
  if (!evidenceItems || evidenceItems.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-blue-50/60 border border-blue-200 text-center text-sm text-slate-600">
        ยังไม่มีไฟล์หลักฐานแนบในคดีนี้
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {evidenceItems.map((evd) => {
        const isPdf = evd.fileType?.includes('pdf');
        const isVideo = evd.fileType?.includes('mp4') || evd.fileType?.includes('video');
        const icon = isPdf
          ? 'bi-file-earmark-pdf-fill text-red-600'
          : isVideo
            ? 'bi-file-earmark-play-fill text-purple-600'
            : 'bi-file-earmark-image-fill text-[#2563EB]';

        return (
          <div
            key={evd.evidenceId}
            className="ofic-card p-4 border-blue-200 flex flex-col justify-between gap-3 bg-gradient-to-b from-white to-blue-50/40"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-blue-100/80 flex items-center justify-center text-2xl shrink-0">
                  <i className={`bi ${icon}`}></i>
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm text-[#1E3A8A] truncate">
                    {evd.fileName}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    อัปโหลดเมื่อ: {formatThaiDate(evd.uploadedAt, true)}
                  </div>
                </div>
              </div>
              <StatusBadge status={evd.verificationStatus} type="evidence" />
            </div>

            {evd.note && (
              <div className="p-2.5 rounded-xl bg-white border border-blue-100 text-xs text-slate-700">
                <span className="font-semibold text-[#1E3A8A]">หมายเหตุ: </span>
                {evd.note}
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-blue-100">
              <span className="text-[11px] text-slate-500">รหัส: {evd.evidenceId}</span>
              <Link
                to={`/cases/${caseId}/evidence/${evd.evidenceId}`}
                className="px-3.5 py-1.5 rounded-lg bg-[#1E3A8A] hover:bg-[#2563EB] text-white text-xs font-medium no-underline transition-colors"
              >
                <i className="bi bi-search mr-1"></i>
                เปิดดู / ตรวจสอบหลักฐาน
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
