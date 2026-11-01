/**
 * Geolocation helper and status utilities.
 * Handles permission states, timeout, error formatting, and position retrieval.
 */

export const GEOLOCATION_STATUS = Object.freeze({
  IDLE: 'idle',
  PROMPTING: 'prompting', // showing explanation dialog
  REQUESTING: 'requesting', // browser geolocation in progress
  SUCCESS: 'success',
  DENIED: 'denied',
  TIMEOUT: 'timeout',
  UNAVAILABLE: 'unavailable',
  UNSUPPORTED: 'unsupported',
});

/**
 * Maps a GeolocationPositionError to a structured error state and human message.
 * @param {GeolocationPositionError | Error} err
 * @returns {{ status: string, message: string }}
 */
export function parseGeolocationError(err) {
  if (!err) {
    return {
      status: GEOLOCATION_STATUS.UNAVAILABLE,
      message: 'Unable to determine your current location.',
    };
  }

  // GeolocationPositionError codes:
  // 1: PERMISSION_DENIED
  // 2: POSITION_UNAVAILABLE
  // 3: TIMEOUT
  if (err.code === 1) {
    return {
      status: GEOLOCATION_STATUS.DENIED,
      message: 'Location permission was denied. You can still select any location manually by clicking on the map.',
    };
  }
  if (err.code === 3) {
    return {
      status: GEOLOCATION_STATUS.TIMEOUT,
      message: 'Location request timed out. Please check your GPS signal or click the map manually.',
    };
  }
  if (err.code === 2) {
    return {
      status: GEOLOCATION_STATUS.UNAVAILABLE,
      message: 'Location position is currently unavailable. You can click the map to place a report pin.',
    };
  }

  return {
    status: GEOLOCATION_STATUS.UNAVAILABLE,
    message: err.message || 'Unable to determine your current location.',
  };
}

/**
 * Executes a one-shot getCurrentPosition with options.
 * @param {object} [options]
 * @returns {Promise<{ coords: { lat: number, lng: number, accuracy?: number }, timestamp: number }>}
 */
export function requestCurrentPosition(options = {}) {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !navigator?.geolocation) {
      const error = new Error('Geolocation is not supported by your browser.');
      error.code = 0;
      return reject(error);
    }

    const geoOptions = {
      enableHighAccuracy: false,
      timeout: 20000,
      maximumAge: 60000,
      ...options,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          coords: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          },
          timestamp: position.timestamp,
        });
      },
      (error) => {
        reject(error);
      },
      geoOptions
    );
  });
}
