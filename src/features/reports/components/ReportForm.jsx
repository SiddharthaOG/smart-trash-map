import React from 'react';
import { X, MapPin, AlertCircle, Send, CheckCircle2, Loader2, Database } from 'lucide-react';
import { formatCoordinates } from '../validation.js';
import { MAX_DESCRIPTION_LENGTH } from '../constants.js';
import SeveritySelector from './SeveritySelector.jsx';
import Button from '../../../components/ui/Button.jsx';

export function ReportForm({
  draft,
  validation,
  onSeverityChange,
  onDescriptionChange,
  onClose,
  onSubmit,
  isSubmitting = false,
  submitError = null,
  submitSuccess = false,
  isConfigured = false,
  className = '',
}) {
  const coordinatesDisplay = formatCoordinates(draft.coordinates);
  const hasCoordinates = Boolean(draft.coordinates);
  const descriptionLength = (draft.description || '').length;

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (validation.canSubmit && onSubmit && !isSubmitting && isConfigured) {
      onSubmit(draft);
    }
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className={`bg-white rounded-2xl border border-slate-200/90 shadow-lg flex flex-col overflow-hidden max-h-[85vh] lg:max-h-[calc(100vh-120px)] ${className}`}
      aria-label="Community litter report form"
    >
      {/* Form Header */}
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 leading-tight">
              Report Litter
            </h3>
            <p className="text-xs text-slate-500">
              Community hotspot coordination
            </p>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close report panel"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Scrollable Form Body */}
      <div className="p-5 space-y-4 overflow-y-auto flex-1">
        {/* Success Banner */}
        {submitSuccess && (
          <div
            role="status"
            className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 flex items-center gap-2.5 animate-in fade-in"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
            <div>
              <span className="font-semibold block">Report Recorded</span>
              <span>Saved to community database. The report feed has been refreshed.</span>
            </div>
          </div>
        )}

        {/* Error Banner */}
        {submitError && (
          <div
            role="alert"
            className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-900 flex items-center gap-2.5 animate-in fade-in"
          >
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" aria-hidden="true" />
            <div>
              <span className="font-semibold block">Submission Error</span>
              <span>{submitError}</span>
            </div>
          </div>
        )}

        {/* Location Status Section */}
        <div className="space-y-1.5">
          <span className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Location Status
          </span>
          <div
            className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
              hasCoordinates
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                : 'bg-amber-50/80 border-amber-200 text-amber-950'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {hasCoordinates ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600" aria-hidden="true" />
              )}
            </div>
            <div className="space-y-0.5">
              <div className="font-semibold text-slate-900">
                Coordinates:{' '}
                <span className="font-mono font-normal">{coordinatesDisplay}</span>
              </div>
              <p className="text-slate-600 leading-normal">
                {hasCoordinates
                  ? 'Selected location coordinates recorded. Click the map to reposition.'
                  : 'Click anywhere on the map to drop a pin and capture coordinates.'}
              </p>
            </div>
          </div>
        </div>

        {/* Severity Selector */}
        <SeveritySelector
          value={draft.severity}
          onChange={onSeverityChange}
          disabled={isSubmitting}
        />

        {/* Optional Description */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="litter-description"
              className="text-xs font-semibold uppercase tracking-wider text-slate-700"
            >
              Description <span className="font-normal text-slate-400">(Optional)</span>
            </label>
            <span
              className={`text-xs font-mono ${
                descriptionLength > MAX_DESCRIPTION_LENGTH
                  ? 'text-rose-600 font-bold'
                  : 'text-slate-400'
              }`}
            >
              {descriptionLength}/{MAX_DESCRIPTION_LENGTH}
            </span>
          </div>

          <textarea
            id="litter-description"
            rows={2}
            value={draft.description}
            onChange={(e) => onDescriptionChange && onDescriptionChange(e.target.value)}
            disabled={isSubmitting}
            placeholder="e.g. Broken bottles along the park trail entrance..."
            maxLength={MAX_DESCRIPTION_LENGTH + 20}
            className="w-full rounded-xl border border-slate-300 p-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition resize-none disabled:bg-slate-100"
          />
          {validation.errors.description && (
            <p className="text-xs text-rose-600 font-medium">
              {validation.errors.description}
            </p>
          )}
        </div>

        {/* Milestone Persistence Notice */}
        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-0.5">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800">
            <Database className="w-3.5 h-3.5 text-emerald-700 shrink-0" aria-hidden="true" />
            Milestone 3: Supabase Persistence
          </div>
          <p className="leading-relaxed text-[11px]">
            {isConfigured
              ? 'Database configuration present. Submissions insert real records into the PostgreSQL trash_reports table.'
              : 'Supabase credentials missing. Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to save reports.'}
          </p>
        </div>
      </div>

      {/* Form Footer Actions (Pinned) */}
      <div className="p-3.5 border-t border-slate-100 bg-slate-50/90 backdrop-blur-xs flex items-center justify-between gap-3 shrink-0">
        {onClose && (
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}

        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={!validation.canSubmit || isSubmitting || !isConfigured}
          className="flex-1"
          title={
            !isConfigured
              ? 'Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable database submission'
              : !validation.canSubmit
              ? 'Click on the map to set coordinates before submitting'
              : 'Submit report to PostgreSQL database'
          }
          icon={isSubmitting ? Loader2 : Send}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </Button>
      </div>
    </form>
  );
}

export default ReportForm;