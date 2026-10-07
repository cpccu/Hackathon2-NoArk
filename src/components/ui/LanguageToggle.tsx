"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Languages } from "lucide-react";

export const LanguageToggle: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === "en" ? "bn" : "en")}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold text-slate-300 hover:text-white hover:bg-campus-navy-800 border border-slate-700 transition focus:outline-none focus:ring-2 focus:ring-campus-gold-400 ${className}`}
      aria-label={`Switch language to ${language === "en" ? "Bangla" : "English"}`}
      title="Toggle English / বাংলা"
    >
      <Languages className="w-3.5 h-3.5 text-campus-gold-400" />
      <span>{language === "en" ? "বাং" : "EN"}</span>
    </button>
  );
};
