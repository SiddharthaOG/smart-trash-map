import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isValidSeverity,
  isValidCoordinate,
  formatCoordinates,
  getSeverityDetails,
  validateReportDraft,
} from './validation.js';
import { SEVERITY_MIN, SEVERITY_MAX } from './constants.js';

test('isValidSeverity accepts valid integer levels 1 through 5', () => {
  assert.equal(isValidSeverity(1), true);
  assert.equal(isValidSeverity(2), true);
  assert.equal(isValidSeverity(3), true);
  assert.equal(isValidSeverity(4), true);
  assert.equal(isValidSeverity(5), true);
});

test('isValidSeverity rejects invalid values, floats, strings, and out-of-range numbers', () => {
  assert.equal(isValidSeverity(0), false);
  assert.equal(isValidSeverity(6), false);
  assert.equal(isValidSeverity(-1), false);
  assert.equal(isValidSeverity(3.5), false);
  assert.equal(isValidSeverity('3'), false);
  assert.equal(isValidSeverity(null), false);
  assert.equal(isValidSeverity(undefined), false);
});

test('isValidCoordinate validates latitude and longitude limits', () => {
  assert.equal(isValidCoordinate({ lat: 37.7749, lng: -122.4194 }), true);
  assert.equal(isValidCoordinate({ lat: 0, lng: 0 }), true);
  assert.equal(isValidCoordinate({ lat: 90, lng: 180 }), true);
  assert.equal(isValidCoordinate({ lat: -90, lng: -180 }), true);

  // Out of bounds
  assert.equal(isValidCoordinate({ lat: 90.1, lng: 0 }), false);
  assert.equal(isValidCoordinate({ lat: 0, lng: 180.5 }), false);
  assert.equal(isValidCoordinate(null), false);
  assert.equal(isValidCoordinate({ lat: '37', lng: -122 }), false);
  assert.equal(isValidCoordinate({ lat: NaN, lng: 0 }), false);
});

test('formatCoordinates returns formatted string or None selected', () => {
  assert.equal(formatCoordinates({ lat: 37.7749, lng: -122.4194 }), '37.7749° N, 122.4194° W');
  assert.equal(formatCoordinates({ lat: -33.8688, lng: 151.2093 }), '33.8688° S, 151.2093° E');
  assert.equal(formatCoordinates(null), 'None selected');
  assert.equal(formatCoordinates(undefined), 'None selected');
});

test('getSeverityDetails returns correct metadata for all valid levels', () => {
  for (let i = SEVERITY_MIN; i <= SEVERITY_MAX; i++) {
    const details = getSeverityDetails(i);
    assert.equal(details.level, i);
    assert.ok(typeof details.label === 'string');
    assert.ok(typeof details.description === 'string');
    assert.ok(typeof details.hex === 'string');
  }

  // Fallback for unknown
  const fallback = getSeverityDetails(99);
  assert.equal(fallback.level, 0);
  assert.equal(fallback.label, 'Unspecified');
});

test('validateReportDraft requires coordinates and valid severity', () => {
  // Missing coordinates (Phase 1 default state)
  const draftWithoutCoords = {
    coordinates: null,
    severity: 3,
    description: 'Debris near transit stop',
  };
  const result1 = validateReportDraft(draftWithoutCoords);
  assert.equal(result1.isValid, false);
  assert.equal(result1.canSubmit, false);
  assert.ok(result1.errors.coordinates);

  // Valid draft with coordinates
  const validDraft = {
    coordinates: { lat: 37.7749, lng: -122.4194 },
    severity: 4,
    description: 'Bulk furniture dumping on side alley',
  };
  const result2 = validateReportDraft(validDraft);
  assert.equal(result2.isValid, true);
  assert.equal(result2.canSubmit, true);
  assert.equal(Object.keys(result2.errors).length, 0);

  // Description exceeding character limit
  const overlongDraft = {
    coordinates: { lat: 37.7749, lng: -122.4194 },
    severity: 2,
    description: 'a'.repeat(300),
  };
  const result3 = validateReportDraft(overlongDraft);
  assert.equal(result3.isValid, false);
  assert.equal(result3.canSubmit, false);
  assert.ok(result3.errors.description);
});
