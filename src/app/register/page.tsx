"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { DEPARTMENTS, Department } from "@/types/user";
import { Eye, EyeOff, Lock, Mail, User as UserIcon, BookOpen, Hash, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { registerWithEmail, signInWithGoogle, user } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState<Department>("CSE");
  const [batch, setBatch] = useState("50th");
  const [studentId, setStudentId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (user) {
      if (!user.emailVerified) {
        router.push("/verify-email");
      } else {
        router.push("/dashboard");
      }
    }
  }, [user, router]);

  const mapAuthError = (errCode: string): string => {
    if (errCode.includes("email-already-in-use")) return "This email address is already registered. Please sign in instead.";
    if (errCode.includes("weak-password")) return "Password must be at least 6 characters long.";
    if (errCode.includes("invalid-email")) return "Please enter a valid email address.";
    return "Registration could not be completed. Please try again.";
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim() || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      await registerWithEmail(email.trim(), password, {
        name: fullName.trim(),
        department,
        batch: batch.trim(),
        studentId: studentId.trim() || undefined,
      });
      router.push("/verify-email");
    } catch (err: any) {
      console.error("Sign up error:", err);
      setError(mapAuthError(err.code || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Google sign-in error:", err);
      setError(err.message || "Failed to authenticate with Google.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Left Column: Academic Branding */}
      <div className="md:w-5/12 bg-campus-navy-900 text-white flex flex-col justify-between p-8 lg:p-14 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-8">
            <div className="h-10 w-10 rounded-md bg-campus-gold-500 text-campus-navy-950 flex items-center justify-center font-serif font-bold text-xl shadow">
              CU
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white block">City University</span>
              <span className="text-xs uppercase tracking-widest text-campus-gold-400 font-semibold">CampusOS Registration</span>
            </div>
          </div>

          <div className="mt-6 max-w-md">
            <h1 className="font-serif text-2xl lg:text-3xl font-bold text-slate-100 leading-tight">
              Join your official student ecosystem.
            </h1>
            <p className="mt-3 text-sm text-slate-300 leading-relaxed">
              Registering gives you role-tailored access to campus bus timetables, club event registrations, academic notes repository, and instant class updates.
            </p>

            <div className="mt-6 space-y-3 border-t border-campus-navy-800 pt-6 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-campus-gold-400 shrink-0" />
                <span>Single login for all City University campus life activities</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-campus-gold-400 shrink-0" />
                <span>Official student identity verification</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-campus-gold-400 shrink-0" />
                <span>Strict privacy: student complaints & claims remain confidential</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-campus-navy-800 text-xs text-slate-400 relative z-10">
          <p className="font-medium text-slate-300">Permanent Campus</p>
          <p>Khagan, Birulia, Savar, Dhaka-1340</p>
        </div>
      </div>

      {/* Right Column: Registration Form */}
      <div className="md:w-7/12 flex items-center justify-center p-6 sm:p-10 lg:p-12">
        <div className="w-full max-w-lg">
          <div className="mb-6">
            <h2 className="font-serif text-2xl font-bold text-slate-900 tracking-tight">Create Student Account</h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Fill in your academic details. Your role is automatically set to student.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-md bg-rose-50 border border-rose-200 p-3 text-xs sm:text-sm text-rose-800 flex items-start space-x-2"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Google Sign Up option */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={googleLoading || loading}
            className="w-full mb-5 flex items-center justify-center gap-2.5 py-2.5 px-4 border border-slate-300 rounded-md bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium shadow-sm transition disabled:opacity-60"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
            <span>{googleLoading ? "Connecting..." : "Quick Sign Up with Google"}</span>
          </button>

          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-50 px-2 text-slate-500 font-medium">Or enter details</span>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label htmlFor="reg-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="h-4 w-4" />
                </div>
                <input
                  id="reg-name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Shakib Al Hasan"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-md text-slate-900 focus:border-campus-navy-700 focus:ring-1 focus:ring-campus-navy-700 transition"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="reg-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@cityuniversity.ac.bd"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-md text-slate-900 focus:border-campus-navy-700 focus:ring-1 focus:ring-campus-navy-700 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="reg-dept" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Department *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <select
                    id="reg-dept"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value as Department)}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-md text-slate-900 focus:border-campus-navy-700 focus:ring-1 focus:ring-campus-navy-700 transition"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept.code} value={dept.code}>
                        {dept.code} ({dept.name})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="reg-batch" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Batch *
                </label>
                <input
                  id="reg-batch"
                  type="text"
                  required
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  placeholder="e.g. 52nd, 54th"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-md text-slate-900 focus:border-campus-navy-700 focus:ring-1 focus:ring-campus-navy-700 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="reg-studentid" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Student ID (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Hash className="h-4 w-4" />
                  </div>
                  <input
                    id="reg-studentid"
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="e.g. 2115101001"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-md text-slate-900 focus:border-campus-navy-700 focus:ring-1 focus:ring-campus-navy-700 transition"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reg-password" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Password (min 6) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="reg-password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-9 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-md text-slate-900 focus:border-campus-navy-700 focus:ring-1 focus:ring-campus-navy-700 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full mt-3 flex items-center justify-center py-2.5 px-4 border border-transparent rounded-md shadow bg-campus-navy-800 hover:bg-campus-navy-900 text-white text-xs sm:text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-campus-navy-800 disabled:opacity-70"
            >
              {loading ? (
                <span>Creating Account...</span>
              ) : (
                <span className="flex items-center gap-2">
                  Complete Registration <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-600">
              Already registered?{" "}
              <Link href="/login" className="font-semibold text-campus-navy-800 hover:underline">
                Sign in to your account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
