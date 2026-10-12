// Hook สำหรับดึงข้อมูลคดีรายคดี หลักฐาน และไทม์ไลน์
import { useState, useEffect, useCallback } from 'react';
import { getCaseById, getCaseTimeline } from '../services/caseService';
import { getEvidenceByCaseId } from '../services/evidenceService';

export function useCase(caseId) {
  const [caseData, setCaseData] = useState(null);
  const [evidenceList, setEvidenceList] = useState([]);
  const [timelineList, setTimelineList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDetail = useCallback(async () => {
    if (!caseId) return;
    setLoading(true);
    setError(null);
    try {
      const [cData, evdData, tlData] = await Promise.all([
        getCaseById(caseId),
        getEvidenceByCaseId(caseId),
        getCaseTimeline(caseId)
      ]);
      if (!cData) {
        setError('ไม่พบข้อมูลคดีที่ระบุในระบบ');
      } else {
        setCaseData(cData);
        setEvidenceList(evdData);
        setTimelineList(tlData);
      }
    } catch (err) {
      setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูลคดี');
    } finally {
      setLoading(false);
    }
  }, [caseId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return {
    caseData,
    evidenceList,
    timelineList,
    loading,
    error,
    reload: fetchDetail
  };
}
