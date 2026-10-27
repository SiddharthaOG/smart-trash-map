import { useState, useCallback } from 'react';
import { config } from '../../../app/config.js';

/**
 * Hook for managing map viewport center and selected pin coordinates.
 * In Phase 1: Exposes coordinates contract without binding live Google Maps events.
 */
export function useMapSelection() {
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);
  const [mapCenter, setMapCenter] = useState(config.maps.defaultCenter);
  const [zoom, setZoom] = useState(config.maps.defaultZoom);

  const selectCoordinates = useCallback((coords) => {
    setSelectedCoordinates(coords);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedCoordinates(null);
  }, []);

  return {
    selectedCoordinates,
    mapCenter,
    zoom,
    selectCoordinates,
    clearSelection,
    setMapCenter,
    setZoom,
  };
}

export default useMapSelection;
