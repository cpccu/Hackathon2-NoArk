import React from "react";
import { AlertTriangle } from "lucide-react";

export interface DemoBadgeProps {
  size?: "sm" | "md";
  className?: string;
}

export const DemoBadge: React.FC<DemoBadgeProps> = ({ size = "sm", className = "" }) => {
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1 font-bold uppercase tracking-wider rounded bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800 ${sizeClasses} ${className}`}
      title="This record contains simulated sample data for the hackathon."
    >
      <AlertTriangle className={size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3"} />
      <span>DEMO DATA</span>
    </span>
  );
};
