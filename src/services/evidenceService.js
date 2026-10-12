// บริการจัดการหลักฐานประกอบคดี (Firebase Storage + Realtime Database path: evidence/{caseId}/{evidenceId})
import { ref as dbRef, get, set, update } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import { addTimelineEvent } from './caseService';

const DEFAULT_EVIDENCE_BY_CASE = {
  case_001: [
    {
      evidenceId: 'evd_001_001',
      caseId: 'case_001',
      fileName: 'evidence_case_001_slip_kbank.jpg',
      fileType: 'image/jpeg',
      storagePath: 'evidence/case_001/evidence_case_001_slip_kbank.jpg',
      downloadUrl: '',
      verificationStatus: 'verified',
      note: 'ตรวจสอบสลิปโอนเงินตรงกับบัญชีม้าเป้าหมาย ยืนยันร่องรอยธุรกรรมถูกต้อง',
      uploadedAt: '2026-07-02T14:35:00Z',
      verifiedBy: 'ร.ต.อ. พิทักษ์ สันติราษฎร์'
    },
    {
      evidenceId: 'evd_001_002',
      caseId: 'case_001',
      fileName: 'evidence_case_001_chatlog.jpg',
      fileType: 'image/jpeg',
      storagePath: 'evidence/case_001/evidence_case_001_chatlog.jpg',
      downloadUrl: '',
      verificationStatus: 'verified',
      note: 'ภาพหน้าจอการสนทนาทาง LINE มีการส่งเอกสารราชการปลอมชัดเจน',
      uploadedAt: '2026-07-02T14:38:00Z',
      verifiedBy: 'ร.ต.อ. พิทักษ์ สันติราษฎร์'
    }
  ],
  case_002: [
    {
      evidenceId: 'evd_002_001',
      caseId: 'case_002',
      fileName: 'evidence_case_002_transfer_statement.pdf',
      fileType: 'application/pdf',
      storagePath: 'evidence/case_002/evidence_case_002_transfer_statement.pdf',
      downloadUrl: '',
      verificationStatus: 'pending',
      note: 'อยู่ระหว่างตรวจสอบรายการเดินบัญชีกับธนาคารไทยพาณิชย์',
      uploadedAt: '2026-07-06T11:25:00Z'
    },
    {
      evidenceId: 'evd_002_002',
      caseId: 'case_002',
      fileName: 'evidence_case_002_web_capture.png',
      fileType: 'image/png',
      storagePath: 'evidence/case_002/evidence_case_002_web_capture.png',
      downloadUrl: '',
      verificationStatus: 'verified',
      note: 'หน้าเว็บเทรดปลอมตรงกับฐานข้อมูลอาชญากรรมไซเบอร์',
      uploadedAt: '2026-07-06T11:30:00Z',
      verifiedBy: 'ร.ต.อ. พิทักษ์ สันติราษฎร์'
    }
  ]
};

/**
 * ดึงรายการหลักฐานทั้งหมดของคดี
 */
export async function getEvidenceByCaseId(caseId) {
  try {
    const snap = await get(dbRef(db, `evidence/${caseId}`));
    if (snap.exists()) {
      return Object.entries(snap.val()).map(([key, val]) => ({
        ...val,
        evidenceId: key,
        caseId
      }));
    }
  } catch {
    // fallback
  }

  const localKey = `ofic_evidence_${caseId}`;
  const saved = localStorage.getItem(localKey);
  if (saved) {
    return JSON.parse(saved);
  }

  return (
    DEFAULT_EVIDENCE_BY_CASE[caseId] || [
      {
        evidenceId: `evd_${caseId}_001`,
        caseId,
        fileName: `evidence_${caseId}_transfer_slip.jpg`,
        fileType: 'image/jpeg',
        storagePath: `evidence/${caseId}/evidence_${caseId}_transfer_slip.jpg`,
        downloadUrl: '',
        verificationStatus: 'pending',
        note: 'หลักฐานสลิปการโอนเงินและภาพหน้าจอการสนทนา รอการตรวจสอบจากเจ้าหน้าที่',
        uploadedAt: new Date().toISOString()
      }
    ]
  );
}

