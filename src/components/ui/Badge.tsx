import React from "react";

export interface BadgeProps {
  variant?: "default" | "official" | "success" | "warning" | "danger" | "neutral" | "gold" | "outline" | "info";
  size?: "sm" | "md";
  className?: string;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "default",
  size = "sm",
  className = "",
  children,
}) => {
  const variantStyles = {
    default: "bg-campus-navy-100 text-campus-navy-900 border-campus-navy-200 dark:bg-campus-navy-900 dark:text-campus-navy-200 dark:border-campus-navy-700",
    official: "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
    warning: "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800",
    danger: "bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-800",
    neutral: "bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    gold: "bg-campus-gold-100 text-campus-gold-900 border-campus-gold-300 dark:bg-campus-gold-950 dark:text-campus-gold-200 dark:border-campus-gold-800",
    outline: "bg-transparent text-slate-700 border-slate-300 dark:text-slate-300 dark:border-slate-700",
    info: "bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800",
  }[variant];

  const sizeStyles = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center font-semibold rounded border uppercase tracking-wider ${variantStyles} ${sizeStyles} ${className}`}
    >
      {children}
    </span>
  );
};
