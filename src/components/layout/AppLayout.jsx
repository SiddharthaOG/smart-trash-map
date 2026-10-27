import React, { useState, useEffect } from 'react';
import AppHeader from './AppHeader.jsx';

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => (typeof window !== 'undefined' ? window.innerWidth >= 1024 : true)
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(min-width: 1024px)');
    const update = (e) => setIsDesktop(e.matches);
    setIsDesktop(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return isDesktop;
}

export function AppLayout({
  children,
  headerProps,
  reportPanel,
  isReportOpen = false,
  onCloseReport,
}) {
  const isDesktop = useIsDesktop();

  return (
    <div className="min-h-screen flex flex-col bg-[#f7faf7] text-slate-800">
      {/* Top Application Header */}
      <AppHeader
        onOpenReport={headerProps?.onOpenReport}
        isReportOpen={isReportOpen}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Dominant Map Workspace (takes full width or 8 cols when report is open on desktop) */}
          <div
            className={`w-full transition-all duration-300 ${
              isReportOpen && isDesktop
                ? 'lg:col-span-7 xl:col-span-8'
                : 'lg:col-span-12'
            }`}
          >
            {children}
          </div>

          {/* Desktop Report Drawer / Side Panel (only rendered on desktop to avoid duplicate DOM) */}
          {isReportOpen && isDesktop && (
            <aside
              id="report-sidebar-panel"
              aria-label="Report submission panel"
              className="lg:col-span-5 xl:col-span-4 sticky top-24 transition-all duration-300"
            >
              {reportPanel}
            </aside>
          )}
        </div>
      </main>

      {/* Mobile Drawer / Bottom Sheet (only rendered on mobile/tablet to avoid duplicate DOM) */}
      {isReportOpen && !isDesktop && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Report submission modal"
          className="fixed inset-0 z-50 flex flex-col justify-end"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseReport}
            aria-hidden="true"
          />

          {/* Sheet Container */}
          <div className="relative w-full max-h-[88vh] bg-white rounded-t-3xl shadow-2xl z-10 overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-200">
            {/* Grab handle for touch */}
            <div className="pt-3 pb-1 flex justify-center">
              <div className="w-10 h-1.5 rounded-full bg-slate-300" />
            </div>
            <div className="flex-1 overflow-y-auto">{reportPanel}</div>
          </div>
        </div>
      )}

      {/* Understated Civic Tech Footer */}
      <footer className="border-t border-slate-200/80 bg-white/70 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            <strong>Smart Trash Map</strong> — Community Litter Reporting
          </span>
          <span className="font-mono text-[11px] text-slate-400">
            Milestone 1 Architecture: Decoupled Features &amp; Service Contracts
          </span>
        </div>
      </footer>
    </div>
  );
}

export default AppLayout;
