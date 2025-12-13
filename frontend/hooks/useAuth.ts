import { useState } from 'react';
import { api } from '../lib/api';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerUser = async (data: { name: string; email: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/register', data);
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
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return { registerUser, loginUser, loading, error };
};
