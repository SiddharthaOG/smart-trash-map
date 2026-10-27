# Smart Trash Map

> A community litter reporting and cleanup coordination web application designed to identify litter hotspots and direct civic environmental action.

Smart Trash Map is built with a feature-oriented, modular architecture designed to support a 5-milestone implementation plan without major refactoring.

---

## Current Status: Milestone 1 (Project Foundation & UI)

This repository currently implements **Milestone 1**:
- Complete responsive web interface adhering to a calm civic-tech visual identity (forest-green palette, high contrast, clean typography).
- Dominant interactive map workspace shell ready for `@vis.gl/react-google-maps`.
- Slide-out community report submission form with 1–5 severity rating and validation rules.
- Isolated data-access layer (`reportService.js`) and Supabase client boundary (`supabase.js`).
- Purposeful empty states and architectural schema preview.
- Deterministic unit tests covering validation and coordinate formatting.

---

## Architecture & Directory Structure

```text
src/
├── app/
│   ├── App.jsx             # Shell orchestration layer (composes features, no direct DB/map APIs)
│   └── config.js           # Centralized environment variable & configuration boundary
├── components/
│   ├── layout/
│   │   ├── AppHeader.jsx   # Product identity, branding, and primary "Report Litter" action
│   │   └── AppLayout.jsx   # Responsive desktop split & mobile sliding bottom-sheet layout
│   └── ui/
│       ├── Badge.jsx       # Semantic status and severity badges
│       ├── Button.jsx      # Accessible action buttons with variants and focus rings
│       ├── Card.jsx        # Standardized container panels
│       └── StatusBanner.jsx# Milestone information and architectural status notices
├── features/
│   ├── map/
│   │   ├── components/
│   │   │   ├── MapView.jsx      # Dominant map viewport, schematic grid, and legend
│   │   │   └── MapControls.jsx  # Geolocation, zoom, and layer controls (Phase 2 hooks)
│   │   ├── hooks/
│   │   │   └── useMapSelection.js # Viewport center and coordinate selection state
│   │   └── index.js             # Public API boundary for the map feature
│   └── reports/
│       ├── components/
│       │   ├── ReportForm.jsx       # Litter report form with validation and locked submit
│       │   ├── SeveritySelector.jsx # Accessible 1–5 rating scale with descriptions
│       │   └── ReportSummary.jsx    # Feed empty state, relational schema, and milestones
│       ├── hooks/
│       │   └── useReportDraft.js    # Draft state lifecycle and validation hook
│       ├── services/
│       │   └── reportService.js     # Data-access layer for Supabase queries & inserts
│       ├── constants.js             # Form limits and severity re-exports
│       ├── validation.js            # Pure validation and coordinate formatting functions
│       ├── validation.test.js       # Fast-feedback unit tests via node:test runner
│       └── index.js                 # Public API boundary for the reports feature
├── lib/
│   └── supabase.js         # Singleton Supabase client initialization boundary
├── constants/
│   └── index.js            # Single source of truth for severity definitions and statuses
├── styles/
│   └── index.css           # Tailwind CSS imports and theme typography
└── main.jsx                # Application root mounting App
```

---

## Architectural Boundaries & Future Extensions

1. **Google Maps Integration (Phase 2)**:
   - Mount `<APIProvider>` and `<Map>` from `@vis.gl/react-google-maps` inside `src/features/map/components/MapView.jsx`.
   - Wire `onClick` on the map to `selectCoordinates({ lat, lng })` provided by `useMapSelection`.
   - Connect `src/features/map/components/MapControls.jsx` buttons to the Google Maps map instance pan/zoom and `navigator.geolocation`.
   - No modifications to the report form or database services are required.

2. **Supabase Schema & Persistence (Phase 3)**:
   - Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in environment.
   - Initialize `createClient` in `src/lib/supabase.js`.
   - Implement real queries in `src/features/reports/services/reportService.js` against the relational `trash_reports` table (`lat`, `lng`, `severity`, `status`, `description`).
   - Presentation components in `src/features/reports/components/` remain completely unchanged.

3. **Realtime Updates & Color-Coded Pins (Phase 4)**:
   - Bind Supabase Realtime channel subscriptions inside `reportService.subscribeToReports`.
   - Render reactive pins on `MapView` colored according to `SEVERITY_LEVELS[report.severity].hex`.

---

## Getting Started

### Prerequisites

- Node.js 18+ (or compatible runtime)
- npm / pnpm / bun

### Installation

```bash
npm install
```

### Development Server

Start Vite development server on port 3000:

```bash
npm run dev
```

### Unit Tests

Run the pure logic validation test suite using Node's test runner:

```bash
npm test
# or directly:
npx tsx --test src/features/reports/validation.test.js
```

### Production Build

Verify the production build:

```bash
npm run build
```

---

## License

Apache-2.0
