"use client";
import { useEffect, useState } from "react";
import { api } from "../lib/api";

interface User {
  id: string;
  name: string;
  email: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);   // current user
  const [loading, setLoading] = useState(false);   // loading state
  const [error, setError] = useState<string | null>(null);   // error state
  const [isInitializing, setIsInitializing] = useState(true);   // init state for user fetch


  const fetchUser = async () => {
    try {
      const res = await api.get("/users/me");
      setUser(res.data.user);
    } catch {
      setUser(null);
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const registerUser = async (data: {   // register a new user
    name: string;
    email: string;
    password: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/auth/register", data);
      setUser(res.data.user);   // set uer 
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (data: { email: string; password: string }) => {   // log in user
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/auth/login", data);
      setUser(res.data.user);   // set user
      setIsInitializing(false)
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
      throw new Error(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {   // logout user
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.warn("Logout failed", err);
    } finally {
      setUser(null);
      setIsInitializing(false);
    }
  };

  return {
    user,
    registerUser,
    loginUser,
    logoutUser,
    loading,
    error,
    isInitializing,
  };
};
