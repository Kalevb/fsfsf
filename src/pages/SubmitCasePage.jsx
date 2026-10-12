// หน้าแจ้งเหตุคดีฉ้อโกงออนไลน์ 5 ขั้นตอน (/victim/submit-case) ตาม User Flow Flow 1 และข้อกำหนดหัวข้อ 4 & 6
// ขั้นตอน: 1. ข้อมูลผู้แจ้ง -> 2. รายละเอียดเหตุการณ์ -> 3. ข้อมูลผู้ต้องสงสัย -> 4. อัปโหลดหลักฐาน -> 5. ตรวจสอบและยืนยัน
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import SuspectForm from '../components/cases/SuspectForm';
import { useAuth } from '../hooks/useAuth';
import { createNewCase } from '../services/caseService';
import { uploadEvidenceFile } from '../services/evidenceService';
import { CASE_TYPES } from '../utils/constants';
import { formatCurrency } from '../utils/format';
import {
  validatePhone,
  validateNationalId,
  validateEvidenceFile
} from '../utils/validators';

const STEPS = [
  { num: 1, title: 'ข้อมูลผู้แจ้ง', icon: 'bi-person-vcard' },
  { num: 2, title: 'รายละเอียดเหตุการณ์', icon: 'bi-file-earmark-text' },
  { num: 3, title: 'ข้อมูลผู้ต้องสงสัย', icon: 'bi-person-bounding-box' },
  { num: 4, title: 'อัปโหลดหลักฐาน', icon: 'bi-cloud-arrow-up' },
  { num: 5, title: 'ตรวจสอบและยืนยัน', icon: 'bi-shield-check' }
];

