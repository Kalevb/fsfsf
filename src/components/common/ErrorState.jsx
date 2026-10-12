import React from 'react';

export default function ErrorState({
  title = 'เกิดข้อผิดพลาดในการเชื่อมต่อข้อมูล',
  message = 'ไม่สามารถโหลดข้อมูลได้ในขณะนี้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตแล้วลองใหม่อีกครั้ง',
  onRetry
}) {
  return (
    <div className="ofic-card p-8 border-red-200 bg-red-50/50 text-center flex flex-col items-center my-4">
      <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center text-2xl mb-3">
        <i className="bi bi-exclamation-triangle-fill"></i>
      </div>
      <h3 className="text-lg font-semibold text-red-900 mb-1">{title}</h3>
      <p className="text-sm text-red-700 max-w-md mb-5">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="ofic-btn ofic-btn-primary">
          <i className="bi bi-arrow-clockwise"></i>
          <span>ลองใหม่</span>
        </button>
      )}
    </div>
  );
}
