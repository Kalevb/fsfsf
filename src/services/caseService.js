// บริการจัดการข้อมูลคดีฉ้อโกงออนไลน์ (Firebase Realtime Database)
// ดึงข้อมูลจาก Firebase Realtime Database โดยตรง และรองรับการซิงค์ข้อมูลเริ่มต้นอัตโนมัติหากฐานข้อมูลว่างเปล่า
import {
  ref,
  get,
  set,
  update,
  onValue,
  runTransaction
} from 'firebase/database';
import { db } from './firebase';

// แคชข้อมูลในหน่วยความจำกรณีที่ Firebase Realtime Database ยังไม่ได้ตั้งค่า Rules เป็นการอนุญาตอ่านชั่วคราว
let runtimeMemoryStore = null;

/**
 * โหลดข้อมูลเริ่มต้นจาก Firebase Realtime Database
 * หากในโปรเจกต์ Firebase ยังว่างเปล่า จะพยายามบันทึกโครงสร้างเริ่มต้นหรือจำลองจากแคชเพื่อให้ระบบทำงานได้ 100%
 */
async function ensureRealtimeDataLoaded() {
  try {
    const casesSnap = await get(ref(db, 'cases'));
    if (casesSnap.exists()) {
      return true;
    }
  } catch (err) {
    console.warn('Firebase RTDB direct read status:', err.message);
  }
  return false;
}

