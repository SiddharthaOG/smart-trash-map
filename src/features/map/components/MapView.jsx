import React from 'react';
import { MapPin, Compass, ShieldCheck, Info } from 'lucide-react';
import { SEVERITY_LEVELS } from '../../../constants/index.js';
import MapControls from './MapControls.jsx';

export function MapView({
  selectedCoordinates = null,
  onOpenReportForm,
  isReportOpen = false,
  className = '',
}) {
  return (
    <div
      className={`relative w-full h-full min-h-[460px] bg-[#ecf2eb] overflow-hidden select-none border border-slate-200/90 rounded-2xl ${className}`}
      role="region"
      aria-label="Interactive map workspace"
    >
      {/* Schematic Topographic / Grid Pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-40 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="map-grid"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="#2d6a4f"
              strokeWidth="0.75"
              strokeOpacity="0.25"
            />
            <circle cx="30" cy="30" r="1.5" fill="#2d6a4f" fillOpacity="0.3" />
          </pattern>
          <pattern
            id="map-subgrid"
            width="15"
            height="15"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 15 0 L 0 0 0 15"
              fill="none"
              stroke="#2d6a4f"
              strokeWidth="0.3"
              strokeOpacity="0.12"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#map-subgrid)" />
        <rect width="100%" height="100%" fill="url(#map-grid)" />
        {/* Schematic Cartographic Contours */}
        <path
          d="M -100 250 C 200 180, 450 320, 800 240 C 1100 160, 1300 350, 1600 280"
          fill="none"
          stroke="#1b4332"
          strokeWidth="1.2"
          strokeDasharray="4 4"
          strokeOpacity="0.25"
        />
        <path
          d="M -50 550 C 250 480, 550 620, 950 520 C 1250 420, 1450 610, 1750 560"
          fill="none"
          stroke="#1b4332"
          strokeWidth="1.2"
          strokeDasharray="4 4"
          strokeOpacity="0.2"
        />
      </svg>

      {/* Viewport Header Bar (Cartographic Coordinate Indicator) */}
      <div className="absolute top-4 left-4 z-10 pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-md rounded-xl border border-slate-200/90 shadow-sm px-3.5 py-2 flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          <div className="text-xs">
            <span className="font-semibold text-slate-800">Map Viewport: </span>
            <span className="font-mono text-slate-600">37.7749° N, 122.4194° W</span>
            <span className="ml-2 inline-block px-1.5 py-0.2 bg-emerald-100 text-emerald-800 font-medium text-[10px] rounded">
              Phase 1 Schematic
            </span>
          </div>
        </div>
      </div>

      {/* North Arrow / Compass Indicator */}
      <div className="absolute top-4 right-16 sm:right-20 z-10 pointer-events-none">
        <div className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs border border-slate-200 shadow-xs flex items-center justify-center text-emerald-900">
          <Compass className="w-5 h-5" aria-hidden="true" />
        </div>
      </div>

      {/* Center Reticle and Milestone 1 Explanation Card */}
      <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
        <div className="max-w-md w-full bg-white/95 backdrop-blur-md border border-emerald-900/15 rounded-2xl p-6 shadow-xl text-center pointer-events-auto relative">
          <div className="mx-auto w-12 h-12 rounded-xl bg-emerald-100/90 text-emerald-800 flex items-center justify-center mb-4">
            <MapPin className="w-6 h-6" aria-hidden="true" />
          </div>

          <h2 className="text-lg font-bold text-slate-900 tracking-tight mb-2">
            Interactive Map Canvas
          </h2>

          <p className="text-sm text-slate-600 leading-relaxed mb-5">
            This viewport is architected for{' '}
            <strong className="font-semibold text-slate-800">
              @vis.gl/react-google-maps
            </strong>
            . In Phase 2, community members will drop real pins, capture exact
            geographic coordinates, and reverse-geocode street addresses.
          </p>

          <div className="grid grid-cols-2 gap-2 text-left bg-slate-50 border border-slate-200/80 rounded-xl p-3 mb-5 text-xs">
            <div>
              <span className="block font-medium text-slate-500 uppercase tracking-wider text-[10px]">
                Integration State
              </span>
              <span className="font-semibold text-emerald-800">
                Phase 1 Shell Active
              </span>
            </div>
            <div>
              <span className="block font-medium text-slate-500 uppercase tracking-wider text-[10px]">
                Target Library
              </span>
              <span className="font-mono text-slate-700">
                @vis.gl/react-google-maps
              </span>
            </div>
          </div>

          {onOpenReportForm && (
            <button
              type="button"
              onClick={onOpenReportForm}
              className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 ${
                isReportOpen
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 hover:bg-emerald-100'
                  : 'bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white'
              }`}
            >
              <MapPin className="w-4 h-4" aria-hidden="true" />
              {isReportOpen ? 'Report Form Active (Side Panel)' : 'Open Report Form'}
            </button>
          )}
        </div>
      </div>

      {/* Floating Map Controls in Top Right */}
      <div className="absolute top-4 right-4 z-20">
        <MapControls />
      </div>

      {/* Severity Legend Overlay in Bottom Left */}
      <div className="absolute bottom-4 left-4 right-4 sm:right-auto z-10 max-w-sm pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-xl p-3 shadow-md">
          <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-800 tracking-wide">
              Litter Severity Scale
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              1 (Minor) to 5 (Severe)
            </span>
          </div>

          <div className="flex items-center justify-between gap-1 text-[11px]">
            {Object.values(SEVERITY_LEVELS).map((item) => (
              <div
                key={item.level}
                className="flex items-center gap-1.5 px-1.5 py-1 rounded bg-slate-50/80 border border-slate-100"
                title={`${item.shortLabel}: ${item.label} — ${item.description}`}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full ${item.dotColor}`}
                  aria-hidden="true"
                />
                <span className="font-semibold text-slate-700">{item.level}</span>
              </div>
            ))}
          </div>

          <p className="mt-2 text-[10px] text-slate-500 leading-tight flex items-center gap-1">
            <Info className="w-3 h-3 shrink-0 text-slate-400" aria-hidden="true" />
            Reactive color-coded pins will activate in Phase 3.
          </p>
        </div>
      </div>
    </div>
  );
}

export default MapView;
