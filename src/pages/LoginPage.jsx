// หน้าเข้าสู่ระบบ (LoginPage) สร้างตรงตามรูป Wireframe Login.png 100% ทุกจุด
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { validateEmail, validatePassword } from '../utils/validators';

export default function LoginPage() {
  const { login, showToast } = useAuth();
  const navigate = useNavigate();

  // 2 โหมดตามโจทย์และ Wireframe: victim (ผู้เสียหาย) และ officer (สำหรับเจ้าหน้าที่)
  const [loginMode, setLoginMode] = useState('victim');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleToggleMode = () => {
    const nextMode = loginMode === 'victim' ? 'officer' : 'victim';
    setLoginMode(nextMode);
    setErrors({});
    if (nextMode === 'officer') {
      setEmail('pitak.officer@ofic.police.go.th');
      setPassword('123456');
    } else {
      setEmail('somchai.victim@example.com');
      setPassword('123456');
    }
  };

  const handleQuickFill = (targetEmail) => {
    setEmail(targetEmail);
    setPassword('123456');
    setErrors({});
    if (targetEmail.includes('police.go.th')) {
      setLoginMode('officer');
    } else {
      setLoginMode('victim');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);

    if (emailErr || passErr) {
      setErrors({ email: emailErr, password: passErr });
      return;
    }

    setSubmitting(true);
    setErrors({});
    try {
      const profile = await login(email, password);
      showToast(`ยินดีต้อนรับคุณ ${profile.name} เข้าสู่ระบบสำเร็จ`, 'success');
      if (profile.role === 'officer' || profile.role === 'admin') {
        navigate('/officer/dashboard');
      } else {
        navigate('/victim/dashboard');
      }
    } catch (err) {
      setErrors({ form: err.message || 'ไม่สามารถเข้าสู่ระบบได้' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-split-wrapper">
      <div className="auth-split-container">
        {/* ฝั่งซ้าย (1. Logo & Brand, 3. Headline, 4. Value Proposition, 5. Key Benefits, 6. Security Note) */}
        <div className="auth-left-panel">
          <div>
            {/* 1. Logo & Brand */}
            <Link to="/" className="inline-flex items-center gap-3.5 no-underline mb-12">
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

            {/* 3. Headline */}
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0F2359] leading-[1.28] mb-5">
              แจ้งเหตุ ตรวจสอบ
              <br />
              ติดตามคดี ในที่เดียว
            </h1>

            {/* 4. Value Proposition */}
            <p className="text-sm text-slate-600 leading-relaxed mb-8">
              แพลตฟอร์มกลางสำหรับผู้เสียหายและเจ้าหน้าที่สืบสวน ใช้แจ้งเหตุ
              ฉ้อโกงออนไลน์ ตรวจสอบหลักฐาน และติดตามความคืบหน้าคดีได้
              อย่างปลอดภัยและรวดเร็ว
            </p>

            {/* 5. Key Benefits (24/7 & 256-bit) */}
            <div className="grid grid-cols-2 gap-4 pt-2 pb-8 border-b border-slate-100">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center text-xl shrink-0">
                  <i className="bi bi-clock-history"></i>
                </div>
                <div>
                  <div className="text-base font-bold text-[#1D4ED8]">24/7</div>
                  <div className="text-xs text-slate-600 leading-snug">
                    รับแจ้งเหตุ
                    <br />
                    ตลอดเวลา
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 border-l border-slate-200 pl-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center text-xl shrink-0">
                  <i className="bi bi-shield-check"></i>
                </div>
                <div>
                  <div className="text-base font-bold text-[#1D4ED8]">256-bit</div>
                  <div className="text-xs text-slate-600 leading-snug">
                    การเข้ารหัสข้อมูล
                    <br />
                    ระดับมาตรฐานสากล
                  </div>
                </div>
              </div>
            </div>

            {/* แถบเลือกบัญชีทดสอบด่วนสำหรับตรวจงาน */}
            <div className="mt-6 p-3.5 rounded-2xl bg-blue-50/90 border border-blue-200">
              <div className="text-xs font-semibold text-[#1E3A8A] mb-2 flex items-center gap-1.5">
                <i className="bi bi-lightning-charge-fill text-amber-500"></i>
                <span>คลิกเลือกบัญชีทดสอบ (รหัสผ่าน: 123456)</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickFill('somchai.victim@example.com')}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#2563EB] hover:text-white text-[#1E3A8A] border border-blue-200 text-[11px] font-medium cursor-pointer transition-colors"
                >
                  ผู้เสียหาย (สมชาย)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('pitak.officer@ofic.police.go.th')}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#2563EB] hover:text-white text-[#1E3A8A] border border-blue-200 text-[11px] font-medium cursor-pointer transition-colors"
                >
                  เจ้าหน้าที่ (ร.ต.อ.พิทักษ์)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('admin@ofic.police.go.th')}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#2563EB] hover:text-white text-[#1E3A8A] border border-blue-200 text-[11px] font-medium cursor-pointer transition-colors"
                >
                  แอดมิน (พ.ต.อ.ธนากร)
                </button>
              </div>
            </div>
          </div>

          {/* 6. Security Note */}
          <div className="pt-5 border-t border-slate-200 flex items-center gap-2 text-xs text-slate-600">
            <i className="bi bi-shield-fill-check text-emerald-600 text-base"></i>
            <span>ข้อมูลของท่านได้รับการเข้ารหัสและคุ้มครองตลอดการใช้งาน</span>
          </div>
        </div>

        {/* ฝั่งขวา (13. Background สีน้ำเงินเข้ม + 2. ปุ่มสำหรับเจ้าหน้าที่ + การ์ดฟอร์มสีขาว) */}
        <div className="auth-right-panel">
          {/* 2. Back to Officer / สลับโหมดผู้เสียหาย-เจ้าหน้าที่ มุมซ้ายบน */}
          <div className="w-full flex items-center justify-between mb-6 relative z-10">
            <button
              type="button"
              onClick={handleToggleMode}
              className="auth-mode-switch-btn"
            >
              <i className="bi bi-arrow-left"></i>
              <span>
                {loginMode === 'victim' ? 'สำหรับเจ้าหน้าที่' : 'สำหรับประชาชน / ผู้เสียหาย'}
              </span>
              <i className="bi bi-shield-check text-blue-300"></i>
            </button>

            <Link
              to="/"
              className="text-xs text-blue-200 hover:text-white no-underline flex items-center gap-1"
            >
              <i className="bi bi-house"></i>
              <span>หน้าหลัก</span>
            </Link>
          </div>

          {/* การ์ดฟอร์มเข้าสู่ระบบ */}
          <div className="auth-form-card">
            {/* 7. Card Header / Security Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#1D4ED8] text-xs font-semibold mb-4">
              <i className="bi bi-lock-fill"></i>
              <span>
                {loginMode === 'officer'
                  ? 'เข้าสู่ระบบสำหรับเจ้าหน้าที่สืบสวน'
                  : 'เข้าสู่ระบบอย่างปลอดภัย'}
              </span>
            </div>

            <h2 className="text-2xl font-bold text-[#111827] m-0">ยินดีต้อนรับกลับ</h2>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              กรอกข้อมูลบัญชีผู้ใช้ของท่านเพื่อเข้าใช้งานระบบ
            </p>

            {/* แท็บสลับโหมด 2 แท็บชัดเจน */}
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100 mb-5">
              <button
                type="button"
                onClick={() => setLoginMode('victim')}
                className={`py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  loginMode === 'victim'
                    ? 'bg-[#1E3A8A] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <i className="bi bi-person-fill mr-1"></i>
                ผู้เสียหาย
              </button>
              <button
                type="button"
                onClick={() => setLoginMode('officer')}
                className={`py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  loginMode === 'officer'
                    ? 'bg-[#1E3A8A] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <i className="bi bi-shield-shaded mr-1"></i>
                เจ้าหน้าที่ / Admin
              </button>
            </div>

            {errors.form && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 mb-4 flex items-center gap-2">
                <i className="bi bi-exclamation-circle-fill text-red-600"></i>
                <span>{errors.form}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* 8. Email Field */}
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                  อีเมล
                </label>
                <div className="relative">
                  <i className="bi bi-envelope text-slate-400 absolute left-4 top-1/2 -translate-y-1/2"></i>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className={`ofic-input pl-11 ${errors.email ? 'ofic-input-error' : ''}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                )}
              </div>

              {/* 9. Password Field */}
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                  รหัสผ่าน
                </label>
                <div className="relative">
                  <i className="bi bi-lock text-slate-400 absolute left-4 top-1/2 -translate-y-1/2"></i>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`ofic-input pl-11 pr-11 ${
                      errors.password ? 'ofic-input-error' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    aria-label="แสดงหรือซ่อนรหัสผ่าน"
                  >
                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-600 mt-1">{errors.password}</p>
                )}
              </div>

              {/* 10. Options Row (จดจำฉันไว้ / ลืมรหัสผ่าน?) */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="inline-flex items-center gap-2 text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-[#2563EB]"
                  />
                  <span>จดจำฉันไว้</span>
                </label>
                <button
                  type="button"
                  onClick={() =>
                    showToast(
                      'สำหรับบัญชีทดสอบสามารถใช้รหัสผ่าน 123456 หรือคลิกปุ่มเลือกบัญชีด้านซ้ายได้ทันที',
                      'warning'
                    )
                  }
                  className="text-[#2563EB] hover:underline font-medium cursor-pointer"
                >
                  ลืมรหัสผ่าน?
                </button>
              </div>

              {/* 11. Login Button */}
              <button
                type="submit"
                disabled={submitting}
                className="ofic-btn ofic-btn-primary w-full text-base font-semibold mt-2"
              >
                <span>{submitting ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}</span>
                <i className="bi bi-arrow-right"></i>
              </button>
            </form>

            <div className="relative my-6 text-center">
              <div className="border-t border-slate-200"></div>
              <span className="bg-white px-3 text-xs text-slate-400 relative -top-2.5">
                หรือ
              </span>
            </div>

            {/* 12. Register Link */}
            <div className="text-center text-xs text-slate-600">
              ยังไม่มีบัญชีผู้ใช้งาน?{' '}
              <Link
                to="/register"
                className="text-[#1D4ED8] font-bold hover:underline no-underline"
              >
                ลงทะเบียนแจ้งเหตุ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
