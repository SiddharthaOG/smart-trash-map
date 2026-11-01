import React from 'react';
import { AdvancedMarker } from '@vis.gl/react-google-maps';

/**
 * Distinctive User Location Marker.
 * Displays a pulsing blue beacon to clearly differentiate user location
 * from green/amber/red litter report pins.
 */
export function UserLocationMarker({ position }) {
  if (!position) return null;

  return (
    <AdvancedMarker
      position={position}
      title="Your Current Location"
      zIndex={10}
    >
      <div className="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        {/* Pulsing Outer Radar Ring */}
        <div className="absolute w-10 h-10 rounded-full bg-sky-500/25 animate-ping" />

        {/* Semi-transparent Accuracy Halo */}
        <div className="absolute w-8 h-8 rounded-full bg-sky-400/30 border border-sky-400/60" />

        {/* Solid Center Dot with White Border */}
        <div className="relative w-4 h-4 rounded-full bg-sky-600 border-2 border-white shadow-md flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-white" />
        </div>
      </div>
    </AdvancedMarker>
  );
}

export default UserLocationMarker;