export default function SubmitCasePage() {
  const { user, showToast } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [formData, setFormData] = useState({
    victimName: user?.name || '',
    victimPhone: user?.phone || '',
    victimEmail: user?.email || '',
    victimNationalId: user?.victimProfile?.nationalId || '1100400556677',
    victimAddress:
      user?.victimProfile?.address ||
      '123/45 ถนนพหลโยธิน แขวงจตุจักร เขตจตุจักร กรุงเทพมหานคร 10900',
    caseType: 'call_center',
    incidentDate: '2026-10-09',
    incidentTime: '10:30',
    incidentLocation: 'ติดต่อผ่านโทรศัพท์และแอปพลิเคชัน LINE',
    damageAmount: '',
    description: '',
    policeReportFiled: false,
    policeReportNumber: '',
    suspectName: '',
    suspectPhone: '',
    suspectBankName: '',
    suspectBankAccount: '',
    suspectWebsite: '',
    suspectSocial: '',
    evidenceNote: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newErrors = {};
    const validList = [];

    files.forEach((file) => {
      const err = validateEvidenceFile(file);
      if (err) {
        newErrors.evidenceFile = err;
      } else {
        validList.push(file);
      }
    });

    if (newErrors.evidenceFile) {
      setErrors((prev) => ({ ...prev, ...newErrors }));
      return;
    }

    setErrors((prev) => ({ ...prev, evidenceFile: '' }));
    setSelectedFiles((prev) => [...prev, ...validList]);
  };

  const removeSelectedFile = (idx) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  // ตรวจสอบความถูกต้องของข้อมูลในแต่ละขั้นตอน (Validation ทุกขั้น)
  const validateCurrentStep = () => {
    const stepErrors = {};

    if (currentStep === 1) {
      if (!formData.victimName.trim()) stepErrors.victimName = 'กรุณากรอกชื่อ-นามสกุลผู้แจ้ง';
      const phoneErr = validatePhone(formData.victimPhone);
      if (phoneErr) stepErrors.victimPhone = phoneErr;
      const nidErr = validateNationalId(formData.victimNationalId);
      if (nidErr) stepErrors.victimNationalId = nidErr;
    } else if (currentStep === 2) {
      if (!formData.caseType) stepErrors.caseType = 'กรุณาเลือกประเภทคดีฉ้อโกง';
      if (!formData.incidentDate) stepErrors.incidentDate = 'กรุณาระบุวันที่เกิดเหตุ';
      if (!formData.damageAmount || Number(formData.damageAmount) <= 0) {
        stepErrors.damageAmount = 'กรุณาระบุมูลค่าความเสียหาย (บาท) ที่มากกว่า 0';
      }
      if (!formData.description.trim() || formData.description.trim().length < 15) {
        stepErrors.description = 'กรุณาบรรยายพฤติการณ์เหตุการณ์อย่างน้อย 15 ตัวอักษร';
      }
    } else if (currentStep === 3) {
      if (!formData.suspectName.trim()) {
        stepErrors.suspectName = 'กรุณาระบุชื่อบัญชีม้า หรือชื่อเพจ/ผู้ต้องสงสัย';
      }
      const sPhoneErr = validatePhone(formData.suspectPhone);
      if (sPhoneErr) stepErrors.suspectPhone = sPhoneErr;
      if (!formData.suspectBankName) {
        stepErrors.suspectBankName = 'กรุณาเลือกธนาคารของบัญชีคนร้าย';
      }
      if (
        !formData.suspectBankAccount.trim() ||
        formData.suspectBankAccount.replace(/\D/g, '').length < 6
      ) {
        stepErrors.suspectBankAccount = 'กรุณากรอกเลขที่บัญชีธนาคารอย่างน้อย 6 หลัก';
      }
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(5, prev + 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setErrors({});
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const createdCase = await createNewCase(formData, user);

      // อัปโหลดไฟล์หลักฐานขึ้น Firebase Storage หากผู้ใช้แนบไฟล์มา
      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          await uploadEvidenceFile(
            createdCase.caseId,
            file,
            formData.evidenceNote || 'แนบหลักฐานพร้อมการแจ้งเหตุ',
            user
          );
        }
      }

      showToast(
        `บันทึกการแจ้งเหตุสำเร็จ รหัสคดีของท่านคือ ${createdCase.caseCode}`,
        'success'
      );
      navigate('/victim/track-status');
    } catch (err) {
      showToast(err.message || 'เกิดข้อผิดพลาดในการส่งข้อมูลแจ้งเหตุ', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell title="แจ้งเหตุคดีฉ้อโกงออนไลน์ (Submit Case 5 ขั้นตอน)">
      {/* แบนเนอร์หัวข้อ */}
      <div className="ofic-page-banner mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs text-blue-100 mb-2">
              <i className="bi bi-file-earmark-lock2"></i>
              <span>แบบฟอร์มร้องทุกข์อิเล็กทรอนิกส์ (Online Fraud Report)</span>
            </span>
            <h2 className="text-2xl font-bold m-0">แจ้งเหตุคดีฉ้อโกงออนไลน์ 5 ขั้นตอน</h2>
            <p className="text-xs sm:text-sm text-blue-100 mt-1 mb-0">
              กรอกข้อมูลตามความจริงเพื่อให้เจ้าหน้าที่ใช้ตรวจสอบเส้นทางการเงินและตรวจจับเครือข่ายบัญชีม้า
            </p>
          </div>
          <div className="text-right hidden md:block">
            <div className="text-xs text-blue-200">ขั้นตอนปัจจุบัน</div>
            <div className="text-2xl font-bold">{currentStep} / 5</div>
          </div>
        </div>
      </div>

      {/* Stepper แถบแสดง 5 ขั้นตอน */}
      <div className="ofic-card p-5 mb-6 bg-white border-blue-200">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {STEPS.map((st) => {
            const isActive = st.num === currentStep;
            const isCompleted = st.num < currentStep;
            return (
              <div
                key={st.num}
                className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                  isActive
                    ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-md'
                    : isCompleted
                      ? 'bg-blue-50 text-[#1E3A8A] border-blue-300'
                      : 'bg-slate-50 text-slate-500 border-slate-200'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${
                    isActive
                      ? 'bg-[#2563EB] text-white'
                      : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isCompleted ? <i className="bi bi-check-lg"></i> : st.num}
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] opacity-80">ขั้นตอนที่ {st.num}</div>
                  <div className="text-xs font-semibold truncate">{st.title}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* กล่องฟอร์มตามขั้นตอน */}
      <div className="ofic-card p-6 sm:p-8 bg-white border-blue-200">
        {/* ขั้นตอนที่ 1: ข้อมูลผู้แจ้ง */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <div className="pb-3 border-b border-blue-100">
              <h3 className="text-lg font-bold text-[#1E3A8A] m-0 flex items-center gap-2">
                <i className="bi bi-person-vcard text-[#2563EB]"></i>
                <span>ขั้นตอนที่ 1: ข้อมูลผู้แจ้งเหตุ (ผู้เสียหาย)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1 mb-0">
                ตรวจสอบข้อมูลติดต่อของท่านเพื่อให้พนักงานสอบสวนสามารถประสานงานกลับได้
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                  ชื่อ-นามสกุลผู้เสียหาย <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="victimName"
                  value={formData.victimName}
                  onChange={handleChange}
                  className={`ofic-input ${errors.victimName ? 'ofic-input-error' : ''}`}
                />
                {errors.victimName && (
                  <p className="text-xs text-red-600 mt-1">{errors.victimName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                  เลขประจำตัวประชาชน 13 หลัก <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="victimNationalId"
                  maxLength={13}
                  value={formData.victimNationalId}
                  onChange={handleChange}
                  className={`ofic-input ${errors.victimNationalId ? 'ofic-input-error' : ''}`}
                />
                {errors.victimNationalId && (
                  <p className="text-xs text-red-600 mt-1">{errors.victimNationalId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                  หมายเลขโทรศัพท์ติดต่อ <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="victimPhone"
                  value={formData.victimPhone}
                  onChange={handleChange}
                  className={`ofic-input ${errors.victimPhone ? 'ofic-input-error' : ''}`}
                />
                {errors.victimPhone && (
                  <p className="text-xs text-red-600 mt-1">{errors.victimPhone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                  อีเมลสำหรับรับแจ้งเตือน
                </label>
                <input
                  type="email"
                  name="victimEmail"
                  value={formData.victimEmail}
                  onChange={handleChange}
                  className="ofic-input"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                  ที่อยู่ปัจจุบัน
                </label>
                <input
                  type="text"
                  name="victimAddress"
                  value={formData.victimAddress}
                  onChange={handleChange}
                  className="ofic-input"
                />
              </div>
            </div>
          </div>
        )}

        {/* ขั้นตอนที่ 2: รายละเอียดเหตุการณ์และมูลค่าความเสียหาย */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <div className="pb-3 border-b border-blue-100">
              <h3 className="text-lg font-bold text-[#1E3A8A] m-0 flex items-center gap-2">
                <i className="bi bi-file-earmark-text text-[#2563EB]"></i>
                <span>ขั้นตอนที่ 2: รายละเอียดเหตุการณ์และมูลค่าความเสียหาย</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1 mb-0">
                เลือกประเภทภัยคุกคามออนไลน์ วันเวลาที่เกิดเหตุ และจำนวนเงินที่ได้รับความเสียหาย
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-2">
                ประเภทคดีฉ้อโกงออนไลน์ <span className="text-red-600">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {Object.values(CASE_TYPES).map((tp) => {
                  const active = formData.caseType === tp.code;
                  return (
                    <button
                      key={tp.code}
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, caseType: tp.code }))}
                      className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                        active
                          ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-md'
                          : 'bg-blue-50/50 text-slate-800 border-blue-200 hover:border-blue-400'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <i
                          className={`bi ${tp.icon} text-xl ${
                            active ? 'text-blue-300' : 'text-[#2563EB]'
                          }`}
                        ></i>
                        <span className="font-bold text-sm">{tp.nameEn}</span>
                      </div>
                      <div className={`text-xs ${active ? 'text-blue-100' : 'text-slate-600'}`}>
                        {tp.name}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                  วันที่เกิดเหตุ <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  name="incidentDate"
                  value={formData.incidentDate}
                  onChange={handleChange}
                  className={`ofic-input ${errors.incidentDate ? 'ofic-input-error' : ''}`}
                />
                {errors.incidentDate && (
                  <p className="text-xs text-red-600 mt-1">{errors.incidentDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                  เวลาที่เกิดเหตุ (โดยประมาณ)
                </label>
                <input
                  type="time"
                  name="incidentTime"
                  value={formData.incidentTime}
                  onChange={handleChange}
                  className="ofic-input"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                  มูลค่าความเสียหายรวม (บาท) <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  name="damageAmount"
                  min="1"
                  value={formData.damageAmount}
                  onChange={handleChange}
                  placeholder="เช่น 125000"
                  className={`ofic-input ${errors.damageAmount ? 'ofic-input-error' : ''}`}
                />
                {errors.damageAmount && (
                  <p className="text-xs text-red-600 mt-1">{errors.damageAmount}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                ช่องทางหรือสถานที่เกิดเหตุ
              </label>
              <input
                type="text"
                name="incidentLocation"
                value={formData.incidentLocation}
                onChange={handleChange}
                placeholder="เช่น โทรศัพท์แอบอ้างเจ้าหน้าที่, เพจ Facebook, เว็บไซต์ลงทุนปลอม"
                className="ofic-input"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                รายละเอียดพฤติการณ์ของคนร้ายโดยละเอียด <span className="text-red-600">*</span>
              </label>
              <textarea
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="อธิบายลำดับเหตุการณ์ วิธีการที่คนร้ายติดต่อเข้ามา คำพูดหลอกลวง และการโอนเงิน..."
                className={`ofic-textarea ${errors.description ? 'ofic-input-error' : ''}`}
              />
              {errors.description && (
                <p className="text-xs text-red-600 mt-1">{errors.description}</p>
              )}
            </div>

            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex flex-wrap items-center justify-between gap-4">
              <label className="inline-flex items-center gap-2.5 text-sm font-semibold text-[#1E3A8A] cursor-pointer">
                <input
                  type="checkbox"
                  name="policeReportFiled"
                  checked={formData.policeReportFiled}
                  onChange={handleChange}
                  className="w-4 h-4 rounded"
                />
                <span>เคยลงบันทึกประจำวันกับสถานีตำรวจแล้ว</span>
              </label>

              {formData.policeReportFiled && (
                <div className="flex-1 min-w-[240px]">
                  <input
                    type="text"
                    name="policeReportNumber"
                    value={formData.policeReportNumber}
                    onChange={handleChange}
                    placeholder="ระบุเลขที่ใบแจ้งความ เช่น ตอท. 145/2569"
                    className="ofic-input h-10 text-xs"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ขั้นตอนที่ 3: ข้อมูลผู้ต้องสงสัย */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <div className="pb-3 border-b border-blue-100">
              <h3 className="text-lg font-bold text-[#1E3A8A] m-0 flex items-center gap-2">
                <i className="bi bi-person-bounding-box text-[#2563EB]"></i>
                <span>ขั้นตอนที่ 3: ข้อมูลผู้ต้องสงสัยและบัญชีม้า</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1 mb-0">
                ระบุข้อมูลบัญชีธนาคารและเบอร์โทรศัพท์ของคนร้ายเพื่อใช้ตรวจจับความเชื่อมโยงกับคดีอื่น
              </p>
            </div>

            <SuspectForm formData={formData} onChange={handleChange} errors={errors} />
          </div>
        )}

        {/* ขั้นตอนที่ 4: อัปโหลดหลักฐาน */}
        {currentStep === 4 && (
          <div className="space-y-5">
            <div className="pb-3 border-b border-blue-100">
              <h3 className="text-lg font-bold text-[#1E3A8A] m-0 flex items-center gap-2">
                <i className="bi bi-cloud-arrow-up text-[#2563EB]"></i>
                <span>ขั้นตอนที่ 4: อัปโหลดไฟล์พยานหลักฐาน (Firebase Storage)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1 mb-0">
                รองรับไฟล์รูปภาพ (.jpg, .png), เอกสาร (.pdf) และวิดีโอ (.mp4) ขนาดไม่เกิน 10 MB ต่อไฟล์
              </p>
            </div>

            <div className="p-8 rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50/50 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#2563EB] text-white flex items-center justify-center text-3xl mx-auto mb-3 shadow-md">
                <i className="bi bi-cloud-plus-fill"></i>
              </div>
              <h4 className="text-base font-bold text-[#1E3A8A] mb-1">
                เลือกไฟล์สลิปโอนเงิน หรือภาพหน้าจอแชทคนร้าย
              </h4>
              <p className="text-xs text-slate-600 mb-4">
                จำกัดชนิดไฟล์ .jpg, .png, .pdf, .mp4 (ขนาดสูงสุดไม่เกิน 10 MB)
              </p>
              <label className="ofic-btn ofic-btn-primary cursor-pointer inline-flex">
                <i className="bi bi-folder2-open"></i>
                <span>เลือกไฟล์จากอุปกรณ์</span>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf,.mp4"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
              {errors.evidenceFile && (
                <p className="text-xs text-red-600 font-semibold mt-3">
                  <i className="bi bi-exclamation-circle mr-1"></i>
                  {errors.evidenceFile}
                </p>
              )}
            </div>

            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-bold text-[#1E3A8A]">
                  ไฟล์ที่เตรียมอัปโหลด ({selectedFiles.length} รายการ):
                </div>
                {selectedFiles.map((file, idx) => (
                  <div
                    key={`${file.name}-${idx}`}
                    className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <i className="bi bi-file-earmark-check-fill text-[#2563EB] text-lg"></i>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-900 truncate">
                          {file.name}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {(file.size / 1024).toFixed(1)} KB • {file.type}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSelectedFile(idx)}
                      className="text-red-600 hover:text-red-800 text-sm px-2 cursor-pointer"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                คำอธิบายประกอบหลักฐานเพิ่มเติม
              </label>
              <input
                type="text"
                name="evidenceNote"
                value={formData.evidenceNote}
                onChange={handleChange}
                placeholder="เช่น สลิปโอนเงินครั้งที่ 1 เวลา 14:20 น. และภาพแชทข่มขู่"
                className="ofic-input"
              />
            </div>
          </div>
        )}

        {/* ขั้นตอนที่ 5: ตรวจสอบและยืนยันการส่งคดี */}
        {currentStep === 5 && (
          <div className="space-y-5">
            <div className="pb-3 border-b border-blue-100">
              <h3 className="text-lg font-bold text-[#1E3A8A] m-0 flex items-center gap-2">
                <i className="bi bi-shield-check text-[#2563EB]"></i>
                <span>ขั้นตอนที่ 5: ตรวจสอบความถูกต้องและยืนยันการส่งคดี</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1 mb-0">
                กรุณาตรวจสอบข้อมูลสรุปทั้งหมดก่อนกดยืนยันส่งเข้าสู่ระบบศูนย์สืบสวนคดีฉ้อโกงออนไลน์
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2 text-xs">
                <div className="font-bold text-sm text-[#1E3A8A] pb-1 border-b border-blue-200">
                  1. ข้อมูลผู้เสียหาย
                </div>
                <div>
                  <span className="text-slate-500">ชื่อ-นามสกุล:</span>{' '}
                  <strong className="text-slate-900">{formData.victimName}</strong>
                </div>
                <div>
                  <span className="text-slate-500">เลขบัตรประชาชน:</span>{' '}
                  <strong className="text-slate-900">{formData.victimNationalId}</strong>
                </div>
                <div>
                  <span className="text-slate-500">เบอร์โทรศัพท์:</span>{' '}
                  <strong className="text-slate-900">{formData.victimPhone}</strong>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2 text-xs">
                <div className="font-bold text-sm text-[#1E3A8A] pb-1 border-b border-blue-200">
                  2. ข้อมูลผู้ต้องสงสัย / บัญชีม้า
                </div>
                <div>
                  <span className="text-slate-500">ชื่อผู้ต้องสงสัย:</span>{' '}
                  <strong className="text-slate-900">{formData.suspectName}</strong>
                </div>
                <div>
                  <span className="text-slate-500">เบอร์โทรคนร้าย:</span>{' '}
                  <strong className="text-slate-900">{formData.suspectPhone}</strong>
                </div>
                <div>
                  <span className="text-slate-500">บัญชีธนาคาร:</span>{' '}
                  <strong className="text-[#1D4ED8]">
                    {formData.suspectBankName} ({formData.suspectBankAccount})
                  </strong>
                </div>
              </div>

              <div className="md:col-span-2 p-4 rounded-2xl bg-white border border-blue-200 space-y-2 text-xs">
                <div className="font-bold text-sm text-[#1E3A8A] pb-1 border-b border-blue-100">
                  3. รายละเอียดเหตุการณ์และความเสียหาย
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <span className="text-slate-500">ประเภทคดี:</span>{' '}
                    <strong>{CASE_TYPES[formData.caseType]?.name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">วันที่เกิดเหตุ:</span>{' '}
                    <strong>
                      {formData.incidentDate} ({formData.incidentTime} น.)
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500">ความเสียหาย:</span>{' '}
                    <strong className="text-red-600 text-sm">
                      {formatCurrency(formData.damageAmount)}
                    </strong>
                  </div>
                </div>
                <div className="pt-2 text-slate-700">
                  <span className="text-slate-500">พฤติการณ์คดี:</span> {formData.description}
                </div>
                <div className="pt-1 text-blue-700 font-medium">
                  จำนวนไฟล์หลักฐานที่แนบ: {selectedFiles.length} ไฟล์
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ปุ่มย้อนกลับ / ถัดไป / ยืนยันส่งคดี */}
        <div className="mt-8 pt-5 border-t border-blue-100 flex items-center justify-between gap-4">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              disabled={submitting}
              className="ofic-btn ofic-btn-outline"
            >
              <i className="bi bi-arrow-left"></i>
              <span>ย้อนกลับ</span>
            </button>
          ) : (
            <div></div>
          )}

          {currentStep < 5 ? (
            <button type="button" onClick={handleNext} className="ofic-btn ofic-btn-primary">
              <span>ขั้นตอนถัดไป</span>
              <i className="bi bi-arrow-right"></i>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={submitting}
              className="ofic-btn ofic-btn-primary px-8"
            >
              <i className="bi bi-send-check-fill"></i>
              <span>{submitting ? 'กำลังส่งข้อมูลคดี...' : 'ยืนยันและส่งข้อมูลแจ้งเหตุ'}</span>
            </button>
          )}
        </div>
      </div>
    </AppShell>
  );
}
