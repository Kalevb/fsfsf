// ตารางแสดงรายการคดีทั้งหมด รองรับเลื่อนแนวนอนบนมือถือ
import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';
import { CASE_TYPES } from '../../utils/constants';
import { formatCurrency, formatThaiDate } from '../../utils/format';

export default function CaseTable({ cases = [], showVictimColumn = true }) {
  return (
    <div className="ofic-table-wrapper border border-blue-200 shadow-xs">
      <table className="ofic-table">
        <thead>
          <tr>
            <th>รหัสคดี</th>
            <th>ประเภทคดี</th>
            {showVictimColumn && <th>ผู้เสียหาย</th>}
            <th>ผู้ต้องสงสัย / บัญชีม้า</th>
            <th>วันที่เกิดเหตุ</th>
            <th className="text-right">มูลค่าความเสียหาย</th>
            <th>สถานะคดี</th>
            <th className="text-center">การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((c) => {
            const typeInfo = CASE_TYPES[c.caseType] || {
              name: c.caseType,
              nameEn: c.caseType
            };
            const suspects = c.suspects ? Object.values(c.suspects) : [];
            const mainSuspect = suspects[0] || {};

            return (
              <tr key={c.caseId}>
                <td>
                  <Link
                    to={`/cases/${c.caseId}`}
                    className="font-bold text-[#1E3A8A] hover:text-[#2563EB] no-underline whitespace-nowrap"
                  >
                    {c.caseCode}
                  </Link>
                </td>
                <td>
                  <div className="font-medium text-xs text-slate-900">{typeInfo.nameEn}</div>
                  <div className="text-[11px] text-slate-500">{typeInfo.name}</div>
                </td>
                {showVictimColumn && (
                  <td>
                    <div className="font-medium text-xs text-slate-900">{c.victimName || '-'}</div>
                    <div className="text-[11px] text-slate-500 tabular-nums">
                      {c.victimPhone || '-'}
                    </div>
                  </td>
                )}
                <td>
                  <div className="font-medium text-xs text-slate-900">
                    {mainSuspect.name || 'ไม่ระบุ'}
                  </div>
                  <div className="text-[11px] text-blue-700 tabular-nums">
                    {mainSuspect.bankAccountNumber
                      ? `บัญชี: ${mainSuspect.bankAccountNumber}`
                      : mainSuspect.phone || '-'}
                  </div>
                </td>
                <td className="whitespace-nowrap text-xs tabular-nums">
                  {formatThaiDate(c.incidentDate)}
                </td>
                <td className="text-right font-bold text-[#1E3A8A] whitespace-nowrap tabular-nums">
                  {formatCurrency(c.damageAmount)}
                </td>
                <td>
                  <StatusBadge status={c.status} />
                </td>
                <td className="text-center whitespace-nowrap">
                  <div className="inline-flex items-center gap-1.5">
                    <Link
                      to={`/cases/${c.caseId}`}
                      className="px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1E3A8A] text-white text-xs font-medium no-underline"
                    >
                      เปิดดูคดี
                    </Link>
                    <Link
                      to={`/cases/${c.caseId}/timeline`}
                      className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#1E3A8A] text-xs font-medium no-underline"
                      title="ไทม์ไลน์คดี"
                    >
                      <i className="bi bi-clock-history"></i>
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
