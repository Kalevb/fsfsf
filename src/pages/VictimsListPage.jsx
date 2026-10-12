// หน้ารายชื่อผู้เสียหายทั้งหมด (/officer/victims) สำหรับเจ้าหน้าที่สืบสวน
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import Loading from '../components/common/Loading';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import { useUsers } from '../hooks/useUsers';
import { useCases } from '../hooks/useCases';
import { formatCurrency, formatPhone, maskNationalId } from '../utils/format';

export default function VictimsListPage() {
  const { users, loading: usersLoading, error: usersError, reload } = useUsers();
  const { cases, loading: casesLoading } = useCases();
  const [search, setSearch] = useState('');

  // รวมข้อมูลผู้เสียหายพร้อมจำนวนคดีและมูลค่าความเสียหายของแต่ละคน
  const victimRows = useMemo(() => {
    const victims = users.filter((u) => u.role === 'victim');
    return victims
      .map((v) => {
        const userCases = cases.filter((c) => c.victimId === v.uid);
        const totalDamage = userCases.reduce(
          (sum, c) => sum + (Number(c.damageAmount) || 0),
          0
        );
        return {
          ...v,
          caseCount: userCases.length,
          totalDamage,
          userCases
        };
      })
      .filter((v) => {
        const kw = search.trim().toLowerCase();
        if (!kw) return true;
        return (
          (v.name && v.name.toLowerCase().includes(kw)) ||
          (v.email && v.email.toLowerCase().includes(kw)) ||
          (v.phone && v.phone.includes(kw))
        );
      });
  }, [users, cases, search]);

  return (
    <AppShell title="รายชื่อผู้เสียหายทั้งหมด (Victims List)">
      <div className="ofic-page-banner mb-6">
        <h2 className="text-2xl font-bold m-0">ทะเบียนรายชื่อผู้เสียหายและประวัติการร้องทุกข์</h2>
        <p className="text-xs sm:text-sm text-blue-100 mt-1 mb-0">
          ตรวจสอบข้อมูลผู้เสียหาย จำนวนคดีที่ยื่นแจ้ง และลิงก์ไปยังสำนวนคดีของแต่ละบุคคล
        </p>
      </div>

      <div className="ofic-card-tinted p-5 mb-6">
        <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5">
          <i className="bi bi-search mr-1"></i>
          ค้นหาผู้เสียหาย (ชื่อ-นามสกุล, เบอร์โทรศัพท์, อีเมล)
        </label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="พิมพ์ชื่อผู้เสียหาย หรือหมายเลขโทรศัพท์..."
          className="ofic-input"
        />
      </div>

      {usersLoading || casesLoading ? (
        <Loading />
      ) : usersError ? (
        <ErrorState message={usersError} onRetry={reload} />
      ) : victimRows.length === 0 ? (
        <EmptyState
          title="ไม่พบรายชื่อผู้เสียหาย"
          description="ไม่พบข้อมูลผู้เสียหายที่ตรงกับคำค้นหา"
        />
      ) : (
        <div className="ofic-card p-6 bg-white border-blue-200">
          <div className="ofic-table-wrapper">
            <table className="ofic-table">
              <thead>
                <tr>
                  <th>รหัสผู้เสียหาย</th>
                  <th>ชื่อ-นามสกุล</th>
                  <th>เลขประจำตัวประชาชน</th>
                  <th>เบอร์โทรศัพท์ / อีเมล</th>
                  <th className="text-center">จำนวนคดีที่แจ้ง</th>
                  <th className="text-right">ความเสียหายรวม</th>
                  <th>รหัสคดีที่เกี่ยวข้อง</th>
                </tr>
              </thead>
              <tbody>
                {victimRows.map((v) => (
                  <tr key={v.uid}>
                    <td className="font-mono text-xs text-[#1E3A8A] font-semibold">
                      {v.uid}
                    </td>
                    <td>
                      <div className="font-bold text-sm text-slate-900">{v.name}</div>
                      <div className="text-xs text-slate-500 truncate max-w-xs">
                        {v.victimProfile?.address || '-'}
                      </div>
                    </td>
                    <td className="tabular-nums text-xs">
                      {maskNationalId(v.victimProfile?.nationalId || '1100400556677')}
                    </td>
                    <td>
                      <div className="text-xs font-semibold tabular-nums">
                        {formatPhone(v.phone)}
                      </div>
                      <div className="text-xs text-slate-500">{v.email}</div>
                    </td>
                    <td className="text-center">
                      <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-blue-100 text-[#1E3A8A] font-bold text-xs tabular-nums">
                        {v.caseCount} คดี
                      </span>
                    </td>
                    <td className="text-right font-bold text-[#1E3A8A] tabular-nums">
                      {formatCurrency(v.totalDamage)}
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1.5">
                        {v.userCases.length === 0 ? (
                          <span className="text-xs text-slate-400">ยังไม่มีคดี</span>
                        ) : (
                          v.userCases.map((c) => (
                            <Link
                              key={c.caseId}
                              to={`/cases/${c.caseId}`}
                              className="px-2.5 py-1 rounded-lg bg-[#2563EB] hover:bg-[#1E3A8A] text-white text-xs font-medium no-underline"
                            >
                              {c.caseCode}
                            </Link>
                          ))
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AppShell>
  );
}