// ข้อมูลเริ่มต้นสำหรับซิงค์เข้า Firebase Realtime Database อัตโนมัติหากผู้ใช้ยังไม่ได้กด Import JSON ใน Console
const INITIAL_FIREBASE_NODES = {
  stats: {
    totalCases: 12,
    totalDamage: 2121300,
    landingStats: {
      totalReported: 12458,
      resolvedCases: 7895,
      resolvedPercentage: 63.4,
      recoveredDamageMillions: 256.42,
      avgProcessingDays: 18
    },
    byStatus: {
      pending: 2,
      investigating: 3,
      evidence_review: 3,
      closed: 3,
      rejected: 1
    },
    byType: {
      call_center: 4,
      investment: 4,
      online_shopping: 4
    }
  },
  cases: {
    case_001: {
      caseId: 'case_001',
      caseCode: 'CASE-2026-001',
      caseTypeId: 'caseType_001',
      caseType: 'call_center',
      victimId: 'user_v001',
      victimName: 'สมชาย ใจดี',
      victimPhone: '0812345678',
      assignedOfficerId: 'user_o001',
      assignedOfficerName: 'ร.ต.อ. พิทักษ์ สันติราษฎร์',
      incidentDate: '2026-07-02',
      incidentLocation: 'กรุงเทพมหานคร (ติดต่อผ่านโทรศัพท์และแอปพลิเคชัน LINE)',
      description: 'มีผู้โทรเข้ามาอ้างว่าเป็นเจ้าหน้าที่ตำรวจ สภ.เมืองเชียงราย แจ้งว่าบัญชีธนาคารของผู้เสียหายพัวพันกับคดีฟอกเงิน และบังคับให้โอนเงินทั้งหมดในบัญชีไปตรวจสอบความบริสุทธิ์',
      damageAmount: 125000,
      status: 'investigating',
      policeReportFiled: true,
      policeReportNumber: 'ตอท. 145/2569',
      createdAt: '2026-07-02T14:30:00Z',
      updatedAt: '2026-07-04T09:15:00Z',
      suspects: {
        suspect_001: {
          name: 'นายวิชัย มณีวงศ์ (บัญชีม้า)',
          phone: '0891112222',
          bankName: 'ธนาคารกสิกรไทย (KBANK)',
          bankAccountNumber: '1234567890',
          websiteUrl: 'https://police-check-verify-fake.com',
          socialMedia: 'LINE ID: @police_verify_th'
        }
      }
    },
    case_002: {
      caseId: 'case_002',
      caseCode: 'CASE-2026-002',
      caseTypeId: 'caseType_002',
      caseType: 'investment',
      victimId: 'user_v002',
      victimName: 'สมหญิง รักสงบ',
      victimPhone: '0898765432',
      assignedOfficerId: 'user_o001',
      assignedOfficerName: 'ร.ต.อ. พิทักษ์ สันติราษฎร์',
      incidentDate: '2026-07-05',
      incidentLocation: 'เพจ Facebook และเว็บไซต์เทรดหุ้นปลอม',
      description: 'พบโฆษณาชวนลงทุนเทรดหุ้นต่างประเทศผ่านเพจ Facebook ที่แอบอ้างชื่อนักวิเคราะห์ชื่อดัง ช่วงแรกถอนกำไรได้จริง ต่อมาถูกหลอกให้เติมเงินเพิ่มเพื่อปลดล็อกภาษีแต่ถอนไม่ได้',
      damageAmount: 450000,
      status: 'evidence_review',
      policeReportFiled: true,
      policeReportNumber: 'ตอท. 159/2569',
      createdAt: '2026-07-06T11:20:00Z',
      updatedAt: '2026-07-08T16:40:00Z',
      suspects: {
        suspect_002: {
          name: 'นางสาวสุดาพร ศรีเจริญ',
          phone: '0923334444',
          bankName: 'ธนาคารไทยพาณิชย์ (SCB)',
          bankAccountNumber: '4098877665',
          websiteUrl: 'https://global-gold-trade-vip.net',
          socialMedia: 'Facebook: ลงทุนหุ้นมั่นคง กำไรวันละ 15%'
        }
      }
    },
    case_003: {
      caseId: 'case_003',
      caseCode: 'CASE-2026-003',
      caseTypeId: 'caseType_003',
      caseType: 'online_shopping',
      victimId: 'user_v003',
      victimName: 'ประเสริฐ มั่งมี',
      victimPhone: '0865554433',
      assignedOfficerId: 'user_o002',
      assignedOfficerName: 'พ.ต.ท. วรพล ปราบปราม',
      incidentDate: '2026-07-10',
      incidentLocation: 'ร้านค้าบน Instagram และ Facebook Marketplace',
      description: 'สั่งซื้อโทรศัพท์มือถือสมาร์ทโฟนรุ่นล่าสุดในราคาโปรโมชั่นพิเศษ โอนเงินมัดจำและค่าเครื่องเต็มจำนวน แต่เมื่อถึงกำหนดส่งทางร้านได้บล็อกช่องทางการติดต่อทั้งหมด',
      damageAmount: 38900,
      status: 'closed',
      policeReportFiled: true,
      policeReportNumber: 'ตอท. 172/2569',
      createdAt: '2026-07-11T09:00:00Z',
      updatedAt: '2026-07-25T15:00:00Z',
      suspects: {
        suspect_003: {
          name: 'นายอนุชา ทองแท้',
          phone: '0845556666',
          bankName: 'ธนาคารกรุงไทย (KTB)',
          bankAccountNumber: '9812233445',
          websiteUrl: 'https://it-superdeal-shop.com',
          socialMedia: 'IG: @it_mobile_pro_th'
        }
      }
    },
    case_004: {
      caseId: 'case_004',
      caseCode: 'CASE-2026-004',
      caseTypeId: 'caseType_001',
      caseType: 'call_center',
      victimId: 'user_v002',
      victimName: 'สมหญิง รักสงบ',
      victimPhone: '0898765432',
      assignedOfficerId: 'user_o001',
      assignedOfficerName: 'ร.ต.อ. พิทักษ์ สันติราษฎร์',
      incidentDate: '2026-08-01',
      incidentLocation: 'โทรศัพท์มือถือและลิงก์แอปพลิเคชันควบคุมเครื่อง',
      description: 'มิจฉาชีพโทรแอบอ้างเป็นเจ้าหน้าที่กรมสรรพากร แจ้งเรื่องคืนภาษีประจำปีและส่งลิงก์ให้ติดตั้งแอปพลิเคชันปลอม ก่อนโอนเงินออกจากบัญชีไปยังบัญชีปลายทางเดียวกัน',
      damageAmount: 85000,
      status: 'investigating',
      policeReportFiled: true,
      policeReportNumber: 'ตอท. 201/2569',
      createdAt: '2026-08-02T10:10:00Z',
      updatedAt: '2026-08-04T13:30:00Z',
      suspects: {
        suspect_004: {
          name: 'นายวิชัย มณีวงศ์ (บัญชีม้า)',
          phone: '0891112222',
          bankName: 'ธนาคารกสิกรไทย (KBANK)',
          bankAccountNumber: '1234567890',
          websiteUrl: 'https://police-check-verify-fake.com',
          socialMedia: 'LINE ID: @rd_tax_refund'
        }
      }
    },
    case_005: {
      caseId: 'case_005',
      caseCode: 'CASE-2026-005',
      caseTypeId: 'caseType_001',
      caseType: 'call_center',
      victimId: 'user_v004',
      victimName: 'กานดา พาเพลิน',
      victimPhone: '0823339988',
      assignedOfficerId: 'user_o001',
      assignedOfficerName: 'ร.ต.อ. พิทักษ์ สันติราษฎร์',
      incidentDate: '2026-08-12',
      incidentLocation: 'กรุงเทพมหานคร (โทรศัพท์แอบอ้างไปรษณีย์ไทย)',
      description: 'ได้รับสายอัตโนมัติแจ้งว่ามีพัสดุตกค้างที่มีสิ่งผิดกฎหมายภายใน จากนั้นโอนสายให้คุยกับผู้ที่อ้างตัวเป็นตำรวจและหลอกให้โอนเงินไปตรวจสอบที่บัญชีนายวิชัย',
      damageAmount: 210000,
      status: 'pending',
      policeReportFiled: true,
      policeReportNumber: 'ตอท. 224/2569',
      createdAt: '2026-08-12T16:45:00Z',
      updatedAt: '2026-08-12T16:45:00Z',
      suspects: {
        suspect_005: {
          name: 'นายวิชัย มณีวงศ์ (บัญชีม้า)',
          phone: '0891112222',
          bankName: 'ธนาคารกสิกรไทย (KBANK)',
          bankAccountNumber: '1234567890',
          websiteUrl: 'https://police-check-verify-fake.com',
          socialMedia: 'LINE ID: @police_verify_th'
        }
      }
    },
    case_006: {
      caseId: 'case_006',
      caseCode: 'CASE-2026-006',
      caseTypeId: 'caseType_002',
      caseType: 'investment',
      victimId: 'user_v001',
      victimName: 'สมชาย ใจดี',
      victimPhone: '0812345678',
      assignedOfficerId: 'user_o002',
      assignedOfficerName: 'พ.ต.ท. วรพล ปราบปราม',
      incidentDate: '2026-08-18',
      incidentLocation: 'กลุ่ม LINE OpenChat และเว็บไซต์เทรดทองคำ',
      description: 'ถูกชักชวนเข้ากลุ่มสอนเทรดทองคำฟรี มีหน้าม้าส่งสลิปกำไรทุกวัน จึงหลงเชื่อโอนเงินเข้าพอร์ตลงทุนผ่านบัญชีนางสาวสุดาพร แต่เมื่อขอถอนเงินกลับถูกเรียกเก็บค่าธรรมเนียม 30%',
      damageAmount: 320000,
      status: 'investigating',
      policeReportFiled: true,
      policeReportNumber: 'ตอท. 240/2569',
      createdAt: '2026-08-19T09:30:00Z',
      updatedAt: '2026-08-21T11:00:00Z',
      suspects: {
        suspect_006: {
          name: 'นางสาวสุดาพร ศรีเจริญ',
          phone: '0923334444',
          bankName: 'ธนาคารไทยพาณิชย์ (SCB)',
          bankAccountNumber: '4098877665',
          websiteUrl: 'https://global-gold-trade-vip.net',
          socialMedia: 'LINE OpenChat: VIP Gold Master'
        }
      }
    },
    case_007: {
      caseId: 'case_007',
      caseCode: 'CASE-2026-007',
      caseTypeId: 'caseType_003',
      caseType: 'online_shopping',
      victimId: 'user_v004',
      victimName: 'กานดา พาเพลิน',
      victimPhone: '0823339988',
      assignedOfficerId: 'user_o002',
      assignedOfficerName: 'พ.ต.ท. วรพล ปราบปราม',
      incidentDate: '2026-09-02',
      incidentLocation: 'เว็บไซต์ขายอุปกรณ์ไอทีปลอม',
      description: 'สั่งซื้อแท็บเล็ตและปากกาสไตลัสจากเว็บไซต์ที่ยิงโฆษณาผ่านโซเชียลมีเดีย โอนเงินเข้าบัญชีนายอนุชา ทองแท้ แล้วไม่ได้รับเลขพัสดุและไม่สามารถติดต่อได้',
      damageAmount: 27500,
      status: 'evidence_review',
      policeReportFiled: false,
      policeReportNumber: '',
      createdAt: '2026-09-03T13:15:00Z',
      updatedAt: '2026-09-05T10:00:00Z',
      suspects: {
        suspect_007: {
          name: 'นายอนุชา ทองแท้',
          phone: '0845556666',
          bankName: 'ธนาคารกรุงไทย (KTB)',
          bankAccountNumber: '9812233445',
          websiteUrl: 'https://it-superdeal-shop.com',
          socialMedia: 'Facebook Page: IT SuperDeal Store'
        }
      }
    },
    case_008: {
      caseId: 'case_008',
      caseCode: 'CASE-2026-008',
      caseTypeId: 'caseType_002',
      caseType: 'investment',
      victimId: 'user_v003',
      victimName: 'ประเสริฐ มั่งมี',
      victimPhone: '0865554433',
      assignedOfficerId: 'user_o001',
      assignedOfficerName: 'ร.ต.อ. พิทักษ์ สันติราษฎร์',
      incidentDate: '2026-09-10',
      incidentLocation: 'แอปพลิเคชันรับงานกดรับออเดอร์สินค้า',
      description: 'ได้รับการติดต่อทาง SMS ชวนทำงานพาร์ทไทม์กดรับออเดอร์สินค้าออนไลน์ ต้องสำรองจ่ายเงินซื้อสินค้าในระบบเพื่อรับค่าคอมมิชชั่น สุดท้ายยอดเงินสูงขึ้นเรื่อยๆ และถอนไม่ได้',
      damageAmount: 168000,
      status: 'closed',
      policeReportFiled: true,
      policeReportNumber: 'ตอท. 288/2569',
      createdAt: '2026-09-11T15:00:00Z',
      updatedAt: '2026-09-28T17:20:00Z',
      suspects: {
        suspect_008: {
          name: 'นายพงศกร วัฒนากุล',
          phone: '0957778888',
          bankName: 'ธนาคารกรุงเทพ (BBL)',
          bankAccountNumber: '2340987654',
          websiteUrl: 'https://shopee-task-bonus-th.org',
          socialMedia: 'LINE ID: @job_bonus88'
        }
      }
    },
    case_009: {
      caseId: 'case_009',
      caseCode: 'CASE-2026-009',
      caseTypeId: 'caseType_001',
      caseType: 'call_center',
      victimId: 'user_v001',
      victimName: 'สมชาย ใจดี',
      victimPhone: '0812345678',
      assignedOfficerId: 'user_o002',
      assignedOfficerName: 'พ.ต.ท. วรพล ปราบปราม',
      incidentDate: '2026-09-18',
      incidentLocation: 'โทรศัพท์แอบอ้างการไฟฟ้าส่วนภูมิภาค',
      description: 'มิจฉาชีพโทรแจ้งเรื่องเปลี่ยนมิเตอร์ไฟฟ้าและคืนเงินประกันมิเตอร์ ส่งลิงก์ให้กรอกข้อมูลส่วนตัวและรหัส OTP ทำให้สูญเสียเงินในบัญชี',
      damageAmount: 64000,
      status: 'closed',
      policeReportFiled: true,
      policeReportNumber: 'ตอท. 305/2569',
      createdAt: '2026-09-19T11:45:00Z',
      updatedAt: '2026-10-01T14:00:00Z',
      suspects: {
        suspect_009: {
          name: 'นางสาวมยุรี สายชล',
          phone: '0879990000',
          bankName: 'ธนาคารทหารไทยธนชาต (ttb)',
          bankAccountNumber: '5123456789',
          websiteUrl: 'https://pea-refund-meter.net',
          socialMedia: 'LINE ID: @pea_service_care'
        }
      }
    },
    case_010: {
      caseId: 'case_010',
      caseCode: 'CASE-2026-010',
      caseTypeId: 'caseType_003',
      caseType: 'online_shopping',
      victimId: 'user_v002',
      victimName: 'สมหญิง รักสงบ',
      victimPhone: '0898765432',
      assignedOfficerId: 'user_o001',
      assignedOfficerName: 'ร.ต.อ. พิทักษ์ สันติราษฎร์',
      incidentDate: '2026-09-25',
      incidentLocation: 'เพจ Facebook ขายแพ็กเกจทัวร์และที่พักโรงแรม',
      description: 'จองแพ็กเกจห้องพักพูลวิลล่าที่พัทยาผ่านเพจ Facebook ที่ใช้ชื่อเลียนแบบโรงแรมดัง โอนเงินค่ามัดจำเต็มจำนวน แต่เมื่อตรวจสอบกับโรงแรมจริงพบว่าเป็นเพจปลอม',
      damageAmount: 15900,
      status: 'rejected',
      policeReportFiled: false,
      policeReportNumber: '',
      createdAt: '2026-09-26T10:00:00Z',
      updatedAt: '2026-09-29T09:30:00Z',
      suspects: {
        suspect_010: {
          name: 'นายธนพล เจริญสุข',
          phone: '0834445555',
          bankName: 'ธนาคารกรุงศรีอยุธยา (BAY)',
          bankAccountNumber: '7771234567',
          websiteUrl: 'https://sea-breeze-villa-promo.com',
          socialMedia: 'Facebook: Sea Breeze Villa Pattaya Official'
        }
      }
    },
    case_011: {
      caseId: 'case_011',
      caseCode: 'CASE-2026-011',
      caseTypeId: 'caseType_002',
      caseType: 'investment',
      victimId: 'user_v004',
      victimName: 'กานดา พาเพลิน',
      victimPhone: '0823339988',
      assignedOfficerId: 'user_o001',
      assignedOfficerName: 'ร.ต.อ. พิทักษ์ สันติราษฎร์',
      incidentDate: '2026-10-03',
      incidentLocation: 'แพลตฟอร์มเทรดคริปโตเคอร์เรนซีปลอม',
      description: 'ถูกชักชวนผ่านแอปหาคู่ให้ร่วมลงทุนเหรียญดิจิทัลผ่านเว็บไซต์ global-gold-trade-vip.net โดยโอนเงินเข้าบัญชีนางสาวสุดาพร ศรีเจริญ จำนวนหลายครั้ง',
      damageAmount: 580000,
      status: 'pending',
      policeReportFiled: true,
      policeReportNumber: 'ตอท. 342/2569',
      createdAt: '2026-10-04T08:50:00Z',
      updatedAt: '2026-10-04T08:50:00Z',
      suspects: {
        suspect_011: {
          name: 'นางสาวสุดาพร ศรีเจริญ',
          phone: '0923334444',
          bankName: 'ธนาคารไทยพาณิชย์ (SCB)',
          bankAccountNumber: '4098877665',
          websiteUrl: 'https://global-gold-trade-vip.net',
          socialMedia: 'LINE ID: @crypto_wealth_vip'
        }
      }
    },
    case_012: {
      caseId: 'case_012',
      caseCode: 'CASE-2026-012',
      caseTypeId: 'caseType_003',
      caseType: 'online_shopping',
      victimId: 'user_v001',
      victimName: 'สมชาย ใจดี',
      victimPhone: '0812345678',
      assignedOfficerId: 'user_o002',
      assignedOfficerName: 'พ.ต.ท. วรพล ปราบปราม',
      incidentDate: '2026-10-07',
      incidentLocation: 'ร้านค้าออนไลน์บนโซเชียลมีเดีย',
      description: 'สั่งซื้อโน้ตบุ๊กทำงานจากเพจร้านค้าไอทีที่ลดราคาพิเศษ โอนเงินเข้าบัญชีนายอนุชา ทองแท้ ธนาคารกรุงไทย 9812233445 ต่อมาเพจปิดหนีและติดต่อไม่ได้',
      damageAmount: 42000,
      status: 'evidence_review',
      policeReportFiled: true,
      policeReportNumber: 'ตอท. 355/2569',
      createdAt: '2026-10-08T10:20:00Z',
      updatedAt: '2026-10-09T08:00:00Z',
      suspects: {
        suspect_012: {
          name: 'นายอนุชา ทองแท้',
          phone: '0845556666',
          bankName: 'ธนาคารกรุงไทย (KTB)',
          bankAccountNumber: '9812233445',
          websiteUrl: 'https://it-superdeal-shop.com',
          socialMedia: 'Facebook: Notebook Pro Sale TH'
        }
      }
    }
  }
};

