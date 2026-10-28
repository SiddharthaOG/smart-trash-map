/**
 * Supabase Client Boundary
 *
 * Single initialization boundary for Supabase data operations.
 * Reads centralized configuration from config.supabase.
 * Fails gracefully when credentials are not configured in the environment.
 */

import { createClient } from '@supabase/supabase-js';
import { config } from '../app/config.js';

let supabaseClientInstance = null;

/**
 * Returns true if Supabase URL and Anon Key are present and valid in configuration.
 *
 * @returns {boolean}
 */
export function isSupabaseConfigured() {
  return Boolean(
    config.supabase.isConfigured &&
    config.supabase.url &&
    config.supabase.anonKey &&
    !config.supabase.url.includes('your-project')
  );
}

/**
 * Singleton client getter.
 * Initializes and returns the Supabase client instance if configured, or null otherwise.
 *
 * @returns {import('@supabase/supabase-js').SupabaseClient | null}
 */
export function getSupabaseClient() {
  if (!isSupabaseConfigured()) {
    return supabaseClientInstance; // may be null or mock client in test mode
  }

  if (!supabaseClientInstance) {
    supabaseClientInstance = createClient(
      config.supabase.url,
      config.supabase.anonKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );
  }

  return supabaseClientInstance;
}

/**
 * Overrides or resets the client instance for testing purposes.
 *
 * @param {any} [client] - Mock Supabase client or null to reset.
 */
export function setSupabaseClientForTesting(client = null) {
  supabaseClientInstance = client;
}

export default getSupabaseClient;
