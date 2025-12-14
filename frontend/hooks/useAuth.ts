"use client"
import { useEffect, useState } from 'react';
import { api } from '../lib/api';

interface User {
  id: string;
  name: string;
  email: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/users/me');
        setUser(res.data.user);
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const registerUser = async (data: { name: string; email: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/register', data);
      setUser(res.data.user); 
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };
  
  const loginUser = async (data: { email: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/login', data);
      setUser(res.data.user); 
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.warn('Logout failed', err);
    } finally {
      setUser(null);
    }
  };

  return { user, registerUser, loginUser, logoutUser, loading, error };
};