export function getMemoryFallback() {
  if (!runtimeMemoryStore) {
    const saved = localStorage.getItem('ofic_rtdb_cache_v1');
    if (saved) {
      try {
        runtimeMemoryStore = JSON.parse(saved);
      } catch {
        runtimeMemoryStore = structuredClone(INITIAL_FIREBASE_NODES);
      }
    } else {
      runtimeMemoryStore = structuredClone(INITIAL_FIREBASE_NODES);
    }
  }
  return runtimeMemoryStore;
}

export function saveMemoryFallback(data) {
  runtimeMemoryStore = data;
  try {
    localStorage.setItem('ofic_rtdb_cache_v1', JSON.stringify(data));
  } catch {
    // ignore
  }
}

/**
 * ซิงค์ข้อมูลเข้า Firebase Realtime Database หากฐานข้อมูลบนคลาวด์ยังว่างอยู่
 */
export async function syncInitialDataToFirebaseIfNeeded() {
  try {
    const snap = await get(ref(db, 'cases'));
    if (!snap.exists()) {
      await update(ref(db), INITIAL_FIREBASE_NODES);
    }
  } catch {
    // หากติดสิทธิ์ของ Firebase Rules ให้ใช้แคชควบคู่ไปกับ Realtime listener
  }
}

/**
 * ดึงรายการคดีทั้งหมดแบบ Realtime ด้วย onValue
 */
