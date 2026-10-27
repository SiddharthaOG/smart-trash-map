/**
 * Supabase Client Boundary
 *
 * Single initialization boundary for Supabase data operations.
 * In Phase 3, this module initializes `@supabase/supabase-js` using config.supabase.
 * For Phase 1 (Foundation & UI), this module provides the contract and client accessor
 * without premature dependencies or unconfigured client crashes.
 */

import { config } from '../app/config.js';

let supabaseClientInstance = null;

/**
 * Returns true if Supabase credentials are configured in the environment.
 */
export function isSupabaseConfigured() {
  return config.supabase.isConfigured;
}

/**
 * Singleton client getter. In Phase 3, will instantiate createClient().
 * In Phase 1, returns null safely to prevent uncaught runtime errors.
 */
export function getSupabaseClient() {
  if (!config.supabase.isConfigured) {
    return null;
  }

  // Phase 3 integration hook:
  // if (!supabaseClientInstance) {
  //   const { createClient } = await import('@supabase/supabase-js');
  //   supabaseClientInstance = createClient(config.supabase.url, config.supabase.anonKey);
  // }

  return supabaseClientInstance;
}
