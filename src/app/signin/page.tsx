"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  ChevronRight,
  CheckCircle2,
  ArrowRight,
  LogOut,
  ShieldCheck,
  Lock,
  MessageCircle,
  Phone,
  Mail,
  User as UserIcon,
  Eye,
  EyeOff,
  KeyRound,
  Info,
} from "lucide-react";

function SignInContent() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const {
    loginWithPhone,
    loginWithEmail,
    loginWithPassword,
    loginWithOtp,
    register,
    resetPassword,
    user,
    isLoggedIn,
    loginAsGuest,
    logout,
  } = useAuth();

  // Mode: "signin" | "register" | "forgot"
  const [activeTab, setActiveTab] = useState<"signin" | "register" | "forgot">("signin");

  // Inputs
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Prefill name and phone if already known
  React.useEffect(() => {
    try {
      const savedAddress = localStorage.getItem("scn_customer_address");
      if (savedAddress) {
        const parsed = JSON.parse(savedAddress);
        if (parsed.fullName && !name) setName(parsed.fullName);
        if (parsed.phone && !phone) setPhone(parsed.phone.replace(/\D/g, "").slice(-10));
      }
    } catch {}
  }, []);

  // OTP Mode (Flipkart alternative)
  const [otpMode, setOtpMode] = useState(false);
  const [otpCode, setOtpCode] = useState("123456");

  // Forgot password inputs
  const [newPassword, setNewPassword] = useState("");
  const [forgotOtp, setForgotOtp] = useState("123456");

  // UI States
  const [showHelp, setShowHelp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successName, setSuccessName] = useState("");

  // Complete login with instant redirection
  const finishLogin = (customerName: string) => {
    setSuccessName(customerName);
    setIsSuccess(true);
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 700);
  };

  // 1. Handle Primary Sign In with Compulsory Name and Mobile Phone Number
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleanName = name.trim();
    const cleanPhone = phone.replace(/\D/g, "").slice(-10);

    if (!cleanName) {
      setError("Please enter your name (Required)");
      return;
    }

    if (cleanName.length < 2) {
      setError("Please enter a valid full name (at least 2 characters)");
      return;
    }

    if (!cleanPhone) {
      setError("Please enter your 10-digit mobile phone number (Required)");
      return;
    }

    if (cleanPhone.length !== 10) {
      setError("Please enter a valid 10-digit Indian mobile number");
      return;
    }

    setIsSubmitting(true);

    try {
      await loginWithPhone(cleanPhone, cleanName);

      // Pre-fill customer address for faster checkout
      try {
        const saved = localStorage.getItem("scn_customer_address");
        const existing = saved ? JSON.parse(saved) : {};
        localStorage.setItem(
          "scn_customer_address",
          JSON.stringify({
            ...existing,
            fullName: cleanName,
            phone: cleanPhone,
          })
        );
      } catch (e) {}

      // Save to registered accounts in localStorage
      try {
        const raw = localStorage.getItem("scn_registered_accounts");
        let accounts = raw ? JSON.parse(raw) : [];
        const existingIdx = accounts.findIndex(
          (a: any) =>
            a.phone?.replace(/\D/g, "").endsWith(cleanPhone) ||
            a.identifier === cleanPhone
        );
        if (existingIdx >= 0) {
          accounts[existingIdx].name = cleanName;
          accounts[existingIdx].lastLogin = new Date().toISOString();
        } else {
          accounts.push({
            id: `ACC-${Date.now().toString().slice(-6)}`,
            name: cleanName,
            identifier: cleanPhone,
            phone: cleanPhone,
            createdAt: new Date().toISOString(),
          });
        }
        localStorage.setItem("scn_registered_accounts", JSON.stringify(accounts));
      } catch (e) {}

      // Sync customer sign in to Google Sheets in background
      fetch("/api/record-customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cleanName,
          identifier: cleanPhone,
          type: "signin",
        }),
      }).catch(() => {});

      finishLogin(cleanName);
    } catch (err) {
      console.error(err);
      setError("Unable to sign in. Please check your credentials and try again.");
      setIsSubmitting(false);
    }
  };

  // 2. Handle Register Form with Password Verification
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleanName = name.trim();
    const cleanId = identifier.trim();
    const cleanPhone = cleanId.replace(/\D/g, "").slice(-10);

    if (!cleanName) {
      setError("Enter your name (Required)");
      return;
    }
    if (cleanName.length < 2) {
      setError("Please enter a valid full name (at least 2 characters)");
      return;
    }
    if (!cleanId) {
      setError("Enter your 10-digit mobile number (Required)");
      return;
    }
    if (!cleanId.includes("@") && cleanPhone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    if (!password) {
      setError("Enter a password");
      return;
    }
    if (password.length < 6) {
      setError("Passwords must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await register(cleanName, cleanId, password);
      if (!res.success) {
        setError(res.error || "Registration failed. Please check your information.");
        setIsSubmitting(false);
        return;
      }

      // Pre-fill customer address for faster checkout
      try {
        const saved = localStorage.getItem("scn_customer_address");
        const existing = saved ? JSON.parse(saved) : {};
        localStorage.setItem(
          "scn_customer_address",
          JSON.stringify({
            ...existing,
            fullName: cleanName,
            phone: cleanPhone.length === 10 ? cleanPhone : existing.phone || "",
          })
        );
      } catch (e) {}

      // Sync customer registration to Google Sheets in background
      fetch("/api/record-customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cleanName,
          identifier: cleanId,
          type: "signup",
        }),
      }).catch(() => {});

      finishLogin(cleanName);
    } catch (err) {
      console.error(err);
      setError("Registration failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  // 3. Handle Forgot Password Reset
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim()) {
      setError("Enter your mobile number or email to reset password");
      return;
    }
    if (forgotOtp !== "123456" && forgotOtp.length !== 6) {
      setError("Invalid OTP code. Please enter demo OTP: 123456");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await resetPassword(identifier.trim(), newPassword);
      if (!res.success) {
        setError(res.error || "Could not reset password. Please check your details.");
        setIsSubmitting(false);
        return;
      }
      // After reset, log them in
      await loginWithPassword(identifier.trim(), newPassword);
      finishLogin("Customer");
    } catch (err) {
      console.error(err);
      setError("Password reset failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  // 4. Handle Guest Login
  const handleGuestLogin = () => {
    setIsSubmitting(true);
    loginAsGuest();
    finishLogin("Guest Customer");
  };

  return (
    <div className="min-h-screen bg-white sm:bg-[#FAF8F5]/60 flex flex-col justify-between text-[#0f1111] font-sans selection:bg-amber-200 selection:text-amber-900 py-6 px-4">
      {/* Top Brand Logo (Centered Amazon/Flipkart Header) */}
      <div className="w-full flex justify-center pt-2 pb-5">
        <Link
          href="/"
          className="flex items-center gap-2 p-1 hover:opacity-95 transition-opacity group"
          aria-label="Shreya's Craft Nest Home"
        >
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-amber-300 bg-white shadow-xs flex-shrink-0">
            <Image
              src="/logo-emblem.png"
              alt="Shreya's Craft Nest Logo"
              fill
              sizes="40px"
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col leading-none">
            <div className="flex items-baseline font-serif font-bold tracking-tight text-stone-900 text-2xl">
              <span>Shreya&apos;s Craft Nest</span>
              <span className="text-amber-800 text-xs font-sans font-bold ml-0.5">.in</span>
            </div>
            {/* Amazon-style smile / arc accent */}
            <div className="relative h-1 w-full overflow-hidden mt-0.5">
              <div className="w-full h-2 rounded-full border-b-2 border-amber-500"></div>
            </div>
          </div>
        </Link>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-[360px] mx-auto">
        {isSuccess ? (
          /* SUCCESS STATE ANIMATION */
          <div className="bg-white border border-[#d5d9d9] rounded-lg p-6 sm:p-7 shadow-xs text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mx-auto text-emerald-700 shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-medium text-[#0f1111]">
                Welcome, {successName}!
              </h2>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                Opening your handcrafted bag collection...
              </p>
            </div>
            <div className="w-5 h-5 border-2 border-amber-800 border-t-transparent rounded-full animate-spin mx-auto mt-3" />
          </div>
        ) : isLoggedIn && user && !user.isGuest ? (
          /* ACTIVE SESSION VIEW (Amazon Switch Account View) */
          <div className="bg-white border border-[#d5d9d9] rounded-lg p-6 sm:p-7 shadow-xs text-center space-y-4 animate-in fade-in duration-200">
            <div className="w-14 h-14 rounded-full bg-amber-500 text-stone-950 border border-amber-300 flex items-center justify-center mx-auto text-lg font-bold shadow-xs">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="inline-block text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 mb-1">
                Active Customer Account
              </span>
              <h2 className="text-lg font-bold text-[#0f1111]">
                {user.name}
              </h2>
              <p className="text-xs text-stone-500 mt-0.5 truncate max-w-xs mx-auto">
                {user.email || user.phone}
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <Link
                href={redirectUrl}
                className="w-full bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] text-[#0f1111] font-medium text-sm py-2 px-4 rounded-lg border border-[#a88734] shadow-xs hover:shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={() => logout()}
                className="w-full bg-[#f0f2f2] hover:bg-[#e3e6e6] active:bg-[#d8dbdb] text-[#0f1111] font-normal text-xs py-2 px-4 rounded-lg border border-[#d5d9d9] shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <LogOut className="w-3.5 h-3.5 text-stone-600" />
                <span>Sign out of this account</span>
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* SIGN IN / CREATE ACCOUNT CARD */}
            <div className="bg-white border border-[#d5d9d9] rounded-lg p-6 sm:p-7 shadow-xs">
              {/* Error Alert Box (Amazon Red Box with !) */}
              {error && (
                <div className="mb-4 p-3 rounded-lg border border-[#c40000] bg-white flex items-start gap-2.5 shadow-2xs animate-in fade-in duration-150">
                  <div className="w-4 h-4 rounded-full bg-[#c40000] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    !
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#c40000]">There was a problem</h4>
                    <p className="text-xs text-[#0f1111] mt-0.5 leading-snug">{error}</p>
                  </div>
                </div>
              )}

              {/* VIEW 1: SIGN IN WITH COMPULSORY NAME & MOBILE PHONE NUMBER */}
              {activeTab === "signin" && (
                <form onSubmit={handleSignInSubmit} className="space-y-4">
                  <div>
                    <h1 className="text-[28px] font-normal text-[#0f1111] leading-tight mb-1">
                      Sign in
                    </h1>
                    <p className="text-xs text-stone-500">
                      Please enter your name and 10-digit mobile number to continue.
                    </p>
                  </div>

                  {/* 1. Compulsory Name Input */}
                  <div>
                    <label
                      htmlFor="signin-name"
                      className="block text-[13px] font-bold text-[#0f1111] mb-1"
                    >
                      Your name <span className="text-[#c40000] font-bold">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <input
                        id="signin-name"
                        type="text"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (error) setError(null);
                        }}
                        placeholder="First and last name"
                        autoFocus
                        required
                        className="w-full px-2.5 py-2 bg-white text-[#0f1111] text-sm rounded-[4px] border border-[#888c8c] focus:outline-none focus:border-[#e77600] focus:ring-2 focus:ring-[#f3a847]/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] transition-all pr-8"
                      />
                      <div className="absolute right-2.5 pointer-events-none text-stone-400">
                        <UserIcon className="w-4 h-4 text-stone-400" />
                      </div>
                    </div>
                  </div>

                  {/* 2. Compulsory Mobile Number Input */}
                  <div>
                    <label
                      htmlFor="signin-phone"
                      className="block text-[13px] font-bold text-[#0f1111] mb-1"
                    >
                      Mobile number <span className="text-[#c40000] font-bold">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-2.5 pointer-events-none text-xs font-bold text-stone-600 border-r border-stone-300 pr-2 flex items-center gap-1">
                        <span>🇮🇳</span>
                        <span>+91</span>
                      </div>
                      <input
                        id="signin-phone"
                        type="tel"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, "");
                          setPhone(digits);
                          if (error) setError(null);
                        }}
                        placeholder="10-digit mobile number"
                        required
                        className="w-full pl-16 pr-8 py-2 bg-white text-[#0f1111] text-sm rounded-[4px] border border-[#888c8c] focus:outline-none focus:border-[#e77600] focus:ring-2 focus:ring-[#f3a847]/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] transition-all font-medium"
                      />
                      <div className="absolute right-2.5 pointer-events-none text-stone-400">
                        <Phone className="w-4 h-4 text-stone-400" />
                      </div>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1">
                      We will connect your bag orders and WhatsApp chat using this number.
                    </p>
                  </div>

                  {/* Primary Signature Button (Amazon Yellow Button) */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] border border-[#a88734] rounded-lg py-2.5 text-sm text-[#0f1111] font-medium shadow-xs hover:shadow transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-stone-800 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span>Continue</span>
                    )}
                  </button>

                  {/* Conditions & Privacy Notice */}
                  <p className="text-[12px] text-[#0f1111] leading-relaxed pt-1">
                    By continuing, you agree to Shreya&apos;s Craft Nest&apos;s{" "}
                    <Link href="/#catalog" className="text-[#007185] hover:text-[#c7511f] hover:underline">
                      Conditions of Use
                    </Link>{" "}
                    and{" "}
                    <Link href="/#catalog" className="text-[#007185] hover:text-[#c7511f] hover:underline">
                      Privacy Notice
                    </Link>
                    .
                  </p>

                  {/* Amazon Collapsible: Need help? */}
                  <div className="pt-2 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={() => setShowHelp((prev) => !prev)}
                      className="flex items-center gap-1 text-xs text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer group"
                    >
                      <ChevronRight
                        className={`w-3.5 h-3.5 transition-transform duration-150 ${
                          showHelp ? "rotate-90 text-[#c7511f]" : "text-stone-500"
                        }`}
                      />
                      <span>Need help?</span>
                    </button>

                    {showHelp && (
                      <div className="pl-4 pt-2 space-y-1.5 text-xs animate-in fade-in duration-150">
                        <a
                          href="https://wa.me/919491710704?text=Hi%20Sudha%20Rani%20ji%2C%20I%20need%20assistance%20signing%20in%20to%20Shreya%27s%20Craft%20Nest."
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 hover:underline font-medium"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp Help (Sudha Rani)</span>
                        </a>
                        <button
                          type="button"
                          onClick={handleGuestLogin}
                          className="block text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer text-left"
                        >
                          Explore store as Guest Customer →
                        </button>
                      </div>
                    )}
                  </div>
                </form>
              )}

              {/* VIEW 2: CREATE ACCOUNT WITH PASSWORD SETUP (Amazon Style) */}
              {activeTab === "register" && (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <h1 className="text-[28px] font-normal text-[#0f1111] leading-tight mb-2">
                    Create Account
                  </h1>

                  {/* Name Input */}
                  <div>
                    <label
                      htmlFor="reg-name"
                      className="block text-[13px] font-bold text-[#0f1111] mb-1"
                    >
                      Your name <span className="text-[#c40000] font-bold">*</span>
                    </label>
                    <input
                      id="reg-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="First and last name"
                      autoFocus
                      required
                      className="w-full px-2.5 py-2 bg-white text-[#0f1111] text-sm rounded-[4px] border border-[#888c8c] focus:outline-none focus:border-[#e77600] focus:ring-2 focus:ring-[#f3a847]/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] transition-all"
                    />
                  </div>

                  {/* Mobile Number Input */}
                  <div>
                    <label
                      htmlFor="reg-id"
                      className="block text-[13px] font-bold text-[#0f1111] mb-1"
                    >
                      Mobile number <span className="text-[#c40000] font-bold">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-2.5 pointer-events-none text-xs font-bold text-stone-600 border-r border-stone-300 pr-2 flex items-center gap-1">
                        <span>🇮🇳</span>
                        <span>+91</span>
                      </div>
                      <input
                        id="reg-id"
                        type="tel"
                        maxLength={10}
                        value={identifier}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, "");
                          setIdentifier(digits);
                        }}
                        placeholder="10-digit mobile number"
                        required
                        className="w-full pl-16 pr-8 py-2 bg-white text-[#0f1111] text-sm rounded-[4px] border border-[#888c8c] focus:outline-none focus:border-[#e77600] focus:ring-2 focus:ring-[#f3a847]/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Password Input with Verification */}
                  <div>
                    <label
                      htmlFor="reg-password"
                      className="block text-[13px] font-bold text-[#0f1111] mb-1"
                    >
                      Password
                    </label>
                    <div className="relative flex items-center">
                      <input
                        id="reg-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        required
                        minLength={6}
                        className="w-full px-2.5 py-1.5 bg-white text-[#0f1111] text-sm rounded-[4px] border border-[#888c8c] focus:outline-none focus:border-[#e77600] focus:ring-2 focus:ring-[#f3a847]/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] transition-all pr-8"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {/* Amazon Signature Password Info Note */}
                    <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-1.5">
                      <Info className="w-3.5 h-3.5 text-[#007185] flex-shrink-0" />
                      <span>Passwords must be at least 6 characters.</span>
                    </div>
                  </div>

                  {/* Legal Notice */}
                  <p className="text-[12px] text-[#0f1111] leading-relaxed pt-1">
                    By creating an account, you agree to Shreya&apos;s Craft Nest&apos;s{" "}
                    <Link href="/#catalog" className="text-[#007185] hover:text-[#c7511f] hover:underline">
                      Conditions of Use
                    </Link>{" "}
                    and{" "}
                    <Link href="/#catalog" className="text-[#007185] hover:text-[#c7511f] hover:underline">
                      Privacy Notice
                    </Link>
                    .
                  </p>

                  {/* Create Account Action */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] border border-[#a88734] rounded-lg py-2 text-sm text-[#0f1111] font-medium shadow-xs hover:shadow transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-stone-800 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span>Create your Shreya&apos;s Craft Nest account</span>
                    )}
                  </button>

                  {/* Back to Sign In */}
                  <div className="pt-3 border-t border-stone-100 text-xs text-[#0f1111]">
                    <span>Already have an account? </span>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("signin");
                        setError(null);
                      }}
                      className="text-[#007185] hover:text-[#c7511f] hover:underline font-semibold cursor-pointer"
                    >
                      Sign in ▸
                    </button>
                  </div>
                </form>
              )}

              {/* VIEW 3: FORGOT PASSWORD RESET */}
              {activeTab === "forgot" && (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-amber-800" />
                    <h1 className="text-[24px] font-normal text-[#0f1111] leading-tight">
                      Password assistance
                    </h1>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    Enter the email address or mobile phone number associated with your Shreya&apos;s Craft Nest account.
                  </p>

                  <div>
                    <label
                      htmlFor="forgot-id"
                      className="block text-[13px] font-bold text-[#0f1111] mb-1"
                    >
                      Email or mobile phone number
                    </label>
                    <input
                      id="forgot-id"
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. 9876543210 or yourname@gmail.com"
                      required
                      className="w-full px-2.5 py-1.5 bg-white text-[#0f1111] text-sm rounded-[4px] border border-[#888c8c] focus:outline-none focus:border-[#e77600] focus:ring-2 focus:ring-[#f3a847]/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] transition-all"
                    />
                  </div>

                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-stone-700">Enter Demo OTP:</span>
                      <span className="bg-emerald-100 text-emerald-800 font-mono font-bold px-2 py-0.5 rounded">
                        123456
                      </span>
                    </div>
                    <input
                      type="text"
                      value={forgotOtp}
                      onChange={(e) => setForgotOtp(e.target.value)}
                      placeholder="123456"
                      maxLength={6}
                      className="w-full px-3 py-1.5 bg-white text-[#0f1111] text-center font-mono font-bold tracking-widest text-sm rounded-[4px] border border-stone-300 focus:outline-none focus:border-[#e77600] focus:ring-2 focus:ring-[#f3a847]/40"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="forgot-new-pwd"
                      className="block text-[13px] font-bold text-[#0f1111] mb-1"
                    >
                      New Password
                    </label>
                    <input
                      id="forgot-new-pwd"
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      required
                      minLength={6}
                      className="w-full px-2.5 py-1.5 bg-white text-[#0f1111] text-sm rounded-[4px] border border-[#888c8c] focus:outline-none focus:border-[#e77600] focus:ring-2 focus:ring-[#f3a847]/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] border border-[#a88734] rounded-lg py-2 text-sm text-[#0f1111] font-medium shadow-xs hover:shadow transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-stone-800 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span>Save Changes & Sign in</span>
                    )}
                  </button>

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("signin");
                        setError(null);
                      }}
                      className="text-xs text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer"
                    >
                      ← Return to Sign in
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* AMAZON SIGNATURE DIVIDER & CREATE ACCOUNT BUTTON */}
            {activeTab === "signin" && (
              <div className="mt-5 space-y-3">
                {/* Horizontal rule with text */}
                <div className="relative flex items-center justify-center">
                  <div className="w-full border-t border-[#e7e7e7]"></div>
                  <span className="bg-[#FAF8F5]/60 sm:bg-[#FAF8F5]/80 px-2 text-[12px] text-stone-500 whitespace-nowrap">
                    New to Shreya&apos;s Craft Nest?
                  </span>
                  <div className="w-full border-t border-[#e7e7e7]"></div>
                </div>

                {/* Secondary Gray Action Button */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("register");
                    setError(null);
                  }}
                  className="w-full bg-[#f0f2f2] hover:bg-[#e3e6e6] active:bg-[#d8dbdb] text-[#0f1111] font-normal text-xs sm:text-sm py-2 rounded-lg border border-[#d5d9d9] shadow-2xs hover:shadow-xs transition-colors cursor-pointer text-center"
                >
                  Create your Shreya&apos;s Craft Nest account
                </button>

                {/* Flipkart Fast Guest Option */}
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={handleGuestLogin}
                    className="text-xs text-stone-500 hover:text-stone-800 hover:underline cursor-pointer"
                  >
                    Want to look around first? <strong className="text-stone-800 font-semibold">Explore as Guest →</strong>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Security Trust Badges */}
        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span className="text-[11px]">Secure 256-bit Encryption</span>
          </div>
          <span className="text-stone-300">•</span>
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-amber-700" />
            <span className="text-[11px]">Privacy Guaranteed</span>
          </div>
        </div>
      </div>

      {/* AMAZON & FLIPKART STYLE FOOTER */}
      <footer className="w-full max-w-sm mx-auto text-center py-6 text-[11px] text-stone-500 space-y-2.5 border-t border-[#e7e7e7] mt-8">
        <div className="flex justify-center gap-6">
          <Link href="/#catalog" className="text-[#007185] hover:text-[#c7511f] hover:underline">
            Conditions of Use
          </Link>
          <Link href="/#catalog" className="text-[#007185] hover:text-[#c7511f] hover:underline">
            Privacy Notice
          </Link>
          <a
            href="https://wa.me/919491710704?text=Hi%20Sudha%20Rani%20ji%2C%20I%20have%20an%20inquiry%20regarding%20Shreya%27s%20Craft%20Nest."
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#007185] hover:text-[#c7511f] hover:underline"
          >
            Help & WhatsApp
          </a>
        </div>
        <p className="text-[11px] text-stone-400">
          © {new Date().getFullYear()}, Shreya&apos;s Craft Nest.in or its affiliates. Handcrafted with love in India.
        </p>
      </footer>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center text-stone-600">
          <div className="w-6 h-6 border-2 border-amber-800 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
