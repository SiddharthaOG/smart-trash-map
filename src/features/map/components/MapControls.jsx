import React, { useState } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import { Navigation, Plus, Minus, Layers, Loader2 } from 'lucide-react';

export function MapControls({ className = '' }) {
  const map = useMap();
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState(null);
  const [mapTypeId, setMapTypeId] = useState('roadmap');

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

  const handleLocateMe = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        if (map) {
          map.panTo(coords);
          map.setZoom(16);
        }
      },
      (err) => {
        setIsLocating(false);
        let msg = 'Location request unavailable.';
        if (err.code === 1) {
          msg = 'Location access was denied.';
        } else if (err.code === 3) {
          msg = 'Location request timed out.';
        }
        setGeoError(msg);
        setTimeout(() => setGeoError(null), 4000);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleToggleLayer = () => {
    if (!map) return;
    const nextType = mapTypeId === 'roadmap' ? 'hybrid' : 'roadmap';
    map.setMapTypeId(nextType);
    setMapTypeId(nextType);
  };

  return (
    <div
      className={`flex flex-col gap-2 pointer-events-auto ${className}`}
      role="toolbar"
      aria-label="Map navigation controls"
    >
      {/* Geolocation Button */}
      <div className="relative group">
        <button
          type="button"
          onClick={handleLocateMe}
          disabled={isLocating}
          aria-label="Locate my position"
          className="w-10 h-10 rounded-lg bg-white/95 backdrop-blur-xs border border-slate-300/80 shadow-md flex items-center justify-center text-slate-700 hover:text-emerald-800 hover:bg-slate-50 active:scale-95 transition cursor-pointer disabled:opacity-50"
          title="Center map on your current location"
        >
          {isLocating ? (
            <Loader2 className="w-4 h-4 animate-spin text-emerald-700" aria-hidden="true" />
          ) : (
            <Navigation className="w-4 h-4" aria-hidden="true" />
          )}
        </button>

        {geoError && (
          <div className="absolute right-12 top-0 whitespace-nowrap bg-rose-900 text-white text-[11px] font-medium px-2.5 py-1 rounded shadow-md z-30">
            {geoError}
          </div>
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
