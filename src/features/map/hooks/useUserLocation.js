import { useState, useCallback } from 'react';
import {
  GEOLOCATION_STATUS,
  parseGeolocationError,
  requestCurrentPosition,
} from '../utils/geolocation.js';

/**
 * Hook for managing user location detection and consent explanation flow.
 *
 * Requirements met:
 * - Clear explanation prompt before asking browser permission.
 * - Browser geolocation only triggered after user confirms.
 * - Single-shot getCurrentPosition (no continuous watch).
 * - Distinguishes denied, timeout, unavailable, unsupported.
 * - Keeps user location independent from report draft coordinates.
 */
export function useUserLocation() {
  const [userLocation, setUserLocation] = useState(null); // { lat, lng, accuracy }
  const [status, setStatus] = useState(GEOLOCATION_STATUS.IDLE);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isPromptOpen, setIsPromptOpen] = useState(false);

  // Open explanation dialog before browser request
  const promptLocationPermission = useCallback(() => {
    setErrorMessage(null);
    setIsPromptOpen(true);
  }, []);

  // Dismiss explanation dialog without requesting location
  const dismissPrompt = useCallback(() => {
    setIsPromptOpen(false);
  }, []);

  // Execute actual location request after user confirms explanation
  const confirmAndRequestLocation = useCallback(async (options = {}) => {
    setIsPromptOpen(false);
    setErrorMessage(null);

    if (typeof window === 'undefined' || !navigator?.geolocation) {
      setStatus(GEOLOCATION_STATUS.UNSUPPORTED);
      setErrorMessage('Geolocation is not supported by your browser.');
      return null;
    }

    setStatus(GEOLOCATION_STATUS.REQUESTING);

    try {
      const result = await requestCurrentPosition(options);
      setUserLocation(result.coords);
      setStatus(GEOLOCATION_STATUS.SUCCESS);
      setErrorMessage(null);
      return result.coords;
    } catch (err) {
      const parsed = parseGeolocationError(err);
      setStatus(parsed.status);
      setErrorMessage(parsed.message);
      return null;
    }
  }, []);

  // Clear or reset user location
  const clearUserLocation = useCallback(() => {
    setUserLocation(null);
    setStatus(GEOLOCATION_STATUS.IDLE);
    setErrorMessage(null);
  }, []);

  return {
    userLocation,
    status,
    errorMessage,
    isPromptOpen,
    isLocating: status === GEOLOCATION_STATUS.REQUESTING,
    hasLocation: Boolean(userLocation),
    promptLocationPermission,
    dismissPrompt,
    confirmAndRequestLocation,
    clearUserLocation,
    setErrorMessage,
  };
}

export default useUserLocation;
