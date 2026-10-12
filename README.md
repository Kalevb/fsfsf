# ศูนย์สืบสวนคดีฉ้อโกงออนไลน์ (Online Fraud Investigation Center - OFIC)

**โครงงานวิชาการพัฒนาเว็บแอปพลิเคชัน (CSD3202)**  
**ผู้จัดทำ:** 67122250043 นายวีรภัทร กรังพานิช  
**อาจารย์ผู้สอน:** ผศ.ดร.เสถียร จันทร์ปลา  
**มหาวิทยาลัยราชภัฏสวนสุนันทา ภาคเรียนที่ 1 ปีการศึกษา 2569**

---

## 1. ชื่อและวัตถุประสงค์ของโครงงาน
- **ชื่อภาษาไทย:** ศูนย์สืบสวนคดีฉ้อโกงออนไลน์
- **ชื่อภาษาอังกฤษ:** Online Fraud Investigation Center (OFIC)
- **วัตถุประสงค์:**
  1. เป็นศูนย์กลางให้ผู้เสียหายจากคดีฉ้อโกงออนไลน์ (แก๊ง Call Center, หลอกลงทุนออนไลน์, หลอกขายสินค้าออนไลน์) แจ้งเหตุและแนบพยานหลักฐานดิจิทัลได้สะดวกและปลอดภัย
  2. ช่วยเจ้าหน้าที่สืบสวนตรวจสอบหลักฐาน ติดตามสถานะคดี และตรวจจับความเชื่อมโยงของคนร้าย (เบอร์โทรศัพท์, เลขบัญชีม้า, เว็บไซต์ปลอม) ที่ซ้ำกันข้ามคดีโดยอัตโนมัติ
  3. นำเสนอข้อมูลสถิติผ่านแดชบอร์ดและส่งออกรายงานไฟล์ CSV เพื่อสนับสนุนการบริหารจัดการคดี

---

## 2. ขอบเขตและฟังก์ชันที่พัฒนาเสร็จสมบูรณ์
1. **ระบบยืนยันตัวตนและแยกสิทธิ์ผู้ใช้งาน (Firebase Auth + Role-Based Access Control):** รองรับ 3 บทบาท ได้แก่ ผู้เสียหาย (`victim`), เจ้าหน้าที่สืบสวน (`officer`), และผู้ดูแลระบบ (`admin`)
2. **ฟอร์มแจ้งเหตุคดีฉ้อโกงออนไลน์ 5 ขั้นตอน (Submit Case Stepper):** ข้อมูลผู้แจ้ง → รายละเอียดเหตุการณ์ → ข้อมูลผู้ต้องสงสัย → อัปโหลดหลักฐาน → ตรวจสอบและยืนยัน พร้อม Validation ทุกขั้นตอน
3. **ระบบจัดการและตรวจสอบพยานหลักฐาน (Firebase Storage & Verification):** อัปโหลดไฟล์ `.jpg`, `.png`, `.pdf`, `.mp4` (สูงสุด 10MB) และให้เจ้าหน้าที่กดยืนยัน (`Verified`) หรือปฏิเสธ (`Rejected`) พร้อมบันทึกหมายเหตุ
4. **ระบบตรวจจับรายการซ้ำอัตโนมัติ (Duplicate Detection):** วิเคราะห์เบอร์โทรศัพท์ เลขบัญชีธนาคาร และ URL เว็บไซต์ของผู้ต้องสงสัยจากทุกคดี จัดกลุ่มเครือข่ายบัญชีม้า และบันทึกข้อสรุปลง `duplicateMatches`
5. **ระบบติดตามสถานะและไทม์ไลน์คดี (Case Tracking & Timeline):** แสดงความคืบหน้าแบบเรียลไทม์ด้วย `onValue` และประวัติเหตุการณ์ทุกขั้นตอน
6. **แดชบอร์ดสถิติและรายงาน (Officer Dashboard & CSV Reports):** แสดงการ์ดตัวเลขจาก `stats` กราฟ 3 รูปแบบ (`StatusChart`, `CaseTypeChart`, `TrendChart`) และระบบส่งออกไฟล์ CSV ภาษาไทย
7. **ระบบจัดการผู้ใช้งาน (Admin User Management):** เปลี่ยน Role และเปิด/ปิดการใช้งานบัญชีผู้ใช้

---

