# HeatX Frontend — Project Context & Handoff Summary

> **Use this file as the primary briefing document when starting a new session on another device.**

---

## 1. Project Overview

- **Project Name**: HeatX — Extreme Heatwave Early Warning & Hyperlocal Human Thermal Stress Index
- **Challenge**: Smart India Hackathon (SIH 2026) · Problem ID: 26083
- **Stakeholders**: Ministry of Earth Sciences (MoES) / NCMRWF / Odisha State Disaster Management Authority (OSDMA)
- **Target Area**: Odisha State (30 Districts · GADM Level 3 Administrative Blocks)
- **Codebase Path**: `/Users/rishabh/Desktop/HeatSyncSIHfrontend`
- **Tech Stack**:
  - **Framework**: React 18 + Vite (ES Modules, fast HMR)
  - **Routing**: `react-router-dom` v6
  - **Visualizations**: `recharts` (custom uncertainty area ribbons & line charts) + Custom SVG Geo Vector Engine
  - **Styling**: Pure Modern CSS3 with Refractive Glassmorphism (`backdrop-filter`, specular rim lighting, multi-spectral atmospheric background orbs)
  - **Icons**: Unicode & SVG icons (zero broken third-party font dependencies)

---

## 2. How to Run the Project

```bash
# 1. Navigate to directory
cd /Users/rishabh/Desktop/HeatSyncSIHfrontend

# 2. Install dependencies (if fresh clone)
npm install

# 3. Start development server
npm run dev
# -> Runs on http://localhost:3000/

# 4. Production build check
npm run build
# -> Compiles in ~3 seconds into dist/ with zero errors
```

---

## 3. Visual & Design System

- **Color Palette**:
  - Background: Deep Forest Earth-Green (`#050e05` base, `#081808` surface)
  - Accent / Primary: Emerald Green (`#27AE60`, `#2ecc71`)
  - 5-Tier Alert Palette:
    - 🟢 Low / Normal (`#27AE60`)
    - 🟡 Elevated / Caution (`#F1C40F`)
    - 🟠 High / Caution (`#E67E22`)
    - 🔴 Very High / Danger (`#E74C3C` / `#C0392B`)
    - 🟣 Extreme Danger (`#7D3C98`)
- **Optical Refraction Glassmorphism**:
  - Atmospheric living background with 4 large floating luminous light pools (emerald, cyan, amber, forest) + cyber topographical contour grid (`64px x 64px`).
  - As the page is scrolled, the light pools and grid lines visibly refract and illuminate through the front tiles.
  - Front tiles (`.glass-tile`, `.glass-card`) feature `backdrop-filter: blur(28px) saturate(210%) contrast(108%)` with specular top rim highlight (`border-top: 1.5px solid rgba(255, 255, 255, 0.38)`).
  - Upper navigation bar (`Navbar.jsx`) is a floating glass capsule with center nav pill tab that refracts whatever content scrolls beneath it.

---

## 4. Implemented Architecture & Pages

| Route | Component | Key Features & Implementation Details |
| :--- | :--- | :--- |
| `/` | `LandingPage.jsx` | Concept design with atmospheric digital twin globe, top-right floating weather status pill (`Bhubaneswar 32°C Partly Cloudy \| AQI 42 Good \| Live Data Connected`), 7 floating glass feature cards, and bottom telemetry stats bar. |
| `/dashboard` | `GISDashboard.jsx` | Interactive SVG Odisha Map with 20 geo-projected block centroids, Bay of Bengal coastline, Layer Switcher (WBGT Proxy, Dry-Bulb Tmax, CAMS PM2.5, MODIS LST), Forecast Horizon (T+1, T+3, T+5), 30 districts filter, Top 5 High-Risk Blocks ranking, and a 5-tab **Block Inspection Modal** with provenance metadata. |
| `/forecast` | `ForecastingPage.jsx` | Multi-horizon predictive intelligence based on LightGBM & Temporal Fusion Transformer (TFT). Quantile spreads (P10, P50, P90), heatwave onset probability meter, and interactive **Recharts uncertainty ribbon chart** with IMD danger thresholds. |
| `/air-quality` | `AQIPage.jsx` | Copernicus CAMS atmospheric chemistry reanalysis (PM2.5, PM10, O3, NO2, SO2) with mandatory `INHERITED_FROM_DISTRICT` badge. **NH3 100% NaN permanent exclusion notice** (zero synthetic data). Compound Heat + Air Pollution flag (WBGT ≥ 29.4°C + PM2.5 ≥ 60 µg/m³). 30-day trend chart. |
| `/alerts` | `AlertCentrePage.jsx` | Disaster Management Center with active warning feed. **Citizen Layman ↔ Analyst Technical dual-mode toggle** (layman provides "Why is it dangerous?", "Who is at risk?", and 5 action steps; technical provides biophysical indices & DISCOM/hospital trigger matrices). Raw **OASIS / ITU-T CAP v1.2 XML** preview with 1-click clipboard copy. |
| `/api-explorer` | `APIExplorerPage.jsx` | Interactive developer console for 5 REST endpoints (`/forecast`, `/thermal`, `/impact`, `/alerts`, `/summary`) with parameter selector, execution button, and syntax-highlighted JSON viewer. |
| `/about` | `AboutPage.jsx` | Scientific methodology & integrity manual. Core biophysical axiom ($T_{\text{db}} \neq \text{Strain} \neq \text{Exposure}$), mathematical formulas (Stull WBGT, UTCI linear proxy, Rothfusz HI), master data lineage table, interactive accordion for all **13 Scientific Integrity Rules**, and 13 academic citations. |

