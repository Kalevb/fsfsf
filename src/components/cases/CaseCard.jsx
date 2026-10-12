// การ์ดแสดงข้อมูลสรุปคดีรายชิ้น
import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';
import { CASE_TYPES } from '../../utils/constants';
import { formatCurrency, formatThaiDate } from '../../utils/format';

export default function CaseCard({ caseItem }) {
  const typeInfo = CASE_TYPES[caseItem.caseType] || {
    name: caseItem.caseType,
    nameEn: 'Fraud Case',
    icon: 'bi-shield-exclamation'
  };

  return (
    <div className="ofic-card p-5 border-blue-200 hover:border-blue-400 transition-all flex flex-col justify-between gap-4">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] text-white flex items-center justify-center text-lg shrink-0">
              <i className={`bi ${typeInfo.icon}`}></i>
            </div>
            <div>
              <div className="font-bold text-sm text-[#1E3A8A]">{caseItem.caseCode}</div>
              <div className="text-xs text-slate-600">{typeInfo.name}</div>
            </div>
          </div>
          <StatusBadge status={caseItem.status} />
        </div>

        <p className="text-xs text-slate-600 line-clamp-2 mb-4">{caseItem.description}</p>
      </div>

      <div className="pt-3 border-t border-blue-100 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="text-[11px] text-slate-500">
            วันที่เกิดเหตุ: {formatThaiDate(caseItem.incidentDate)}
          </div>
          <div className="text-sm font-bold text-[#1E3A8A] tabular-nums">
            ความเสียหาย: {formatCurrency(caseItem.damageAmount)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/cases/${caseItem.caseId}/timeline`}
            className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#1E3A8A] text-xs font-medium no-underline"
          >
            <i className="bi bi-clock-history mr-1"></i>
            ไทม์ไลน์
          </Link>
          <Link
            to={`/cases/${caseItem.caseId}`}
            className="px-3.5 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1E3A8A] text-white text-xs font-medium no-underline"
          >
            ดูรายละเอียด <i className="bi bi-arrow-right ml-1"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}
