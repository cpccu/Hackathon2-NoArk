import React from "react";
import { AlertTriangle, ExternalLink } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export interface DataNoticeProps {
  message?: string;
  sourceUrl?: string;
  className?: string;
}

export const DataNotice: React.FC<DataNoticeProps> = ({
  message,
  sourceUrl,
  className = "",
}) => {
  const { t } = useLanguage();
  const noticeText = message || t.common.sampleNotice;

  return (
    <div
      role="note"
      className={`rounded-lg bg-amber-50/90 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 p-3.5 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5 shadow-sm ${className}`}
    >
      <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
      <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <p className="font-medium leading-relaxed">{noticeText}</p>
        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-amber-800 dark:text-amber-300 hover:underline shrink-0"
          >
            <span>Confirm with Office</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
};
