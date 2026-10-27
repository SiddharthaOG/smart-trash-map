import React from 'react';
import { Info, Sparkles, AlertCircle } from 'lucide-react';

const TONES = {
  info: {
    bg: 'bg-emerald-50/90 border-emerald-200 text-emerald-950',
    iconColor: 'text-emerald-700',
    Icon: Info,
  },
  neutral: {
    bg: 'bg-slate-50 border-slate-200 text-slate-800',
    iconColor: 'text-slate-600',
    Icon: Info,
  },
  warning: {
    bg: 'bg-amber-50 border-amber-200 text-amber-950',
    iconColor: 'text-amber-700',
    Icon: AlertCircle,
  },
};

export function StatusBanner({
  title,
  children,
  tone = 'info',
  badgeText,
  className = '',
}) {
  const { bg, iconColor, Icon } = TONES[tone] || TONES.info;

  return (
    <div
      role="status"
      className={`rounded-lg border p-3.5 text-xs sm:text-sm leading-relaxed ${bg} ${className}`}
    >
      <div className="flex items-start gap-2.5">
        <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${iconColor}`} aria-hidden="true" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {title && <span className="font-semibold text-slate-900">{title}</span>}
            {badgeText && (
              <span className="inline-block px-1.5 py-0.5 text-[10px] uppercase font-mono tracking-wider font-semibold bg-white/80 rounded border border-current text-emerald-800">
                {badgeText}
              </span>
            )}
          </div>
          <div className="text-slate-700 space-y-1">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default StatusBanner;
