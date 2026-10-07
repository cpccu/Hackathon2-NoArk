"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/client";
import { UserProfile, UserRole, Department } from "@/types/user";

interface SignUpData {
  name: string;
  department: Department;
  batch: string;
  studentId?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  role: UserRole;
  loading: boolean;
  isEmailVerified: boolean;
  signInWithGoogle: () => Promise<void>;
  registerWithEmail: (email: string, pass: string, data: SignUpData) => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserPreferences: (data: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  role: "student",
  loading: true,
  isEmailVerified: false,
  signInWithGoogle: async () => {},
  registerWithEmail: async () => {},
  loginWithEmail: async () => {},
  resendVerificationEmail: async () => {},
  resetPassword: async () => {},
  updateUserPreferences: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let unsubscribeDoc: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (unsubscribeDoc) {
        unsubscribeDoc();
        unsubscribeDoc = null;
      }

      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);

        // Listen to profile changes in realtime
        unsubscribeDoc = onSnapshot(
          userRef,
          async (snapshot) => {
            if (snapshot.exists()) {
              setProfile(snapshot.data() as UserProfile);
            } else {
              // Create default profile for first-time Google sign-in
              const initialProfile: UserProfile = {
                uid: currentUser.uid,
                email: currentUser.email || "",
                name: currentUser.displayName || "City University Student",
                department: "CSE",
                batch: "50th",
                role: "student",
                preferredLanguage: "en",
                createdAt: new Date().toISOString(),
              };
              await setDoc(userRef, initialProfile, { merge: true });
              setProfile(initialProfile);
            }
            setLoading(false);
          },
          (error) => {
            console.error("Firestore user profile subscription error:", error);
            setLoading(false);
          }
        );
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
    };
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const registerWithEmail = async (email: string, pass: string, data: SignUpData) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const u = userCredential.user;

    const newProfile: UserProfile = {
      uid: u.uid,
      email: u.email || email,
      name: data.name,
      department: data.department,
      batch: data.batch,
      studentId: data.studentId || "",
      role: "student", // default role, users cannot escalate
      preferredLanguage: "en",
      createdAt: new Date().toISOString(),
    };

    await setDoc(doc(db, "users", u.uid), newProfile);
    await sendEmailVerification(u);
  };

  const loginWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const resendVerificationEmail = async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    }
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const updateUserPreferences = async (data: Partial<UserProfile>) => {
    if (!user) return;
    // Disallow modifying role or uid directly
    const { role, uid, email, ...safeData } = data;
    await setDoc(doc(db, "users", user.uid), { ...safeData, updatedAt: new Date().toISOString() }, { merge: true });
  };

  const logout = async () => {
    await signOut(auth);
    setProfile(null);
  };

  // Google sign in users are automatically email-verified by Google
  const isEmailVerified = Boolean(user && (user.emailVerified || user.providerData.some((p) => p.providerId === "google.com")));

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role: profile?.role || "student",
        loading,
        isEmailVerified,
        signInWithGoogle,
        registerWithEmail,
        loginWithEmail,
        resendVerificationEmail,
        resetPassword,
        updateUserPreferences,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
