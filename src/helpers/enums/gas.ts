
export const GAS_OPTIONS = {
  STANDARD: 1,
  FAST: 2,
  INSTANT: 3,
} as const;

export const GAS_OPTIONS_LABELS = {
  [GAS_OPTIONS.STANDARD]: 'Standard',
  [GAS_OPTIONS.FAST]: 'Fast',
  [GAS_OPTIONS.INSTANT]: 'Instant',
} as const;

export const GAS_OPTIONS_TYPE_NAMES = {
  [GAS_OPTIONS.STANDARD]: 'average',
  [GAS_OPTIONS.FAST]: 'fast',
  [GAS_OPTIONS.INSTANT]: 'fastest',
} as const;
