// ฟังก์ชันจัดรูปแบบวันที่ภาษาไทยและจำนวนเงินบาท

/**
 * แปลงตัวเลขเป็นสกุลเงินบาทไทย เช่น 125,000 บาท
 */
export function formatCurrency(amount, showDecimals = false) {
  const num = Number(amount || 0);
  if (Number.isNaN(num)) return '0 บาท';
  return `${num.toLocaleString('th-TH', {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0
  })} บาท`;
}

/**
 * แปลงวันที่เป็นรูปแบบภาษาไทย เช่น 2 ก.ค. 2569
 */
export function formatThaiDate(dateStr, includeTime = false) {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return dateStr;

    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };

    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }

    return date.toLocaleDateString('th-TH', options);
  } catch {
    return dateStr;
  }
}

/**
 * จัดรูปแบบเบอร์โทรศัพท์ เช่น 081-234-5678
 */
export function formatPhone(phone) {
  if (!phone) return '-';
  const cleaned = String(phone).replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

/**
 * ปิดบังเลขบัตรประชาชนบางส่วนเพื่อความปลอดภัย
 */
export function maskNationalId(id) {
  if (!id) return '-';
  const cleaned = String(id).replace(/\D/g, '');
  if (cleaned.length === 13) {
    return `${cleaned[0]}-${cleaned.slice(1, 5)}-XXXXX-${cleaned.slice(10, 12)}-${cleaned[12]}`;
  }
  return id;
}
