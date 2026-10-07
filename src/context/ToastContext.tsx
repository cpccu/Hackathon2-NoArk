"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  toast: () => {},
  success: () => {},
  error: () => {},
  info: () => {},
});

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider
      value={{
        toast: addToast,
        success: (msg) => addToast(msg, "success"),
        error: (msg) => addToast(msg, "error"),
        info: (msg) => addToast(msg, "info"),
      }}
    >
      {children}
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((t) => {
          const typeConfig = {
            success: {
              icon: CheckCircle2,
              styles: "bg-emerald-900/95 text-white border-emerald-700",
              iconStyle: "text-emerald-400",
            },
            error: {
              icon: AlertCircle,
              styles: "bg-rose-900/95 text-white border-rose-700",
              iconStyle: "text-rose-400",
            },
            info: {
              icon: Info,
              styles: "bg-campus-navy-900/95 text-white border-campus-navy-700",
              iconStyle: "text-campus-gold-400",
            },
          }[t.type];

          const IconComponent = typeConfig.icon;

          return (
            <div
              key={t.id}
              role="status"
              className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border shadow-lg backdrop-blur-sm text-xs transition-all animate-in slide-in-from-bottom-2 ${typeConfig.styles}`}
            >
              <IconComponent className={`w-4 h-4 shrink-0 mt-0.5 ${typeConfig.iconStyle}`} />
              <p className="flex-1 font-medium leading-relaxed">{t.message}</p>
              <button
                onClick={() => removeToast(t.id)}
                className="text-slate-300 hover:text-white p-0.5 rounded"
                aria-label="Dismiss toast"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
