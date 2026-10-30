import React, { useState } from 'react';
import { Plus, Download, Loader2 } from 'lucide-react';
import Button from '../ui/Button.jsx';
import Badge from '../ui/Badge.jsx';

export function AppHeader({ onOpenReport, isReportOpen = false }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadZip = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch('/smart-trash-map.zip');
      if (!response.ok) throw new Error('Failed to fetch zip package');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = blobUrl;
      link.setAttribute('download', 'smart-trash-map.zip');
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
        setIsDownloading(false);
      }, 500);
    } catch (err) {
      console.error('Download error:', err);
      setIsDownloading(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-xs shrink-0">
            {/* Environmental Mark: Stylized Pin + Leaf */}
            <svg
              className="w-5 h-5 text-emerald-100"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
              <path d="M12 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-none">
                Smart Trash Map
              </span>
              <Badge variant="success" size="xs">
                Milestone 3
              </Badge>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden sm:block mt-0.5">
              Community litter reporting & cleanup logistics
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Download Project ZIP */}
          <button
            type="button"
            onClick={handleDownloadZip}
            disabled={isDownloading}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white hover:bg-slate-50 active:scale-95 text-slate-700 shadow-2xs transition cursor-pointer disabled:opacity-60"
            title="Download complete project ZIP archive"
          >
            {isDownloading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-700" aria-hidden="true" />
            ) : (
              <Download className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
            )}
            <span className="hidden sm:inline">Download</span> ZIP
          </button>

          {/* Primary Action: Report Litter */}
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={onOpenReport}
            icon={Plus}
            className="shadow-xs font-semibold"
            aria-expanded={isReportOpen}
            aria-controls="report-sidebar-panel"
          >
            Report Litter
          </Button>
        </div>
      </div>
    </header>
  );
}

export default AppHeader;