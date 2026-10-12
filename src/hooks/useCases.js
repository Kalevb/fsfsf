// Hook สำหรับดึงรายการคดีแบบ Realtime จาก Firebase Realtime Database
import { useState, useEffect, useCallback } from 'react';
import { subscribeToCases, getSystemStats } from '../services/caseService';

export function useCases(victimIdFilter = null) {
  const [cases, setCases] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(() => {
    setLoading(true);
    setError(null);

    getSystemStats()
      .then((s) => setStats(s))
      .catch(() => {});

    const unsubscribe = subscribeToCases(
      (allCases) => {
        if (victimIdFilter) {
          setCases(allCases.filter((c) => c.victimId === victimIdFilter));
        } else {
          setCases(allCases);
        }
        setLoading(false);
      },
      (err) => {
        setError(err.message || 'ไม่สามารถโหลดข้อมูลคดีได้');
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [victimIdFilter]);

  useEffect(() => {
    const unsubscribe = loadData();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [loadData]);

  return {
    cases,
    stats,
    loading,
    error,
    reload: loadData
  };
}
