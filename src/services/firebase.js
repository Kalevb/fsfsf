// การตั้งค่าและเชื่อมต่อ Firebase SDK (v9+ modular) โดยอ่านค่าจาก import.meta.env เท่านั้น
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// เริ่มต้นใช้งาน Firebase App
const app = initializeApp(firebaseConfig);

// บริการหลักของระบบ: Auth, Realtime Database และ Storage
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);

// เริ่มต้น Analytics เฉพาะสภาพแวดล้อมที่รองรับ
export let analytics = null;
isSupported()
  .then((yes) => {
    if (yes) {
      analytics = getAnalytics(app);
    }
  })
  .catch(() => {});

export default app;
