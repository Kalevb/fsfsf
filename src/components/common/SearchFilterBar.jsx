// แถบค้นหาและกรองข้อมูลคดี (รหัสคดี ชื่อ เบอร์โทร เลขบัญชี สถานะ ประเภทคดี และเรียงลำดับ)
import React from 'react';
import { CASE_TYPES, CASE_STATUSES } from '../../utils/constants';

export default function SearchFilterBar({
  keyword,
  onKeywordChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
  sortBy = 'newest',
  onSortChange,
  onReset
}) {
  return (
    <div className="ofic-card-tinted p-5 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        <div className="md:col-span-5">
          <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5">
            <i className="bi bi-search mr-1"></i>
            ค้นหาคดี (รหัสคดี, ชื่อผู้เสียหาย, เบอร์โทร, เลขบัญชีคนร้าย)
          </label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            placeholder="เช่น CASE-2026-001, 0891112222, 1234567890..."
            className="ofic-input"
          />
        </div>

        <div className="md:col-span-3">
          <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5">
            <i className="bi bi-funnel mr-1"></i>
            สถานะคดี
          </label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="ofic-select"
          >
            <option value="all">ทุกสถานะคดี</option>
            {Object.values(CASE_STATUSES).map((st) => (
              <option key={st.key} value={st.key}>
                {st.label}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5">
            <i className="bi bi-tags mr-1"></i>
            ประเภทคดี
          </label>
          <select
            value={typeFilter}
            onChange={(e) => onTypeChange(e.target.value)}
            className="ofic-select"
          >
            <option value="all">ทุกประเภท</option>
            {Object.values(CASE_TYPES).map((tp) => (
              <option key={tp.code} value={tp.code}>
                {tp.nameEn}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2 flex gap-2">
          {onSortChange && (
            <div className="w-full">
              <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5">
                <i className="bi bi-sort-down mr-1"></i>
                เรียงลำดับ
              </label>
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="ofic-select"
              >
                <option value="newest">วันที่แจ้งล่าสุด</option>
                <option value="damage_desc">มูลค่าเสียหายสูงสุด</option>
                <option value="damage_asc">มูลค่าเสียหายต่ำสุด</option>
              </select>
            </div>
          )}
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              title="ล้างตัวกรอง"
              className="ofic-btn ofic-btn-outline px-3 shrink-0"
            >
              <i className="bi bi-arrow-counterclockwise"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
