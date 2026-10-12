// คอมโพเนนต์แสดงรายการเหตุการณ์ในไทม์ไลน์คดี
import React from 'react';
import { formatThaiDate } from '../../utils/format';

export default function TimelineItem({ item, isLast = false }) {
  const iconByType = {
    caseCreated: { icon: 'bi-file-earmark-plus-fill', bg: 'bg-[#2563EB]' },
    evidenceUploaded: { icon: 'bi-cloud-arrow-up-fill', bg: 'bg-indigo-600' },
    officerAssigned: { icon: 'bi-person-badge-fill', bg: 'bg-[#1E3A8A]' },
    evidenceVerified: { icon: 'bi-patch-check-fill', bg: 'bg-emerald-600' },
    statusChanged: { icon: 'bi-arrow-repeat', bg: 'bg-amber-500' },
    duplicateDetected: { icon: 'bi-fingerprint', bg: 'bg-red-600' },
    investigationNote: { icon: 'bi-journal-text', bg: 'bg-[#1E3A8A]' }
  };

  const style = iconByType[item.eventType] || iconByType.investigationNote;

  return (
    <div className="relative flex gap-4 pb-6">
      {!isLast && (
        <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-blue-200"></div>
      )}
      <div
        className={`relative z-10 w-10 h-10 rounded-xl ${style.bg} text-white flex items-center justify-center shrink-0 shadow-md`}
      >
        <i className={`bi ${style.icon}`}></i>
      </div>
      <div className="flex-1 ofic-card p-4 border-blue-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
          <h4 className="font-semibold text-sm text-[#1E3A8A] m-0">
            {item.title || 'บันทึกความคืบหน้าคดี'}
          </h4>
          <span className="text-xs text-slate-500 tabular-nums">
            <i className="bi bi-calendar3 mr-1"></i>
            {formatThaiDate(item.createdAt, true)}
          </span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed mb-2">{item.description}</p>
        <div className="text-[11px] text-blue-800 font-medium">
          <i className="bi bi-person-check mr-1"></i>
          ผู้ดำเนินการ: {item.createdBy || 'ระบบอัตโนมัติ'}
        </div>
      </div>
    </div>
  );
}