/**
 * ดึงข้อมูลหลักฐานรายชิ้น
 */
export async function getSingleEvidence(caseId, evidenceId) {
  const list = await getEvidenceByCaseId(caseId);
  return list.find((item) => item.evidenceId === evidenceId) || list[0] || null;
}

/**
 * อัปโหลดไฟล์หลักฐานขึ้น Firebase Storage และบันทึกเมตาดาต้าลง Realtime Database
 */
export async function uploadEvidenceFile(caseId, file, note = '', actorUser = null) {
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const evidenceId = `evd_${Date.now()}`;
  const storagePath = `evidence/${caseId}/${evidenceId}_${cleanFileName}`;
  let downloadUrl = '';

  try {
    const fileRef = storageRef(storage, storagePath);
    await uploadBytes(fileRef, file);
    downloadUrl = await getDownloadURL(fileRef);
  } catch (storageErr) {
    console.warn('Firebase Storage upload fallback:', storageErr.message);
    downloadUrl = URL.createObjectURL(file);
  }

  const newEvidence = {
    evidenceId,
    caseId,
    fileName: cleanFileName,
    fileType: file.type || 'image/jpeg',
    fileSize: file.size || 0,
    storagePath,
    downloadUrl,
    verificationStatus: 'pending',
    note: note || 'อัปโหลดโดยผู้เสียหาย รอเจ้าหน้าที่ตรวจสอบ',
    uploadedAt: new Date().toISOString()
  };

  const currentList = await getEvidenceByCaseId(caseId);
  const updatedList = [...currentList, newEvidence];
  localStorage.setItem(`ofic_evidence_${caseId}`, JSON.stringify(updatedList));

  try {
    await set(dbRef(db, `evidence/${caseId}/${evidenceId}`), newEvidence);
  } catch {
    // stored locally
  }

  await addTimelineEvent(
    caseId,
    {
      eventType: 'evidenceUploaded',
      title: 'อัปโหลดหลักฐานเพิ่มเติม',
      description: `แนบไฟล์หลักฐาน "${cleanFileName}" เข้าสู่ระบบเรียบร้อยแล้ว`
    },
    actorUser
  );

  return newEvidence;
}

/**
 * เจ้าหน้าที่ตรวจสอบหลักฐาน (ยืนยัน Verified หรือ ปฏิเสธ Rejected พร้อมบันทึกหมายเหตุ)
 */
export async function verifyEvidenceItem(caseId, evidenceId, { status, note }, officerUser) {
  const list = await getEvidenceByCaseId(caseId);
  const updatedList = list.map((item) => {
    if (item.evidenceId === evidenceId) {
      return {
        ...item,
        verificationStatus: status,
        note: note || item.note,
        verifiedBy: officerUser?.name || 'เจ้าหน้าที่สืบสวน',
        verifiedAt: new Date().toISOString()
      };
    }
    return item;
  });

  localStorage.setItem(`ofic_evidence_${caseId}`, JSON.stringify(updatedList));

  try {
    await update(dbRef(db, `evidence/${caseId}/${evidenceId}`), {
      verificationStatus: status,
      note,
      verifiedBy: officerUser?.name || 'เจ้าหน้าที่สืบสวน',
      verifiedAt: new Date().toISOString()
    });
  } catch {
    // fallback
  }

  const statusText =
    status === 'verified'
      ? 'ยืนยันความถูกต้องของหลักฐาน (Verified)'
      : 'ปฏิเสธหลักฐาน (Rejected)';

  await addTimelineEvent(
    caseId,
    {
      eventType: 'evidenceVerified',
      title: `ผลการตรวจสอบหลักฐาน: ${statusText}`,
      description: `รหัสหลักฐาน ${evidenceId}: ${note || statusText}`
    },
    officerUser
  );

  return updatedList.find((i) => i.evidenceId === evidenceId);
}
