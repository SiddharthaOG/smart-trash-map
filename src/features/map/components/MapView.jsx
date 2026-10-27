import React from 'react';
import { Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { MapPin, Info, Compass } from 'lucide-react';
import { SEVERITY_LEVELS } from '../../../constants/index.js';
import { config } from '../../../app/config.js';
import { formatCoordinates } from '../../reports/validation.js';
import MapControls from './MapControls.jsx';

export function MapView({
  selectedCoordinates = null,
  onSelectCoordinates,
  onOpenReportForm,
  isReportOpen = false,
  className = '',
}) {
  const hasKey = Boolean(config.maps.apiKey);
  const activeCoordinatesDisplay = selectedCoordinates
    ? formatCoordinates(selectedCoordinates)
    : `${config.maps.defaultCenter.lat.toFixed(4)}° N, ${Math.abs(config.maps.defaultCenter.lng).toFixed(4)}° W (Default)`;

  const handleMapClick = (e) => {
    if (e.detail?.latLng && onSelectCoordinates) {
      onSelectCoordinates({
        lat: e.detail.latLng.lat,
        lng: e.detail.latLng.lng,
      });
    }
  };

  return (
    <div
      className={`relative w-full h-full min-h-[460px] bg-slate-100 overflow-hidden select-none border border-slate-200/90 rounded-2xl ${className}`}
      role="region"
      aria-label="Interactive Google Map workspace"
    >
      {/* Real Google Map Container */}
      {hasKey ? (
        <Map
          defaultCenter={config.maps.defaultCenter}
          defaultZoom={config.maps.defaultZoom}
          mapId="DEMO_MAP_ID"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          disableDefaultUI={true}
          gestureHandling="greedy"
          onClick={handleMapClick}
          className="w-full h-full min-h-[460px]"
        >
          {/* Active Pin Marker at Selected Coordinates */}
          {selectedCoordinates && (
            <AdvancedMarker
              position={selectedCoordinates}
              title="Selected litter location"
            >
              <Pin
                background="#1b4332"
                borderColor="#081c15"
                glyphColor="#ffffff"
                scale={1.15}
              />
            </AdvancedMarker>
          )}

          {/* Floating Map Controls mounted inside Map so useMap() binds cleanly */}
          <div className="absolute top-4 right-4 z-20">
            <MapControls />
          </div>
        </Map>
      ) : (
        <div className="w-full h-full flex items-center justify-center p-6 text-center bg-[#ecf2eb]">
          <div className="max-w-md bg-white p-6 rounded-2xl shadow-md border border-emerald-900/10">
            <MapPin className="w-8 h-8 mx-auto text-emerald-800 mb-2" />
            <h3 className="font-bold text-slate-900 mb-1">Google Maps Key Required</h3>
            <p className="text-xs text-slate-600 mb-4">
              Configure <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">VITE_GOOGLE_MAPS_API_KEY</code> to activate the live map canvas.
            </p>
          </div>
        </div>
      )}

      {/* Viewport Top-Left Coordinate Indicator Badge */}
      <div className="absolute top-4 left-4 z-10 pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-md rounded-xl border border-slate-200/90 shadow-sm px-3.5 py-2 flex items-center gap-2.5">
          <div
            className={`w-2 h-2 rounded-full ${
              selectedCoordinates ? 'bg-emerald-600 animate-ping' : 'bg-amber-500'
            }`}
          />
          <div className="text-xs">
            <span className="font-semibold text-slate-800">
              {selectedCoordinates ? 'Dropped Pin: ' : 'Map Center: '}
            </span>
            <span className="font-mono text-slate-600">{activeCoordinatesDisplay}</span>
            <span className="ml-2 inline-block px-1.5 py-0.5 bg-emerald-100 text-emerald-800 font-medium text-[10px] rounded">
              {selectedCoordinates ? 'Coordinates Locked' : 'Click Map to Place Pin'}
            </span>
          </div>
        </div>
      </div>

      {/* Floating Prompt When No Pin Is Placed Yet */}
      {!selectedCoordinates && hasKey && (
        <div className="absolute top-16 left-4 z-10 pointer-events-none">
          <div className="bg-slate-900/85 backdrop-blur-xs text-white text-xs px-3 py-1.5 rounded-lg shadow-md flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
            <span>Click anywhere on the map to drop a litter report pin</span>
          </div>
        </div>
      )}

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
            Click anywhere on the map to set report coordinates.
          </p>
        </div>
      </div>
    </div>
  );
}

export default MapView;
