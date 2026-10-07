"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { MailCheck, RefreshCw, LogOut, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { user, isEmailVerified, resendVerificationEmail, logout } = useAuth();
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already verified or signed in via Google, redirect to dashboard
  React.useEffect(() => {
    if (user && isEmailVerified) {
      router.push("/dashboard");
    }
  }, [user, isEmailVerified, router]);

  const handleResend = async () => {
    setError(null);
    setResending(true);
    setResendSuccess(false);
    try {
      await resendVerificationEmail();
      setResendSuccess(true);
    } catch (err: any) {
      console.error("Resend error:", err);
      setError("Unable to resend verification email right now. Please wait a minute and try again.");
    } finally {
      setResending(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg border border-slate-200 shadow-sm text-center">
        <div className="w-16 h-16 bg-campus-navy-50 text-campus-navy-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-campus-navy-100">
          <MailCheck className="w-8 h-8 text-campus-navy-700" />
        </div>

        <h1 className="font-serif text-2xl font-bold text-slate-900">Verify Your Academic Email</h1>
        <p className="mt-2 text-sm text-slate-600">
          A verification link has been dispatched to <strong>{user?.email || "your email address"}</strong>.
          Please click the link in your inbox to confirm your student identity before continuing.
        </p>

        {error && (
          <div role="alert" className="mt-4 rounded-md bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800 flex items-start text-left space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {resendSuccess && (
          <div className="mt-4 rounded-md bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>A new verification email has been sent. Check spam folder if not found.</span>
          </div>
        )}

        <div className="mt-8 space-y-3">
          <button
            onClick={handleReload}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-md bg-campus-navy-800 hover:bg-campus-navy-900 text-white text-sm font-medium transition"
          >
            <span>I have verified my email</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleResend}
            disabled={resending}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium transition disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${resending ? "animate-spin" : ""}`} />
            <span>{resending ? "Dispatching..." : "Resend Verification Email"}</span>
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Wrong email account?</span>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1 font-semibold text-rose-600 hover:underline"
          >
            <LogOut className="w-3.5 h-3.5" /> Log out
          </button>
        </div>
      </div>
    </div>
  );
}
