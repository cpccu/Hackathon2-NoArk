"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Language, translations } from "@/data/translations";
import { useAuth } from "./AuthContext";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (typeof translations)["en"];
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: translations.en,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, updateUserPreferences } = useAuth();
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    // 1. Check user profile preference
    if (profile?.preferredLanguage) {
      setLanguageState(profile.preferredLanguage);
      return;
    }

    // 2. Fallback to localStorage
    const saved = localStorage.getItem("campusos_lang") as Language | null;
    if (saved === "en" || saved === "bn") {
      setLanguageState(saved);
    }
  }, [profile]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("campusos_lang", lang);
    if (profile) {
      updateUserPreferences({ preferredLanguage: lang });
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
