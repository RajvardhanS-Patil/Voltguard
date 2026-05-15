export const COLORS = {
  // Brand
  cyan: '#00E5FF',
  cyanDim: 'rgba(0,229,255,0.14)',
  green: '#00FF9C',
  greenDim: 'rgba(0,255,156,0.12)',
  purple: '#7C4DFF',
  purpleDim: 'rgba(124,77,255,0.14)',
  amber: '#FFC107',
  amberDim: 'rgba(255,193,7,0.14)',
  danger: '#FF3D71',
  dangerDim: 'rgba(255,61,113,0.14)',

  // Backgrounds
  bgBasic: '#111827',
  bgAdvanced: '#02040f',
  cardBasic: 'rgba(26,37,53,0.95)',
  cardAdvanced: 'rgba(5,12,35,0.85)',
  borderBasic: 'rgba(255,255,255,0.08)',
  borderAdvanced: 'rgba(0,229,255,0.18)',

  // Text
  textPrimary: '#d0dff5',
  textSecondary: 'rgba(160,190,220,0.65)',
  textDim: 'rgba(110,145,185,0.45)',

  // Nav
  navBasic: 'rgba(13,20,35,0.97)',
  navAdvanced: 'rgba(2,4,15,0.96)',
};

export const SPACING = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
};

export const RADIUS = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
};

export function modeColor(mode, basic, advanced) {
  return mode === 'advanced' ? advanced : basic;
}

export function statusColor(status) {
  switch (status) {
    case 'ok': return COLORS.green;
    case 'warn': return COLORS.amber;
    case 'crit': return COLORS.danger;
    default: return COLORS.cyan;
  }
}

export function theftColor(prob) {
  if (prob < 30) return COLORS.cyan;
  if (prob < 65) return COLORS.amber;
  return COLORS.danger;
}
