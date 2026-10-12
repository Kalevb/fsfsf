// Hook สำหรับดึงรายชื่อผู้ใช้งานทั้งหมด
import { useState, useEffect, useCallback } from 'react';
import { getAllUsers } from '../services/userService';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await getAllUsers();
      setUsers(list);
    } catch (err) {
      setError(err.message || 'ไม่สามารถดึงรายชื่อผู้ใช้งานได้');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    reload: fetchUsers
  };
}
