// หน้าจัดการผู้ใช้งานสำหรับผู้ดูแลระบบ (/officer/users - เฉพาะ role = admin)
import React, { useState } from 'react';
import AppShell from '../components/layout/AppShell';
import Loading from '../components/common/Loading';
import ErrorState from '../components/common/ErrorState';
import { useUsers } from '../hooks/useUsers';
import { useAuth } from '../hooks/useAuth';
import { adminUpdateUserRoleOrStatus } from '../services/userService';
import { ROLES } from '../utils/constants';
import { formatThaiDate } from '../utils/format';

export default function UserManagementPage() {
  const { users, loading, error, reload } = useUsers();
  const { showToast } = useAuth();
  const [roleFilter, setRoleFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    const kw = search.trim().toLowerCase();
    if (!kw) return true;
    return (
      (u.name && u.name.toLowerCase().includes(kw)) ||
      (u.email && u.email.toLowerCase().includes(kw))
    );
  });

  const handleRoleChange = async (targetUser, newRole) => {
    try {
      await adminUpdateUserRoleOrStatus(targetUser.uid, { role: newRole });
      showToast(`เปลี่ยนบทบาทของ ${targetUser.name} เป็น ${newRole} สำเร็จ`, 'success');
      reload();
    } catch (err) {
      showToast(err.message || 'ไม่สามารถเปลี่ยนสิทธิ์ได้', 'error');
    }
  };

  const handleToggleActive = async (targetUser) => {
    const nextStatus = targetUser.isActive === false ? true : false;
    try {
      await adminUpdateUserRoleOrStatus(targetUser.uid, { isActive: nextStatus });
      showToast(
        `${nextStatus ? 'เปิดการใช้งาน' : 'ระงับการใช้งาน'}บัญชี ${targetUser.name} เรียบร้อยแล้ว`,
        nextStatus ? 'success' : 'warning'
      );
      reload();
    } catch (err) {
      showToast(err.message || 'ไม่สามารถอัปเดตสถานะบัญชีได้', 'error');
    }
  };

  return (
    <AppShell title="จัดการผู้ใช้งานระบบ (User Management - Admin Only)">
      <div className="ofic-page-banner mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs text-blue-100 mb-2">
          <i className="bi bi-person-gear"></i>
          <span>สำหรับผู้ดูแลระบบสูงสุด (Administrator)</span>
        </span>
        <h2 className="text-2xl font-bold m-0">บริหารจัดการสิทธิ์และสถานะบัญชีผู้ใช้งาน</h2>
        <p className="text-xs sm:text-sm text-blue-100 mt-1 mb-0">
          กำหนดบทบาทผู้ใช้งาน (Victim / Officer / Admin) และเปิด-ปิดสิทธิ์การเข้าใช้งานระบบ
        </p>
      </div>

      {/* ตัวกรองผู้ใช้งาน */}
      <div className="ofic-card-tinted p-5 mb-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        <div className="md:col-span-7">
          <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5">
            ค้นหาชื่อหรืออีเมลผู้ใช้งาน
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="พิมพ์ชื่อ หรืออีเมล..."
            className="ofic-input"
          />
        </div>
        <div className="md:col-span-5">
          <label className="block text-xs font-semibold text-[#1E3A8A] mb-1.5">
            กรองตามบทบาท (Role)
          </label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="ofic-select"
          >
            <option value="all">ทุกบทบาท ({users.length} บัญชี)</option>
            {Object.values(ROLES).map((r) => (
              <option key={r.key} value={r.key}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : (
        <div className="ofic-card p-6 bg-white border-blue-200">
          <div className="ofic-table-wrapper">
            <table className="ofic-table">
              <thead>
                <tr>
                  <th>UID</th>
                  <th>ชื่อ-นามสกุล</th>
                  <th>อีเมล</th>
                  <th>วันที่สร้างบัญชี</th>
                  <th>บทบาท (Role)</th>
                  <th>สถานะบัญชี</th>
                  <th className="text-center">การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => {
                  const isActive = u.isActive !== false;
                  return (
                    <tr key={u.uid}>
                      <td className="font-mono text-xs text-[#1E3A8A] font-semibold">
                        {u.uid}
                      </td>
                      <td className="font-bold text-sm text-slate-900">{u.name}</td>
                      <td className="text-xs text-slate-600">{u.email}</td>
                      <td className="text-xs tabular-nums">
                        {formatThaiDate(u.createdAt)}
                      </td>
                      <td>
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u, e.target.value)}
                          className="px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50/60 text-xs font-semibold text-[#1E3A8A]"
                        >
                          <option value="victim">ผู้เสียหาย (victim)</option>
                          <option value="officer">เจ้าหน้าที่ (officer)</option>
                          <option value="admin">ผู้ดูแลระบบ (admin)</option>
                        </select>
                      </td>
                      <td>
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                            isActive
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          <i
                            className={`bi ${
                              isActive ? 'bi-check-circle-fill' : 'bi-slash-circle-fill'
                            }`}
                          ></i>
                          <span>{isActive ? 'ใช้งานปกติ' : 'ระงับการใช้งาน'}</span>
                        </span>
                      </td>
                      <td className="text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(u)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                            isActive
                              ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          }`}
                        >
                          {isActive ? 'ระงับบัญชี' : 'เปิดใช้งาน'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AppShell>
  );
}
