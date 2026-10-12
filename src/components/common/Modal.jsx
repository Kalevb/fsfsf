import React from 'react';

export default function Modal({ isOpen, onClose, title, children, footer }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-[18px] shadow-2xl border border-blue-200 w-full max-w-lg overflow-hidden">
        <div className="bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] px-6 py-4 flex items-center justify-between text-white">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <i className="bi bi-shield-lock"></i>
            <span>{title}</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white text-lg"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        <div className="p-6 max-h-[75vh] overflow-y-auto">{children}</div>
        {footer && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
