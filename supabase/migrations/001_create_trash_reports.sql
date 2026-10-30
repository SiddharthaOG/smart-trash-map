-- =============================================================================
-- Migration: 001_create_trash_reports.sql
-- Project: Smart Trash Map
-- Milestone: M3 (Supabase Persistence)
-- Description: Creates the core trash_reports table, spatial/temporal indexes,
--              Row Level Security (RLS), and anonymous access policies.
-- =============================================================================

-- 1. Create trash_reports table
CREATE TABLE IF NOT EXISTS public.trash_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lat double precision NOT NULL CHECK (lat >= -90.0 AND lat <= 90.0),
  lng double precision NOT NULL CHECK (lng >= -180.0 AND lng <= 180.0),
  severity smallint NOT NULL CHECK (severity >= 1 AND severity <= 5),
  description text CHECK (description IS NULL OR char_length(description) <= 280),
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'reported', 'in_progress', 'cleaned')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Indexes for efficient feed ordering and geographic bounding queries
CREATE INDEX IF NOT EXISTS idx_trash_reports_created_at
  ON public.trash_reports (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_trash_reports_status
  ON public.trash_reports (status);

CREATE INDEX IF NOT EXISTS idx_trash_reports_coords
  ON public.trash_reports (lat, lng);

-- 3. Row Level Security (RLS)
ALTER TABLE public.trash_reports ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policy: Allow public read access to all reports
-- Enables anonymous community members and volunteers to inspect hotspot data.
DROP POLICY IF EXISTS "Allow public read access to trash reports" ON public.trash_reports;
CREATE POLICY "Allow public read access to trash reports"
  ON public.trash_reports
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- 5. RLS Policy: Allow anonymous report creation
-- Enables friction-free anonymous reporting without requiring account registration.
-- Security Note: Status is forced to 'open' on creation.
-- Abuse Risk Note: Permitting anonymous INSERTs opens potential spam risks.
-- For production hardening, apply Cloudflare Turnstile or Supabase Edge Function
-- rate-limiting (e.g., maximum 5 reports per IP per hour).
DROP POLICY IF EXISTS "Allow anonymous report creation" ON public.trash_reports;
CREATE POLICY "Allow anonymous report creation"
  ON public.trash_reports
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    status = 'open'
    AND severity >= 1 AND severity <= 5
    AND lat >= -90.0 AND lat <= 90.0
    AND lng >= -180.0 AND lng <= 180.0
  );


-- 6. Explicit Table Privileges for Supabase PostgREST Layer
-- PostgREST needs table privileges in addition to RLS policies.
-- Public clients may read reports and create new reports only.
-- Explicitly revoke UPDATE and DELETE so pre-existing grants do not
-- unintentionally permit these operations for the client-facing roles.
-- Administrative modifications must use a trusted, server-side path.

REVOKE UPDATE, DELETE ON TABLE public.trash_reports FROM anon, authenticated;

GRANT SELECT, INSERT ON TABLE public.trash_reports TO anon, authenticated;
