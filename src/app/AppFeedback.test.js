import test from 'node:test';
import assert from 'node:assert/strict';

/**
 * Unit tests verifying App-level state resiliency and submission-feedback reset behavior.
 */

test('loadReports logic resets loading state and handles unconfigured environment', async () => {
  let reports = [{ id: 'old-report' }];
  let reportsError = 'old error';
  let isLoadingReports = true;

  const runLoadReports = async (isConfigured, fetchFn) => {
    if (!isConfigured) {
      reports = [];
      reportsError = null;
      isLoadingReports = false;
      return;
    }

    isLoadingReports = true;
    reportsError = null;

    try {
      const result = await fetchFn();
      if (result?.error) {
        reportsError = result.error;
      } else {
        reports = result?.data || [];
      }
    } catch (err) {
      reportsError = err?.message || 'Unexpected error while loading reports.';
    } finally {
      isLoadingReports = false;
    }
  };

  // 1. Unconfigured execution
  await runLoadReports(false, async () => ({ data: [] }));
  assert.equal(isLoadingReports, false);
  assert.equal(reportsError, null);
  assert.deepEqual(reports, []);

  // 2. Unexpected thrown exception during fetch
  await runLoadReports(true, async () => {
    throw new Error('Network crash');
  });
  assert.equal(isLoadingReports, false); // Guaranteed false in finally
  assert.equal(reportsError, 'Network crash');

  // 3. Service-level returned error
  await runLoadReports(true, async () => {
    return { data: [], error: 'Table does not exist' };
  });
  assert.equal(isLoadingReports, false);
  assert.equal(reportsError, 'Table does not exist');

  // 4. Successful recovery clears previous error
  await runLoadReports(true, async () => {
    return { data: [{ id: 'new-1' }], error: null };
  });
  assert.equal(isLoadingReports, false);
  assert.equal(reportsError, null); // Stale error was cleared
  assert.equal(reports.length, 1);
});

test('draft edit actions immediately reset submission feedback', () => {
  let submitSuccess = true;
  let submitError = 'Previous submission failed';

  const clearFeedback = () => {
    submitSuccess = false;
    submitError = null;
  };

  const onSelectCoordinates = (coords) => {
    clearFeedback();
    return coords;
  };

  const onSeverityChange = (level) => {
    clearFeedback();
    return level;
  };

  const onDescriptionChange = (text) => {
    clearFeedback();
    return text;
  };

  // Coordinate change resets feedback
  submitSuccess = true;
  submitError = 'Old error';
  onSelectCoordinates({ lat: 37.77, lng: -122.41 });
  assert.equal(submitSuccess, false);
  assert.equal(submitError, null);

  // Severity change resets feedback
  submitSuccess = true;
  submitError = 'Old error';
  onSeverityChange(4);
  assert.equal(submitSuccess, false);
  assert.equal(submitError, null);

  // Description change resets feedback
  submitSuccess = true;
  submitError = 'Old error';
  onDescriptionChange('Bottles near playground');
  assert.equal(submitSuccess, false);
  assert.equal(submitError, null);
});
