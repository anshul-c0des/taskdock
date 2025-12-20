"use client";

import { useState, useEffect } from "react";
import { api } from "../lib/api";

interface User {
  id: string;
  name: string;
}

export const useUserSearch = (query: string) => {
  const [users, setUsers] = useState<User[]>([]);   // matching users
  const [loading, setLoading] = useState(false);   // loading state

  useEffect(() => {
    if (query.length < 2) {   // min chars to fetch user
      setUsers([]);
      return;
    }

    let cancelled = false;
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await api.get("/users", { params: { search: query } });
        if (!cancelled) setUsers(res.data.users || []);
      } catch (err) {
        if (!cancelled) setUsers([]);
        console.error("Failed to fetch users:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchUsers();

    return () => {
      cancelled = true;
    };
  }, [query]);

  return { users, loading };
};