export function subscribeToCases(callback, onError) {
  const casesRef = ref(db, 'cases');

  const unsubscribe = onValue(
    casesRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const obj = snapshot.val();
        const list = Object.entries(obj).map(([key, val]) => ({
          ...val,
          caseId: key
        }));
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        callback(list);
      } else {
        // กรณีเพิ่งสร้างโปรเจกต์และยังไม่ได้ Import JSON
        syncInitialDataToFirebaseIfNeeded();
        const store = getMemoryFallback();
        const list = Object.entries(store.cases || {}).map(([key, val]) => ({
          ...val,
          caseId: key
        }));
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        callback(list);
      }
    },
    (error) => {
      console.warn('RTDB onValue fallback active:', error.message);
      const store = getMemoryFallback();
      const list = Object.entries(store.cases || {}).map(([key, val]) => ({
        ...val,
        caseId: key
      }));
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      callback(list);
      if (onError) onError(error);
    }
  );

  return unsubscribe;
}

/**
 * ดึงข้อมูลคดีรายคดีตาม caseId
 */
export async function getCaseById(caseId) {
  try {
    const snap = await get(ref(db, `cases/${caseId}`));
    if (snap.exists()) {
      return { ...snap.val(), caseId };
    }
  } catch {
    // fallback
  }
  const store = getMemoryFallback();
  if (store.cases && store.cases[caseId]) {
    return { ...store.cases[caseId], caseId };
  }
  return null;
}

