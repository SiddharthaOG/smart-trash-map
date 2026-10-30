<div align="center">

# 🗺️ Smart Trash Map

![React](https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Google Maps](https://img.shields.io/badge/Google_Maps-API-4285F4?style=for-the-badge&logo=google-maps&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![License](https://img.shields.io/badge/License-Apache--2.0-blue?style=for-the-badge)

*A community litter reporting and cleanup coordination web application designed to identify litter hotspots and direct civic environmental action.*

</div>

---

## 📊 Milestone Status & Roadmap

| Milestone | Scope | Status | Notes |
| :--- | :--- | :---: | :--- |
| **M1: Foundation & UI** | Modular architecture, responsive civic-tech UI, report draft & validation rules | ✅ **Completed** | Merged into `main` via PR #1 |
| **M2: Google Maps Integration** | Live `@vis.gl/react-google-maps`, `AdvancedMarker`, controls, and click-to-pin coordinate capture | ✅ **Completed** | Merged into `main` via PR #2 |
| **M3: Supabase Persistence** | PostgreSQL schema, Row Level Security (RLS), `reportService`, real submissions & live community feed | ✅ **Completed** | Implemented on `feat/m3-supabase-persistence` |
| **M4: Realtime Dashboard** | Live color-coded map pins, Supabase Realtime channel subscriptions (`postgres_changes`) | ⏳ *Upcoming* | **Not implemented yet** (stubbed boundary ready in `reportService.js`) |
| **M5: Release Hardening** | PWA offline capability, rate limiting, and production optimization | ⏳ *Upcoming* | Scheduled after M4 |

---

## 💻 Tech Stack

- **Framework**: React 19 SPA with Vite bundler
- **Styling**: Tailwind CSS 4 with a civic-tech forest-green palette
- **Mapping**: `@vis.gl/react-google-maps` with Google Maps JavaScript API, vector maps, and `AdvancedMarkerElement`
- **Database & Backend**: Supabase (`@supabase/supabase-js`) backed by PostgreSQL with Row Level Security (RLS)
- **Icons**: Lucide React
- **Testing**: Node.js native test runner (`node:test`, `node:assert/strict`) via `tsx`
- **TypeScript**: Strict typechecking via `tsc --noEmit`

---

## 🏗️ Architecture & Project Structure

The project uses a feature-oriented, modular architecture with clear boundary isolation between UI presentation, map rendering, and data access.

```text
smart-trash-map/
├── .env.example                                      # Template for environment variables
├── .gitignore                                        # Excludes build artifacts, secrets, and temp files
├── index.html                                        # HTML entry point with metadata
├── metadata.json                                     # Applet metadata
├── package.json                                      # Project dependencies and npm scripts
├── tsconfig.json                                     # TypeScript configuration
├── vite.config.ts                                    # Vite build configuration with Tailwind plugin
├── supabase/
│   └── migrations/
│       └── 001_create_trash_reports.sql             # PostgreSQL schema, indexes, and RLS policies
└── src/
    ├── app/
    │   ├── App.jsx                                   # Shell orchestration: bridges map selection, report draft & DB
    │   └── config.js                                 # Centralized environment variable & configuration boundary
    ├── components/
    │   ├── layout/
    │   │   ├── AppHeader.jsx                         # Civic-tech header, branding, milestone badge, download action
    │   │   └── AppLayout.jsx                         # Responsive desktop split and mobile sliding drawer layout
    │   └── ui/
    │       ├── Badge.jsx                             # Status and severity badges
    │       ├── Button.jsx                            # Accessible buttons with variants and icons
    │       ├── Card.jsx                              # Standardized container cards
    │       └── StatusBanner.jsx                      # Milestone status notices
    ├── features/
    │   ├── map/
    │   │   ├── components/
    │   │   │   ├── MapView.jsx                       # Google Map canvas, click-to-pin, AdvancedMarker, legend
    │   │   │   └── MapControls.jsx                   # Geolocation anchor, zoom in/out, and layer toggle
    │   │   ├── hooks/
    │   │   │   └── useMapSelection.js                # Viewport center and coordinate selection hook
    │   │   └── index.js                              # Public API boundary for map feature
    │   └── reports/
    │       ├── components/
    │       │   ├── ReportForm.jsx                    # Slide-out report form with real submission & loading states
    │       │   ├── SeveritySelector.jsx              # 1–5 severity rating scale with descriptions
    │       │   └── ReportSummary.jsx                 # Live feed, PostgreSQL data contract tab, and milestones
    │       ├── hooks/
    │       │   └── useReportDraft.js                 # Draft state lifecycle and validation hook
    │       ├── services/
    │       │   ├── reportService.js                  # Data-access layer for Supabase queries & inserts
    │       │   └── reportService.test.js             # Automated tests with mock client dependency injection
    │       ├── constants.js                          # Form constraints and severity metadata
    │       ├── validation.js                         # Pure coordinate and severity validation functions
    │       ├── validation.test.js                    # Unit tests for pure validation logic
    │       └── index.js                              # Public API boundary for reports
    ├── lib/
    │   └── supabase.js                               # Singleton Supabase client with graceful degradation
    ├── constants/
    │   └── index.js                                  # Global constants, severity definitions, and roadmap phases
    ├── styles/
    │   └── index.css                                 # Tailwind CSS 4 imports and typography
    └── main.jsx                                      # Application root mounting App with quota listener
```

---

## ⚙️ Environment Configuration

1. Copy `.env.example` to create your local `.env` file:
   ```bash
   cp .env.example .env
   ```
2. Configure the required environment variables:
   ```bash
   # Google Maps Platform JavaScript API Key (required for live interactive map & AdvancedMarker)
   VITE_GOOGLE_MAPS_API_KEY="AIzaSyYourGoogleMapsApiKeyHere"

   # Supabase Project Configuration (Milestone 3: PostgreSQL persistence for trash reports)
   # Found in Supabase Dashboard -> Project Settings -> API
   VITE_SUPABASE_URL="https://your-project-id.supabase.co"

   # Supabase Anon Key (Public Key Safe for Browser Use)
   # Found in Supabase Dashboard -> Project Settings -> API -> Project API Keys -> anon / public
   VITE_SUPABASE_ANON_KEY="your-anon-public-key-here"
   ```

> 🔒 **Security Notice**: Never commit `.env` or use the privileged `service_role` secret key in frontend code. Only use the public `anon` key.

---

## 🗄️ Database Setup & SQL Migration

The application includes a version-controlled SQL migration at `supabase/migrations/001_create_trash_reports.sql`.

### Table Schema (`public.trash_reports`)

| Column | Type | Constraints & Defaults | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Unique report identifier |
| `lat` | `double precision` | `NOT NULL CHECK (lat >= -90.0 AND lat <= 90.0)` | Geographic latitude |
| `lng` | `double precision` | `NOT NULL CHECK (lng >= -180.0 AND lng <= 180.0)` | Geographic longitude |
| `severity` | `smallint` | `NOT NULL CHECK (severity >= 1 AND severity <= 5)` | Litter severity level |
| `description` | `text` | `CHECK (char_length(description) <= 280)` | Optional details |
| `status` | `text` | `NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'reported', 'in_progress', 'cleaned'))` | Cleanup lifecycle status |
| `created_at` | `timestamptz` | `NOT NULL DEFAULT now()` | Server generation timestamp |

### Indexes
- `idx_trash_reports_created_at` on `created_at DESC` (efficient chronological feed sorting)
- `idx_trash_reports_status` on `status` (filtering by status)
- `idx_trash_reports_coords` on `(lat, lng)` (spatial coordinate queries)

### Row Level Security (RLS) Policies
- **Public Read (`SELECT`)**: Granted to `anon` and `authenticated` roles (`USING (true)`). Community members can view all reported hotspots.
- **Anonymous Insert (`INSERT`)**: Granted to `anon` and `authenticated` roles with strict `WITH CHECK` enforcing `status = 'open'` and valid coordinates and severity rating.
- **Modifications Restricted**: No `UPDATE` or `DELETE` policies are granted to `anon`. Updates require administrative role or service-role credentials.
- **Abuse Risk Mitigation**: Anonymous reporting removes friction for civic users. For production deployments with high public exposure, rate-limiting (e.g. Supabase Edge Functions with IP throttling or Cloudflare Turnstile) can be added to prevent spam.

### How to Apply the Migration in Supabase
1. Open your [Supabase Dashboard](https://supabase.com/dashboard) and select your project.
2. In the left navigation, click on the **SQL Editor** icon.
3. Open `supabase/migrations/001_create_trash_reports.sql` from this repository.
4. Paste the SQL script into the editor and click **Run**.
5. Check the **Table Editor** to confirm `trash_reports` is created with RLS enabled and 2 active policies.

---

## 🔄 Data Operations & UI Integration

- **Report Submission (`ReportForm.jsx`)**:
  - The submit button is locked until a user drops a pin on the map.
  - When submitting, an active spinner (`Submitting...`) prevents accidental duplicate inserts.
  - Transparent error banners display constraint or network issues if an insert fails.
  - On success, the form draft resets, the dropped pin clears, and the live community feed refreshes immediately.
- **Community Feed (`ReportSummary.jsx`)**:
  - Fetches real reports from Supabase ordered chronologically (`created_at DESC`).
  - Displays color-coded severity indicators (Level 1–5), exact geographic coordinates, optional descriptions, and formatted timestamps.
  - Displays an honest configuration banner when `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` are not set, and a clean empty state when no reports have been filed yet.
- **Graceful Degradation (`src/lib/supabase.js` & `reportService.js`)**:
  - If Supabase environment variables are missing, the application remains fully functional: the Google Map, pin placement, coordinate formatting, and UI controls operate normally, while persistence features clearly state they are awaiting configuration.
- **Realtime Scope**:
  - **M4 Realtime subscriptions (`supabase.channel`) are not yet implemented.** Realtime synchronization and reactive color-coded pins across the map canvas will be delivered in Milestone M4. Currently, the feed refreshes upon report submission and manual "Refresh" button click.

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm, pnpm, or bun

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/SiddharthaOG/smart-trash-map.git
cd smart-trash-map
npm install
```

### 2. Configure Environment Variables
```bash
cp .env.example .env
# Open .env and add your VITE_GOOGLE_MAPS_API_KEY, VITE_SUPABASE_URL, and VITE_SUPABASE_ANON_KEY
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Verification

### Run Unit Tests
```bash
npm test
```
Executes 17 automated unit tests using Node's native test runner (`node:test` via `tsx`):
- `validation.test.js`: Validates severity ranges (1–5), geographic coordinate bounds, coordinate string formatting, and draft completeness.
- `reportService.test.js`: Tests payload column mapping, coordinate and severity rejection, unconfigured environment handling, mock Supabase insertion, database constraint error handling, and feed chronological ordering.
- `AppFeedback.test.js`: Tests `loadReports` state resets and draft edit feedback clearing.

### Lint & Typecheck
```bash
npm run lint
```
Runs `tsc --noEmit` across all project files.

### Production Build
```bash
npm run build
```
Builds the client application bundle with Vite into `dist/`.

---

## 📄 License

This project is licensed under the **Apache-2.0** License.