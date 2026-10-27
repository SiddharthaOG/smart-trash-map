/**
 * Report Data Access Service
 *
 * Encapsulates all read, write, and realtime subscription operations for litter reports.
 * Presentation components consume this service instead of interacting with Supabase directly.
 *
 * In Phase 3 (Supabase Integration), these methods will perform real table queries:
 * - listReports -> supabase.from('trash_reports').select('*').order('created_at', { ascending: false })
 * - createReport -> supabase.from('trash_reports').insert([payload])
 * - subscribeReports -> supabase.channel('trash_reports_changes').on(...)
 */

import { getSupabaseClient, isSupabaseConfigured } from '../../../lib/supabase.js';

/**
 * Fetches all community litter reports.
 * In Phase 1: Returns empty dataset with milestone metadata. No fake data.
 *
 * @returns {Promise<{ data: Array, count: number, isConnected: boolean, phaseNotice: string }>}
 */
export async function listReports() {
  const client = getSupabaseClient();

  if (!client || !isSupabaseConfigured()) {
    return {
      data: [],
      count: 0,
      isConnected: false,
      phaseNotice: 'Database synchronization unlocks in Phase 3 with Supabase integration.',
    };
  }

  return { data: [], count: 0, isConnected: false, phaseNotice: '' };
}

/**
 * Submits a new litter report.
 * In Phase 1: Explicitly rejects mock persistence so the UI cannot falsely claim success.
 *
 * @param {{ coordinates: { lat: number, lng: number }, severity: number, description?: string }} reportData
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function createReport(reportData) {
  const client = getSupabaseClient();

  if (!client || !isSupabaseConfigured()) {
    throw new Error(
      'Persistence is not available in Phase 1. Backend database connection will be established in Phase 3.'
    );
  }

  return { success: false, message: 'Unconfigured' };
}

/**
 * Subscribes to realtime updates for reports.
 * In Phase 1: Returns a no-op unsubscribe function.
 *
 * @param {(payload: any) => void} _onUpdate
 * @returns {() => void} unsubscribe function
 */
export function subscribeToReports(_onUpdate) {
  return () => {};
}
