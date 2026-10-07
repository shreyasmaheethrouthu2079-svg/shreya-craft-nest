"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Mail,
  Phone,
  User,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Lock,
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
    isLoaded,
    loginAsGuest,
  } = useAuth();

  // Tabs: "signin" | "register" | "quick"
  const [activeTab, setActiveTab] = useState<"signin" | "register" | "quick">("signin");

  // Inputs
  const [identifier, setIdentifier] = useState("");
  const [name, setName] = useState("");
  const [otpMode, setOtpMode] = useState(false);
  const [otpCode, setOtpCode] = useState("123456");

  // States
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successName, setSuccessName] = useState("");

  // If already logged in when visiting, redirect to store immediately
  useEffect(() => {
    if (isLoaded && isLoggedIn && !isSuccess) {
      window.location.href = redirectUrl;
    }
  }, [isLoaded, isLoggedIn, redirectUrl, isSuccess]);

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
      setError("Please enter your mobile phone number or email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const isEmail = cleanId.includes("@");
      const cleanPhone = cleanId.replace(/\D/g, "");

      if (otpMode) {
        // OTP verification
        if (otpCode !== "123456" && otpCode.length !== 6) {
          setError("Invalid code. Please enter demo verification code: 123456");
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

      const displayName = name.trim() || (isEmail ? cleanId.split("@")[0] : `Customer ${cleanPhone.slice(-4) || ""}`);
      finishLogin(displayName);
    } catch (err) {
      console.error(err);
      setError("Unable to sign in. Please try again or use 1-click Quick Login.");
      setIsSubmitting(false);
    }
  };

  // 2. Handle Register Form
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

    setIsSubmitting(true);
    try {
      await register(name.trim(), identifier.trim());
      finishLogin(name.trim());
    } catch (err) {
      console.error(err);
      setError("Registration failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  // 3. Handle 1-Click Quick Profiles
  const handleQuickLogin = (demoName: string, demoId: string) => {
    setError(null);
    setIsSubmitting(true);
    if (demoId.includes("@")) {
      loginWithEmail(demoId, undefined, demoName);
    } else {
      loginWithPhone(demoId, demoName);
    }
    finishLogin(demoName);
  };

  // 4. Handle Guest Login
  const handleGuestLogin = () => {
    setIsSubmitting(true);
    loginAsGuest();
    finishLogin("Guest Customer");
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between text-stone-800 font-sans selection:bg-amber-200 selection:text-amber-900 py-8 px-4">
      {/* Top Brand Logo */}
      <div className="w-full flex justify-center pt-2 pb-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 p-1 rounded-lg hover:opacity-90 transition-all group"
          aria-label="Shreya Craft Nest"
        >
          <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-amber-300 bg-white shadow-xs flex-shrink-0">
            <Image
              src="/logo-emblem.png"
              alt="Shreya Craft Nest"
              fill
              sizes="44px"
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col leading-none">
            <div className="flex items-baseline font-serif font-bold tracking-tight text-stone-900 text-2xl">
              <span>Shreya Craft Nest</span>
              <span className="text-amber-800 text-xs font-sans font-bold ml-0.5">.in</span>
            </div>
            <div className="relative h-1 w-full overflow-hidden mt-0.5">
              <div className="w-full h-2 rounded-full border-b-2 border-amber-500"></div>
            </div>
          </div>
        </Link>
      </div>

      {/* Main Authentication Card */}
      <div className="w-full max-w-[420px] mx-auto">
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-md p-6 sm:p-8">
          {isSuccess ? (
            /* SUCCESS STATE ANIMATION */
            <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mx-auto text-emerald-700 shadow-xs">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h2 className="text-2xl font-serif font-bold text-stone-900">
                  Welcome, {successName}!
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xs mx-auto">
                  You are now signed in. Opening your storefront with all bags and cart...
                </p>
              </div>
              <div className="w-6 h-6 border-2 border-amber-800 border-t-transparent rounded-full animate-spin mx-auto mt-4" />
            </div>
          ) : (
            <div>
              {/* Header Badge */}
              <div className="mb-5">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-900 bg-amber-100/90 px-3 py-1 rounded-full mb-2 border border-amber-300/60">
                  <Sparkles className="w-3.5 h-3.5 text-amber-800" />
                  <span>Customer Access Portal</span>
                </div>
                <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
                  Sign in or Login
                </h1>
                <p className="text-xs text-stone-500 mt-1">
                  Access your orders, saved cart items, and handcrafted bag collection.
                </p>
              </div>

              {/* Mode Tabs */}
              <div className="grid grid-cols-3 gap-1 bg-stone-100 p-1 rounded-xl mb-5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("signin");
                    setError(null);
                  }}
                  className={`py-2 rounded-lg transition-all cursor-pointer ${
                    activeTab === "signin"
                      ? "bg-white text-stone-900 shadow-2xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("quick");
                    setError(null);
                  }}
                  className={`py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    activeTab === "quick"
                      ? "bg-white text-stone-900 shadow-2xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  <Zap className="w-3 h-3 text-amber-600" />
                  <span>1-Click</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("register");
                    setError(null);
                  }}
                  className={`py-2 rounded-lg transition-all cursor-pointer ${
                    activeTab === "register"
                      ? "bg-white text-stone-900 shadow-2xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  New User
                </button>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                  <span className="font-bold">!</span>
                  <span>{error}</span>
                </div>
              )}

              {/* TAB 1: STANDARD SIGN IN */}
              {activeTab === "signin" && (
                <form onSubmit={handleSignInSubmit} className="space-y-4">
                  {/* Phone / Email Input */}
                  <div>
                    <label
                      htmlFor="signin-id"
                      className="block text-xs font-bold text-stone-800 mb-1.5"
                    >
                      Mobile Phone Number or Email
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
                        placeholder="e.g. 9876543210 or yourname@gmail.com"
                        autoFocus
                        required
                        className="w-full px-3.5 py-2.5 bg-white text-stone-900 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#f3a847] focus:border-[#f3a847] transition-all shadow-inner"
                      />
                      <div className="absolute right-3 pointer-events-none text-stone-400">
                        {identifier.includes("@") ? (
                          <Mail className="w-4 h-4 text-amber-700" />
                        ) : (
                          <Phone className="w-4 h-4 text-amber-700" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Customer Name Input (Optional for personalization) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="signin-name"
                        className="text-xs font-bold text-stone-800"
                      >
                        Your Name <span className="text-stone-400 font-normal">(Optional)</span>
                      </label>
                      <span className="text-[10px] text-amber-800 font-medium">Shows on Menu Bar</span>
                    </div>
                    <div className="relative flex items-center">
                      <input
                        id="signin-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Shreya"
                        className="w-full px-3.5 py-2 bg-white text-stone-900 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#f3a847] focus:border-[#f3a847] transition-all shadow-inner"
                      />
                      <div className="absolute right-3 pointer-events-none text-stone-400">
                        <User className="w-4 h-4 text-stone-400" />
                      </div>
                    </div>
                  </div>

                  {/* OTP Mode Toggle */}
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-stone-700">Verification Mode:</span>
                      <button
                        type="button"
                        onClick={() => setOtpMode(!otpMode)}
                        className="text-amber-800 font-bold hover:underline cursor-pointer"
                      >
                        {otpMode ? "✓ Using OTP Mode" : "Switch to OTP Mode"}
                      </button>
                    </div>

                    {otpMode && (
                      <div className="pt-2 border-t border-stone-200">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="text-stone-500">Demo OTP Code:</span>
                          <span className="bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">123456</span>
                        </div>
                        <input
                          type="text"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          placeholder="Enter 123456"
                          maxLength={6}
                          className="w-full px-3 py-1.5 bg-white text-stone-900 text-center font-bold tracking-widest text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#f3a847]"
                        />
                      </div>
                    )}
                  </div>

                  {/* Amazon Signature Yellow Action Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#ffd814] hover:bg-[#f7ca00] active:scale-[0.98] text-stone-900 font-bold text-sm py-3.5 px-4 rounded-xl border border-[#fcd200] shadow-sm hover:shadow transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-stone-800 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Sign In & Enter Store</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* TAB 2: 1-CLICK INSTANT DEMO LOGIN */}
              {activeTab === "quick" && (
                <div className="space-y-3">
                  <p className="text-xs text-stone-500">
                    Click any pre-configured customer profile below to sign in instantly with 1-click:
                  </p>

                  {/* Profile 1 */}
                  <button
                    type="button"
                    onClick={() => handleQuickLogin("Shreya", "+91 98765 43210")}
                    disabled={isSubmitting}
                    className="w-full p-3.5 rounded-2xl border border-amber-300 bg-amber-50/70 hover:bg-amber-100 text-left transition-all flex items-center justify-between cursor-pointer group shadow-2xs hover:shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center text-sm border border-amber-300">
                        S
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900 group-hover:text-amber-900">
                          Shreya (Customer)
                        </div>
                        <div className="text-[11px] text-stone-500">
                          +91 98765 43210 • Primary Account
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-900 group-hover:translate-x-0.5 transition-transform">
                      Sign In →
                    </span>
                  </button>

                  {/* Profile 2 */}
                  <button
                    type="button"
                    onClick={() => handleQuickLogin("Priya", "priya@craftnest.in")}
                    disabled={isSubmitting}
                    className="w-full p-3.5 rounded-2xl border border-stone-200 bg-white hover:bg-stone-50 text-left transition-all flex items-center justify-between cursor-pointer group shadow-2xs hover:shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-800 font-bold flex items-center justify-center text-sm border border-stone-300">
                        P
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900 group-hover:text-amber-900">
                          Priya (Handmade Lover)
                        </div>
                        <div className="text-[11px] text-stone-500">
                          priya@craftnest.in • Verified Email
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-stone-700 group-hover:translate-x-0.5 transition-transform">
                      Sign In →
                    </span>
                  </button>

                  {/* Profile 3: Guest */}
                  <button
                    type="button"
                    onClick={handleGuestLogin}
                    disabled={isSubmitting}
                    className="w-full p-3 rounded-2xl border border-dashed border-stone-300 hover:border-amber-400 bg-[#FAF8F5] text-stone-700 text-xs font-bold text-center transition-colors cursor-pointer"
                  >
                    ✨ Browse Storefront as Guest Customer
                  </button>
                </div>
              )}

              {/* TAB 3: REGISTER NEW USER */}
              {activeTab === "register" && (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="reg-name"
                      className="block text-xs font-bold text-stone-800 mb-1"
                    >
                      Your Full Name
                    </label>
                    <input
                      id="reg-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Shreya Sharma"
                      autoFocus
                      required
                      className="w-full px-3.5 py-2.5 bg-white text-stone-900 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#f3a847] focus:border-[#f3a847] shadow-inner"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="reg-id"
                      className="block text-xs font-bold text-stone-800 mb-1"
                    >
                      Mobile Phone Number or Email
                    </label>
                    <input
                      id="reg-id"
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. 9876543210 or yourname@gmail.com"
                      required
                      className="w-full px-3.5 py-2.5 bg-white text-stone-900 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#f3a847] focus:border-[#f3a847] shadow-inner"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#ffd814] hover:bg-[#f7ca00] active:scale-[0.98] text-stone-900 font-bold text-sm py-3.5 px-4 rounded-xl border border-[#fcd200] shadow-sm hover:shadow transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-stone-800 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Create Account & Start Shopping</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Bottom Quick Guest Link */}
              <div className="pt-4 mt-5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <button
                  type="button"
                  onClick={handleGuestLogin}
                  className="text-amber-800 font-semibold hover:underline cursor-pointer"
                >
                  Continue as Guest →
                </button>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 font-semibold hover:underline"
                >
                  WhatsApp Help
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Security & Authenticity Trust Footer */}
        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Secure 256-bit Encryption</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-amber-700" />
            <span>Privacy Guaranteed</span>
          </div>
        </div>
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
            className="text-emerald-700 hover:underline font-medium"
          >
            Help & WhatsApp
          </a>
        </div>
        <p>© {new Date().getFullYear()} Shreya Crafts Nest. Hand-stitched with love in India.</p>
      </footer>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center text-stone-600">
          <div className="w-6 h-6 border-2 border-amber-800 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
