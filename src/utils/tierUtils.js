/**
 * tierUtils.js
 * HeatX 5-Tier / 6-Tier Alert & Impact Classification Tokens & Logic
 */

export const IMPACT_TIERS = [
  {
    tier: 'LOW',
    label: 'Normal / Low',
    color: '#27AE60',
    bgColor: 'rgba(39, 174, 96, 0.12)',
    borderColor: 'rgba(39, 174, 96, 0.4)',
    wbgtMin: 0,
    wbgtMax: 26.7,
    description: 'Normal summer conditions. Standard public hydration advice.',
    action: 'Routine monitoring; maintain standard summer preparedness.',
  },
  {
    tier: 'MODERATE',
    label: 'Elevated / Caution',
    color: '#F1C40F',
    bgColor: 'rgba(241, 196, 15, 0.12)',
    borderColor: 'rgba(241, 196, 15, 0.4)',
    wbgtMin: 26.7,
    wbgtMax: 29.4,
    description: 'Elevated thermal stress. Caution advised for manual outdoor workers.',
    action: 'Issue precautionary advisories; schedule hydration breaks for labor.',
  },
  {
    tier: 'ELEVATED',
    label: 'Elevated / Amber',
    color: '#E67E22',
    bgColor: 'rgba(230, 126, 34, 0.12)',
    borderColor: 'rgba(230, 126, 34, 0.4)',
    wbgtMin: 29.4,
    wbgtMax: 31.0,
    description: 'High thermal strain in built-up or dense residential zones.',
    action: 'Activate district heat action plans; mandate shaded rest breaks.',
  },
  {
    tier: 'HIGH',
    label: 'High / Extreme Caution',
    color: '#E74C3C',
    bgColor: 'rgba(231, 76, 60, 0.12)',
    borderColor: 'rgba(231, 76, 60, 0.4)',
    wbgtMin: 31.0,
    wbgtMax: 32.2,
    description: 'Dangerous outdoor conditions. Rapid onset of heat fatigue likely.',
    action: 'Pre-position emergency ORS and IV fluids; mobile water tankers deployed.',
  },
  {
    tier: 'VERY_HIGH',
    label: 'Very High / Danger',
    color: '#C0392B',
    bgColor: 'rgba(192, 57, 43, 0.12)',
    borderColor: 'rgba(192, 57, 43, 0.4)',
    wbgtMin: 32.2,
    wbgtMax: 34.0,
    description: 'Severe heatwave threshold met. Severe physiological collapse hazard.',
    action: 'Halt non-essential afternoon outdoor work; open cooling shelters.',
  },
  {
    tier: 'EXTREME',
    label: 'Extreme Danger',
    color: '#7D3C98',
    bgColor: 'rgba(125, 60, 152, 0.15)',
    borderColor: 'rgba(125, 60, 152, 0.5)',
    wbgtMin: 34.0,
    wbgtMax: 60.0,
    description: 'Extreme thermal risk combined with humidity/density. Imminent heatstroke.',
    action: 'Declare Level-4 Red Alert; mobilize dedicated hospital heatstroke rooms.',
  },
];

export function getTierColor(tier) {
  const t = IMPACT_TIERS.find(item => item.tier === tier);
  return t ? t.color : '#27AE60';
}

export function getTierBgColor(tier) {
  const t = IMPACT_TIERS.find(item => item.tier === tier);
  return t ? t.bgColor : 'rgba(39, 174, 96, 0.12)';
}

export function getAlertBadgeStyle(tier) {
  const t = IMPACT_TIERS.find(item => item.tier === tier) || IMPACT_TIERS[0];
  return {
    backgroundColor: t.bgColor,
    color: t.color,
    border: `1px solid ${t.borderColor}`,
  };
}

export function getImpactTier(wbgt, builtUpPct = 20, populationDensity = 500) {
  if (wbgt >= 34.0) return 'EXTREME';
  if (wbgt >= 32.2) {
    if (builtUpPct > 60 || populationDensity > 2000) return 'EXTREME';
    return 'VERY_HIGH';
  }
  if (wbgt >= 29.4) {
    if (builtUpPct > 50 || populationDensity > 1500) return 'VERY_HIGH';
    return 'HIGH';
  }
  if (wbgt >= 26.7) {
    if (builtUpPct > 60 || populationDensity > 2000) return 'ELEVATED';
    return 'MODERATE';
  }
  return 'LOW';
}
