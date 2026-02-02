"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { User } from "@/types/user";

type AuthContextValue = {
  user: User | null;
  login: (currentUser: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const CHAT_USER_STORAGE_KEY = "chat_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;

    const raw = localStorage.getItem(CHAT_USER_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  });

  const login = useCallback((currentUser: User) => {
    localStorage.setItem(CHAT_USER_STORAGE_KEY, JSON.stringify(currentUser));
    setUser(currentUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(CHAT_USER_STORAGE_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
