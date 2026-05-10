import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setUsers(data);
    setLoading(false);
  }

  async function updateUserStatus(id, status) {
    const { error } = await supabase
      .from('profiles')
      .update({ status })
      .eq('id', id);
    if (!error) {
      setUsers(prev => prev.map(u => u.id === id ? { ...u, status } : u));
    }
  }

  async function updateUserRole(id, role) {
    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', id);
    if (!error) {
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
    }
  }

  return { users, loading, updateUserStatus, updateUserRole, refetch: fetchUsers };
}
