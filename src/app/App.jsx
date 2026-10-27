import React, { useState, useEffect } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import AppLayout from '../components/layout/AppLayout.jsx';
import { MapView, useMapSelection } from '../features/map/index.js';
import {
  ReportForm,
  ReportSummary,
  useReportDraft,
} from '../features/reports/index.js';
import StatusBanner from '../components/ui/StatusBanner.jsx';
import { config } from './config.js';

/**
 * App Shell
 * Pure orchestration layer that composes feature modules and layout boundaries.
 * Wraps map features with Google Maps APIProvider and connects pin selection to report drafts.
 */
export function App() {
  const [isReportOpen, setIsReportOpen] = useState(true);
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  // Map Feature state & hooks
  const { selectedCoordinates, selectCoordinates } = useMapSelection();

  // Reports Feature state & hooks
  const {
    draft,
    validation,
    setCoordinates,
    setSeverity,
    setDescription,
    resetDraft,
  } = useReportDraft();

  // Listen for Google Maps quota exceeded event
  useEffect(() => {
    const onQuota = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', onQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', onQuota);
  }, []);

  const handleToggleReport = () => {
    setIsReportOpen((prev) => !prev);
  };

  const handleCloseReport = () => {
    setIsReportOpen(false);
  };

  // Bridge map selection to report draft coordinates
  const handleSelectCoordinates = (coords) => {
    selectCoordinates(coords);
    setCoordinates(coords);
  };

  return (
    <APIProvider apiKey={config.maps.apiKey}>
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2 text-xs text-center sticky top-0 z-50 shadow-xs">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      <AppLayout
        headerProps={{ onOpenReport: handleToggleReport }}
        isReportOpen={isReportOpen}
        onCloseReport={handleCloseReport}
        reportPanel={
          <ReportForm
            draft={draft}
            validation={validation}
            onSeverityChange={setSeverity}
            onDescriptionChange={setDescription}
            onClose={handleCloseReport}
          />
        }
      >
        <div className="space-y-6">
          {/* Milestone 2 Architecture Notice */}
          <StatusBanner
            tone="info"
            title="Milestone 2: Google Maps Active"
            badgeText="Phase 2 Ready"
          >
            Google Maps JavaScript API is live via <code className="font-mono text-emerald-800 bg-white/70 px-1 py-0.5 rounded">@vis.gl/react-google-maps</code>.
            Click anywhere on the map to drop an <strong className="font-semibold text-slate-800">AdvancedMarker</strong>, capture exact geographic coordinates, and test the active report draft state.
          </StatusBanner>

          {/* Primary Map Workspace */}
          <div className="h-[480px] sm:h-[540px] xl:h-[580px] w-full">
            <MapView
              selectedCoordinates={selectedCoordinates}
              onSelectCoordinates={handleSelectCoordinates}
              onOpenReportForm={handleToggleReport}
              isReportOpen={isReportOpen}
            />
          </div>

          {/* Reports Summary & Data Schema Hub */}
          <ReportSummary />
        </div>
      </AppLayout>
    </APIProvider>
  );
}

export default App;
