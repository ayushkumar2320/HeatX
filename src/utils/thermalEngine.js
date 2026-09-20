/**
 * thermalEngine.js
 * HeatX Thermal Index Computation Engine
 * All formulas sourced from the HeatX specification.
 */

// ---------------------------------------------------------------------------
// Internal tier tables
// ---------------------------------------------------------------------------

const WBGT_TIERS = [
  { tier: "NORMAL",         min: -Infinity, max: 26.7,    label: "Normal",         color: "#27AE60" },
  { tier: "CAUTION",        min: 26.7,      max: 29.4,    label: "Caution",         color: "#F1C40F" },
  { tier: "DANGER",         min: 29.4,      max: 32.2,    label: "Danger",           color: "#E67E22" },
  { tier: "EXTREME_DANGER", min: 32.2,      max: Infinity, label: "Extreme Danger", color: "#E74C3C" },
];

const UTCI_TIERS = [
  { tier: "NO_STRESS",          min: -Infinity, max: 9,    label: "No Thermal Stress",        color: "#27AE60" },
  { tier: "NO_STRESS_MODERATE", min: 9,         max: 26,   label: "No Stress / Moderate",     color: "#2ECC71" },
  { tier: "MODERATE",           min: 26,        max: 32,   label: "Moderate Heat Stress",     color: "#F1C40F" },
  { tier: "STRONG",             min: 32,        max: 38,   label: "Strong Heat Stress",       color: "#E67E22" },
  { tier: "VERY_STRONG",        min: 38,        max: 46,   label: "Very Strong Heat Stress",  color: "#C0392B" },
  { tier: "EXTREME",            min: 46,        max: Infinity, label: "Extreme Heat Stress",  color: "#8E1010" },
];

const HEAT_INDEX_TIERS = [
  { tier: "NORMAL",          min: -Infinity, max: 27,    label: "Normal",           color: "#27AE60" },
  { tier: "CAUTION",         min: 27,        max: 32,    label: "Caution",           color: "#F1C40F" },
  { tier: "EXTREME_CAUTION", min: 32,        max: 41,    label: "Extreme Caution",   color: "#E67E22" },
  { tier: "DANGER",          min: 41,        max: 54,    label: "Danger",             color: "#C0392B" },
  { tier: "EXTREME_DANGER",  min: 54,        max: Infinity, label: "Extreme Danger", color: "#8E1010" },
];

function _classifyWbgt(value) {
  const t = WBGT_TIERS.find(t => value >= t.min && value < t.max) || WBGT_TIERS[WBGT_TIERS.length - 1];
  return { value: +value.toFixed(2), tier: t.tier, label: t.label, color: t.color };
}

function _classifyUtci(value) {
  const t = UTCI_TIERS.find(t => value >= t.min && value < t.max) || UTCI_TIERS[UTCI_TIERS.length - 1];
  return { value: +value.toFixed(2), tier: t.tier, label: t.label, color: t.color };
}

function _classifyHeatIndex(valueCelsius) {
  const t = HEAT_INDEX_TIERS.find(t => valueCelsius >= t.min && valueCelsius < t.max) || HEAT_INDEX_TIERS[HEAT_INDEX_TIERS.length - 1];
  return { value: +valueCelsius.toFixed(2), tier: t.tier, label: t.label, color: t.color };
}

// ---------------------------------------------------------------------------
// 1. stullWetBulb - Stull (2011)
// Twb = Tdb*atan(0.151977*sqrt(rh+8.313659)) + atan(Tdb+rh) - atan(rh-1.676331)
//       + 0.00391838*rh^1.5*atan(0.023101*rh) - 4.686035
// ---------------------------------------------------------------------------
export function stullWetBulb(tdb, rh) {
  return (
    tdb * Math.atan(0.151977 * Math.sqrt(rh + 8.313659)) +
    Math.atan(tdb + rh) -
    Math.atan(rh - 1.676331) +
    0.00391838 * Math.pow(rh, 1.5) * Math.atan(0.023101 * rh) -
    4.686035
  );
}

// ---------------------------------------------------------------------------
// 2. naturalWetBulb - Stull + 1.0 deg C offset
// ---------------------------------------------------------------------------
export function naturalWetBulb(tdb, rh) {
  return stullWetBulb(tdb, rh) + 1.0;
}

// ---------------------------------------------------------------------------
// 3. globeTemperature - energy-balance proxy
// Tg = Tdb + (S * 0.0075) / (max(w, 0.1) + 0.5)
// ---------------------------------------------------------------------------
export function globeTemperature(tdb, solar, windSpeed) {
  const w = Math.max(windSpeed, 0.1);
  return tdb + (solar * 0.0075) / (w + 0.5);
}

// ---------------------------------------------------------------------------
// 4. wbgt - outdoor composite (ACGIH/OSHA)
// WBGT = 0.7*Tnwb + 0.2*Tg + 0.1*Tdb
// ---------------------------------------------------------------------------
export function wbgt(tdb, rh, solar, windSpeed) {
  const Tnwb  = naturalWetBulb(tdb, rh);
  const Tg    = globeTemperature(tdb, solar, windSpeed);
  const value = 0.7 * Tnwb + 0.2 * Tg + 0.1 * tdb;
  return _classifyWbgt(value);
}