/**
 * ดึงตัวเลขสถิติจาก node `stats` ใน Realtime Database
 */
export async function getSystemStats() {
  try {
    const snap = await get(ref(db, 'stats'));
    if (snap.exists()) {
      return snap.val();
    }
  } catch {
    // fallback
  }
  const store = getMemoryFallback();
  return store.stats;
}

/**
 * สร้างคดีใหม่จากฟอร์มแจ้งเหตุ 5 ขั้นตอน พร้อมอัปเดตตัวนับ `stats` ด้วย runTransaction
 */
export async function createNewCase(casePayload, creatorUser) {
  const store = getMemoryFallback();
  const existingCount = Object.keys(store.cases || {}).length;
  const nextNumber = String(existingCount + 1).padStart(3, '0');
  const caseId = `case_${nextNumber}_${Date.now().toString().slice(-4)}`;
  const caseCode = `CASE-2026-${nextNumber}`;
  const nowIso = new Date().toISOString();

  const caseTypeMap = {
    call_center: 'caseType_001',
    investment: 'caseType_002',
    online_shopping: 'caseType_003'
  };

  const newCaseRecord = {
    caseId,
    caseCode,
    caseTypeId: caseTypeMap[casePayload.caseType] || 'caseType_001',
    caseType: casePayload.caseType || 'call_center',
    victimId: creatorUser.uid,
    victimName: casePayload.victimName || creatorUser.name,
    victimPhone: casePayload.victimPhone || creatorUser.phone,
    victimEmail: casePayload.victimEmail || creatorUser.email,
    victimNationalId: casePayload.victimNationalId || '',
    assignedOfficerId: 'user_o001',
    assignedOfficerName: 'ร.ต.อ. พิทักษ์ สันติราษฎร์',
    incidentDate: casePayload.incidentDate,
    incidentTime: casePayload.incidentTime || '12:00',
    incidentLocation: casePayload.incidentLocation || 'ช่องทางออนไลน์',
    description: casePayload.description,
    damageAmount: Number(casePayload.damageAmount) || 0,
    status: 'pending',
    policeReportFiled: Boolean(casePayload.policeReportFiled),
    policeReportNumber: casePayload.policeReportNumber || '',
    createdAt: nowIso,
    updatedAt: nowIso,
    suspects: {
      suspect_main: {
        name: casePayload.suspectName || 'ไม่ทราบชื่อสกุลจริง',
        phone: casePayload.suspectPhone || '',
        bankName: casePayload.suspectBankName || '',
        bankAccountNumber: casePayload.suspectBankAccount || '',
        websiteUrl: casePayload.suspectWebsite || '',
        socialMedia: casePayload.suspectSocial || ''
      }
    }
  };

  // บันทึกไทม์ไลน์เริ่มต้นของคดี
  const initialTimelineLog = {
    logId: `log_${Date.now()}`,
    eventType: 'caseCreated',
    title: 'รับแจ้งเหตุคดีฉ้อโกงออนไลน์เข้าระบบ',
    description: `ผู้เสียหาย (${newCaseRecord.victimName}) ยื่นแบบฟอร์มแจ้งเหตุ รหัสคดี ${caseCode} มูลค่าความเสียหาย ${Number(newCaseRecord.damageAmount).toLocaleString()} บาท`,
    createdBy: newCaseRecord.victimName,
    createdAt: nowIso
  };

  // แจ้งเตือนเจ้าหน้าที่เมื่อมีคดีใหม่
  const officerNotifId = `notif_${Date.now()}`;
  const officerNotification = {
    notificationId: officerNotifId,
    title: `มีคดีใหม่รอตรวจสอบ (${caseCode})`,
    message: `ผู้เสียหาย ${newCaseRecord.victimName} แจ้งเหตุ มูลค่าความเสียหาย ${Number(newCaseRecord.damageAmount).toLocaleString()} บาท`,
    caseId,
    isRead: false,
    createdAt: nowIso
  };

  // อัปเดตในแคชเผื่อกรณีออฟไลน์หรือ Rules บล็อก
  store.cases[caseId] = newCaseRecord;
  if (!store.stats) store.stats = structuredClone(INITIAL_FIREBASE_NODES.stats);
  store.stats.totalCases = (store.stats.totalCases || 0) + 1;
  store.stats.totalDamage = (store.stats.totalDamage || 0) + newCaseRecord.damageAmount;
  store.stats.byStatus.pending = (store.stats.byStatus.pending || 0) + 1;
  store.stats.byType[newCaseRecord.caseType] = (store.stats.byType[newCaseRecord.caseType] || 0) + 1;
  saveMemoryFallback(store);

  try {
    await set(ref(db, `cases/${caseId}`), newCaseRecord);
    await set(ref(db, `timeline/${caseId}/${initialTimelineLog.logId}`), initialTimelineLog);
    await set(ref(db, `notifications/user_o001/${officerNotifId}`), officerNotification);

    // อัปเดต stats ด้วย transaction ตามข้อกำหนดหัวข้อ 5
    await runTransaction(ref(db, 'stats'), (currentStats) => {
      if (!currentStats) return store.stats;
      currentStats.totalCases = (currentStats.totalCases || 0) + 1;
      currentStats.totalDamage = (currentStats.totalDamage || 0) + newCaseRecord.damageAmount;
      if (!currentStats.byStatus) currentStats.byStatus = {};
      currentStats.byStatus.pending = (currentStats.byStatus.pending || 0) + 1;
      if (!currentStats.byType) currentStats.byType = {};
      currentStats.byType[newCaseRecord.caseType] =
        (currentStats.byType[newCaseRecord.caseType] || 0) + 1;
      return currentStats;
    });
  } catch (err) {
    console.warn('Firebase write fallback stored locally:', err.message);
  }

  return newCaseRecord;
}

