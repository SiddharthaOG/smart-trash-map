import React from 'react';
import { MapPin, ShieldCheck, X, Navigation } from 'lucide-react';
import Button from '../../../components/ui/Button.jsx';

/**
 * Modal prompt that explains why location access is requested BEFORE triggering
 * the native browser permission dialog.
 */
export function LocationPromptModal({
  isOpen,
  onConfirm,
  onDismiss,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-prompt-title"
    >
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200/90 overflow-hidden transform transition-all p-5 sm:p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Navigation className="w-5 h-5 text-emerald-700" aria-hidden="true" />
            </div>
            <div>
              <h3 id="location-prompt-title" className="text-base font-bold text-slate-900 leading-snug">
                Share Current Location?
              </h3>
              <p className="text-xs text-slate-500">
                Automatic map centering &amp; nearby exploration
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Close dialog"
            className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Explanation Body */}
        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <p>
            Smart Trash Map can use your device&apos;s GPS to center the map on your neighborhood and display your location beacon.
          </p>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-start gap-2 text-slate-800 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
              <span>How your location is handled:</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Your location is only used to orient the map in your browser.</li>
              <li>It is <strong>never</strong> submitted as a report automatically.</li>
              <li>You can always click anywhere on the map to manually place report pins.</li>
              <li>No tracking or continuous background watching is performed.</li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onDismiss}
          >
            Not Now
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={onConfirm}
            icon={Navigation}
          >
            Enable Location
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LocationPromptModal;
