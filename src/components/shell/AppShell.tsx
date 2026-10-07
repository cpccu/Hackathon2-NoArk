import React from "react";
import { AppHeader } from "./AppHeader";
import { AppFooter } from "./AppFooter";
import { FloatingChatWidget } from "@/components/chat/FloatingChatWidget";

export interface AppShellProps {
  children: React.ReactNode;
  hideFooter?: boolean;
}

export const AppShell: React.FC<AppShellProps> = ({ children, hideFooter = false }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <AppHeader />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>
      {!hideFooter && <AppFooter />}
      <FloatingChatWidget />
    </div>
  );
};
