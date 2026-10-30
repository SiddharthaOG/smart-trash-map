import test from 'node:test';
import assert from 'node:assert/strict';
import { listReports, createReport } from './reportService.js';
import { setSupabaseClientForTesting } from '../../../lib/supabase.js';

// Clean test client reset before and after
test.beforeEach(() => {
  setSupabaseClientForTesting(null);
});

test.afterEach(() => {
  setSupabaseClientForTesting(null);
});

test('createReport validates and rejects invalid coordinates', async () => {
  const invalidDraft = {
    coordinates: { lat: 95.5, lng: -122.4 }, // lat > 90
    severity: 3,
    description: 'Broken bottles',
  };

  await assert.rejects(
    async () => {
      await createReport(invalidDraft);
    },
    (err) => {
      assert.equal(err.name, 'ValidationError');
      assert.ok(err.message.includes('coordinates'));
      return true;
    }
  );
});

test('createReport rejects invalid severity rating', async () => {
  const invalidDraft = {
    coordinates: { lat: 37.7749, lng: -122.4194 },
    severity: 6, // severity > 5
    description: 'Tires',
  };

  await assert.rejects(
    async () => {
      await createReport(invalidDraft);
    },
    (err) => {
      assert.equal(err.name, 'ValidationError');
      assert.ok(err.message.toLowerCase().includes('severity'));
      return true;
    }
  );
});

test('createReport rejects when Supabase is unconfigured', async () => {
  const validDraft = {
    coordinates: { lat: 37.7749, lng: -122.4194 },
    severity: 2,
    description: 'Curb trash',
  };

  // With no mock client and no env configured:
  await assert.rejects(
    async () => {
      await createReport(validDraft, { client: null });
    },
    (err) => {
      assert.equal(err.name, 'ConfigurationError');
      assert.ok(err.message.includes('unconfigured'));
      return true;
    }
  );
});

test('createReport correctly maps draft payload and handles successful database insert', async () => {
  const validDraft = {
    coordinates: { lat: 37.7749, lng: -122.4194 },
    severity: 4,
    description: '  Dumped mattress on sidewalk  ',
  };

  let capturedInsertPayload = null;

  const mockClient = {
    from(table) {
      assert.equal(table, 'trash_reports');
      return {
        insert(payload) {
          capturedInsertPayload = payload[0];
          return {
            select() {
              return {
                async single() {
                  return {
                    data: {
                      id: 'test-uuid-001',
                      ...capturedInsertPayload,
                      created_at: '2026-10-27T20:00:00Z',
                    },
                    error: null,
                  };
                },
              };
            },
          };
        },
      };
    },
  };

  setSupabaseClientForTesting(mockClient);

  const result = await createReport(validDraft, { client: mockClient });

  assert.equal(result.success, true);
  assert.equal(result.data.id, 'test-uuid-001');
  assert.equal(result.data.lat, 37.7749);
  assert.equal(result.data.lng, -122.4194);
  assert.equal(result.data.severity, 4);
  assert.equal(result.data.description, 'Dumped mattress on sidewalk'); // trimmed
  assert.equal(result.data.status, 'open'); // default status

  // Verify internal mapping
  assert.deepEqual(capturedInsertPayload, {
    lat: 37.7749,
    lng: -122.4194,
    severity: 4,
    description: 'Dumped mattress on sidewalk',
    status: 'open',
  });
});

test('createReport handles database error gracefully', async () => {
  const validDraft = {
    coordinates: { lat: 37.7749, lng: -122.4194 },
    severity: 3,
  };

  const mockClient = {
    from() {
      return {
        insert() {
          return {
            select() {
              return {
                async single() {
                  return {
                    data: null,
                    error: {
                      code: '23514',
                      message: 'check constraint violation',
                    },
                  };
                },
              };
            },
          };
        },
      };
    },
  };

  await assert.rejects(
    async () => {
      await createReport(validDraft, { client: mockClient });
    },
    (err) => {
      assert.equal(err.name, 'DatabaseError');
      assert.equal(err.code, '23514');
      assert.ok(err.message.includes('check constraint'));
      return true;
    }
  );
});

test('listReports returns missingConfig when credentials are not configured', async () => {
  const result = await listReports({ client: null });
  assert.equal(result.isConnected, false);
  assert.equal(result.missingConfig, true);
  assert.equal(result.data.length, 0);
  assert.ok(result.message.includes('not configured'));
});

test('listReports handles successful query and orders by created_at DESC', async () => {
  let selectCalled = false;
  let orderArgs = null;

  const mockReports = [
    {
      id: 'uuid-1',
      lat: 37.7749,
      lng: -122.4194,
      severity: 3,
      description: 'Litter item',
      status: 'open',
      created_at: '2026-10-27T19:00:00Z',
    },
    {
      id: 'uuid-2',
      lat: 37.7833,
      lng: -122.4167,
      severity: 1,
      description: 'Cup',
      status: 'open',
      created_at: '2026-10-27T18:00:00Z',
    },
  ];

  const mockClient = {
    from(table) {
      assert.equal(table, 'trash_reports');
      return {
        select(cols, opts) {
          selectCalled = true;
          assert.equal(opts.count, 'exact');
          return {
            order(col, options) {
              orderArgs = { col, options };
              return Promise.resolve({
                data: mockReports,
                error: null,
                count: 2,
              });
            },
          };
        },
      };
    },
  };

  setSupabaseClientForTesting(mockClient);

  const result = await listReports({ client: mockClient });

  assert.equal(selectCalled, true);
  assert.deepEqual(orderArgs, { col: 'created_at', options: { ascending: false } });
  assert.equal(result.isConnected, true);
  assert.equal(result.missingConfig, false);
  assert.equal(result.count, 2);
  assert.equal(result.data.length, 2);
  assert.equal(result.data[0].id, 'uuid-1');
});

test('listReports handles empty results and database query error gracefully', async () => {
  // Empty result
  const emptyClient = {
    from() {
      return {
        select() {
          return {
            order() {
              return Promise.resolve({ data: [], error: null, count: 0 });
            },
          };
        },
      };
    },
  };

  const emptyResult = await listReports({ client: emptyClient });
  assert.equal(emptyResult.isConnected, true);
  assert.equal(emptyResult.count, 0);
  assert.deepEqual(emptyResult.data, []);

  // Error result
  const errorClient = {
    from() {
      return {
        select() {
          return {
            order() {
              return Promise.resolve({
                data: null,
                error: { message: 'relation "trash_reports" does not exist' },
                count: null,
              });
            },
          };
        },
      };
    },
  };

  const errorResult = await listReports({ client: errorClient });
  assert.equal(errorResult.isConnected, false);
  assert.equal(errorResult.error, 'relation "trash_reports" does not exist');
  assert.deepEqual(errorResult.data, []);
});

test('listReports catches unexpected client exceptions and returns structured failure', async () => {
  const throwingClient = {
    from() {
      throw new Error('Supabase client socket closed unexpectedly');
    },
  };

  const result = await listReports({ client: throwingClient });
  assert.equal(result.isConnected, false);
  assert.equal(result.missingConfig, false);
  assert.equal(result.count, 0);
  assert.deepEqual(result.data, []);
  assert.equal(result.error, 'Supabase client socket closed unexpectedly');
});
