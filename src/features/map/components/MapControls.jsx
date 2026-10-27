import React from 'react';
import { Navigation, Plus, Minus, Layers } from 'lucide-react';

export function MapControls({ className = '' }) {
  return (
    <div
      className={`flex flex-col gap-2 pointer-events-auto ${className}`}
      role="toolbar"
      aria-label="Map navigation controls"
    >
      {/* Geolocation Anchor Control */}
      <div className="relative group">
        <button
          type="button"
          disabled
          aria-disabled="true"
          aria-label="Locate my position (Available in Phase 2)"
          className="w-10 h-10 rounded-lg bg-white/95 backdrop-blur-xs border border-slate-300/80 shadow-md flex items-center justify-center text-slate-400 cursor-not-allowed opacity-80"
          title="Geolocation anchor activates in Phase 2 with Google Maps"
        >
          <Navigation className="w-4 h-4" aria-hidden="true" />
        </button>
        <span className="hidden sm:group-hover:block absolute right-12 top-2 whitespace-nowrap bg-slate-900 text-white text-[11px] font-medium px-2 py-1 rounded shadow-md pointer-events-none z-30">
          Geolocation (Phase 2)
        </span>
      </div>

      {/* Zoom In/Out Stack */}
      <div className="bg-white/95 backdrop-blur-xs border border-slate-300/80 rounded-lg shadow-md overflow-hidden flex flex-col">
        <button
          type="button"
          disabled
          aria-disabled="true"
          aria-label="Zoom in (Available in Phase 2)"
          className="w-10 h-9 flex items-center justify-center text-slate-400 hover:text-slate-400 cursor-not-allowed opacity-80 border-b border-slate-200"
          title="Zoom controls connect in Phase 2"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          disabled
          aria-disabled="true"
          aria-label="Zoom out (Available in Phase 2)"
          className="w-10 h-9 flex items-center justify-center text-slate-400 hover:text-slate-400 cursor-not-allowed opacity-80"
          title="Zoom controls connect in Phase 2"
        >
          <Minus className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Map Layers */}
      <button
        type="button"
        disabled
        aria-disabled="true"
        aria-label="Toggle map layers (Available in Phase 2)"
        className="w-10 h-10 rounded-lg bg-white/95 backdrop-blur-xs border border-slate-300/80 shadow-md flex items-center justify-center text-slate-400 cursor-not-allowed opacity-80"
        title="Map layers activate in Phase 2"
      >
        <Layers className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export default MapControls;
