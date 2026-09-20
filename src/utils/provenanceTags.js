/**
 * provenanceTags.js
 * HeatX Data Provenance Tagging System
 */

// ---------------------------------------------------------------------------
// Provenance tag definitions
// ---------------------------------------------------------------------------

export const PROVENANCE_TAGS = {
  OBSERVED: {
    label:       "Observed",
    color:       "#27AE60",
    bgColor:     "rgba(39, 174, 96, 0.15)",
    description: "Directly measured from a physical sensor or ground station.",
  },
  MODELLED: {
    label:       "Modelled",
    color:       "#2980B9",
    bgColor:     "rgba(41, 128, 185, 0.15)",
    description: "Output from a numerical weather prediction (NWP) or climate model.",
  },
  DERIVED: {
    label:       "Derived",
    color:       "#8E44AD",
    bgColor:     "rgba(142, 68, 173, 0.15)",
    description: "Calculated from one or more other fields using a deterministic formula.",
  },
  PROXY: {
    label:       "Proxy",
    color:       "#16A085",
    bgColor:     "rgba(22, 160, 133, 0.15)",
    description: "Estimated from a surrogate variable or indirect measurement (e.g. LST -> Tdb).",
  },
  RULE_DERIVED: {
    label:       "Rule-Derived",
    color:       "#D35400",
    bgColor:     "rgba(211, 84, 0, 0.15)",
    description: "Assigned by a deterministic rule or lookup table, not a physical formula.",
  },
  INHERITED: {
    label:       "Inherited",
    color:       "#7F8C8D",
    bgColor:     "rgba(127, 140, 141, 0.15)",
    description: "Propagated from a parent grid cell, district average, or upstream block.",
  },
  BLOCKED: {
    label:       "Blocked",
    color:       "#E74C3C",
    bgColor:     "rgba(231, 76, 60, 0.15)",
    description: "Field exists but has been intentionally suppressed or masked.",
  },
  MISSING: {
    label:       "Missing",
    color:       "#BDC3C7",
    bgColor:     "rgba(189, 195, 199, 0.15)",
    description: "No data available; field is null or was never populated.",
  },
};

// ---------------------------------------------------------------------------
// getProvenanceBadge helper
// ---------------------------------------------------------------------------

/**
 * Retrieve the provenance tag object for a given tag key.
 * Falls back to MISSING if the key is unknown or absent.
 * @param {string} tag - One of the PROVENANCE_TAGS keys
 * @returns {{ label: string, color: string, bgColor: string, description: string }}
 */
export function getProvenanceBadge(tag) {
  return PROVENANCE_TAGS[tag] ?? PROVENANCE_TAGS.MISSING;
}

// ---------------------------------------------------------------------------
// FEATURE_PROVENANCE - field-level provenance map for the block schema
// ---------------------------------------------------------------------------

/**
 * Maps each block schema field name to its provenance tag key.
 * Used by the TechnicalMode overlay to render per-field badges.
 */
export const FEATURE_PROVENANCE = {
  // -- Identifiers & geometry -----------------------------------------------
  block_id:                "OBSERVED",
  district:                "OBSERVED",
  ward:                    "OBSERVED",
  lat:                     "OBSERVED",
  lon:                     "OBSERVED",
  geometry:                "OBSERVED",
  area_km2:                "DERIVED",

  // -- Meteorological (station / NWP) ----------------------------------------
  tdb:                     "OBSERVED",
  rh:                      "OBSERVED",
  wind_speed:              "OBSERVED",
  wind_direction:          "OBSERVED",
  solar_wm2:               "OBSERVED",
  solar_mj:                "OBSERVED",
  pressure_hpa:            "OBSERVED",
  precipitation_mm:        "OBSERVED",
  cloud_cover_pct:         "MODELLED",

  // -- Derived meteorological ------------------------------------------------
  stull_wet_bulb:          "DERIVED",
  natural_wet_bulb:        "DERIVED",
  globe_temperature:       "DERIVED",
  vapor_pressure:          "DERIVED",
  wind_at_10m:             "DERIVED",
  dew_point:               "DERIVED",

  // -- Thermal indices --------------------------------------------------------
  wbgt:                    "DERIVED",
  wbgt_tier:               "RULE_DERIVED",
  utci:                    "DERIVED",
  utci_tier:               "RULE_DERIVED",
  heat_index:              "DERIVED",
  heat_index_tier:         "RULE_DERIVED",

  // -- Land surface & remote sensing -----------------------------------------
  lst:                     "PROXY",
  lst_anomaly:             "DERIVED",
  ndvi:                    "OBSERVED",
  albedo:                  "PROXY",
  emissivity:              "PROXY",
  urban_heat_island_delta: "DERIVED",

  // -- Urban morphology -------------------------------------------------------
  built_up_pct:            "OBSERVED",
  green_cover_pct:         "OBSERVED",
  water_body_pct:          "OBSERVED",
  impervious_pct:          "DERIVED",
  building_height_m:       "OBSERVED",
  sky_view_factor:         "DERIVED",
  aspect_ratio:            "DERIVED",

  // -- Air quality ------------------------------------------------------------
  aqi:                     "OBSERVED",
  pm25:                    "OBSERVED",
  pm10:                    "OBSERVED",
  no2:                     "OBSERVED",
  ozone:                   "OBSERVED",
  co:                      "OBSERVED",

  // -- Population & vulnerability --------------------------------------------
  population_density:      "OBSERVED",
  elderly_pct:             "OBSERVED",
  children_pct:            "OBSERVED",
  outdoor_worker_pct:      "OBSERVED",
  vulnerability_index:     "DERIVED",

  // -- Infrastructure --------------------------------------------------------
  hospital_proximity_km:   "OBSERVED",
  cooling_center_count:    "OBSERVED",
  power_reliability_pct:   "OBSERVED",
  water_access_pct:        "OBSERVED",

  // -- Forecast / temporal ---------------------------------------------------
  forecast_horizon:        "RULE_DERIVED",
  timestamp_utc:           "OBSERVED",
  data_age_hours:          "DERIVED",

  // -- Impact / alert --------------------------------------------------------
  impact_tier:             "RULE_DERIVED",
  alert_level:             "RULE_DERIVED",
  composite_risk_score:    "DERIVED",
  cooling_demand_mwh:      "MODELLED",

  // -- Meta ------------------------------------------------------------------
  source_station:          "OBSERVED",
  nwp_model:               "MODELLED",
  grid_resolution_km:      "INHERITED",
  confidence_pct:          "DERIVED",
  qa_flag:                 "RULE_DERIVED",
};
