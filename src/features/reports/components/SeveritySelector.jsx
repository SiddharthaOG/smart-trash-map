import React from 'react';
import { SEVERITY_LEVELS } from '../../../constants/index.js';

export function SeveritySelector({ value = 3, onChange, disabled = false }) {
  const currentSeverity = SEVERITY_LEVELS[value] || SEVERITY_LEVELS[3];

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label
          id="severity-selector-label"
          className="text-xs font-semibold uppercase tracking-wider text-slate-700"
        >
          Severity Rating
        </label>
        <span className="text-xs font-medium text-slate-500">
          Scale: 1 (Minor) – 5 (Severe)
        </span>
      </div>

      {/* Button Group (1 to 5) */}
      <div
        role="radiogroup"
        aria-labelledby="severity-selector-label"
        className="grid grid-cols-5 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200"
      >
        {Object.values(SEVERITY_LEVELS).map((item) => {
          const isSelected = item.level === value;

          return (
            <button
              key={item.level}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={disabled}
              onClick={() => onChange && onChange(item.level)}
              className={`relative flex flex-col items-center justify-center py-2.5 px-1 rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 ${
                isSelected
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-300/80 scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span className="flex items-center gap-1">
                <span
                  className={`w-2 h-2 rounded-full ${item.dotColor}`}
                  aria-hidden="true"
                />
                <span>{item.level}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Level Description Banner */}
      <div
        className={`p-3 rounded-xl border text-xs leading-relaxed transition-all ${currentSeverity.badgeBg}`}
        aria-live="polite"
      >
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`w-2 h-2 rounded-full ${currentSeverity.dotColor}`}
            aria-hidden="true"
          />
          <strong className="font-semibold text-slate-900">
            {currentSeverity.shortLabel}: {currentSeverity.label}
          </strong>
        </div>
        <p className="text-slate-700">{currentSeverity.description}</p>
      </div>
    </div>
  );
}

export default SeveritySelector;
