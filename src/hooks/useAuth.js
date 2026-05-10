import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId) {
    const { data, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (fetchError) {
      console.error('[EventRadar] Profile fetch error:', fetchError.message, fetchError.code);
    }
    console.log('[EventRadar] Profile fetched:', data);
    setProfile(data ?? null);
    setLoading(false);
  }

  async function login(email, password) {
    setError('');
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
      setError(err.message);
      return false;
    }
    return true;
  }

  async function signup(name, email, password, college = '', district = '') {
    setError('');
    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, college, district } },
    });
    if (err) {
      setError(err.message);
      return false;
    }
    return true;
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  const mergedUser = profile
    ? { ...profile, email: user?.email }
    : user
    ? { id: user.id, email: user.email, name: user.email, role: 'student' }
    : null;

  return { user: mergedUser, loading, error, setError, login, signup, logout };
}
