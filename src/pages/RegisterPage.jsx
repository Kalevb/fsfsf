// หน้าลงทะเบียนสำหรับผู้เสียหาย (/register) ใช้เลย์เอาต์ Split-screen สีน้ำเงิน-ขาว คู่กับหน้า Login
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  validateEmail,
  validatePassword,
  validatePhone,
  validateNationalId
} from '../utils/validators';

export default function RegisterPage() {
  const { register, showToast } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    nationalId: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'กรุณากรอกชื่อ-นามสกุลจริง';
    const emailErr = validateEmail(formData.email);
    if (emailErr) newErrors.email = emailErr;
    const phoneErr = validatePhone(formData.phone);
    if (phoneErr) newErrors.phone = phoneErr;
    const nidErr = validateNationalId(formData.nationalId);
    if (nidErr) newErrors.nationalId = nidErr;
    if (!formData.address.trim()) newErrors.address = 'กรุณากรอกที่อยู่ปัจจุบันสำหรับติดต่อราชการ';
    const passErr = validatePassword(formData.password);
    if (passErr) newErrors.password = passErr;
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    setErrors({});
    try {
      await register(formData);
      showToast('ลงทะเบียนผู้เสียหายสำเร็จ พร้อมเข้าสู่ระบบแจ้งเหตุ', 'success');
      navigate('/victim/dashboard');
    } catch (err) {
      setErrors({ form: err.message || 'ไม่สามารถลงทะเบียนได้' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-split-wrapper">
      <div className="auth-split-container">
        {/* ซ้าย: ข้อมูลแนะนำการลงทะเบียนยืนยันตัวตน */}
        <div className="auth-left-panel">
          <div>
            <Link to="/" className="inline-flex items-center gap-3.5 no-underline mb-10">
              <div className="w-12 h-12 rounded-2xl bg-[#1D4ED8] text-white flex items-center justify-center font-bold text-xl shadow-md">
                OF
              </div>
              <div>
                <div className="text-base font-bold text-[#111827] leading-tight">
                  ศูนย์สืบสวนคดีฉ้อโกงออนไลน์
                </div>
                <div className="text-xs text-slate-500 leading-tight mt-0.5">
                  Online Fraud Investigation Center
                </div>
              </div>
            </Link>

            <h1 className="text-3xl font-bold text-[#0F2359] leading-snug mb-4">
              ลงทะเบียนผู้เสียหาย
              <br />
              เพื่อแจ้งเหตุออนไลน์
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              สร้างบัญชีผู้ใช้งานสำหรับประชาชนเพื่อยื่นเรื่องร้องทุกข์คดีฉ้อโกงทางเทคโนโลยี
              แนบไฟล์พยานหลักฐาน และรับการแจ้งเตือนความคืบหน้าของคดีแบบเรียลไทม์
            </p>

            <div className="space-y-3 bg-blue-50/80 border border-blue-200 rounded-2xl p-5">
              <div className="text-xs font-bold text-[#1E3A8A]">
                สิ่งที่ควรเตรียมก่อนแจ้งเหตุ:
              </div>
              <ul className="text-xs text-slate-700 space-y-2 list-none p-0 m-0">
                <li className="flex items-center gap-2">
                  <i className="bi bi-check-circle-fill text-[#2563EB]"></i>
                  <span>ข้อมูลบัตรประจำตัวประชาชน 13 หลักของผู้เสียหาย</span>
                </li>
                <li className="flex items-center gap-2">
                  <i className="bi bi-check-circle-fill text-[#2563EB]"></i>
                  <span>สลิปการโอนเงิน และเลขบัญชีธนาคารของคนร้าย</span>
                </li>
                <li className="flex items-center gap-2">
                  <i className="bi bi-check-circle-fill text-[#2563EB]"></i>
                  <span>ภาพหน้าจอประวัติการสนทนา หรือลิงก์เว็บไซต์มิจฉาชีพ</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-5 border-t border-slate-200 flex items-center gap-2 text-xs text-slate-600">
            <i className="bi bi-shield-fill-check text-emerald-600 text-base"></i>
            <span>ข้อมูลส่วนบุคคลคุ้มครองตามมาตรฐานความปลอดภัยทางไซเบอร์</span>
          </div>
        </div>

        {/* ขวา: ฟอร์มลงทะเบียน */}
        <div className="auth-right-panel">
          <div className="auth-form-card max-w-[520px]">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#1D4ED8] text-xs font-semibold mb-3">
              <i className="bi bi-person-plus-fill"></i>
              <span>สำหรับประชาชน / ผู้เสียหาย (Victim)</span>
            </div>

            <h2 className="text-xl font-bold text-[#111827] m-0">สร้างบัญชีผู้ใช้งานใหม่</h2>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              กรอกข้อมูลจริงเพื่อใช้ประกอบสำนวนการสืบสวนของเจ้าหน้าที่
            </p>

            {errors.form && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 mb-4">
                {errors.form}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1">
                    ชื่อ-นามสกุล <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="เช่น สมชาย ใจดี"
                    className={`ofic-input ${errors.name ? 'ofic-input-error' : ''}`}
                  />
                  {errors.name && <p className="text-[11px] text-red-600 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1">
                    เบอร์โทรศัพท์ติดต่อ <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0812345678"
                    className={`ofic-input ${errors.phone ? 'ofic-input-error' : ''}`}
                  />
                  {errors.phone && (
                    <p className="text-[11px] text-red-600 mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1">
                    เลขประจำตัวประชาชน 13 หลัก <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="nationalId"
                    maxLength={13}
                    value={formData.nationalId}
                    onChange={handleChange}
                    placeholder="1100400556677"
                    className={`ofic-input ${errors.nationalId ? 'ofic-input-error' : ''}`}
                  />
                  {errors.nationalId && (
                    <p className="text-[11px] text-red-600 mt-1">{errors.nationalId}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1">
                    อีเมล <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className={`ofic-input ${errors.email ? 'ofic-input-error' : ''}`}
                  />
                  {errors.email && (
                    <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1">
                  ที่อยู่ปัจจุบัน <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="บ้านเลขที่ ถนน แขวง/ตำบล เขต/อำเภอ จังหวัด รหัสไปรษณีย์"
                  className={`ofic-input ${errors.address ? 'ofic-input-error' : ''}`}
                />
                {errors.address && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1">
                    รหัสผ่าน (อย่างน้อย 6 ตัวอักษร) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`ofic-input ${errors.password ? 'ofic-input-error' : ''}`}
                  />
                  {errors.password && (
                    <p className="text-[11px] text-red-600 mt-1">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1">
                    ยืนยันรหัสผ่าน <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`ofic-input ${
                      errors.confirmPassword ? 'ofic-input-error' : ''
                    }`}
                  />
                  {errors.confirmPassword && (
                    <p className="text-[11px] text-red-600 mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="ofic-btn ofic-btn-primary w-full text-sm font-semibold mt-3"
              >
                <i className="bi bi-check2-circle"></i>
                <span>{submitting ? 'กำลังบันทึกข้อมูล...' : 'ยืนยันการลงทะเบียน'}</span>
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-slate-200 text-center text-xs text-slate-600">
              มีบัญชีผู้ใช้งานอยู่แล้ว?{' '}
              <Link to="/login" className="text-[#1D4ED8] font-bold hover:underline no-underline">
                เข้าสู่ระบบที่นี่
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
