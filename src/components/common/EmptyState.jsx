import React from 'react';
import { Link } from 'react-router-dom';

export default function EmptyState({
  icon = 'bi-folder2-open',
  title = 'ไม่พบรายการข้อมูล',
  description = 'ยังไม่มีข้อมูลในหมวดหมู่นี้ หรือไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา',
  actionLabel = '',
  actionTo = '',
  onAction = null
}) {
  return (
    <div className="ofic-card-tinted p-10 text-center flex flex-col items-center justify-center my-4">
      <div className="w-16 h-16 rounded-2xl bg-blue-100 text-[#1E3A8A] flex items-center justify-center text-3xl mb-4">
        <i className={`bi ${icon}`}></i>
      </div>
      <h3 className="text-lg font-semibold text-[#111827] mb-1">{title}</h3>
      <p className="text-sm text-slate-600 max-w-md mb-5">{description}</p>
      {actionLabel && actionTo && (
        <Link to={actionTo} className="ofic-btn ofic-btn-primary">
          <i className="bi bi-plus-circle"></i>
          <span>{actionLabel}</span>
        </Link>
      )}
      {actionLabel && onAction && (
        <button type="button" onClick={onAction} className="ofic-btn ofic-btn-outline">
          <i className="bi bi-arrow-counterclockwise"></i>
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}
