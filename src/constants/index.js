/**
 * Application Constants
 * Single source of truth for Smart Trash Map definitions, status values, and severity levels.
 */

export const APP_INFO = {
  name: 'Smart Trash Map',
  tagline: 'Community Litter Reporting',
  description: 'Identify litter hotspots and coordinate community cleanup efforts.',
  currentPhase: {
    number: 1,
    title: 'Project Foundation & UI',
    status: 'In Progress',
  },
};

export const REPORT_STATUS = Object.freeze({
  REPORTED: 'reported',
  IN_PROGRESS: 'in_progress',
  CLEANED: 'cleaned',
});

export const SEVERITY_MIN = 1;
export const SEVERITY_MAX = 5;

export const SEVERITY_LEVELS = Object.freeze({
  1: {
    level: 1,
    label: 'Very Minor',
    shortLabel: 'Level 1',
    description: 'Single isolated items (e.g., beverage cup, plastic wrapper, bottle)',
    dotColor: 'bg-emerald-500',
    borderColor: 'border-emerald-300',
    textColor: 'text-emerald-700',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    hex: '#10b981',
  },
  2: {
    level: 2,
    label: 'Minor',
    shortLabel: 'Level 2',
    description: 'Scattered debris along curb or walkway (e.g., cigarette butts, small cluster)',
    dotColor: 'bg-lime-500',
    borderColor: 'border-lime-300',
    textColor: 'text-lime-700',
    badgeBg: 'bg-lime-50 text-lime-800 border-lime-200',
    hex: '#84cc16',
  },
  3: {
    level: 3,
    label: 'Moderate',
    shortLabel: 'Level 3',
    description: 'Overflowing public bin, tied trash bag, or broken glass hazard',
    dotColor: 'bg-amber-500',
    borderColor: 'border-amber-300',
    textColor: 'text-amber-700',
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
    hex: '#f59e0b',
  },
  4: {
    level: 4,
    label: 'Substantial',
    shortLabel: 'Level 4',
    description: 'Multiple bags, dumped furniture, discarded tires, or large accumulation',
    dotColor: 'bg-orange-600',
    borderColor: 'border-orange-300',
    textColor: 'text-orange-700',
    badgeBg: 'bg-orange-50 text-orange-800 border-orange-200',
    hex: '#ea580c',
  },
  5: {
    level: 5,
    label: 'Severe Hazard',
    shortLabel: 'Level 5',
    description: 'Toxic, chemical, sharp debris, or severe blockage needing rapid response',
    dotColor: 'bg-rose-600',
    borderColor: 'border-rose-300',
    textColor: 'text-rose-700',
    badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
    hex: '#e11d48',
  },
});

export const ROADMAP_PHASES = Object.freeze([
  {
    phase: 1,
    title: 'Project Foundation & UI',
    description: 'Vite + React + Tailwind modular architecture, responsive map-first layout, and report form boundaries.',
    status: 'Current Milestone',
    active: true,
  },
  {
    phase: 2,
    title: 'Google Maps Integration',
    description: 'Mount @vis.gl/react-google-maps, geolocation anchoring, and click-to-capture coordinate handling.',
    status: 'Planned',
    active: false,
  },
  {
    phase: 3,
    title: 'Supabase Data Layer',
    description: 'Spin up Supabase DB, trash_reports schema (lat, lng, severity 1-5, status), and report persistence.',
    status: 'Planned',
    active: false,
  },
  {
    phase: 4,
    title: 'Realtime Dashboard & Polish',
    description: 'Live color-coded map pins, Supabase Realtime websocket subscriptions, and mobile polish.',
    status: 'Planned',
    active: false,
  },
  {
    phase: 5,
    title: 'Release Hardening',
    description: 'Performance optimization, accessibility audit, and deployment configuration.',
    status: 'Planned',
    active: false,
  },
]);