// ---------------------------------------------------------------------------
// 5. vaporPressure - Magnus-Tetens
// es = 0.6112 * exp(17.67 * Tdb / (Tdb + 243.5))  [kPa]
// e  = rh/100 * es
// ---------------------------------------------------------------------------
export function vaporPressure(tdb, rh) {
  const es = 0.6112 * Math.exp((17.67 * tdb) / (tdb + 243.5));
  return (rh / 100) * es;
}

// ---------------------------------------------------------------------------
// 6. windAt10m - log law, z0=0.1m
// v10 = v2 * ln(10/0.1) / ln(2/0.1) = v2 * 1.251
// ---------------------------------------------------------------------------
export function windAt10m(windSpeed2m) {
  return windSpeed2m * (Math.log(10 / 0.1) / Math.log(2 / 0.1));
}

// ---------------------------------------------------------------------------
// 7. utciApprox - simplified UTCI proxy (COST 730)
// UTCI = Tdb + 0.33*e - 0.70*v10 - 4.00 + 0.10*Tmrt_excess
// ---------------------------------------------------------------------------
export function utciApprox(tdb, rh, windSpeed2m, solar) {
  const v10         = windAt10m(windSpeed2m);
  const e           = vaporPressure(tdb, rh);
  const Tmrt_excess = solar / 200.0;
  const value       = tdb + 0.33 * e - 0.70 * v10 - 4.00 + 0.10 * Tmrt_excess;
  return _classifyUtci(value);
}

// ---------------------------------------------------------------------------
// 8. heatIndex - Rothfusz full polynomial (NWS)
// ---------------------------------------------------------------------------
export function heatIndex(tdb_c, rh) {
  const T = tdb_c * 9 / 5 + 32; // deg C -> deg F
  const R = rh;

  // Not applicable below 80 F or below 40% RH
  if (T < 80 || R < 40) {
    return {
      value: +tdb_c.toFixed(2),
      tier:  "HEAT_INDEX_UNADJUSTED",
      label: "Air Temperature (HI N/A)",
      color: "#607d8b",
    };
  }

  // Full Rothfusz polynomial
  let HI =
    -42.379 +
    2.04901523  * T +
    10.14333127 * R -
    0.22475541  * T * R -
    0.00683783  * T * T -
    0.05481717  * R * R +
    0.00122874  * T * T * R +
    0.00085282  * T * R * R -
    0.00000199  * T * T * R * R;

  // Low-humidity adjustment: R < 13 and 80 <= T <= 112
  if (R < 13 && T >= 80 && T <= 112) {
    HI += -((13 - R) / 4) * Math.sqrt((17 - Math.abs(T - 95)) / 17);
  }

  // High-humidity adjustment: R > 85 and 80 <= T <= 87
  if (R > 85 && T >= 80 && T <= 87) {
    HI += ((R - 85) / 10) * ((87 - T) / 5);
  }

  const hiCelsius = (HI - 32) * 5 / 9;
  return _classifyHeatIndex(hiCelsius);
}

// ---------------------------------------------------------------------------
// 9. solarMjToWm2 - MJ/m2/day -> W/m2
// ---------------------------------------------------------------------------
export function solarMjToWm2(mj) {
  return mj * 11.574074074;
}

// ---------------------------------------------------------------------------
// 10. getThermalProfile - compute all indices for a block object
// ---------------------------------------------------------------------------
export function getThermalProfile(block) {
  if (!block) return null;

  const tdb  = Number(block.tdb        ?? block.temperature ?? 25);
  const rh   = Number(block.rh         ?? block.humidity    ?? 50);
  const wind = Number(block.wind_speed ?? block.windSpeed   ?? 1.0);

  let solar = 0;
  if (block.solar_wm2 != null)     solar = Number(block.solar_wm2);
  else if (block.solar_mj != null) solar = solarMjToWm2(Number(block.solar_mj));
  else if (block.solar != null)    solar = Number(block.solar);

  const Tnwb = naturalWetBulb(tdb, rh);
  const Twb  = stullWetBulb(tdb, rh);
  const Tg   = globeTemperature(tdb, solar, wind);
  const e    = vaporPressure(tdb, rh);
  const v10  = windAt10m(wind);

  return {
    tdb,
    rh,
    solar,
    wind,
    stullWetBulb:     +Twb.toFixed(2),
    naturalWetBulb:   +Tnwb.toFixed(2),
    globeTemperature: +Tg.toFixed(2),
    vaporPressure:    +e.toFixed(4),
    windAt10m:        +v10.toFixed(2),
    wbgt:             wbgt(tdb, rh, solar, wind),
    utci:             utciApprox(tdb, rh, wind, solar),
    heatIndex:        heatIndex(tdb, rh),
  };
}

// ---------------------------------------------------------------------------
// 11. getWbgtTierColor / getWbgtTierLabel
// ---------------------------------------------------------------------------
export function getWbgtTierColor(tier) {
  const t = WBGT_TIERS.find(t => t.tier === tier);
  return t ? t.color : "#607d8b";
}

export function getWbgtTierLabel(tier) {
  const t = WBGT_TIERS.find(t => t.tier === tier);
  return t ? t.label : "Unknown";
}
