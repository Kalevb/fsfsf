// ฟอร์มกรอกข้อมูลผู้ต้องสงสัย / บัญชีม้า (ใช้ในขั้นตอนที่ 3 ของการแจ้งเหตุคดี)
import React from 'react';
import { THAI_BANKS } from '../../utils/constants';

export default function SuspectForm({ formData, onChange, errors = {} }) {
  return (
    <div className="space-y-5">
      <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-[#1E3A8A] flex items-start gap-3">
        <i className="bi bi-info-circle-fill text-lg text-[#2563EB] shrink-0"></i>
        <div>
          <strong>ข้อมูลสำคัญสำหรับการตรวจจับคดีซ้ำ (Duplicate Detection):</strong>{' '}
          ระบบจะนำหมายเลขโทรศัพท์ เลขที่บัญชีธนาคาร และ URL เว็บไซต์ของคนร้ายไปเปรียบเทียบกับฐานข้อมูลคดีทั่วประเทศโดยอัตโนมัติ
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-[#111827] mb-1.5">
            ชื่อ-นามสกุลผู้ต้องสงสัย / ชื่อบัญชีม้า <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="suspectName"
            value={formData.suspectName}
            onChange={onChange}
            placeholder="เช่น นายวิชัย มณีวงศ์ หรือชื่อเพจร้านค้า"
            className={`ofic-input ${errors.suspectName ? 'ofic-input-error' : ''}`}
          />
          {errors.suspectName && (
            <p className="text-xs text-red-600 mt-1">{errors.suspectName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#111827] mb-1.5">
            หมายเลขโทรศัพท์คนร้าย <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="suspectPhone"
            value={formData.suspectPhone}
            onChange={onChange}
            placeholder="เช่น 0891112222 (กรอกเฉพาะตัวเลข)"
            className={`ofic-input ${errors.suspectPhone ? 'ofic-input-error' : ''}`}
          />
          {errors.suspectPhone && (
            <p className="text-xs text-red-600 mt-1">{errors.suspectPhone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#111827] mb-1.5">
            ธนาคารของบัญชีคนร้าย <span className="text-red-600">*</span>
          </label>
          <select
            name="suspectBankName"
            value={formData.suspectBankName}
            onChange={onChange}
            className={`ofic-select ${errors.suspectBankName ? 'ofic-input-error' : ''}`}
          >
            <option value="">-- เลือกธนาคารปลายทาง --</option>
            {THAI_BANKS.map((bank) => (
              <option key={bank} value={bank}>
                {bank}
              </option>
            ))}
          </select>
          {errors.suspectBankName && (
            <p className="text-xs text-red-600 mt-1">{errors.suspectBankName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#111827] mb-1.5">
            เลขที่บัญชีธนาคารคนร้าย <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="suspectBankAccount"
            value={formData.suspectBankAccount}
            onChange={onChange}
            placeholder="เช่น 1234567890"
            className={`ofic-input ${errors.suspectBankAccount ? 'ofic-input-error' : ''}`}
          />
          {errors.suspectBankAccount && (
            <p className="text-xs text-red-600 mt-1">{errors.suspectBankAccount}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#111827] mb-1.5">
            เว็บไซต์ / ลิงก์แพลตฟอร์มปลอม (ถ้ามี)
          </label>
          <input
            type="text"
            name="suspectWebsite"
            value={formData.suspectWebsite}
            onChange={onChange}
            placeholder="เช่น https://global-gold-trade-vip.net"
            className="ofic-input"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#111827] mb-1.5">
            บัญชีโซเชียลมีเดีย / LINE ID ของคนร้าย (ถ้ามี)
          </label>
          <input
            type="text"
            name="suspectSocial"
            value={formData.suspectSocial}
            onChange={onChange}
            placeholder="เช่น LINE ID: @police_verify_th หรือชื่อเพจ Facebook"
            className="ofic-input"
          />
        </div>
      </div>
    </div>
  );
}
