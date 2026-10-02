"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  isLoggedIn: boolean;
  avatar?: string;
  createdAt: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoggedIn: boolean;
  loginWithPhone: (phone: string, name?: string) => Promise<boolean>;
  loginWithEmail: (email: string, password?: string, name?: string) => Promise<boolean>;
  loginWithOtp: (identifier: string, otp: string, name?: string) => Promise<boolean>;
  register: (name: string, identifier: string, password?: string) => Promise<boolean>;
  logout: () => void;
  sendOtp: (identifier: string) => Promise<{ success: boolean; demoOtp: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);

  // Load saved session on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("scn_user_session");
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load user session", e);
    }
  }, []);

  const saveUserSession = (newUser: UserProfile) => {
    setUser(newUser);
    try {
      localStorage.setItem("scn_user_session", JSON.stringify(newUser));
    } catch (e) {
      console.error("Failed to save user session", e);
    }
  };

  const sendOtp = async (identifier: string) => {
    // Simulated realistic OTP dispatch (e.g. SMS / WhatsApp / Email)
    const demoOtp = "123456";
    return { success: true, demoOtp };
  };

  const loginWithPhone = async (phone: string, name?: string): Promise<boolean> => {
    const formattedPhone = phone.replace(/\D/g, "").slice(-10);
    const profileName = name?.trim() || `Customer ${formattedPhone.slice(-4)}`;
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: profileName,
      phone: `+91 ${formattedPhone}`,
      isLoggedIn: true,
      createdAt: new Date().toISOString(),
    };
    saveUserSession(newUser);
    return true;
  };

  const loginWithEmail = async (email: string, _password?: string, name?: string): Promise<boolean> => {
    const defaultName = email.split("@")[0] || "Artisan Lover";
    const profileName =
      name?.trim() ||
      defaultName.charAt(0).toUpperCase() + defaultName.slice(1);
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: profileName,
      email: email.trim().toLowerCase(),
      isLoggedIn: true,
      createdAt: new Date().toISOString(),
    };
    saveUserSession(newUser);
    return true;
  };

  const loginWithOtp = async (identifier: string, otp: string, name?: string): Promise<boolean> => {
    if (otp !== "123456" && otp.length !== 6) {
      return false;
    }
    const isEmail = identifier.includes("@");
    if (isEmail) {
      return loginWithEmail(identifier, undefined, name);
    } else {
      return loginWithPhone(identifier, name);
    }
  };

  const register = async (name: string, identifier: string, _password?: string): Promise<boolean> => {
    const isEmail = identifier.includes("@");
    if (isEmail) {
      return loginWithEmail(identifier, _password, name);
    } else {
      return loginWithPhone(identifier, name);
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem("scn_user_session");
    } catch (e) {
      console.error("Failed to clear user session", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user?.isLoggedIn,
        loginWithPhone,
        loginWithEmail,
        loginWithOtp,
        register,
        logout,
        sendOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
