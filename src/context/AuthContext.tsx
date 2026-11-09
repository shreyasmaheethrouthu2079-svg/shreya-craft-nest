"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  isLoggedIn: boolean;
  isGuest?: boolean;
  avatar?: string;
  createdAt: string;
}

export interface RegisteredAccount {
  id: string;
  name: string;
  identifier: string;
  password?: string;
  email?: string;
  phone?: string;
  createdAt: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoggedIn: boolean;
  isLoaded: boolean;
  loginWithPassword: (identifier: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  loginWithPhone: (phone: string, name?: string) => Promise<boolean>;
  loginWithEmail: (email: string, password?: string, name?: string) => Promise<boolean>;
  loginWithOtp: (identifier: string, otp: string, name?: string) => Promise<boolean>;
  register: (name: string, identifier: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (identifier: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  loginAsGuest: () => void;
  logout: () => void;
  sendOtp: (identifier: string) => Promise<{ success: boolean; demoOtp: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getStoredAccounts = (): RegisteredAccount[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("scn_registered_accounts");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveStoredAccounts = (accounts: RegisteredAccount[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("scn_registered_accounts", JSON.stringify(accounts));
  } catch (e) {
    console.error("Failed to save accounts", e);
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved session on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("scn_user_session");
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load user session", e);
    } finally {
      setIsLoaded(true);
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

  const sendOtp = async (_identifier: string) => {
    const demoOtp = "123456";
    return { success: true, demoOtp };
  };

  // Amazon/Flipkart Password Login & Verification
  const loginWithPassword = async (
    identifier: string,
    password: string,
    name?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPhone = cleanId.replace(/\D/g, "").slice(-10);
    const isEmail = cleanId.includes("@");

    if (!password || password.length < 6) {
      return {
        success: false,
        error: "Password must be at least 6 characters.",
      };
    }

    const accounts = getStoredAccounts();
    const existing = accounts.find(
      (acc) =>
        acc.identifier === cleanId ||
        (cleanPhone && acc.phone?.replace(/\D/g, "").endsWith(cleanPhone)) ||
        (acc.email && acc.email.toLowerCase() === cleanId)
    );

    if (existing) {
      // Check password if set
      if (existing.password && existing.password !== password) {
        return {
          success: false,
          error: "Your password was incorrect. Please try again or click 'Forgot Password'.",
        };
      }
      // If user had no password yet, save this password for them
      if (!existing.password) {
        existing.password = password;
        saveStoredAccounts(accounts);
      }
      const activeUser: UserProfile = {
        id: existing.id,
        name: name?.trim() || existing.name,
        email: existing.email,
        phone: existing.phone,
        isLoggedIn: true,
        createdAt: existing.createdAt,
      };
      saveUserSession(activeUser);
      return { success: true };
    }

    // New user signing in directly with credentials:
    const profileName =
      name?.trim() ||
      (isEmail
        ? cleanId.split("@")[0].charAt(0).toUpperCase() + cleanId.split("@")[0].slice(1)
        : `Customer ${cleanPhone.slice(-4) || ""}`);

    const newAccount: RegisteredAccount = {
      id: `usr_${Date.now()}`,
      name: profileName,
      identifier: cleanId,
      password: password,
      email: isEmail ? cleanId : undefined,
      phone: !isEmail ? `+91 ${cleanPhone}` : undefined,
      createdAt: new Date().toISOString(),
    };

    accounts.push(newAccount);
    saveStoredAccounts(accounts);

    const activeUser: UserProfile = {
      id: newAccount.id,
      name: newAccount.name,
      email: newAccount.email,
      phone: newAccount.phone,
      isLoggedIn: true,
      createdAt: newAccount.createdAt,
    };
    saveUserSession(activeUser);
    return { success: true };
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

  const register = async (
    name: string,
    identifier: string,
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPhone = cleanId.replace(/\D/g, "").slice(-10);
    const isEmail = cleanId.includes("@");

    if (password && password.length < 6) {
      return {
        success: false,
        error: "Password must be at least 6 characters.",
      };
    }

    const accounts = getStoredAccounts();
    const existingIndex = accounts.findIndex(
      (acc) =>
        acc.identifier === cleanId ||
        (cleanPhone && acc.phone?.replace(/\D/g, "").endsWith(cleanPhone)) ||
        (acc.email && acc.email.toLowerCase() === cleanId)
    );

    const profileName = name.trim();
    if (existingIndex >= 0) {
      accounts[existingIndex].name = profileName;
      if (password) accounts[existingIndex].password = password;
      saveStoredAccounts(accounts);

      const activeUser: UserProfile = {
        id: accounts[existingIndex].id,
        name: profileName,
        email: accounts[existingIndex].email,
        phone: accounts[existingIndex].phone,
        isLoggedIn: true,
        createdAt: accounts[existingIndex].createdAt,
      };
      saveUserSession(activeUser);
      return { success: true };
    }

    const newAccount: RegisteredAccount = {
      id: `usr_${Date.now()}`,
      name: profileName,
      identifier: cleanId,
      password: password,
      email: isEmail ? cleanId : undefined,
      phone: !isEmail ? `+91 ${cleanPhone}` : undefined,
      createdAt: new Date().toISOString(),
    };

    accounts.push(newAccount);
    saveStoredAccounts(accounts);

    const activeUser: UserProfile = {
      id: newAccount.id,
      name: newAccount.name,
      email: newAccount.email,
      phone: newAccount.phone,
      isLoggedIn: true,
      createdAt: newAccount.createdAt,
    };
    saveUserSession(activeUser);
    return { success: true };
  };

  const resetPassword = async (
    identifier: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!newPassword || newPassword.length < 6) {
      return {
        success: false,
        error: "New password must be at least 6 characters.",
      };
    }
    const cleanId = identifier.trim().toLowerCase();
    const cleanPhone = cleanId.replace(/\D/g, "").slice(-10);
    const accounts = getStoredAccounts();
    const acc = accounts.find(
      (a) =>
        a.identifier === cleanId ||
        (cleanPhone && a.phone?.replace(/\D/g, "").endsWith(cleanPhone)) ||
        (a.email && a.email.toLowerCase() === cleanId)
    );
    if (acc) {
      acc.password = newPassword;
      saveStoredAccounts(accounts);
      return { success: true };
    }
    return {
      success: false,
      error: "No account found matching this email or mobile number.",
    };
  };

  const loginAsGuest = () => {
    const guestUser: UserProfile = {
      id: `usr_guest_${Date.now()}`,
      name: "Guest",
      isLoggedIn: true,
      isGuest: true,
      createdAt: new Date().toISOString(),
    };
    saveUserSession(guestUser);
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
        isLoaded,
        loginWithPassword,
        loginWithPhone,
        loginWithEmail,
        loginWithOtp,
        register,
        resetPassword,
        loginAsGuest,
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
