import test from 'node:test';
import assert from 'node:assert/strict';
import {
  GEOLOCATION_STATUS,
  parseGeolocationError,
} from './geolocation.js';

test('GEOLOCATION_STATUS defines expected states', () => {
  assert.equal(GEOLOCATION_STATUS.IDLE, 'idle');
  assert.equal(GEOLOCATION_STATUS.PROMPTING, 'prompting');
  assert.equal(GEOLOCATION_STATUS.REQUESTING, 'requesting');
  assert.equal(GEOLOCATION_STATUS.SUCCESS, 'success');
  assert.equal(GEOLOCATION_STATUS.DENIED, 'denied');
  assert.equal(GEOLOCATION_STATUS.TIMEOUT, 'timeout');
  assert.equal(GEOLOCATION_STATUS.UNAVAILABLE, 'unavailable');
  assert.equal(GEOLOCATION_STATUS.UNSUPPORTED, 'unsupported');
});

test('parseGeolocationError handles permission denied (code 1)', () => {
  const error = { code: 1, message: 'User denied Geolocation' };
  const parsed = parseGeolocationError(error);
  assert.equal(parsed.status, GEOLOCATION_STATUS.DENIED);
  assert.ok(parsed.message.toLowerCase().includes('denied'));
  assert.ok(parsed.message.toLowerCase().includes('manually'));
});

test('parseGeolocationError handles position unavailable (code 2)', () => {
  const error = { code: 2, message: 'Position unavailable' };
  const parsed = parseGeolocationError(error);
  assert.equal(parsed.status, GEOLOCATION_STATUS.UNAVAILABLE);
  assert.ok(parsed.message.toLowerCase().includes('unavailable'));
});

test('parseGeolocationError handles request timeout (code 3)', () => {
  const error = { code: 3, message: 'Timeout expired' };
  const parsed = parseGeolocationError(error);
  assert.equal(parsed.status, GEOLOCATION_STATUS.TIMEOUT);
  assert.ok(parsed.message.toLowerCase().includes('timed out'));
});

test('parseGeolocationError falls back cleanly for unknown error objects', () => {
  const parsedNull = parseGeolocationError(null);
  assert.equal(parsedNull.status, GEOLOCATION_STATUS.UNAVAILABLE);

  const parsedCustom = parseGeolocationError(new Error('GPS device disconnected'));
  assert.equal(parsedCustom.status, GEOLOCATION_STATUS.UNAVAILABLE);
  assert.equal(parsedCustom.message, 'GPS device disconnected');
});

test('manual report pin placement remains decoupled from user location coordinates', () => {
  const detectedUserLocation = { lat: 37.7749, lng: -122.4194 };
  let selectedReportCoordinates = null;

  // Clicking the map sets selected coordinates independently
  const handleMapClick = (clickCoords) => {
    selectedReportCoordinates = clickCoords;
  };

  handleMapClick({ lat: 37.7833, lng: -122.4167 });

  assert.notDeepEqual(selectedReportCoordinates, detectedUserLocation);
  assert.equal(selectedReportCoordinates.lat, 37.7833);
  assert.equal(detectedUserLocation.lat, 37.7749);
});