## 3. โครงสร้างข้อมูล Firebase Realtime Database
ไฟล์ฐานข้อมูลสำหรับนำเข้าอยู่ที่ `database/seed-data.json` โดยมีโครงสร้าง Node หลักดังนี้:
- `users/{uid}` — ข้อมูลบัญชีผู้ใช้งาน (`name`, `email`, `phone`, `role`, `isActive`, `victimProfile`, `officerProfile`, `settings`)
- `caseTypes/{caseTypeId}` — หมวดหมู่ประเภทคดีฉ้อโกง 3 ประเภทหลัก
- `cases/{caseId}` — ข้อมูลสำนวนคดีฉ้อโกงและข้อมูลผู้ต้องสงสัย (`suspects`)
- `evidence/{caseId}/{evidenceId}` — เมตาดาต้าไฟล์พยานหลักฐานและสถานะการตรวจสอบ (`pending`, `verified`, `rejected`)
- `timeline/{caseId}/{logId}` — ประวัติความเคลื่อนไหวของแต่ละคดีตามลำดับเวลา
- `duplicateMatches/{matchId}` — ผลการตรวจจับรายการซ้ำและบันทึกข้อสรุปของเจ้าหน้าที่
- `notifications/{uid}/{notificationId}` — รายการแจ้งเตือนแบบเรียลไทม์
- `reports/{reportId}` — ประวัติการสร้างรายงานสรุปสถิติ CSV
- `stats` — ตัวนับสถิติรวมของระบบที่อัปเดตด้วย Transaction

---

## 4. โครงสร้างหน้า Route และ Component ทั้งหมด

| ลำดับ | Route Path | Page Component | หน้าที่และส่วนประกอบหลัก | สิทธิ์การเข้าถึง |
| :---: | :--- | :--- | :--- | :--- |
| 1 | `/` | `LandingPage.jsx` | หน้าแรกตาม Wireframe Home 100% (Hero, สถิติ 4 ช่อง, ประเภทคดี, ขั้นตอนใช้งาน, Footer) | สาธารณะ |
| 2 | `/login` | `LoginPage.jsx` | หน้าเข้าสู่ระบบตาม Wireframe Login 100% (สลับโหมดผู้เสียหาย / เจ้าหน้าที่) | สาธารณะ |
| 3 | `/register` | `RegisterPage.jsx` | หน้าลงทะเบียนสำหรับประชาชน/ผู้เสียหายใหม่ | สาธารณะ |
| 4 | `/victim/dashboard` | `VictimDashboardPage.jsx` | แดชบอร์ดภาพรวมคดีของผู้เสียหายและการแจ้งเตือนล่าสุด | `victim`, `admin` |
| 5 | `/victim/submit-case` | `SubmitCasePage.jsx` | แบบฟอร์มแจ้งเหตุคดีฉ้อโกง 5 ขั้นตอน (Stepper) พร้อมอัปโหลดหลักฐาน | `victim`, `admin` |
| 6 | `/victim/track-status` | `TrackStatusPage.jsx` | ติดตามสถานะคดีและแถบความคืบหน้าการสืบสวน | `victim`, `admin` |
| 7 | `/victim/profile` | `VictimProfilePage.jsx` | แก้ไขข้อมูลส่วนตัว ที่อยู่ และการตั้งค่ารับแจ้งเตือนของผู้เสียหาย | `victim`, `admin` |
| 8 | `/officer/dashboard` | `OfficerDashboardPage.jsx` | แดชบอร์ดเจ้าหน้าที่ การ์ดสถิติ กราฟ 3 ชนิด และตารางค้นหา/กรองคดี | `officer`, `admin` |
| 9 | `/officer/victims` | `VictimsListPage.jsx` | รายชื่อผู้เสียหายทั้งหมดและลิงก์ไปยังคดีของแต่ละคน | `officer`, `admin` |
| 10 | `/officer/duplicates` | `DuplicateDetectionPage.jsx` | ตรวจจับรายการซ้ำ (เลขบัญชี/เบอร์โทร/เว็บไซต์) และบันทึกผลตรวจสอบ | `officer`, `admin` |
| 11 | `/officer/reports` | `ReportsPage.jsx` | เลือกช่วงวันที่เพื่อสร้างและดาวน์โหลดรายงาน CSV | `officer`, `admin` |
| 12 | `/officer/settings` | `OfficerSettingsPage.jsx` | ตั้งค่าข้อมูลเจ้าหน้าที่และระดับความไว Duplicate Detection | `officer`, `admin` |
| 13 | `/officer/users` | `UserManagementPage.jsx` | จัดการบัญชีผู้ใช้งาน เปลี่ยน Role และระงับการใช้งาน | `admin` เท่านั้น |
| 14 | `/cases/:caseId` | `CaseDetailPage.jsx` | รายละเอียดสำนวนคดี ผู้ต้องสงสัย รายการหลักฐาน และการเปลี่ยนสถานะคดี | ทุกบทบาทที่ล็อกอิน |
| 15 | `/cases/:caseId/evidence/:evidenceId` | `EvidenceDetailPage.jsx` | ตรวจสอบหลักฐานรายชิ้น (ปุ่ม Verified / Rejected พร้อมหมายเหตุ) | ทุกบทบาทที่ล็อกอิน |
| 16 | `/cases/:caseId/timeline` | `CaseTimelinePage.jsx` | ไทม์ไลน์ประวัติความเคลื่อนไหวของคดีและการเพิ่มบันทึกสืบสวน | ทุกบทบาทที่ล็อกอิน |

