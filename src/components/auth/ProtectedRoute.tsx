"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/user";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const router = useRouter();
  const { user, profile, role, loading, isEmailVerified } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (!isEmailVerified) {
        router.push("/verify-email");
      }
    }
  }, [user, loading, isEmailVerified, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-campus-navy-800 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold">
            Authenticating Campus-OS session...
          </p>
        </div>
      </div>
    );
  }

  if (!user || !isEmailVerified) {
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg border border-slate-200 text-center">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="font-serif text-xl font-bold text-slate-900">Access Restricted</h2>
          <p className="mt-2 text-xs text-slate-600">
            This module requires <strong>{allowedRoles.join(" or ")}</strong> privileges. Your current role is <strong>{role}</strong>.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-6 px-4 py-2 bg-campus-navy-800 text-white rounded text-xs font-semibold hover:bg-campus-navy-900 transition"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
