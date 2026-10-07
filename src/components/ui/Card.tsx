import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "bordered" | "interactive";
}

export const Card: React.FC<CardProps> = ({
  variant = "default",
  className = "",
  children,
  ...props
}) => {
  const variantStyles = {
    default: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm",
    bordered: "bg-white dark:bg-slate-900 border-2 border-campus-navy-200 dark:border-campus-navy-800",
    interactive:
      "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-campus-navy-400 dark:hover:border-campus-gold-500/50 hover:shadow-md transition cursor-pointer",
  }[variant];

  return (
    <div className={`rounded-lg p-5 sm:p-6 ${variantStyles} ${className}`} {...props}>
      {children}
    </div>
  );
};
