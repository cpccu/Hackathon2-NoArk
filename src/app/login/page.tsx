"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { loginWithEmail, signInWithGoogle, user, profile, isEmailVerified } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<"student" | "club_admin" | "admin">("student");
  const ROLE_TABS = [
    { id: "student", label: "Student", email: "student@cityuniversity.edu.bd" },
    { id: "club_admin", label: "Club Executive", email: "cpc.admin@cityuniversity.edu.bd" },
    { id: "admin", label: "Administrator", email: "admin@cityuniversity.edu.bd" },
  ] as const;

  // If already logged in
  React.useEffect(() => {
    if (user) {
      if (!isEmailVerified) {
        router.push("/verify-email");
      } else {
        if (!profile) return;
      if (profile.role !== selectedRole) {
        const label = ROLE_TABS.find((r) => r.id === selectedRole)?.label;
        setError(`This account is not registered as ${label}. Choose the correct role tab.`);
        signOut(auth);
        return;
      }
      router.push("/dashboard");
      }
    }
  }, [user, profile, isEmailVerified, router, selectedRole]);

  const mapAuthError = (errCode: string): string => {
    if (errCode.includes("user-not-found")) return "No account registered with this email address.";
    if (errCode.includes("wrong-password") || errCode.includes("invalid-credential"))
      return "Incorrect email or password. Please verify and try again.";
    if (errCode.includes("popup-closed-by-user")) return "Google sign-in was cancelled before completion.";
    if (errCode.includes("too-many-requests"))
      return "Too many unsuccessful attempts. Access temporarily restricted. Please try again later or reset password.";
    if (errCode.includes("invalid-email")) return "Please enter a valid academic or personal email address.";
    return "Sign in failed. Please check your network and credentials.";
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setLoading(true);
    try {
      await loginWithEmail(email.trim(), password);
      // Navigation is handled by useEffect
    } catch (err: any) {
      console.error("Login error:", err);
      setError(mapAuthError(err.code || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      // Navigation handled by useEffect
    } catch (err: any) {
      console.error("Google sign-in error:", err);
      setError(mapAuthError(err.code || err.message));
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Left Column: Academic & Campus Identity */}
      <div className="md:w-1/2 bg-campus-navy-900 text-white flex flex-col justify-between p-8 lg:p-16 relative overflow-hidden">
        {/* Background Subtle Accent */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-campus-navy-800 rounded-full opacity-40 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-campus-gold-600/10 rounded-full opacity-30 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-8">
            <div className="h-10 w-10 rounded-md bg-campus-gold-500 text-campus-navy-950 flex items-center justify-center font-serif font-bold text-xl shadow">
              CU
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white block">City University</span>
              <span className="text-xs uppercase tracking-widest text-campus-gold-400 font-semibold">CampusOS Portal</span>
            </div>
          </div>

          <div className="mt-8 lg:mt-16 max-w-lg">
            <h1 className="font-serif text-3xl lg:text-4xl font-bold leading-tight text-slate-100">
              Creating a culture of excellence.
            </h1>
            <p className="mt-4 text-slate-300 text-sm lg:text-base leading-relaxed">
              CampusOS is the unified operating system connecting students, faculty, clubs, and administration at City University.
            </p>

            <div className="mt-8 space-y-3.5 border-t border-campus-navy-700/60 pt-6">
              <div className="flex items-start space-x-3 text-slate-200 text-sm">
                <CheckCircle2 className="w-5 h-5 text-campus-gold-400 shrink-0 mt-0.5" />
                <span><strong>Unified Event Feed:</strong> Club schedules, instant registrations, and QR tickets.</span>
              </div>
              <div className="flex items-start space-x-3 text-slate-200 text-sm">
                <CheckCircle2 className="w-5 h-5 text-campus-gold-400 shrink-0 mt-0.5" />
                <span><strong>Live Bus Tracking:</strong> Route schedules and real-time next-bus countdown.</span>
              </div>
              <div className="flex items-start space-x-3 text-slate-200 text-sm">
                <CheckCircle2 className="w-5 h-5 text-campus-gold-400 shrink-0 mt-0.5" />
                <span><strong>Class Updates Feed:</strong> Instant cancellations and timetable adjustments.</span>
              </div>
              <div className="flex items-start space-x-3 text-slate-200 text-sm">
                <CheckCircle2 className="w-5 h-5 text-campus-gold-400 shrink-0 mt-0.5" />
                <span><strong>Academic Resource Hub:</strong> Verified lecture notes, question papers, and syllabi.</span>
              </div>
              <div className="flex items-start space-x-3 text-slate-200 text-sm">
                <CheckCircle2 className="w-5 h-5 text-campus-gold-400 shrink-0 mt-0.5" />
                <span><strong>Lost & Found & Smart Helpdesk:</strong> Verified claims and AI student advisory.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Campus Address Footer */}
        <div className="mt-12 pt-6 border-t border-campus-navy-800 text-xs text-slate-400 relative z-10 leading-relaxed">
          <p className="font-medium text-slate-300">City University Main Campus</p>
          <p>Khagan, Birulia, Savar, Dhaka-1340, Bangladesh</p>
          <p className="mt-1 text-campus-gold-400">Phone: 09643-234234 | UGC Approved Private University</p>
        </div>
      </div>

      {/* Right Column: Sign In Form */}
      <div className="md:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="font-serif text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">Sign In to CampusOS</h2>
            <p className="mt-2 text-sm text-slate-600">
              Welcome back. Enter your credentials or use your student Google account.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-6 rounded-md bg-rose-50 border border-rose-200 p-4 text-sm text-rose-800 flex items-start space-x-3"
            >
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Authentication Error</p>
                <p className="mt-0.5 text-xs text-rose-700">{error}</p>
              </div>
            </div>
          )}

          {/* Role selector */}
          <div className="mb-6">
            <p className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">Sign in as</p>
            <div className="grid grid-cols-3 gap-2" role="tablist">
              {ROLE_TABS.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  role="tab"
                  aria-selected={selectedRole === r.id}
                  onClick={() => { setSelectedRole(r.id); setEmail(r.email); setError(null); }}
                  className={`py-2 px-2 rounded-md text-xs font-semibold border transition ${
                    selectedRole === r.id
                      ? "bg-campus-navy-600 text-white border-campus-navy-600"
                      : "bg-white text-slate-700 border-slate-300 hover:border-campus-navy-600"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Google Sign-in */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-slate-300 rounded-md bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-campus-navy-700 focus:ring-offset-2 disabled:opacity-60"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{googleLoading ? "Connecting to Google..." : "Continue with Google"}</span>
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-50 px-3 text-slate-500 font-medium">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@cityuniversity.ac.bd"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:border-campus-navy-700 focus:ring-1 focus:ring-campus-navy-700 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-campus-navy-700 hover:text-campus-navy-900 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:border-campus-navy-700 focus:ring-1 focus:ring-campus-navy-700 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full mt-2 flex items-center justify-center py-2.5 px-4 border border-transparent rounded-md shadow bg-campus-navy-800 hover:bg-campus-navy-900 text-white text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-campus-navy-800 disabled:opacity-70"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-600">
              New to City University CampusOS?{" "}
              <Link href="/register" className="font-semibold text-campus-navy-800 hover:underline">
                Create student account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
