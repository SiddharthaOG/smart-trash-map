import React, { useState } from 'react';
import AppLayout from '../components/layout/AppLayout.jsx';
import { MapView, useMapSelection } from '../features/map/index.js';
import {
  ReportForm,
  ReportSummary,
  useReportDraft,
} from '../features/reports/index.js';
import StatusBanner from '../components/ui/StatusBanner.jsx';

/**
 * App Shell
 * Pure orchestration layer that composes feature modules and layout boundaries.
 * Does not implement direct database queries or map canvas internals.
 */
export function App() {
  const [isReportOpen, setIsReportOpen] = useState(true);

  // Map Feature state & hooks
  const { selectedCoordinates, selectCoordinates } = useMapSelection();

  // Reports Feature state & hooks
  const {
    draft,
    validation,
    setSeverity,
    setDescription,
    resetDraft,
  } = useReportDraft();

  const handleToggleReport = () => {
    setIsReportOpen((prev) => !prev);
  };

  const handleCloseReport = () => {
    setIsReportOpen(false);
  };

  return (
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
        {/* Milestone 1 Architecture Notice */}
        <StatusBanner
          tone="info"
          title="Milestone 1 Architecture Established"
          badgeText="Day 1 Complete"
        >
          Project foundation initialized with modular feature boundaries (App Shell, Map View, Reports, Data Access Service).
          Phase 2 will integrate <code className="font-mono text-emerald-800 bg-white/70 px-1 py-0.5 rounded">@vis.gl/react-google-maps</code> without altering report components or database services.
        </StatusBanner>

        {/* Primary Map Workspace */}
        <div className="h-[480px] sm:h-[540px] xl:h-[580px] w-full">
          <MapView
            selectedCoordinates={selectedCoordinates}
            onOpenReportForm={handleToggleReport}
            isReportOpen={isReportOpen}
          />
        </div>

        {/* Reports Summary & Data Schema Hub */}
        <ReportSummary />
      </div>
    </AppLayout>
  );
}

export default App;
