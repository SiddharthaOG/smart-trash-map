/**
 * Report Data Access Service
 *
 * Encapsulates all read and write persistence operations for litter reports.
 * Presentation components consume this service instead of interacting with Supabase directly.
 *
 * M3 Implementation:
 * - listReports: Fetches live reports from `trash_reports` ordered by `created_at DESC`.
 * - createReport: Validates payload and inserts real record into `trash_reports`.
 * - Handles missing configuration, validation failures, and database errors transparently.
 */

import { getSupabaseClient, isSupabaseConfigured } from '../../../lib/supabase.js';
import { validateReportDraft } from '../validation.js';

/**
 * Fetches community litter reports from Supabase.
 *
 * @param {object} [options]
 * @param {import('@supabase/supabase-js').SupabaseClient} [options.client] - Optional client for dependency injection in tests
 * @returns {Promise<{
 *   data: Array<object>,
 *   count: number,
 *   isConnected: boolean,
 *   missingConfig: boolean,
 *   error: string | null,
 *   message?: string
 * }>}
 */
export async function listReports(options = {}) {
  const client = options.client !== undefined ? options.client : getSupabaseClient();
  const isConfigured = Boolean(options.client || isSupabaseConfigured());

  if (!isConfigured || !client) {
    return {
      data: [],
      count: 0,
      isConnected: false,
      missingConfig: true,
      error: null,
      message: 'Supabase credentials are not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to load live reports.',
    };
  }

  try {
    const { data, error, count } = await client
      .from('trash_reports')
      .select('id, lat, lng, severity, description, status, created_at', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (error) {
      return {
        data: [],
        count: 0,
        isConnected: false,
        missingConfig: false,
        error: error.message || 'Database read error.',
      };
    }

    return {
      data: data || [],
      count: count ?? (data?.length || 0),
      isConnected: true,
      missingConfig: false,
      error: null,
    };
  } catch (err) {
    return {
      data: [],
      count: 0,
      isConnected: false,
      missingConfig: false,
      error: err.message || 'Network failure when connecting to Supabase.',
    };
  }
}

/**
 * Validates and submits a new litter report to Supabase.
 *
 * @param {{
 *   coordinates: { lat: number, lng: number },
 *   severity: number,
 *   description?: string
 * }} reportData
 * @param {object} [options]
 * @param {import('@supabase/supabase-js').SupabaseClient} [options.client] - Optional client for dependency injection
 * @returns {Promise<{ success: boolean, data: object }>}
 */
export async function createReport(reportData, options = {}) {
  // 1. Validate payload before network request
  const validation = validateReportDraft(reportData);
  if (!validation.isValid) {
    const errorDetails = Object.values(validation.errors).join(', ');
    const err = new Error(`Report validation failed: ${errorDetails}`);
    err.name = 'ValidationError';
    err.errors = validation.errors;
    throw err;
  }

  // 2. Check client configuration
  const client = options.client !== undefined ? options.client : getSupabaseClient();
  const isConfigured = Boolean(options.client || isSupabaseConfigured());

  if (!isConfigured || !client) {
    const err = new Error(
      'Supabase persistence is unconfigured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.'
    );
    err.name = 'ConfigurationError';
    throw err;
  }

  // 3. Map draft state to PostgreSQL schema columns
  const payload = {
    lat: Number(reportData.coordinates.lat),
    lng: Number(reportData.coordinates.lng),
    severity: Number(reportData.severity),
    description: reportData.description?.trim() || null,
    status: 'open',
  };

  // 4. Perform Supabase database insert
  try {
    const { data, error } = await client
      .from('trash_reports')
      .insert([payload])
      .select()
      .single();

    if (error) {
      const dbErr = new Error(error.message || 'Database insert failed.');
      dbErr.name = 'DatabaseError';
      dbErr.code = error.code;
      throw dbErr;
    }

    return { success: true, data };
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'ConfigurationError' || err.name === 'DatabaseError') {
      throw err;
    }
    const netErr = new Error(err.message || 'Network connection failed during report submission.');
    netErr.name = 'NetworkError';
    throw netErr;
  }
}

/**
 * Subscribes to realtime updates for reports.
 * Scheduled for Milestone 4 (Realtime Dashboard).
 *
 * @param {(payload: any) => void} _onUpdate
 * @returns {() => void} unsubscribe function
 */
export function subscribeToReports(_onUpdate) {
  return () => {};
}
