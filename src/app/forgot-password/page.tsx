"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);
    try {
      await resetPassword(email.trim());
      setSent(true);
    } catch (err: any) {
      console.error("Password reset error:", err);
      setError("Unable to process password reset. Please verify your email address.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg border border-slate-200 shadow-sm">
        <div className="mb-6">
          <Link href="/login" className="inline-flex items-center text-xs text-campus-navy-700 hover:underline mb-4">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to sign in
          </Link>
          <h1 className="font-serif text-2xl font-bold text-slate-900">Reset Your Password</h1>
          <p className="mt-1 text-xs text-slate-600">
            Enter the email associated with your City University account, and we will send you a recovery link.
          </p>
        </div>

        {error && (
          <div role="alert" className="mb-4 rounded-md bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {sent ? (
          <div className="rounded-md bg-emerald-50 border border-emerald-200 p-4 text-emerald-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <p className="font-medium text-sm">Recovery Link Dispatched</p>
            </div>
            <p className="mt-2 text-xs text-emerald-700">
              Check your inbox at <strong>{email}</strong> for instructions to reset your password.
            </p>
            <div className="mt-4">
              <Link href="/login" className="text-xs font-semibold text-emerald-800 hover:underline">
                Return to Login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="reset-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Registered Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="reset-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@cityuniversity.ac.bd"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-900 focus:border-campus-navy-700 focus:ring-1 focus:ring-campus-navy-700 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-md bg-campus-navy-800 hover:bg-campus-navy-900 text-white text-sm font-medium transition disabled:opacity-60"
            >
              {loading ? "Sending link..." : "Send Reset Link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
