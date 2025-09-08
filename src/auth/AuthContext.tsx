import React, { createContext, useState, useEffect, ReactNode } from "react";
import { getAuthUser, setAuthUser, removeAuthUser } from "../utils/storage";

type User = {
  id: string;
  name: string;
  role?: string;
  token: string;
};

type AuthContextType = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = getAuthUser();
      // const parsedUser = stored ? stored : null;
      return (stored?.token) ? stored: null
    } catch {
      return null;
    }
  });

  // Login: store user in state and localStorage, set auth header
  const login = (userData: User) => {
    setUser(userData);
    console.log("Setting auth token:", user);
    console.log("Storing user in localStorage:", userData);
    setAuthUser(userData);
  };

  // Logout: clear user, remove token and storage
  const logout = () => {
    setUser(null);
    removeAuthUser();
  };

  // Listen for changes in localStorage (from other tabs)
  useEffect(() => {
    function syncLogout(event: StorageEvent) {
      if (event.key === "authUser") {
        if (event.newValue) {
          // User logged in in another tab
          setUser(JSON.parse(event.newValue));
        } else {
          // User logged out in another tab
          setUser(null);
        }
      }
    }
    window.addEventListener("storage", syncLogout);
    return () => window.removeEventListener("storage", syncLogout);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
