// ฟังก์ชันตรวจสอบความถูกต้องของข้อมูลฟอร์ม (Validation)

export function validateEmail(email) {
  if (!email || !email.trim()) return 'กรุณากรอกอีเมล';
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email.trim())) return 'รูปแบบอีเมลไม่ถูกต้อง';
  return '';
}

export function validatePassword(password) {
  if (!password) return 'กรุณากรอกรหัสผ่าน';
  if (password.length < 6) return 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร';
  return '';
}

export function validatePhone(phone) {
  if (!phone || !String(phone).trim()) return 'กรุณากรอกหมายเลขโทรศัพท์';
  const cleaned = String(phone).replace(/\D/g, '');
  if (cleaned.length < 9 || cleaned.length > 10) {
    return 'หมายเลขโทรศัพท์ต้องเป็นตัวเลข 9-10 หลัก';
  }
  return '';
}

export function validateNationalId(nationalId) {
  if (!nationalId || !String(nationalId).trim()) return 'กรุณากรอกเลขประจำตัวประชาชน 13 หลัก';
  const cleaned = String(nationalId).replace(/\D/g, '');
  if (cleaned.length !== 13) return 'เลขประจำตัวประชาชนต้องมี 13 หลัก';
  return '';
}

export function validateEvidenceFile(file) {
  if (!file) return 'กรุณาเลือกไฟล์หลักฐาน';
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'video/mp4'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(file.type)) {
    return 'รองรับเฉพาะไฟล์นามสกุล .jpg, .png, .pdf และ .mp4 เท่านั้น';
  }
  if (file.size > maxSize) {
    return 'ขนาดไฟล์ต้องไม่เกิน 10 MB';
  }
  return '';
}
