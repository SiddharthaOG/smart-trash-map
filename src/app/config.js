/**
 * Application Configuration
 * Central boundary for environment variables and integration flags.
 */

const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {};

export const config = Object.freeze({
  app: {
    name: 'Smart Trash Map',
    version: '0.1.0-alpha',
    phase: 2,
    phaseName: 'Google Maps Integration',
    isProduction: Boolean(env.PROD),
  },
  maps: {
    apiKey: env.VITE_GOOGLE_MAPS_API_KEY || '',
    isConfigured: Boolean(env.VITE_GOOGLE_MAPS_API_KEY && env.VITE_GOOGLE_MAPS_API_KEY.length > 5),
    defaultCenter: {
      lat: 37.7749,
      lng: -122.4194,
    },
    defaultZoom: 13,
  },
  supabase: {
    url: env.VITE_SUPABASE_URL || '',
    anonKey: env.VITE_SUPABASE_ANON_KEY || '',
    isConfigured: Boolean(env.VITE_SUPABASE_URL && env.VITE_SUPABASE_ANON_KEY),
  },
});

export default config;
