// Context สำหรับจัดการสถานะผู้ใช้งานและการแจ้งเตือนแบบ Realtime
import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import {
  fetchUserProfileFromDb,
  getStoredSessionUser,
  loginWithEmail,
  registerVictim,
  logoutUser
} from '../services/authService';
import { subscribeToNotifications } from '../services/userService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredSessionUser());
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [toast, setToast] = useState(null);

  // แสดง Toast แจ้งผลการทำงานทั่วทั้งระบบ
  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast((prev) => (prev && prev.message === message ? null : prev));
    }, 4000);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const profile = await fetchUserProfileFromDb(fbUser.uid, fbUser.email || '');
        if (profile) {
          setUser(profile);
          localStorage.setItem('ofic_active_session_user', JSON.stringify(profile));
        }
      } else {
        const stored = getStoredSessionUser();
        if (stored) {
          setUser(stored);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ติดตามการแจ้งเตือนแบบ Realtime ด้วย onValue
  useEffect(() => {
    if (!user?.uid) {
      setNotifications([]);
      return undefined;
    }
    const unsubNotifs = subscribeToNotifications(user.uid, (list) => {
      setNotifications(list);
    });
    return () => unsubNotifs();
  }, [user?.uid]);

  const handleLogin = async (email, password) => {
    const loggedInUser = await loginWithEmail(email, password);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const handleRegister = async (payload) => {
    const newUser = await registerVictim(payload);
    setUser(newUser);
    return newUser;
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
  };

  const refreshUserState = (updatedProfile) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedProfile };
      localStorage.setItem('ofic_active_session_user', JSON.stringify(merged));
      return merged;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        notifications,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        refreshUserState,
        showToast
      }}
    >
      {children}
      {/* Toast Notification แสดงผลมุมขวาล่าง */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md animate-bounce">
          <div
            className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border text-white ${
              toast.type === 'error'
                ? 'bg-red-600 border-red-400'
                : toast.type === 'warning'
                  ? 'bg-amber-600 border-amber-400'
                  : 'bg-[#1E3A8A] border-blue-400'
            }`}
          >
            <i
              className={`bi text-xl ${
                toast.type === 'error'
                  ? 'bi-exclamation-triangle-fill'
                  : 'bi-check-circle-fill text-emerald-300'
              }`}
            ></i>
            <div className="text-sm font-medium">{toast.message}</div>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="ml-2 text-white/80 hover:text-white"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}
