// คอมโพเนนต์แสดงสถานะคดีและสถานะหลักฐาน
import React from 'react';
import { CASE_STATUSES, EVIDENCE_STATUSES } from '../../utils/constants';

export default function StatusBadge({ status, type = 'case' }) {
  const dict = type === 'evidence' ? EVIDENCE_STATUSES : CASE_STATUSES;
  const item = dict[status] || {
    label: status || 'ไม่ระบุ',
    bgColor: '#EFF6FF',
    textColor: '#1E3A8A',
    icon: 'bi-info-circle'
  };

  return (
    <span
      style={{
        backgroundColor: item.bgColor,
        color: item.textColor
      }}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap"
    >
      <i className={`bi ${item.icon}`}></i>
      <span>{item.label}</span>
    </span>
  );
}
