
<div align="center">

# 🗺️ Smart Trash Map

![React](https://img.shields.io/badge/React-18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Ready-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Google Maps](https://img.shields.io/badge/Google_Maps-API-4285F4?style=for-the-badge&logo=google-maps&logoColor=white)
![License](https://img.shields.io/badge/License-Apache--2.0-blue?style=for-the-badge)

*A community litter reporting and cleanup coordination web application designed to identify litter hotspots and direct civic environmental action.*

<img src="https://images.unsplash.com/photo-1532992918124-a6a0a7c6f8d2?w=800&h=300&fit=crop" alt="Smart Trash Map Banner" width="800" />

</div>

---

> Smart Trash Map is built with a feature-oriented, modular architecture designed to support a 5-milestone implementation plan without major refactoring.

---

<div align="center">

## 📊 Current Status: Milestone 1 (Project Foundation & UI)

![Status](https://img.shields.io/badge/Status-In_Progress-yellow?style=flat-square) ![Milestone](https://img.shields.io/badge/Milestone-1_of_5-blue?style=flat-square)

</div>

This repository currently implements **Milestone 1**:

- ✅ Complete responsive web interface adhering to a calm civic-tech visual identity (forest-green palette, high contrast, clean typography).
- ✅ Dominant interactive map workspace shell ready for `@vis.gl/react-google-maps`.
- ✅ Slide-out community report submission form with 1–5 severity rating and validation rules.
- ✅ Isolated data-access layer (`reportService.js`) and Supabase client boundary (`supabase.js`).
- ✅ Purposeful empty states and architectural schema preview.
- ✅ Deterministic unit tests covering validation and coordinate formatting.

---

## 🏗️ Architecture & Directory Structure

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

## 🔮 Architectural Boundaries & Future Extensions

<div align="center">

| Phase | Feature | Status |
|-------|---------|--------|
| 🗺️ Phase 2 | Google Maps Integration | ⏳ Pending |
| 🗄️ Phase 3 | Supabase Schema & Persistence | ⏳ Pending |
| ⚡ Phase 4 | Realtime Updates & Color-Coded Pins | ⏳ Pending |

</div>

### 1. Google Maps Integration (Phase 2)

- Mount `<APIProvider>` and `<Map>` from `@vis.gl/react-google-maps` inside `src/features/map/components/MapView.jsx`.
- Wire `onClick` on the map to `selectCoordinates({ lat, lng })` provided by `useMapSelection`.
- Connect `src/features/map/components/MapControls.jsx` buttons to the Google Maps map instance pan/zoom and `navigator.geolocation`.
- No modifications to the report form or database services are required.

### 2. Supabase Schema & Persistence (Phase 3)

- Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in environment.
- Initialize `createClient` in `src/lib/supabase.js`.
- Implement real queries in `src/features/reports/services/reportService.js` against the relational `trash_reports` table (`lat`, `lng`, `severity`, `status`, `description`).
- Presentation components in `src/features/reports/components/` remain completely unchanged.

### 3. Realtime Updates & Color-Coded Pins (Phase 4)

- Bind Supabase Realtime channel subscriptions inside `reportService.subscribeToReports`.
- Render reactive pins on `MapView` colored according to `SEVERITY_LEVELS[report.severity].hex`.

---

## 🚀 Getting Started

### Prerequisites

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)
![npm](https://img.shields.io/badge/npm-Latest-CB3837?style=flat-square&logo=npm&logoColor=white)

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

## 📄 License

This project is licensed under the **Apache-2.0** License.

![License](https://img.shields.io/badge/License-Apache--2.0-blue?style=for-the-badge)

---

<div align="center">

*Built for cleaner communities, one report at a time.* 🌍

</div>
