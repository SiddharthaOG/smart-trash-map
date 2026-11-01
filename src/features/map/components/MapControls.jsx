import React from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import { Navigation, Plus, Minus, Layers, Loader2, Crosshair } from 'lucide-react';

export function MapControls({
  className = '',
  onLocateMe,
  onRecenterUser,
  isLocating,
  hasUserLocation,
}) {
  const map = useMap();
  const [mapTypeId, setMapTypeId] = React.useState('roadmap');

  const handleZoomIn = () => {
    if (!map) return;
    const current = map.getZoom() ?? 13;
    map.setZoom(current + 1);
  };

  const handleZoomOut = () => {
    if (!map) return;
    const current = map.getZoom() ?? 13;
    map.setZoom(current - 1);
  };

  const handleToggleLayer = () => {
    if (!map) return;
    const nextType = mapTypeId === 'roadmap' ? 'hybrid' : 'roadmap';
    map.setMapTypeId(nextType);
    setMapTypeId(nextType);
  };

  const handleLocationAction = () => {
    if (hasUserLocation) {
      onRecenterUser?.();
    } else {
      onLocateMe?.();
    }
  };

  return (
    <div
      className={`flex flex-col gap-2 pointer-events-auto ${className}`}
      role="toolbar"
      aria-label="Map navigation controls"
    >
      {/* Geolocation / Recenter Button */}
      <div className="relative group">
        <button
          type="button"
          onClick={handleLocationAction}
          disabled={isLocating}
          aria-label={hasUserLocation ? 'Recenter on your location' : 'Locate my position'}
          className={`w-10 h-10 rounded-lg bg-white/95 backdrop-blur-xs border shadow-md flex items-center justify-center transition cursor-pointer active:scale-95 disabled:opacity-50 ${
            hasUserLocation
              ? 'bg-sky-50 text-sky-700 hover:bg-sky-100 border-sky-300/80'
              : 'bg-white/95 text-slate-700 hover:text-emerald-800 hover:bg-slate-50 border-slate-300/80'
          }`}
          title={hasUserLocation ? 'Recenter map on your location' : 'Center map on your current location'}
        >
          {isLocating ? (
            <Loader2 className="w-4 h-4 animate-spin text-emerald-700" aria-hidden="true" />
          ) : hasUserLocation ? (
            <Crosshair className="w-4 h-4 text-sky-600" aria-hidden="true" />
          ) : (
            <Navigation className="w-4 h-4" aria-hidden="true" />
          )}
        </button>

        {hasUserLocation && (
          <span className="hidden sm:group-hover:block absolute right-12 top-2 whitespace-nowrap bg-sky-900 text-white text-[11px] font-medium px-2 py-1 rounded shadow-md pointer-events-none z-30">
            Your Location Active
          </span>
        )}
      </div>

      {/* Zoom In / Out Stack */}
      <div className="bg-white/95 backdrop-blur-xs border border-slate-300/80 rounded-lg shadow-md overflow-hidden flex flex-col">
        <button
          type="button"
          onClick={handleZoomIn}
          aria-label="Zoom in"
          className="w-10 h-9 flex items-center justify-center text-slate-700 hover:text-emerald-800 hover:bg-slate-50 active:bg-slate-100 transition cursor-pointer border-b border-slate-200"
          title="Zoom in"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          aria-label="Zoom out"
          className="w-10 h-9 flex items-center justify-center text-slate-700 hover:text-emerald-800 hover:bg-slate-50 active:bg-slate-100 transition cursor-pointer"
          title="Zoom out"
        >
          <Minus className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Layer Toggle */}
      <button
        type="button"
        onClick={handleToggleLayer}
        aria-label={`Toggle map layer (currently ${mapTypeId})`}
        className={`w-10 h-10 rounded-lg backdrop-blur-xs border shadow-md flex items-center justify-center transition cursor-pointer active:scale-95 ${
          mapTypeId === 'hybrid'
            ? 'bg-emerald-800 text-white border-emerald-900'
            : 'bg-white/95 text-slate-700 hover:text-emerald-800 hover:bg-slate-50 border-slate-300/80'
        }`}
        title={`Toggle satellite/terrain view (active: ${mapTypeId})`}
      >
        <Layers className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export default MapControls;