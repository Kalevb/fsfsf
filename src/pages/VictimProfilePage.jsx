// หน้าจัดการโปรไฟล์ของผู้เสียหาย (/victim/profile)
import React, { useState } from 'react';
import AppShell from '../components/layout/AppShell';
import { useAuth } from '../hooks/useAuth';
import { updateUserProfile } from '../services/userService';
import { validatePhone } from '../utils/validators';
import { maskNationalId } from '../utils/format';

export default function VictimProfilePage() {
  const { user, refreshUserState, showToast } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    nationalId: user?.victimProfile?.nationalId || '1100400556677',
    address:
      user?.victimProfile?.address ||
      '123/45 ถนนพหลโยธิน แขวงจตุจักร เขตจตุจักร กรุงเทพมหานคร 10900',
    notifyNewCase: user?.settings?.notifyNewCase ?? true
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'กรุณากรอกชื่อ-นามสกุล';
    const phoneErr = validatePhone(formData.phone);
    if (phoneErr) newErrors.phone = phoneErr;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    setErrors({});
    try {
      const updated = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        victimProfile: {
          nationalId: formData.nationalId.trim(),
          address: formData.address.trim()
        },
        settings: {
          ...(user?.settings || {}),
          notifyNewCase: formData.notifyNewCase
        }
      };
      await updateUserProfile(user.uid, updated);
      refreshUserState(updated);
      showToast('บันทึกการแก้ไขข้อมูลส่วนตัวเรียบร้อยแล้ว', 'success');
    } catch (err) {
      showToast(err.message || 'ไม่สามารถบันทึกโปรไฟล์ได้', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell title="ข้อมูลส่วนตัว / โปรไฟล์ผู้เสียหาย">
      <div className="ofic-page-banner mb-6">
        <h2 className="text-2xl font-bold m-0">จัดการข้อมูลส่วนตัวและการแจ้งเตือน</h2>
        <p className="text-xs sm:text-sm text-blue-100 mt-1 mb-0">
          อัปเดตข้อมูลติดต่อและที่อยู่ปัจจุบันเพื่อความรวดเร็วในการประสานงานทางคดีกับพนักงานสอบสวน
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ซ้าย: บัตรประจำตัวผู้ใช้งาน */}
        <div className="lg:col-span-4">
          <div className="ofic-card-blue p-6 text-center space-y-4">
            <div className="w-20 h-20 rounded-3xl bg-white/15 border border-white/30 flex items-center justify-center text-4xl font-bold mx-auto">
              {(formData.name || 'U').slice(0, 1)}
            </div>
            <div>
              <h3 className="text-lg font-bold m-0">{formData.name}</h3>
              <p className="text-xs text-blue-200 mt-0.5">{user?.email}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-blue-950/50 border border-blue-400/30 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-blue-200">บทบาทผู้ใช้งาน:</span>
                <span className="font-semibold">ผู้เสียหาย (Victim)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200">เลขประจำตัวประชาชน:</span>
                <span className="font-semibold tabular-nums">
                  {maskNationalId(formData.nationalId)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200">สถานะบัญชี:</span>
                <span className="text-emerald-300 font-semibold">ยืนยันตัวตนแล้ว</span>
              </div>
            </div>
          </div>
        </div>

        {/* ขวา: ฟอร์มแก้ไขโปรไฟล์ */}
        <div className="lg:col-span-8">
          <form onSubmit={handleSubmit} className="ofic-card p-6 sm:p-8 bg-white border-blue-200 space-y-5">
            <h3 className="text-lg font-bold text-[#1E3A8A] m-0 pb-3 border-b border-blue-100">
              แก้ไขข้อมูลส่วนตัว
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                  ชื่อ-นามสกุล <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`ofic-input ${errors.name ? 'ofic-input-error' : ''}`}
                />
                {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                  หมายเลขโทรศัพท์ <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`ofic-input ${errors.phone ? 'ofic-input-error' : ''}`}
                />
                {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                  อีเมลบัญชีผู้ใช้ (ไม่สามารถแก้ไขได้)
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="ofic-input bg-slate-100 text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                  เลขประจำตัวประชาชน 13 หลัก
                </label>
                <input
                  type="text"
                  name="nationalId"
                  maxLength={13}
                  value={formData.nationalId}
                  onChange={handleChange}
                  className="ofic-input"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                  ที่อยู่ปัจจุบันสำหรับติดต่อราชการ
                </label>
                <textarea
                  rows={3}
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="ofic-textarea"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
              <label className="inline-flex items-center gap-3 text-sm font-medium text-[#1E3A8A] cursor-pointer">
                <input
                  type="checkbox"
                  name="notifyNewCase"
                  checked={formData.notifyNewCase}
                  onChange={handleChange}
                  className="w-4 h-4 rounded"
                />
                <span>รับการแจ้งเตือนแบบเรียลไทม์เมื่อเจ้าหน้าที่อัปเดตสถานะคดีหรือตรวจสอบหลักฐาน</span>
              </label>
            </div>

            <div className="pt-2 flex justify-end">
              <button type="submit" disabled={saving} className="ofic-btn ofic-btn-primary px-7">
                <i className="bi bi-floppy-fill"></i>
                <span>{saving ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
