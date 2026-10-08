"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { GlobalSearchModal } from "@/components/search/GlobalSearchModal";
import {
  Search,
  Menu,
  X,
  LogOut,
  User as UserIcon,
  Shield,
  ChevronDown,
  Ticket,
  Sparkles,
  Compass,
  Calendar,
  Settings,
} from "lucide-react";

export const AppHeader: React.FC = () => {
  const pathname = usePathname();
  const { user, profile, role, logout } = useAuth();
  const { t } = useLanguage();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Keyboard shortcut listener for Ctrl+K / Cmd+K
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navLinks = [
    { href: "/events", label: t.nav.events },
    { href: "/bus", label: t.nav.bus },
    { href: "/resources", label: t.nav.resources },
    { href: "/helpdesk", label: t.nav.helpdesk },
    { href: "/lost-found", label: t.nav.lostFound },
    { href: "/complaints", label: t.nav.complaints },
    { href: "/updates", label: t.nav.updates },
    { href: "/directory", label: t.nav.directory },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <header className="sticky top-0 z-40 bg-campus-navy-950 text-white border-b border-campus-navy-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Campus Branding */}
            <div className="flex items-center space-x-6">
              <Link href="/" className="flex items-center space-x-2.5 group">
                <div className="shrink-0 rounded-md bg-white px-2 py-1 shadow"><img src="/logo.png" alt="City University" className="h-11 w-auto max-w-none" style={{minWidth:72}} /></div>
                <div>
                  
                  <span className="text-[10px] uppercase tracking-widest text-campus-gold-400 font-semibold block leading-tight">
                    CampusOS
                  </span>
                </div>
              </Link>

              {/* Desktop Nav Items */}
              <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
                {navLinks.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                        active
                          ? "bg-campus-navy-800 text-campus-gold-300 font-semibold border border-campus-navy-700"
                          : "text-slate-300 hover:text-white hover:bg-campus-navy-900"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right Controls: Search button, Language, Theme, User Menu */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Search Trigger */}
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs bg-campus-navy-900 hover:bg-campus-navy-800 text-slate-300 border border-campus-navy-700 transition focus:outline-none focus:ring-2 focus:ring-campus-gold-400"
                aria-label="Open search dialog (Ctrl+K)"
              >
                <Search className="w-3.5 h-3.5 text-campus-gold-400" />
                <span className="hidden sm:inline">{t.nav.searchPlaceholder}</span>
                <kbd className="hidden sm:inline-block px-1 py-0.2 text-[9px] font-mono bg-campus-navy-950 text-slate-400 border border-campus-navy-700 rounded">
                  ⌘K
                </kbd>
              </button>

              {/* Language Switcher */}
              <LanguageToggle />

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* User Account / Sign In */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-campus-navy-900 hover:bg-campus-navy-800 border border-campus-navy-700 text-xs font-medium transition"
                    aria-expanded={userDropdownOpen}
                  >
                    <div className="w-6 h-6 rounded-full bg-campus-gold-500 text-campus-navy-950 flex items-center justify-center font-bold text-[11px]">
                      {(profile?.name || user.email || "U")[0].toUpperCase()}
                    </div>
                    <span className="hidden md:inline max-w-[100px] truncate text-slate-200">
                      {profile?.name || "Student"}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 text-xs z-50 animate-in fade-in-50">
                      <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800">
                        <p className="font-semibold truncate">{profile?.name || "Student"}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                        <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-campus-gold-100 text-campus-gold-800 dark:bg-campus-gold-950 dark:text-campus-gold-300">
                          {role}
                        </span>
                      </div>

                      <Link
                        href="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-slate-500" />
                        <span>{t.nav.dashboard}</span>
                      </Link>

                      {role === "student" && (<Link
                        href="/my/events"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        <Ticket className="w-3.5 h-3.5 text-slate-500" />
                        <span>My Tickets & Passes</span>
                      </Link>)}

                      <Link
                        href="/tools/notice-summariser"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-campus-gold-500" />
                        <span>AI Notice Summariser</span>
                      </Link>

                      <Link
                        href="/onboarding/clubs"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        <Compass className="w-3.5 h-3.5 text-slate-500" />
                        <span>Club Discovery Quiz</span>
                      </Link>

                      <Link
                        href="/tools/timetable"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>Timetable Checker</span>
                      </Link>

                      <Link
                        href="/settings"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        <Settings className="w-3.5 h-3.5 text-slate-500" />
                        <span>Preferences & Settings</span>
                      </Link>

                      {role === "admin" && (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3.5 py-2 text-campus-navy-700 dark:text-campus-gold-400 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        >
                          <Shield className="w-3.5 h-3.5" />
                          <span>{t.nav.admin}</span>
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left flex items-center gap-2 px-3.5 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition border-t border-slate-100 dark:border-slate-800 mt-1"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{t.nav.logOut}</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center space-x-2">
                  <Link
                    href="/login"
                    className="px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white hover:bg-campus-navy-900 rounded-md transition"
                  >
                    {t.nav.signIn}
                  </Link>
                  <Link
                    href="/register"
                    className="px-3 py-1.5 text-xs font-semibold bg-campus-gold-500 hover:bg-campus-gold-400 text-campus-navy-950 rounded-md transition shadow-sm"
                  >
                    {t.nav.register}
                  </Link>
                </div>
              )}

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-md text-slate-400 hover:text-white hover:bg-campus-navy-900 transition"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-campus-navy-900 border-t border-campus-navy-800 px-4 pt-3 pb-5 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm font-medium ${
                  isActive(link.href)
                    ? "bg-campus-navy-800 text-campus-gold-400 font-bold"
                    : "text-slate-300 hover:text-white hover:bg-campus-navy-800"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {!user && (
              <div className="pt-3 border-t border-campus-navy-800 grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 px-3 rounded bg-campus-navy-800 text-white text-xs font-medium"
                >
                  {t.nav.signIn}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 px-3 rounded bg-campus-gold-500 text-campus-navy-950 text-xs font-semibold"
                >
                  {t.nav.register}
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Global Search Dialog */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};
