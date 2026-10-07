import React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "rectangular" | "circular";
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = "rectangular",
  className = "",
  ...props
}) => {
  const variantStyles = {
    text: "h-4 w-full rounded",
    rectangular: "rounded-md",
    circular: "rounded-full",
  }[variant];

  return (
    <div
      className={`animate-pulse bg-slate-200 dark:bg-slate-800 ${variantStyles} ${className}`}
      {...props}
    />
  );
};
