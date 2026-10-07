"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  ChevronRight,
  Eye,
  EyeOff,
  Mail,
  Phone,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const {
    loginWithPhone,
    loginWithEmail,
    loginWithOtp,
    register,
    user,
    sendOtp,
    isLoggedIn,
    isLoaded,
    loginAsGuest,
  } = useAuth();

  // If already logged in, redirect straight to store
  useEffect(() => {
    if (isLoaded && isLoggedIn) {
      router.replace(redirectUrl);
    }
  }, [isLoaded, isLoggedIn, redirectUrl, router]);

  const handleGuestContinue = () => {
    loginAsGuest();
    setStage("success");
    setTimeout(() => {
      router.push(redirectUrl);
    }, 600);
  };

  // Screen stages: "identifier" | "otp" | "password" | "register" | "success"
  const [stage, setStage] = useState<"identifier" | "otp" | "password" | "register" | "success">("identifier");

  // Inputs
  const [identifier, setIdentifier] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [showHelp, setShowHelp] = useState(false);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Detect whether identifier is phone or email
  const isPhone = /^[0-9+ ]+$/.test(identifier.trim()) || (identifier.replace(/\D/g, "").length >= 6 && !identifier.includes("@"));
  const cleanPhone = identifier.replace(/\D/g, "").slice(-10);

  // Countdown timer for OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (stage === "otp" && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [stage, resendTimer]);

  // Stage 1: Validate identifier and proceed to next step
  const handleIdentifierSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = identifier.trim();

    if (!trimmed) {
      setError("Please enter your email or mobile phone number.");
      return;
    }

    if (isPhone) {
      if (cleanPhone.length !== 10) {
        setError("Please enter a valid 10-digit Indian mobile number.");
        return;
      }
      setIsSubmitting(true);
      await sendOtp(cleanPhone);
      setIsSubmitting(false);
      setResendTimer(30);
      setStage("otp");
    } else {
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmed)) {
        setError("Please enter a valid email address.");
        return;
      }
      // Ask for password or OTP for email
      setStage("password");
    }
  };

  // Stage 2A: Handle OTP submission (Phone or Email OTP)
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto focus next box
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pasted[i] || "";
      }
      setOtp(newOtp);
      otpInputsRef.current[Math.min(pasted.length, 5)]?.focus();
    }
  };

  const autoFillDemoOtp = () => {
    setOtp(["1", "2", "3", "4", "5", "6"]);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const fullOtp = otp.join("");

    if (fullOtp.length !== 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    setIsSubmitting(true);
    const success = await loginWithOtp(identifier, fullOtp, name);
    setIsSubmitting(false);

    if (success) {
      setStage("success");
      setTimeout(() => {
        router.push(redirectUrl);
      }, 1200);
    } else {
      setError("Invalid OTP. For demo test, enter 123456.");
    }
  };

  // Stage 2B: Handle Email Password submission
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);
    const success = await loginWithEmail(identifier, password, name);
    setIsSubmitting(false);

    if (success) {
      setStage("success");
      setTimeout(() => {
        router.push(redirectUrl);
      }, 1200);
    } else {
      setError("Incorrect password. Please try again or sign in with OTP.");
    }
  };

  // Stage 3: Handle Account Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!identifier.trim()) {
      setError("Please enter your mobile number or email.");
      return;
    }

    if (isPhone && cleanPhone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (password && password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);
    await sendOtp(identifier);
    setIsSubmitting(false);
    setResendTimer(30);
    setStage("otp");
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between text-stone-800 font-sans selection:bg-amber-200 selection:text-amber-900 py-6 px-4">
      {/* Top Logo */}
      <div className="w-full flex justify-center pt-2 pb-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 p-1 rounded-lg hover:opacity-90 transition-all group"
          aria-label="Back to home"
        >
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-amber-300 bg-white shadow-xs flex-shrink-0">
            <Image
              src="/logo-emblem.png"
              alt="Shreya Craft Nest"
              fill
              sizes="40px"
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col leading-none">
            <div className="flex items-baseline font-serif font-bold tracking-tight text-stone-900 text-xl">
              <span>Shreya Craft Nest</span>
              <span className="text-amber-800 text-xs font-sans font-bold ml-0.5">.in</span>
            </div>
            {/* Amazon golden curve accent */}
            <div className="relative h-1 w-full overflow-hidden mt-0.5">
              <div className="w-full h-2 rounded-full border-b-2 border-amber-500"></div>
            </div>
          </div>
        </Link>
      </div>

      {/* Main Authentication Card */}
      <div className="w-full max-w-[380px] sm:max-w-[400px] mx-auto">
        <div className="bg-white rounded-2xl border border-stone-200/90 shadow-md p-6 sm:p-8">
          {/* ======================================================== */}
          {/* STAGE 1: ASK SIGN IN USING EMAIL OR PHONENUMBER */}
          {/* ======================================================== */}
          {stage === "identifier" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
                  Sign in or create account
                </h1>
                <p className="text-xs text-stone-500 mt-1">
                  Enter your mobile number or email to proceed to Mom's Studio.
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                  <span className="font-bold">!</span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleIdentifierSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="identifier"
                    className="block text-xs font-bold text-stone-800 mb-1.5"
                  >
                    Email or mobile phone number
                  </label>
                  <div className="relative flex items-center">
                    <input
                      id="identifier"
                      type="text"
                      value={identifier}
                      onChange={(e) => {
                        setIdentifier(e.target.value);
                        if (error) setError(null);
                      }}
                      placeholder="e.g. 9876543210 or name@gmail.com"
                      autoFocus
                      className="w-full px-3.5 py-2.5 bg-white text-stone-900 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#f3a847] focus:border-[#f3a847] transition-all shadow-inner"
                    />
                    <div className="absolute right-3 pointer-events-none text-stone-400">
                      {isPhone && cleanPhone.length > 0 ? (
                        <div className="flex items-center gap-1 text-[11px] font-bold text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded">
                          <span>🇮🇳</span>
                          <span>+91</span>
                        </div>
                      ) : identifier.includes("@") ? (
                        <Mail className="w-4 h-4 text-amber-700" />
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Amazon Signature Yellow Action Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#ffd814] hover:bg-[#f7ca00] active:scale-[0.98] text-stone-900 font-bold text-sm py-3 px-4 rounded-xl border border-[#fcd200] shadow-sm hover:shadow transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-stone-800 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Continue</span>
                  )}
                </button>
              </form>

              {/* Conditions of Use */}
              <p className="text-[11px] text-stone-500 leading-relaxed pt-1">
                By continuing, you agree to Shreya Craft Nest's{" "}
                <Link href="/#catalog" className="text-amber-800 hover:underline">
                  Conditions of Use
                </Link>{" "}
                and{" "}
                <Link href="/#catalog" className="text-amber-800 hover:underline">
                  Privacy Notice
                </Link>
                .
              </p>

              {/* Need Help Accordion */}
              <div className="pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowHelp(!showHelp)}
                  className="inline-flex items-center gap-1 text-xs text-amber-800 hover:text-amber-900 font-medium hover:underline cursor-pointer"
                >
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      showHelp ? "rotate-90" : ""
                    }`}
                  />
                  <span>Need help?</span>
                </button>

                {showHelp && (
                  <div className="mt-2 pl-4 space-y-1.5 text-xs text-stone-600 animate-in fade-in duration-150">
                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          setStage("otp");
                          sendOtp(identifier || "9876543210");
                        }}
                        className="text-amber-800 hover:underline cursor-pointer"
                      >
                        Sign in with OTP instead
                      </button>
                    </div>
                    <div>
                      <a
                        href="https://wa.me/919876543210?text=Hi%20Shreya%2C%20I%20need%20help%20signing%20in%20to%20my%20account."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 hover:underline"
                      >
                        WhatsApp customer support
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STAGE 2A: OTP VERIFICATION (For Mobile or One-Time Pass) */}
          {/* ======================================================== */}
          {stage === "otp" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
                  Verification required
                </h1>
                <button
                  type="button"
                  onClick={() => setStage("identifier")}
                  className="text-xs text-amber-800 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Change</span>
                </button>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-stone-700">
                <span className="text-stone-500">Sent code to: </span>
                <span className="font-bold text-stone-900">
                  {isPhone ? `+91 ${cleanPhone}` : identifier}
                </span>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                  <span className="font-bold">!</span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-stone-800">
                      Enter 6-digit OTP
                    </label>
                    <button
                      type="button"
                      onClick={autoFillDemoOtp}
                      className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
                    >
                      Auto-fill Demo (123456)
                    </button>
                  </div>

                  {/* 6 Digit Input Boxes */}
                  <div
                    className="grid grid-cols-6 gap-2"
                    onPaste={handleOtpPaste}
                  >
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => {
                          otpInputsRef.current[idx] = el;
                        }}
                        type="text"
                        maxLength={1}
                        inputMode="numeric"
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="w-full h-12 text-center font-bold text-lg text-stone-900 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#f3a847] focus:border-[#f3a847] bg-white transition-all shadow-inner"
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#ffd814] hover:bg-[#f7ca00] active:scale-[0.98] text-stone-900 font-bold text-sm py-3 px-4 rounded-xl border border-[#fcd200] shadow-sm hover:shadow transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-stone-800 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Verify & Continue</span>
                  )}
                </button>
              </form>

              {/* Resend OTP */}
              <div className="text-center text-xs text-stone-500 pt-2 border-t border-stone-100">
                {resendTimer > 0 ? (
                  <span>Resend OTP in <strong className="text-stone-800">{resendTimer}s</strong></span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      sendOtp(identifier);
                      setResendTimer(30);
                    }}
                    className="text-amber-800 font-bold hover:underline cursor-pointer"
                  >
                    Resend OTP now
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STAGE 2B: EMAIL PASSWORD SIGN IN */}
          {/* ======================================================== */}
          {stage === "password" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
                  Sign in
                </h1>
                <button
                  type="button"
                  onClick={() => setStage("identifier")}
                  className="text-xs text-amber-800 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Change</span>
                </button>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-stone-700">
                <span className="text-stone-500">Signing in as: </span>
                <span className="font-bold text-stone-900">{identifier}</span>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                  <span className="font-bold">!</span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="password"
                      className="text-xs font-bold text-stone-800"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        sendOtp(identifier);
                        setStage("otp");
                      }}
                      className="text-xs text-amber-800 hover:underline cursor-pointer"
                    >
                      Sign in with OTP
                    </button>
                  </div>

                  <div className="relative flex items-center">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) setError(null);
                      }}
                      placeholder="At least 6 characters"
                      autoFocus
                      className="w-full px-3.5 py-2.5 bg-white text-stone-900 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#f3a847] focus:border-[#f3a847] transition-all shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#ffd814] hover:bg-[#f7ca00] active:scale-[0.98] text-stone-900 font-bold text-sm py-3 px-4 rounded-xl border border-[#fcd200] shadow-sm hover:shadow transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-stone-800 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Sign In</span>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ======================================================== */}
          {/* STAGE 3: CREATE ACCOUNT (REGISTER) */}
          {/* ======================================================== */}
          {stage === "register" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
                  Create Account
                </h1>
                <p className="text-xs text-stone-500 mt-1">
                  Join our artisan community to track orders and save favorites.
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                  <span className="font-bold">!</span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <label
                    htmlFor="reg-name"
                    className="block text-xs font-bold text-stone-800 mb-1"
                  >
                    Your name
                  </label>
                  <input
                    id="reg-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="First and last name"
                    autoFocus
                    className="w-full px-3.5 py-2.5 bg-white text-stone-900 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#f3a847] focus:border-[#f3a847] shadow-inner"
                  />
                </div>

                <div>
                  <label
                    htmlFor="reg-identifier"
                    className="block text-xs font-bold text-stone-800 mb-1"
                  >
                    Mobile number or email
                  </label>
                  <input
                    id="reg-identifier"
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. 9876543210 or name@gmail.com"
                    className="w-full px-3.5 py-2.5 bg-white text-stone-900 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#f3a847] focus:border-[#f3a847] shadow-inner"
                  />
                </div>

                <div>
                  <label
                    htmlFor="reg-password"
                    className="block text-xs font-bold text-stone-800 mb-1"
                  >
                    Password (optional)
                  </label>
                  <input
                    id="reg-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full px-3.5 py-2.5 bg-white text-stone-900 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#f3a847] focus:border-[#f3a847] shadow-inner"
                  />
                  <p className="text-[11px] text-stone-400 mt-1">
                    Passwords must be at least 6 characters.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#ffd814] hover:bg-[#f7ca00] active:scale-[0.98] text-stone-900 font-bold text-sm py-3 px-4 rounded-xl border border-[#fcd200] shadow-sm hover:shadow transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-stone-800 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Verify mobile number</span>
                  )}
                </button>
              </form>

              <div className="text-xs text-stone-600 pt-3 border-t border-stone-100">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setStage("identifier")}
                  className="text-amber-800 font-semibold hover:underline cursor-pointer"
                >
                  Sign in ▸
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STAGE 4: SUCCESS CONFIRMATION */}
          {/* ======================================================== */}
          {stage === "success" && (
            <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mx-auto text-emerald-700 shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-stone-900">
                Welcome back!
              </h2>
              <p className="text-xs text-stone-600 max-w-xs mx-auto">
                You are successfully signed in to Shreya Craft Nest. Redirecting you to your shopping experience...
              </p>
            </div>
          )}
        </div>

        {/* Create Account Divider (Only shown in identifier stage) */}
        {stage === "identifier" && (
          <div className="mt-6 space-y-3">
            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-stone-200" />
              <span className="absolute bg-[#FAF8F5] px-3 text-xs text-stone-400 font-medium">
                New to Shreya Craft Nest?
              </span>
            </div>

            <button
              type="button"
              onClick={() => setStage("register")}
              className="w-full bg-white hover:bg-stone-50 active:scale-[0.98] text-stone-800 font-semibold text-xs sm:text-sm py-2.5 px-4 rounded-xl border border-stone-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer text-center"
            >
              Create your Shreya Craft Nest account
            </button>

            {/* Quick Guest Explorer option */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={handleGuestContinue}
                className="text-xs text-amber-900/80 hover:text-amber-950 font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Browse Storefront as Guest Customer →</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="w-full max-w-sm mx-auto text-center py-6 text-[11px] text-stone-400 space-y-2 border-t border-stone-200/60 mt-10">
        <div className="flex justify-center gap-6">
          <Link href="/#catalog" className="text-amber-800/80 hover:underline">
            Conditions of Use
          </Link>
          <Link href="/#catalog" className="text-amber-800/80 hover:underline">
            Privacy Notice
          </Link>
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-800/80 hover:underline"
          >
            Help & WhatsApp
          </a>
        </div>
        <p>© 2026 ShreyaCraftNest.in, lovingly handcrafted by mom.</p>
      </footer>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
}
