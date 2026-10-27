/**
 * Pure Validation Functions for Litter Reports
 * Pure logic decoupled from React components for fast, reliable unit testing.
 */

import {
  SEVERITY_MIN,
  SEVERITY_MAX,
  SEVERITY_LEVELS,
  MAX_DESCRIPTION_LENGTH,
} from './constants.js';

/**
 * Validates whether a value is a valid severity integer (1 to 5).
 * @param {any} val
 * @returns {boolean}
 */
export function isValidSeverity(val) {
  if (typeof val !== 'number' || !Number.isInteger(val)) {
    return false;
  }
  return val >= SEVERITY_MIN && val <= SEVERITY_MAX;
}

/**
 * Validates coordinate pair { lat, lng }.
 * @param {any} coords
 * @returns {boolean}
 */
export function isValidCoordinate(coords) {
  if (!coords || typeof coords !== 'object') {
    return false;
  }
  const { lat, lng } = coords;
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return false;
  }
  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return false;
  }
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

/**
 * Formats coordinates for human-readable display.
 * @param {{ lat: number, lng: number } | null} coords
 * @returns {string}
 */
export function formatCoordinates(coords) {
  if (!isValidCoordinate(coords)) {
    return 'None selected';
  }
  const latDir = coords.lat >= 0 ? 'N' : 'S';
  const lngDir = coords.lng >= 0 ? 'E' : 'W';
  return `${Math.abs(coords.lat).toFixed(4)}° ${latDir}, ${Math.abs(coords.lng).toFixed(4)}° ${lngDir}`;
}

/**
 * Returns severity metadata or fallback for unknown values.
 * @param {number} level
 * @returns {object}
 */
export function getSeverityDetails(level) {
  if (isValidSeverity(level) && SEVERITY_LEVELS[level]) {
    return SEVERITY_LEVELS[level];
  }
  return {
    level: 0,
    label: 'Unspecified',
    shortLabel: 'N/A',
    description: 'Unknown severity level',
    dotColor: 'bg-slate-400',
    borderColor: 'border-slate-300',
    textColor: 'text-slate-600',
    badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
    hex: '#94a3b8',
  };
}

/**
 * Validates a report draft state.
 * Returns canSubmit, errors, and validation flags.
 * In Phase 1, coordinate selection is flagged if not present.
 *
 * @param {{ coordinates: any, severity: any, description: string }} draft
 * @returns {{
 *   isValid: boolean,
 *   canSubmit: boolean,
 *   errors: { coordinates?: string, severity?: string, description?: string }
 * }}
 */
export function validateReportDraft(draft) {
  const errors = {};

  if (!draft || typeof draft !== 'object') {
    return {
      isValid: false,
      canSubmit: false,
      errors: { general: 'Invalid draft object' },
    };
  }

  // 1. Coordinates check
  if (!isValidCoordinate(draft.coordinates)) {
    errors.coordinates = 'Map coordinates are required. Pin placement will unlock in Phase 2.';
  }

  // 2. Severity check
  if (!isValidSeverity(draft.severity)) {
    errors.severity = `Severity must be an integer between ${SEVERITY_MIN} and ${SEVERITY_MAX}.`;
  }

  // 3. Description check (optional, but capped)
  const desc = draft.description || '';
  if (typeof desc !== 'string') {
    errors.description = 'Description must be text.';
  } else if (desc.length > MAX_DESCRIPTION_LENGTH) {
    errors.description = `Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters (currently ${desc.length}).`;
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    isValid,
    // Can only submit if coordinates exist, valid severity, and valid description
    canSubmit: isValid,
    errors,
  };
}
