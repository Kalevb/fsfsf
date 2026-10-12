// หน้าตั้งค่าระบบและโปรไฟล์ของเจ้าหน้าที่ (/officer/settings)
import React, { useState } from 'react';
import AppShell from '../components/layout/AppShell';
import { useAuth } from '../hooks/useAuth';
import { updateUserProfile } from '../services/userService';

export default function OfficerSettingsPage() {
  const { user, refreshUserState, showToast } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    badgeNumber: user?.officerProfile?.badgeNumber || 'OFIC-1042',
    rankTitle: user?.officerProfile?.rankTitle || 'ร้อยตำรวจเอก',
    department:
      user?.officerProfile?.department ||
      'กองบังคับการตรวจสอบและวิเคราะห์อาชญากรรมทางเทคโนโลยี (บก.ตอท.)',
    notifyNewCase: user?.settings?.notifyNewCase ?? true,
    duplicateSensitivity: user?.settings?.duplicateSensitivity || 'high'
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        officerProfile: {
          badgeNumber: formData.badgeNumber.trim(),
          rankTitle: formData.rankTitle.trim(),
          department: formData.department.trim()
        },
        settings: {
          notifyNewCase: formData.notifyNewCase,
          duplicateSensitivity: formData.duplicateSensitivity
        }
      };

      await updateUserProfile(user.uid, updated);
      refreshUserState(updated);
      showToast('บันทึกการตั้งค่าระบบและข้อมูลเจ้าหน้าที่เรียบร้อยแล้ว', 'success');
    } catch (err) {
      showToast(err.message || 'เกิดข้อผิดพลาดในการบันทึกการตั้งค่า', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell title="ตั้งค่าระบบและโปรไฟล์เจ้าหน้าที่ (Settings)">
      <div className="ofic-page-banner mb-6">
        <h2 className="text-2xl font-bold m-0">ตั้งค่าการปฏิบัติงานและระดับการตรวจจับคดีซ้ำ</h2>
        <p className="text-xs sm:text-sm text-blue-100 mt-1 mb-0">
          จัดการข้อมูลประจำตัวเจ้าหน้าที่ การแจ้งเตือนคดีใหม่ และความไวของระบบตรวจจับรายการซ้ำ (Duplicate Detection Sensitivity)
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 ofic-card p-6 bg-white border-blue-200 space-y-4">
          <h3 className="text-base font-bold text-[#1E3A8A] m-0 pb-3 border-b border-blue-100 flex items-center gap-2">
            <i className="bi bi-person-badge-fill text-[#2563EB]"></i>
            <span>ข้อมูลพนักงานสอบสวน / เจ้าหน้าที่</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                ยศและชื่อ-นามสกุล
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="ofic-input"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                รหัสประจำตัวเจ้าหน้าที่ (Badge Number)
              </label>
              <input
                type="text"
                name="badgeNumber"
                value={formData.badgeNumber}
                onChange={handleChange}
                className="ofic-input"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                ระดับยศ / ตำแหน่ง
              </label>
              <input
                type="text"
                name="rankTitle"
                value={formData.rankTitle}
                onChange={handleChange}
                className="ofic-input"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                หมายเลขโทรศัพท์ภายใน
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="ofic-input"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                สังกัด / หน่วยงาน
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="ofic-input"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 ofic-card p-6 bg-white border-blue-200 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#1E3A8A] m-0 pb-3 border-b border-blue-100 flex items-center gap-2">
              <i className="bi bi-sliders text-[#2563EB]"></i>
              <span>การตั้งค่าระบบตรวจจับและการแจ้งเตือน</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                ความไวในการตรวจจับรายการซ้ำ (Duplicate Sensitivity)
              </label>
              <select
                name="duplicateSensitivity"
                value={formData.duplicateSensitivity}
                onChange={handleChange}
                className="ofic-select"
              >
                <option value="high">
                  สูง (High) — ตรวจจับทั้งเลขบัญชี เบอร์โทร และเว็บไซต์ต้องสงสัย
                </option>
                <option value="medium">
                  ปานกลาง (Medium) — ตรวจจับเลขบัญชีและเบอร์โทรศัพท์
                </option>
                <option value="low">
                  ต่ำ (Low) — ตรวจจับเฉพาะเลขบัญชีและเบอร์โทรที่ตรงกัน 100%
                </option>
              </select>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200">
              <label className="inline-flex items-start gap-3 text-xs font-medium text-[#1E3A8A] cursor-pointer">
                <input
                  type="checkbox"
                  name="notifyNewCase"
                  checked={formData.notifyNewCase}
                  onChange={handleChange}
                  className="w-4 h-4 rounded mt-0.5"
                />
                <span>
                  เปิดรับการแจ้งเตือนแบบเรียลไทม์ทันทีเมื่อมีผู้เสียหายยื่นแจ้งเหตุคดีใหม่เข้าระบบ
                </span>
              </label>
            </div>
          </div>

          <button type="submit" disabled={saving} className="ofic-btn ofic-btn-primary w-full">
            <i className="bi bi-floppy-fill"></i>
            <span>{saving ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่าทั้งหมด'}</span>
          </button>
        </div>
      </form>
    </AppShell>
  );
}