---

## 5. File Structure Reference

```
HeatSyncSIHfrontend/
├── PROJECT_SUMMARY.md            # This handoff briefing file
├── index.html                    # Root HTML with Google Fonts
├── package.json                  # Dependencies & scripts
├── vite.config.js                # Vite configuration (port 3000)
├── public/
│   └── heatx-icon.svg            # SVG favicon
└── src/
    ├── main.jsx                  # React DOM entry
    ├── App.jsx                   # React Router v6 configuration
    ├── styles/
    │   └── globals.css           # Glassmorphism tokens, refraction, typography, animations
    ├── context/
    │   ├── BlockContext.jsx      # Global block selection, layer, horizon, district filters
    │   └── ThemeContext.jsx      # Technical vs Layman dual-mode state
    ├── data/
    │   ├── mockBlocks.js         # 20 authentic Odisha blocks with full HeatX thermal profile schema
    │   ├── mockForecasts.js      # T+1, T+3, T+5 quantile predictions & 14-day history
    │   └── mockAlerts.js         # Active civil protection alerts with CAP v1.2 XML payloads
    ├── utils/
    │   ├── thermalEngine.js      # Stull wet-bulb, energy-balance globe, WBGT, UTCI proxy, Rothfusz HI
    │   ├── provenanceTags.js     # Data lineage badge definitions (OBSERVED, MODELLED, PROXY, BLOCKED, etc.)
    │   └── tierUtils.js          # 5-tier alert color tokens, thresholds, and classification logic
    ├── components/
    │   ├── layout/
    │   │   ├── SharedLayout.jsx  # Atmospheric living background + layout shell
    │   │   ├── Navbar.jsx        # Floating refractive glass navigation bar with capsule tab
    │   │   ├── Footer.jsx        # Footer with links, data sources, and scientific integrity note
    │   │   └── SocialSidebar.jsx # Left floating vertical social links
    │   └── ui/
    │       ├── TierBadge.jsx       # Alert tier pills with icons
    │       ├── ProvenanceBadge.jsx # Metadata lineage tags with hover tooltips
    │       ├── Gauge.jsx           # SVG biophysical circular gauge
    │       ├── StatCard.jsx        # Metric cards with trend arrows
    │       ├── Toggle.jsx          # Sliding switch for mode toggle
    │       ├── DataRow.jsx         # Modal audit key-value row with inline tags
    │       └── SectionHeader.jsx   # Section heading with gradient accents
    └── pages/
        ├── LandingPage.jsx       # Home / Hero / Concept tiles
        ├── GISDashboard.jsx      # SVG Odisha Map + Block Audit Modal
        ├── ForecastingPage.jsx   # AI forecast ribbon chart & quantile cards
        ├── AQIPage.jsx           # Air quality & compound stress
        ├── AlertCentrePage.jsx   # Dual-mode warning feed & CAP XML
        ├── APIExplorerPage.jsx   # REST API testing console
        └── AboutPage.jsx         # Methodology & 13 Integrity Rules
```

---

## 6. Core Scientific & Architectural Rules (Never Violate)

1. **Explicit Proxies**: WBGT and UTCI must always be labeled as `PROXY / APPROXIMATION`. Never call them official sensor observations.
2. **Zero Clinical Fabrication**: Hospital admissions and heatstroke death counts are **strictly BLOCKED** until authoritative state health department registers are integrated. Never generate synthetic mortality figures.
3. **Inheritance Transparency**: Air quality features inherited from district centroids are tagged `INHERITED_FROM_DISTRICT`.
4. **No NaN Invention**: Ammonia (NH3) was 100% NaN in source APIs and is permanently excluded, never fabricated.
5. **Decoupled Physical vs Socio-Economic**: Environmental thermal hazard is clearly separated from demographic exposure and health vulnerability.
