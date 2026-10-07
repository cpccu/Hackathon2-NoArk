import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "./Button";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Failed to load information",
  message = "A network or server issue prevented this data from loading. Please retry.",
  onRetry,
  className = "",
}) => {
  return (
    <div
      role="alert"
      className={`rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/30 p-6 sm:p-8 text-center flex flex-col items-center justify-center ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="font-serif text-base font-bold text-rose-950 dark:text-rose-200">{title}</h3>
      <p className="mt-1 text-xs sm:text-sm text-rose-800 dark:text-rose-300 max-w-sm leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-4 border-rose-300 text-rose-800 dark:text-rose-300">
          Try Again
        </Button>
      )}
    </div>
  );
};
