// บริการจัดการข้อมูลผู้ใช้งาน โปรไฟล์ การตั้งค่า และการแจ้งเตือน (users/{uid}, notifications/{uid})
import { ref, get, set, update, onValue } from 'firebase/database';
import { db } from './firebase';
import { DEMO_ACCOUNTS } from './authService';

const INITIAL_USERS_LIST = [
  DEMO_ACCOUNTS['somchai.victim@example.com'],
  DEMO_ACCOUNTS['somying.victim@example.com'],
  {
    uid: 'user_v003',
    name: 'ประเสริฐ มั่งมี',
    email: 'prasert.victim@example.com',
    phone: '0865554433',
    role: 'victim',
    createdAt: '2026-07-05T14:20:00Z',
    isActive: true,
    victimProfile: {
      nationalId: '1409900112233',
      address: '456 ถนนมิตรภาพ ตำบลในเมือง อำเภอเมือง จังหวัดขอนแก่น 40000'
    },
    settings: { notifyNewCase: true, duplicateSensitivity: 'high' }
  },
  {
    uid: 'user_v004',
    name: 'กานดา พาเพลิน',
    email: 'kanda.victim@example.com',
    phone: '0823339988',
    role: 'victim',
    createdAt: '2026-08-10T09:00:00Z',
    isActive: true,
    victimProfile: {
      nationalId: '1101400223344',
      address: '99/9 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110'
    },
    settings: { notifyNewCase: true, duplicateSensitivity: 'high' }
  },
  DEMO_ACCOUNTS['pitak.officer@ofic.police.go.th'],
  {
    uid: 'user_o002',
    name: 'พ.ต.ท. วรพล ปราบปราม',
    email: 'woraphon.officer@ofic.police.go.th',
    phone: '022051235',
    role: 'officer',
    createdAt: '2026-06-01T08:00:00Z',
    isActive: true,
    officerProfile: {
      badgeNumber: 'OFIC-1018',
      rankTitle: 'พันตำรวจโท',
      department: 'กองบังคับการตำรวจสืบสวนสอบสวนอาชญากรรมทางเทคโนโลยี 1'
    },
    settings: { notifyNewCase: true, duplicateSensitivity: 'high' }
  },
  DEMO_ACCOUNTS['admin@ofic.police.go.th']
];

function getLocalUsersList() {
  const saved = localStorage.getItem('ofic_users_cache_v1');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // ignore
    }
  }
  localStorage.setItem('ofic_users_cache_v1', JSON.stringify(INITIAL_USERS_LIST));
  return INITIAL_USERS_LIST;
}

/**
 * ดึงรายชื่อผู้ใช้งานทั้งหมดในระบบ
 */
export async function getAllUsers() {
  try {
    const snap = await get(ref(db, 'users'));
    if (snap.exists()) {
      const obj = snap.val();
      return Object.entries(obj).map(([key, val]) => ({
        ...val,
        uid: key
      }));
    }
  } catch {
    // fallback
  }
  return getLocalUsersList();
}

/**
 * อัปเดตข้อมูลโปรไฟล์หรือการตั้งค่าของผู้ใช้งาน
 */
export async function updateUserProfile(uid, updatedData) {
  const users = getLocalUsersList();
  const updatedUsers = users.map((u) => (u.uid === uid ? { ...u, ...updatedData } : u));
  localStorage.setItem('ofic_users_cache_v1', JSON.stringify(updatedUsers));

  // อัปเดต session ปัจจุบันถ้าเป็นคนเดียวกัน
  const activeRaw = localStorage.getItem('ofic_active_session_user');
  if (activeRaw) {
    const active = JSON.parse(activeRaw);
    if (active.uid === uid) {
      localStorage.setItem(
        'ofic_active_session_user',
        JSON.stringify({ ...active, ...updatedData })
      );
    }
  }

  try {
    await update(ref(db, `users/${uid}`), updatedData);
  } catch {
    // fallback saved
  }

  return updatedUsers.find((u) => u.uid === uid);
}

/**
 * สำหรับ Admin: เปลี่ยนบทบาท (role) หรือ เปิด/ปิด การใช้งานบัญชี (isActive)
 */
export async function adminUpdateUserRoleOrStatus(targetUid, { role, isActive }) {
  const updates = {};
  if (role !== undefined) updates.role = role;
  if (isActive !== undefined) updates.isActive = isActive;
  return updateUserProfile(targetUid, updates);
}

/**
 * ดึงการแจ้งเตือนแบบ Realtime ด้วย onValue
 */
export function subscribeToNotifications(uid, callback) {
  if (!uid) {
    callback([]);
    return () => {};
  }

  const defaultNotifs = [
    {
      notificationId: 'notif_default_1',
      title: 'ระบบแจ้งเตือนอัตโนมัติทำงานปกติ',
      message: 'ท่านจะได้รับการแจ้งเตือนทันทีเมื่อมีความคืบหน้าของคดีหรือพบความเชื่อมโยงใหม่',
      isRead: false,
      createdAt: '2026-10-08T09:00:00Z'
    }
  ];

  const notifRef = ref(db, `notifications/${uid}`);
  const unsubscribe = onValue(
    notifRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const list = Object.entries(snapshot.val()).map(([k, v]) => ({
          ...v,
          notificationId: k
        }));
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        callback(list);
      } else {
        callback(defaultNotifs);
      }
    },
    () => {
      callback(defaultNotifs);
    }
  );

  return unsubscribe;
}

/**
 * ทำเครื่องหมายว่าอ่านแจ้งเตือนแล้ว
 */
export async function markNotificationAsRead(uid, notificationId) {
  try {
    await update(ref(db, `notifications/${uid}/${notificationId}`), { isRead: true });
  } catch {
    // ignore
  }
}
