import React from 'react';

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange
}) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 mt-4 border-t border-blue-100">
      <div className="text-xs text-slate-600">
        แสดงรายการที่ <span className="font-semibold text-[#1E3A8A]">{startItem}</span> ถึง{' '}
        <span className="font-semibold text-[#1E3A8A]">{endItem}</span> จากทั้งหมด{' '}
        <span className="font-semibold text-[#1E3A8A]">{totalItems}</span> รายการ
      </div>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 rounded-lg border border-blue-200 bg-white text-sm text-[#1E3A8A] disabled:opacity-40 hover:bg-blue-50 cursor-pointer"
        >
          <i className="bi bi-chevron-left"></i> ก่อนหน้า
        </button>
        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`w-9 h-9 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
              page === currentPage
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'bg-white border border-blue-200 text-slate-700 hover:bg-blue-50'
            }`}
          >
            {page}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 rounded-lg border border-blue-200 bg-white text-sm text-[#1E3A8A] disabled:opacity-40 hover:bg-blue-50 cursor-pointer"
        >
          ถัดไป <i className="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>
  );
}
