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
} from "lucide-react";

function SignInContent() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const {
    loginWithPhone,
    loginWithEmail,
    loginWithOtp,
    register,
    user,
    isLoggedIn,
    loginAsGuest,
    logout,
  } = useAuth();

  // Mode: "signin" | "register"
  const [activeTab, setActiveTab] = useState<"signin" | "register">("signin");

  // Inputs
  const [identifier, setIdentifier] = useState("");
  const [name, setName] = useState("");
  const [otpMode, setOtpMode] = useState(false);
  const [otpCode, setOtpCode] = useState("123456");
  const [showHelp, setShowHelp] = useState(false);

  // States
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

  // 1. Handle Primary Sign In Form
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleanId = identifier.trim();

    if (!cleanId) {
      setError("Enter your email or mobile phone number");
      return;
    }

    setIsSubmitting(true);

    try {
      const isEmail = cleanId.includes("@");
      const cleanPhone = cleanId.replace(/\D/g, "");

      if (otpMode) {
        // OTP verification
        if (otpCode !== "123456" && otpCode.length !== 6) {
          setError("Invalid verification code. Please enter demo code: 123456");
          setIsSubmitting(false);
          return;
        }
        await loginWithOtp(cleanId, otpCode, name || undefined);
      } else {
        // Direct instant login
        if (isEmail) {
          await loginWithEmail(cleanId, undefined, name || undefined);
        } else {
          await loginWithPhone(cleanPhone || cleanId, name || undefined);
        }
      }

      const displayName =
        name.trim() ||
        (isEmail ? cleanId.split("@")[0] : `Customer ${cleanPhone.slice(-4) || ""}`);
      finishLogin(displayName);
    } catch (err) {
      console.error(err);
      setError("Unable to sign in. Please verify your details and try again.");
      setIsSubmitting(false);
    }
  };

  // 2. Handle Register Form
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Enter your name");
      return;
    }
    if (!identifier.trim()) {
      setError("Enter your mobile number or email");
      return;
    }

    setIsSubmitting(true);
    try {
      await register(name.trim(), identifier.trim());
      finishLogin(name.trim());
    } catch (err) {
      console.error(err);
      setError("Registration failed. Please check your information and try again.");
      setIsSubmitting(false);
    }
  };

  // 3. Handle Guest Login
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
          aria-label="Shreya Craft Nest Home"
        >
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-amber-300 bg-white shadow-xs flex-shrink-0">
            <Image
              src="/logo-emblem.png"
              alt="Shreya Craft Nest Logo"
              fill
              sizes="40px"
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col leading-none">
            <div className="flex items-baseline font-serif font-bold tracking-tight text-stone-900 text-2xl">
              <span>Shreya Craft Nest</span>
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

              {/* VIEW 1: SIGN IN (Amazon/Flipkart Style) */}
              {activeTab === "signin" && (
                <form onSubmit={handleSignInSubmit} className="space-y-4">
                  <h1 className="text-[28px] font-normal text-[#0f1111] leading-tight mb-2">
                    Sign in
                  </h1>

                  {/* Primary ID Input */}
                  <div>
                    <label
                      htmlFor="signin-id"
                      className="block text-[13px] font-bold text-[#0f1111] mb-1"
                    >
                      Email or mobile phone number
                    </label>
                    <div className="relative flex items-center">
                      <input
                        id="signin-id"
                        type="text"
                        value={identifier}
                        onChange={(e) => {
                          setIdentifier(e.target.value);
                          if (error) setError(null);
                        }}
                        placeholder=""
                        autoFocus
                        required
                        className="w-full px-2.5 py-1.5 bg-white text-[#0f1111] text-sm rounded-[4px] border border-[#888c8c] focus:outline-none focus:border-[#e77600] focus:ring-2 focus:ring-[#f3a847]/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] transition-all"
                      />
                      <div className="absolute right-2.5 pointer-events-none text-stone-400">
                        {identifier.includes("@") ? (
                          <Mail className="w-4 h-4 text-stone-400" />
                        ) : (
                          <Phone className="w-4 h-4 text-stone-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Customer Name Input (Amazon Personalization) */}
                  <div>
                    <label
                      htmlFor="signin-name"
                      className="block text-[13px] font-bold text-[#0f1111] mb-1"
                    >
                      Your Name <span className="font-normal text-stone-500">(Optional)</span>
                    </label>
                    <div className="relative flex items-center">
                      <input
                        id="signin-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Shreya"
                        className="w-full px-2.5 py-1.5 bg-white text-[#0f1111] text-sm rounded-[4px] border border-[#888c8c] focus:outline-none focus:border-[#e77600] focus:ring-2 focus:ring-[#f3a847]/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] transition-all"
                      />
                      <div className="absolute right-2.5 pointer-events-none text-stone-400">
                        <UserIcon className="w-4 h-4 text-stone-400" />
                      </div>
                    </div>
                  </div>

                  {/* Flipkart Fast OTP Verification Mode */}
                  {otpMode && (
                    <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-200/90 space-y-2 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-amber-950">Enter 6-digit OTP:</span>
                        <span className="text-[11px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-mono font-bold">
                          Demo OTP: 123456
                        </span>
                      </div>
                      <input
                        type="text"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="123456"
                        maxLength={6}
                        className="w-full px-3 py-1.5 bg-white text-[#0f1111] text-center font-mono font-bold tracking-widest text-base rounded-[4px] border border-amber-300 focus:outline-none focus:border-[#e77600] focus:ring-2 focus:ring-[#f3a847]/40"
                      />
                      <button
                        type="button"
                        onClick={() => setOtpCode("123456")}
                        className="text-[11px] text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer block"
                      >
                        Auto-fill demo code (123456)
                      </button>
                    </div>
                  )}

                  {/* Primary Signature Button (Amazon Yellow Button) */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] border border-[#a88734] rounded-lg py-2 text-sm text-[#0f1111] font-medium shadow-xs hover:shadow transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-stone-800 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span>{otpMode ? "Verify & Sign in" : "Continue"}</span>
                    )}
                  </button>

                  {/* Flipkart Style: Sign in with OTP Toggle */}
                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => setOtpMode(!otpMode)}
                      className="text-xs text-[#007185] hover:text-[#c7511f] hover:underline font-medium cursor-pointer"
                    >
                      {otpMode ? "Sign in directly (without OTP)" : "Sign in with OTP instead"}
                    </button>
                  </div>

                  {/* Conditions & Privacy Notice */}
                  <p className="text-[12px] text-[#0f1111] leading-relaxed pt-1">
                    By continuing, you agree to Shreya Craft Nest's{" "}
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
                          href="https://wa.me/919491710704?text=Hi%20Sudha%20Rani%20ji%2C%20I%20need%20assistance%20signing%20in%20to%20Shreya%20Crafts%20Nest."
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

              {/* VIEW 2: CREATE ACCOUNT (Amazon Style) */}
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
                      Your name
                    </label>
                    <input
                      id="reg-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="First and last name"
                      autoFocus
                      required
                      className="w-full px-2.5 py-1.5 bg-white text-[#0f1111] text-sm rounded-[4px] border border-[#888c8c] focus:outline-none focus:border-[#e77600] focus:ring-2 focus:ring-[#f3a847]/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] transition-all"
                    />
                  </div>

                  {/* ID Input */}
                  <div>
                    <label
                      htmlFor="reg-id"
                      className="block text-[13px] font-bold text-[#0f1111] mb-1"
                    >
                      Mobile number or email
                    </label>
                    <input
                      id="reg-id"
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. 9876543210 or yourname@gmail.com"
                      required
                      className="w-full px-2.5 py-1.5 bg-white text-[#0f1111] text-sm rounded-[4px] border border-[#888c8c] focus:outline-none focus:border-[#e77600] focus:ring-2 focus:ring-[#f3a847]/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] transition-all"
                    />
                  </div>

                  {/* Legal Notice */}
                  <p className="text-[12px] text-[#0f1111] leading-relaxed pt-1">
                    By creating an account, you agree to Shreya Craft Nest's{" "}
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
                      <span>Verify & Create Account</span>
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
            </div>

            {/* AMAZON SIGNATURE DIVIDER & CREATE ACCOUNT BUTTON */}
            {activeTab === "signin" && (
              <div className="mt-5 space-y-3">
                {/* Horizontal rule with text */}
                <div className="relative flex items-center justify-center">
                  <div className="w-full border-t border-[#e7e7e7]"></div>
                  <span className="bg-[#FAF8F5]/60 sm:bg-[#FAF8F5]/80 px-2 text-[12px] text-stone-500 whitespace-nowrap">
                    New to Shreya Craft Nest?
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
                  Create your Shreya Craft Nest account
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
            href="https://wa.me/919491710704?text=Hi%20Sudha%20Rani%20ji%2C%20I%20have%20an%20inquiry%20regarding%20Shreya%20Crafts%20Nest."
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#007185] hover:text-[#c7511f] hover:underline"
          >
            Help & WhatsApp
          </a>
        </div>
        <p className="text-[11px] text-stone-400">
          © {new Date().getFullYear()}, Shreya Craft Nest.in or its affiliates. Handcrafted with love in India.
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
