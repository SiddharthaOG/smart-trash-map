import React, { useState, useEffect, useCallback } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import AppLayout from '../components/layout/AppLayout.jsx';
import { MapView, useMapSelection } from '../features/map/index.js';
import {
  ReportForm,
  ReportSummary,
  useReportDraft,
  reportService,
} from '../features/reports/index.js';
import StatusBanner from '../components/ui/StatusBanner.jsx';
import { config } from './config.js';
import { isSupabaseConfigured } from '../lib/supabase.js';

/**
 * App Shell
 * Pure orchestration layer that composes feature modules and layout boundaries.
 * Wraps map features with Google Maps APIProvider and connects pin selection to report drafts.
 * Connects report submission and feed retrieval to Supabase persistence service.
 */
export function App() {
  const [isReportOpen, setIsReportOpen] = useState(true);
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  // Supabase Reports Feed State
  const [reports, setReports] = useState([]);
  const [isLoadingReports, setIsLoadingReports] = useState(false);
  const [reportsError, setReportsError] = useState(null);

  // Supabase Report Submission State
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const supabaseConfigured = isSupabaseConfigured();

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

  // Fetch reports from Supabase with robust error and lifecycle handling
  const loadReports = useCallback(async () => {
    if (!supabaseConfigured) {
      setReports([]);
      setReportsError(null);
      setIsLoadingReports(false);
      return;
    }

    setIsLoadingReports(true);
    setReportsError(null);

    try {
      const result = await reportService.listReports();
      if (result?.error) {
        setReportsError(result.error);
      } else {
        setReports(result?.data || []);
      }
    } catch (err) {
      setReportsError(err?.message || 'Unexpected error while loading reports.');
    } finally {
      setIsLoadingReports(false);
    }
  }, [supabaseConfigured]);

  // Initial load
  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const handleToggleReport = () => {
    setIsReportOpen((prev) => !prev);
  };

  const handleCloseReport = () => {
    setIsReportOpen(false);
  };

  // Reset submission feedback whenever the user modifies their draft
  const handleClearFeedback = useCallback(() => {
    setSubmitSuccess(false);
    setSubmitError(null);
  }, []);

  // Bridge map selection to report draft coordinates while resetting feedback
  const handleSelectCoordinates = useCallback((coords) => {
    handleClearFeedback();
    selectCoordinates(coords);
    setCoordinates(coords);
  }, [handleClearFeedback, selectCoordinates, setCoordinates]);

  // Wrapper for severity changes that clears submission feedback
  const handleSeverityChange = useCallback((level) => {
    handleClearFeedback();
    setSeverity(level);
  }, [handleClearFeedback, setSeverity]);

  // Wrapper for description changes that clears submission feedback
  const handleDescriptionChange = useCallback((text) => {
    handleClearFeedback();
    setDescription(text);
  }, [handleClearFeedback, setDescription]);

  // Handle report submission to Supabase

  const handleSubmitReport = async (draftData) => {
    setIsSubmittingReport(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const result = await reportService.createReport(draftData);

      if (!result?.success || !result?.data) {
        throw new Error('The report could not be confirmed as saved.');
      }

      setSubmitSuccess(true);
      resetDraft();
      selectCoordinates(null);

      // The insert succeeded. A feed refresh failure must not turn
      // that successful submission into a submission error.
      try {
        await loadReports();
      } catch {
        // loadReports normally handles its own errors.
        // Preserve the successful submission feedback.
      }
    } catch (err) {
      setSubmitError(err.message || 'Submission to database failed.');
    } finally {
      setIsSubmittingReport(false);
    }
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
            onSeverityChange={handleSeverityChange}
            onDescriptionChange={handleDescriptionChange}
            onSubmit={handleSubmitReport}
            isSubmitting={isSubmittingReport}
            submitError={submitError}
            submitSuccess={submitSuccess}
            isConfigured={supabaseConfigured}
            onClose={handleCloseReport}
          />
        }
      >
        <div className="space-y-6">
          {/* Milestone 3 Architecture Notice */}

          <StatusBanner
            tone="info"
            title="Milestone 3: Supabase Persistence"
            badgeText={supabaseConfigured ? "Credentials Configured" : "Setup Required"}
          >
            Report persistence is implemented through the{" "}
            <code className="font-mono text-emerald-800 bg-white/70 px-1 py-0.5 rounded">
              reportService
            </code>{" "}
            and Supabase client.
            {supabaseConfigured ? (
              <span className="block mt-1 text-slate-800">
                Supabase environment variables are present. Actual database
                availability depends on the connection, table migration, and
                permissions. Check the report feed or submit a report to verify
                database operations.
              </span>
            ) : (
              <span className="block mt-1 text-slate-700">
                To enable database operations, configure{" "}
                <code className="font-mono bg-white/70 px-1 py-0.5 rounded">
                  VITE_SUPABASE_URL
                </code>{" "}
                and{" "}
                <code className="font-mono bg-white/70 px-1 py-0.5 rounded">
                  VITE_SUPABASE_ANON_KEY
                </code>{" "}
                in your environment.
              </span>
            )}
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
          <ReportSummary
            reports={reports}
            isLoading={isLoadingReports}
            fetchError={reportsError}
            isConfigured={supabaseConfigured}
            onRefresh={loadReports}
          />
        </div>
      </AppLayout>
    </APIProvider>
  );
}

export default App;
