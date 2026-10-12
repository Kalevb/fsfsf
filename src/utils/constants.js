// ค่าคงที่ของระบบศูนย์สืบสวนคดีฉ้อโกงออนไลน์ (OFIC)

export const CASE_TYPES = {
  call_center: {
    code: 'call_center',
    caseTypeId: 'caseType_001',
    name: 'หลอกลวงทางโทรศัพท์ (แก๊ง Call Center)',
    nameEn: 'Call Center Scam',
    shortDesc: 'แก๊งคอลเซ็นเตอร์ หลอกลวงทางโทรศัพท์ อ้างเป็นเจ้าหน้าที่ หลอกให้โอนเงิน',
    icon: 'bi-headset',
    color: '#2563EB'
  },
  investment: {
    code: 'investment',
    caseTypeId: 'caseType_002',
    name: 'หลอกลงทุนออนไลน์ (Investment Scam)',
    nameEn: 'Investment Scam',
    shortDesc: 'หลอกลงทุน ผ่านแพลตฟอร์มปลอม สัญญาผลตอบแทนสูงผิดปกติ',
    icon: 'bi-graph-up-arrow',
    color: '#1E3A8A'
  },
  online_shopping: {
    code: 'online_shopping',
    caseTypeId: 'caseType_003',
    name: 'หลอกขายสินค้า/บริการออนไลน์ (Online Shopping Scam)',
    nameEn: 'Online Shopping Scam',
    shortDesc: 'หลอกขายสินค้า/บริการออนไลน์ ไม่ได้รับสินค้า ไม่ได้รับบริการ',
    icon: 'bi-cart3',
    color: '#0284C7'
  }
};

export const CASE_STATUSES = {
  pending: {
    key: 'pending',
    label: 'รอรับเรื่อง / รอตรวจสอบ',
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    textColor: '#B45309',
    icon: 'bi-hourglass-split'
  },
  investigating: {
    key: 'investigating',
    label: 'กำลังสืบสวน',
    color: '#2563EB',
    bgColor: '#DBEAFE',
    textColor: '#1D4ED8',
    icon: 'bi-search'
  },
  evidence_review: {
    key: 'evidence_review',
    label: 'กำลังตรวจสอบหลักฐาน',
    color: '#7C3AED',
    bgColor: '#EDE9FE',
    textColor: '#6D28D9',
    icon: 'bi-file-earmark-check'
  },
  closed: {
    key: 'closed',
    label: 'คลี่คลาย / ปิดคดีแล้ว',
    color: '#16A34A',
    bgColor: '#DCFCE7',
    textColor: '#15803D',
    icon: 'bi-check-circle-fill'
  },
  rejected: {
    key: 'rejected',
    label: 'ไม่รับคำร้อง / ข้อมูลไม่ครบ',
    color: '#DC2626',
    bgColor: '#FEE2E2',
    textColor: '#B91C1C',
    icon: 'bi-x-circle-fill'
  }
};

export const EVIDENCE_STATUSES = {
  pending: {
    key: 'pending',
    label: 'รอการตรวจสอบ',
    bgColor: '#FEF3C7',
    textColor: '#B45309',
    icon: 'bi-clock-history'
  },
  verified: {
    key: 'verified',
    label: 'ยืนยันหลักฐานถูกต้อง (Verified)',
    bgColor: '#DCFCE7',
    textColor: '#15803D',
    icon: 'bi-patch-check-fill'
  },
  rejected: {
    key: 'rejected',
    label: 'ปฏิเสธหลักฐาน (Rejected)',
    bgColor: '#FEE2E2',
    textColor: '#B91C1C',
    icon: 'bi-exclamation-octagon-fill'
  }
};

export const THAI_BANKS = [
  'ธนาคารกสิกรไทย (KBANK)',
  'ธนาคารไทยพาณิชย์ (SCB)',
  'ธนาคารกรุงไทย (KTB)',
  'ธนาคารกรุงเทพ (BBL)',
  'ธนาคารกรุงศรีอยุธยา (BAY)',
  'ธนาคารทหารไทยธนชาต (ttb)',
  'ธนาคารออมสิน (GSB)',
  'ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร (ธ.ก.ส.)',
  'ธนาคารยูโอบี (UOB)',
  'ธนาคารซีไอเอ็มบี ไทย (CIMB)',
  'วอลเล็ท / สินทรัพย์ดิจิทัล (TrueMoney / Crypto)'
];

export const ROLES = {
  victim: { key: 'victim', label: 'ผู้เสียหาย (Victim)' },
  officer: { key: 'officer', label: 'เจ้าหน้าที่สืบสวน (Officer)' },
  admin: { key: 'admin', label: 'ผู้ดูแลระบบ (Admin)' }
};
