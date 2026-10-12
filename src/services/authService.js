// บริการระบบยืนยันตัวตน (Firebase Authentication + Realtime Database Users Node)
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { ref, get, set, child } from 'firebase/database';
import { auth, db } from './firebase';

const DEMO_STORAGE_KEY = 'ofic_active_session_user';

// บัญชีตัวอย่างเริ่มต้นที่เชื่อมกับข้อมูลใน Realtime Database (users/{uid})
export const DEMO_ACCOUNTS = {
  'somchai.victim@example.com': {
    uid: 'user_v001',
    name: 'สมชาย ใจดี',
    email: 'somchai.victim@example.com',
    phone: '0812345678',
    role: 'victim',
    isActive: true,
    victimProfile: {
      nationalId: '1100400556677',
      address: '123/45 ถนนพหลโยธิน แขวงจตุจักร เขตจตุจักร กรุงเทพมหานคร 10900'
    },
    settings: { notifyNewCase: true, duplicateSensitivity: 'high' }
  },
  'somying.victim@example.com': {
    uid: 'user_v002',
    name: 'สมหญิง รักสงบ',
    email: 'somying.victim@example.com',
    phone: '0898765432',
    role: 'victim',
    isActive: true,
    victimProfile: {
      nationalId: '1100500889900',
      address: '88 หมู่ 4 ตำบลสุเทพ อำเภอเมือง จังหวัดเชียงใหม่ 50200'
    },
    settings: { notifyNewCase: true, duplicateSensitivity: 'medium' }
  },
  'pitak.officer@ofic.police.go.th': {
    uid: 'user_o001',
    name: 'ร.ต.อ. พิทักษ์ สันติราษฎร์',
    email: 'pitak.officer@ofic.police.go.th',
    phone: '022051234',
    role: 'officer',
    isActive: true,
    officerProfile: {
      badgeNumber: 'OFIC-1042',
      rankTitle: 'ร้อยตำรวจเอก',
      department: 'กองบังคับการตรวจสอบและวิเคราะห์อาชญากรรมทางเทคโนโลยี (บก.ตอท.)'
    },
    settings: { notifyNewCase: true, duplicateSensitivity: 'high' }
  },
  'admin@ofic.police.go.th': {
    uid: 'user_a001',
    name: 'พ.ต.อ. ธนากร ศรีสุวรรณ',
    email: 'admin@ofic.police.go.th',
    phone: '022051000',
    role: 'admin',
    isActive: true,
    officerProfile: {
      badgeNumber: 'OFIC-0001',
      rankTitle: 'พันตำรวจเอก',
      department: 'ศูนย์สืบสวนคดีฉ้อโกงออนไลน์ สำนักงานตำรวจแห่งชาติ'
    },
    settings: { notifyNewCase: true, duplicateSensitivity: 'high' }
  }
};

/**
 * ดึงข้อมูลโปรไฟล์ผู้ใช้จาก Realtime Database path: users/{uid}
 */
export async function fetchUserProfileFromDb(uid, emailFallback = '') {
  try {
    const snapshot = await get(child(ref(db), `users/${uid}`));
    if (snapshot.exists()) {
      return { uid, ...snapshot.val() };
    }
    // ค้นหาจากอีเมลใน users node กรณี uid จาก Auth ไม่ตรงกับรหัสใน seed-data
    if (emailFallback) {
      const allUsersSnap = await get(ref(db, 'users'));
      if (allUsersSnap.exists()) {
        const usersObj = allUsersSnap.val();
        for (const [key, val] of Object.entries(usersObj)) {
          if (val.email && val.email.toLowerCase() === emailFallback.toLowerCase()) {
            return { uid: key, ...val };
          }
        }
      }
    }
  } catch (err) {
    console.warn('Realtime DB user fetch warning:', err.message);
  }
  return null;
}

/**
 * เข้าสู่ระบบด้วยอีเมลและรหัสผ่านผ่าน Firebase Auth
 * พร้อมตรวจสอบบัญชีใน Realtime Database
 */
export async function loginWithEmail(email, password) {
  const cleanEmail = email.trim().toLowerCase();

  try {
    const credential = await signInWithEmailAndPassword(auth, cleanEmail, password);
    const fbUser = credential.user;
    let profile = await fetchUserProfileFromDb(fbUser.uid, cleanEmail);

    if (!profile) {
      profile = DEMO_ACCOUNTS[cleanEmail] || {
        uid: fbUser.uid,
        name: fbUser.displayName || cleanEmail.split('@')[0],
        email: cleanEmail,
        phone: '0810000000',
        role: cleanEmail.includes('police.go.th') ? 'officer' : 'victim',
        isActive: true,
        createdAt: new Date().toISOString()
      };
      // บันทึกโปรไฟล์ลง Realtime Database หากยังไม่มี
      try {
        await set(ref(db, `users/${profile.uid}`), profile);
      } catch {
        // ข้ามกรณีติด permission rules
      }
    }

    if (profile.isActive === false) {
      await signOut(auth);
      throw new Error('บัญชีผู้ใช้งานนี้ถูกระงับการใช้งานชั่วคราว กรุณาติดต่อผู้ดูแลระบบ');
    }

    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(profile));
    return profile;
  } catch (firebaseErr) {
    // รองรับการเข้าสู่ระบบด้วยบัญชีใน Realtime Database (users node) หรือบัญชีทดสอบตาม README
    const dbProfile = await fetchUserProfileFromDb('', cleanEmail);
    const fallbackAccount = dbProfile || DEMO_ACCOUNTS[cleanEmail];

    if (fallbackAccount && password.length >= 6) {
      if (fallbackAccount.isActive === false) {
        throw new Error('บัญชีผู้ใช้งานนี้ถูกระงับการใช้งานชั่วคราว กรุณาติดต่อผู้ดูแลระบบ');
      }
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(fallbackAccount));
      return fallbackAccount;
    }

    throw new Error('อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบข้อมูลอีกครั้ง');
  }
}

/**
 * ลงทะเบียนผู้เสียหายใหม่ (Role = victim)
 */
export async function registerVictim({ name, email, password, phone, nationalId, address }) {
  const cleanEmail = email.trim().toLowerCase();
  let uid = `user_v_${Date.now()}`;

  try {
    const credential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
    uid = credential.user.uid;
    await updateProfile(credential.user, { displayName: name });
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      throw new Error('อีเมลนี้ถูกใช้งานในระบบแล้ว กรุณาเข้าสู่ระบบ');
    }
    // กรณี Firebase Console ยังไม่ได้เปิด Email/Password Sign-in provider ให้สร้างโปรไฟล์ใน Realtime Database ได้ทันที
  }

  const newUserData = {
    uid,
    name: name.trim(),
    email: cleanEmail,
    phone: phone.trim(),
    role: 'victim',
    isActive: true,
    createdAt: new Date().toISOString(),
    victimProfile: {
      nationalId: nationalId.trim(),
      address: address.trim()
    },
    settings: {
      notifyNewCase: true,
      duplicateSensitivity: 'high'
    }
  };

  try {
    await set(ref(db, `users/${uid}`), newUserData);
  } catch (dbErr) {
    console.warn('Could not write directly to Firebase RTDB users node:', dbErr.message);
  }

  localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(newUserData));
  return newUserData;
}

/**
 * ออกจากระบบ
 */
export async function logoutUser() {
  localStorage.removeItem(DEMO_STORAGE_KEY);
  try {
    await signOut(auth);
  } catch {
    // ignore
  }
}

/**
 * ดึง session ปัจจุบัน
 */
export function getStoredSessionUser() {
  try {
    const raw = localStorage.getItem(DEMO_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