---

## 5. บัญชีทดสอบ (Test Accounts)
สามารถคลิกปุ่ม **"คลิกเลือกบัญชีทดสอบ"** บนหน้า `/login` เพื่อกรอกข้อมูลอัตโนมัติได้ทันที หรือใช้ข้อมูลด้านล่างนี้:

| บทบาท (Role) | ชื่อ-นามสกุล | อีเมล (Email) | รหัสผ่าน | UID ใน Seed Data |
| :--- | :--- | :--- | :--- | :--- |
| **ผู้เสียหาย 1 (Victim)** | สมชาย ใจดี | `somchai.victim@example.com` | `123456` | `user_v001` |
| **ผู้เสียหาย 2 (Victim)** | สมหญิง รักสงบ | `somying.victim@example.com` | `123456` | `user_v002` |
| **ผู้เสียหาย 3 (Victim)** | ประเสริฐ มั่งมี | `prasert.victim@example.com` | `123456` | `user_v003` |
| **เจ้าหน้าที่สืบสวน (Officer)** | ร.ต.อ. พิทักษ์ สันติราษฎร์ | `pitak.officer@ofic.police.go.th` | `123456` | `user_o001` |
| **ผู้ดูแลระบบ (Admin)** | พ.ต.อ. ธนากร ศรีสุวรรณ | `admin@ofic.police.go.th` | `123456` | `user_a001` |

---

## 6. วิธีติดตั้งและรันโปรเจกต์ในเครื่อง (Local Development)

1. ติดตั้ง Dependencies:
   ```bash
   npm install
   ```
2. ตั้งค่าไฟล์ `.env` ที่โฟลเดอร์หลักของโปรเจกต์ (ดูตัวอย่างตัวแปรใน `.env.example`):
   ```env
   VITE_FIREBASE_API_KEY="AIzaSyDCw_TbyE7IPKX6CzEkX_S9-zhm5h6KQ0M"
   VITE_FIREBASE_AUTH_DOMAIN="ofis-project-230f8.firebaseapp.com"
   VITE_FIREBASE_DATABASE_URL="https://ofis-project-230f8-default-rtdb.asia-southeast1.firebasedatabase.app"
   VITE_FIREBASE_PROJECT_ID="ofis-project-230f8"
   VITE_FIREBASE_STORAGE_BUCKET="ofis-project-230f8.firebasestorage.app"
   VITE_FIREBASE_MESSAGING_SENDER_ID="364723530499"
   VITE_FIREBASE_APP_ID="1:364723530499:web:69c60bfdd5941fe45e9736"
   VITE_FIREBASE_MEASUREMENT_ID="G-0JM8CC0WRB"
   ```
3. รันเซิร์ฟเวอร์สำหรับพัฒนา:
   ```bash
   npm run dev
   ```
4. นำเข้าข้อมูลเริ่มต้นเข้า Firebase Realtime Database:
   - เปิด [Firebase Console](https://console.firebase.google.com/) เลือกโปรเจกต์ `ofis-project-230f8`
   - ไปที่เมนู **Realtime Database** → คลิกไอคอนจุด 3 จุดมุมขวาบน → เลือก **Import JSON**
   - เลือกไฟล์ `database/seed-data.json` แล้วกด **Import**

---

## 7. ข้อมูลการส่งมอบงาน
- **URL เว็บไซต์ที่ Deploy แล้ว (Firebase Hosting):** `https://ofis-project-230f8.web.app` (หรือกรอก URL จริงหลังรัน `firebase deploy`)
- **URL GitHub Repository:** `https://github.com/<your-username>/ofic-fraud-investigation`
