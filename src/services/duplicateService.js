// บริการตรวจจับรายการซ้ำระหว่างคดี (Duplicate Detection Service)
// ดึงเบอร์โทร เลขบัญชีธนาคาร และ URL เว็บไซต์ของผู้ต้องสงสัยทุกคดีมาเทียบกันในโค้ด และบันทึกลง duplicateMatches
import { ref, get, set, update } from 'firebase/database';
import { db } from './firebase';

/**
 * วิเคราะห์ความเชื่อมโยงของผู้ต้องสงสัยจากรายการคดีทั้งหมดในระบบ
 */
export function analyzeDuplicateCases(casesList, sensitivity = 'high') {
  const groupsMap = {};

  casesList.forEach((caseItem) => {
    const suspectsObj = caseItem.suspects || {};
    const suspects = Array.isArray(suspectsObj) ? suspectsObj : Object.values(suspectsObj);

    suspects.forEach((suspect) => {
      if (!suspect) return;

      const phone = (suspect.phone || '').replace(/\D/g, '');
      const bankAcc = (suspect.bankAccountNumber || '').replace(/\D/g, '');
      const website = (suspect.websiteUrl || '').trim().toLowerCase();
      const name = (suspect.name || '').trim();

      // จัดกลุ่มตามเลขบัญชีธนาคาร
      if (bankAcc && bankAcc.length >= 6) {
        const key = `bank_${bankAcc}`;
        if (!groupsMap[key]) {
          groupsMap[key] = {
            matchId: `match_bank_${bankAcc}`,
            matchType: 'bank_account',
            matchLabel: `เลขบัญชีธนาคาร (${suspect.bankName || 'บัญชีต้องสงสัย'})`,
            matchValue: suspect.bankAccountNumber,
            suspectName: name,
            suspectPhone: suspect.phone || '-',
            bankAccountNumber: suspect.bankAccountNumber,
            websiteUrl: suspect.websiteUrl || '-',
            cases: [],
            caseIds: {}
          };
        }
        if (!groupsMap[key].caseIds[caseItem.caseId]) {
          groupsMap[key].caseIds[caseItem.caseId] = true;
          groupsMap[key].cases.push(caseItem);
        }
      }

      // จัดกลุ่มตามเบอร์โทรศัพท์ผู้ต้องสงสัย
      if (phone && phone.length >= 9) {
        const key = `phone_${phone}`;
        if (!groupsMap[key]) {
          groupsMap[key] = {
            matchId: `match_phone_${phone}`,
            matchType: 'phone',
            matchLabel: 'หมายเลขโทรศัพท์ผู้ต้องสงสัยตรงกัน',
            matchValue: suspect.phone,
            suspectName: name,
            suspectPhone: suspect.phone,
            bankAccountNumber: suspect.bankAccountNumber || '-',
            websiteUrl: suspect.websiteUrl || '-',
            cases: [],
            caseIds: {}
          };
        }
        if (!groupsMap[key].caseIds[caseItem.caseId]) {
          groupsMap[key].caseIds[caseItem.caseId] = true;
          groupsMap[key].cases.push(caseItem);
        }
      }

      // จัดกลุ่มตามเว็บไซต์มิจฉาชีพ (เมื่อความไว medium หรือ high)
      if (website && website.length > 8 && sensitivity !== 'low') {
        const cleanKey = website.replace(/[^a-z0-9]/g, '_');
        const key = `web_${cleanKey}`;
        if (!groupsMap[key]) {
          groupsMap[key] = {
            matchId: `match_web_${cleanKey.slice(0, 20)}`,
            matchType: 'website',
            matchLabel: 'URL เว็บไซต์แพลตฟอร์มปลอมตรงกัน',
            matchValue: suspect.websiteUrl,
            suspectName: name,
            suspectPhone: suspect.phone || '-',
            bankAccountNumber: suspect.bankAccountNumber || '-',
            websiteUrl: suspect.websiteUrl,
            cases: [],
            caseIds: {}
          };
        }
        if (!groupsMap[key].caseIds[caseItem.caseId]) {
          groupsMap[key].caseIds[caseItem.caseId] = true;
          groupsMap[key].cases.push(caseItem);
        }
      }
    });
  });

  // คัดกรองเฉพาะกลุ่มที่พบตั้งแต่ 2 คดีขึ้นไป
  const savedNotes = JSON.parse(localStorage.getItem('ofic_duplicate_notes') || '{}');

  const duplicateGroups = Object.values(groupsMap)
    .filter((group) => group.cases.length >= 2)
    .map((group) => {
      const totalDamage = group.cases.reduce(
        (sum, c) => sum + (Number(c.damageAmount) || 0),
        0
      );
      const riskLevel =
        totalDamage >= 300000 || group.cases.length >= 3 ? 'critical' : 'high';

      return {
        ...group,
        totalDamage,
        riskLevel,
        reviewNote:
          savedNotes[group.matchId] ||
          `ตรวจพบความเชื่อมโยงจำนวน ${group.cases.length} คดี มูลค่าความเสียหายรวม ${totalDamage.toLocaleString()} บาท เห็นควรรวมสำนวนเพื่อออกหมายเรียกและอายัดบัญชี`,
        updatedAt: new Date().toISOString()
      };
    });

  duplicateGroups.sort((a, b) => b.totalDamage - a.totalDamage);
  return duplicateGroups;
}

/**
 * บันทึกผลการตรวจจับรายการซ้ำและข้อสรุปของเจ้าหน้าที่ลง node `duplicateMatches`
 */
export async function saveDuplicateReviewNote(matchId, matchData, reviewNote, officerUser) {
  const savedNotes = JSON.parse(localStorage.getItem('ofic_duplicate_notes') || '{}');
  savedNotes[matchId] = reviewNote;
  localStorage.setItem('ofic_duplicate_notes', JSON.stringify(savedNotes));

  const payload = {
    matchId,
    matchType: matchData.matchType,
    matchLabel: matchData.matchLabel,
    matchValue: matchData.matchValue,
    suspectName: matchData.suspectName,
    totalDamage: matchData.totalDamage,
    caseIds: matchData.caseIds,
    reviewNote,
    reviewedBy: officerUser?.name || 'เจ้าหน้าที่สืบสวน',
    updatedAt: new Date().toISOString()
  };

  try {
    await set(ref(db, `duplicateMatches/${matchId}`), payload);
  } catch {
    // stored in localStorage fallback
  }

  return payload;
}

/**
 * ดึงบันทึกจาก duplicateMatches ใน Firebase
 */
export async function fetchDuplicateMatchesFromDb() {
  try {
    const snap = await get(ref(db, 'duplicateMatches'));
    if (snap.exists()) {
      return snap.val();
    }
  } catch {
    // ignore
  }
  return {};
}