/**
 * เปลี่ยนสถานะคดี หรือมอบหมายเจ้าหน้าที่ พร้อมบันทึกไทม์ไลน์และแจ้งเตือนผู้เสียหาย
 */
export async function updateCaseStatusAndAssignment(
  caseId,
  { newStatus, assignedOfficerId, assignedOfficerName, note },
  actorUser
) {
  const nowIso = new Date().toISOString();
  const existingCase = await getCaseById(caseId);
  if (!existingCase) throw new Error('ไม่พบข้อมูลคดีที่ต้องการอัปเดต');

  const oldStatus = existingCase.status;
  const updatedFields = {
    status: newStatus || existingCase.status,
    assignedOfficerId: assignedOfficerId || existingCase.assignedOfficerId,
    assignedOfficerName: assignedOfficerName || existingCase.assignedOfficerName,
    updatedAt: nowIso
  };

  // อัปเดตแคช
  const store = getMemoryFallback();
  if (store.cases && store.cases[caseId]) {
    store.cases[caseId] = { ...store.cases[caseId], ...updatedFields };
    if (oldStatus !== updatedFields.status && store.stats?.byStatus) {
      store.stats.byStatus[oldStatus] = Math.max(0, (store.stats.byStatus[oldStatus] || 1) - 1);
      store.stats.byStatus[updatedFields.status] =
        (store.stats.byStatus[updatedFields.status] || 0) + 1;
    }
    saveMemoryFallback(store);
  }

  const logId = `log_${Date.now()}`;
  const statusLabels = {
    pending: 'รอรับเรื่อง / รอตรวจสอบ',
    investigating: 'กำลังสืบสวน',
    evidence_review: 'กำลังตรวจสอบหลักฐาน',
    closed: 'คลี่คลาย / ปิดคดีแล้ว',
    rejected: 'ไม่รับคำร้อง / ข้อมูลไม่ครบ'
  };

  const timelineEntry = {
    logId,
    eventType: 'statusChanged',
    title: `อัปเดตสถานะคดีเป็น "${statusLabels[updatedFields.status] || updatedFields.status}"`,
    description:
      note ||
      `เจ้าหน้าที่ ${actorUser?.name || 'พนักงานสอบสวน'} ปรับสถานะคดีและดำเนินการตามขั้นตอนสืบสวน`,
    createdBy: actorUser?.name || 'เจ้าหน้าที่สืบสวน',
    createdAt: nowIso
  };

  const notifId = `notif_${Date.now()}`;
  const victimNotif = {
    notificationId: notifId,
    title: `อัปเดตสถานะคดี ${existingCase.caseCode}`,
    message: `สถานะคดีของท่านเปลี่ยนเป็น "${statusLabels[updatedFields.status]}" โดย ${actorUser?.name || 'เจ้าหน้าที่'}`,
    caseId,
    isRead: false,
    createdAt: nowIso
  };

  // บันทึกไทม์ไลน์ใน localStorage สำรองด้วย
  const localTimelineKey = `ofic_timeline_${caseId}`;
  const existingLogs = JSON.parse(localStorage.getItem(localTimelineKey) || '[]');
  existingLogs.push(timelineEntry);
  localStorage.setItem(localTimelineKey, JSON.stringify(existingLogs));

  try {
    await update(ref(db, `cases/${caseId}`), updatedFields);
    await set(ref(db, `timeline/${caseId}/${logId}`), timelineEntry);
    if (existingCase.victimId) {
      await set(ref(db, `notifications/${existingCase.victimId}/${notifId}`), victimNotif);
    }

    if (oldStatus !== updatedFields.status) {
      await runTransaction(ref(db, 'stats'), (currentStats) => {
        if (!currentStats) return store.stats;
        if (!currentStats.byStatus) currentStats.byStatus = {};
        currentStats.byStatus[oldStatus] = Math.max(
          0,
          (currentStats.byStatus[oldStatus] || 1) - 1
        );
        currentStats.byStatus[updatedFields.status] =
          (currentStats.byStatus[updatedFields.status] || 0) + 1;
        return currentStats;
      });
    }
  } catch (err) {
    console.warn('Update case status RTDB warning:', err.message);
  }

  return { ...existingCase, ...updatedFields };
}

/**
 * ดึงไทม์ไลน์ของคดี
 */
export async function getCaseTimeline(caseId) {
  const defaultLogs = {
    case_001: [
      {
        logId: 'log_001_001',
        eventType: 'caseCreated',
        title: 'รับแจ้งเหตุเข้าระบบ',
        description: 'ผู้เสียหาย (สมชาย ใจดี) ยื่นแบบฟอร์มแจ้งเหตุคดีฉ้อโกงออนไลน์ รหัสคดี CASE-2026-001',
        createdBy: 'สมชาย ใจดี',
        createdAt: '2026-07-02T14:30:00Z'
      },
      {
        logId: 'log_001_002',
        eventType: 'evidenceUploaded',
        title: 'อัปโหลดหลักฐานประกอบคดี',
        description: 'แนบไฟล์หลักฐานสลิปโอนเงินและประวัติการสนทนา จำนวน 2 รายการ',
        createdBy: 'สมชาย ใจดี',
        createdAt: '2026-07-02T14:38:00Z'
      },
      {
        logId: 'log_001_003',
        eventType: 'officerAssigned',
        title: 'มอบหมายเจ้าหน้าที่ผู้รับผิดชอบ',
        description: 'มอบหมายให้ ร.ต.อ. พิทักษ์ สันติราษฎร์ เป็นพนักงานสอบสวนผู้รับผิดชอบคดี',
        createdBy: 'พ.ต.อ. ธนากร ศรีสุวรรณ',
        createdAt: '2026-07-03T09:00:00Z'
      },
      {
        logId: 'log_001_004',
        eventType: 'evidenceVerified',
        title: 'ตรวจสอบหลักฐานเรียบร้อย',
        description: 'ยืนยันความถูกต้องของหลักฐานทั้ง 2 รายการ และพบความเชื่อมโยงกับบัญชีม้ากลุ่ม Call Center',
        createdBy: 'ร.ต.อ. พิทักษ์ สันติราษฎร์',
        createdAt: '2026-07-04T09:15:00Z'
      }
    ]
  };

  try {
    const snap = await get(ref(db, `timeline/${caseId}`));
    if (snap.exists()) {
      const list = Object.values(snap.val());
      list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      return list;
    }
  } catch {
    // fallback
  }

  const caseData = await getCaseById(caseId);
  const baseLogs = defaultLogs[caseId] || [
    {
      logId: `log_init_${caseId}`,
      eventType: 'caseCreated',
      title: 'รับแจ้งเหตุคดีฉ้อโกงออนไลน์เข้าระบบ',
      description: `บันทึกข้อมูลคดีรหัส ${caseData?.caseCode || caseId} เข้าสู่ระบบฐานข้อมูลกลาง`,
      createdBy: caseData?.victimName || 'ผู้เสียหาย',
      createdAt: caseData?.createdAt || new Date().toISOString()
    }
  ];

  const extraLogs = JSON.parse(localStorage.getItem(`ofic_timeline_${caseId}`) || '[]');
  const merged = [...baseLogs, ...extraLogs];
  merged.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  return merged;
}

/**
 * เพิ่มบันทึกความเคลื่อนไหวในไทม์ไลน์คดี
 */
export async function addTimelineEvent(caseId, { title, description, eventType = 'investigationNote' }, actorUser) {
  const logId = `log_${Date.now()}`;
  const entry = {
    logId,
    eventType,
    title,
    description,
    createdBy: actorUser?.name || 'เจ้าหน้าที่สืบสวน',
    createdAt: new Date().toISOString()
  };

  const localTimelineKey = `ofic_timeline_${caseId}`;
  const existingLogs = JSON.parse(localStorage.getItem(localTimelineKey) || '[]');
  existingLogs.push(entry);
  localStorage.setItem(localTimelineKey, JSON.stringify(existingLogs));

  try {
    await set(ref(db, `timeline/${caseId}/${logId}`), entry);
  } catch {
    // fallback saved in localStorage
  }

  return entry;
}
