export function withAlpha(hex, alpha) {
  const n = parseInt(hex.slice(1), 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`
}

const BRAND = {
  lime: '#92c12e',
  green: '#446d44',
  olive: '#44580f',
  plum: '#69334b',
  indigo: '#3e3465',
}

const NEUTRAL = {
  soil: '#d6c8a0',
  cream: '#f1f5e4',
  muted: '#d3e0b8',
  dark: '#1c2608',
}

export const THEME = {
  ...BRAND,

  bg: BRAND.olive,
  surface: BRAND.green,
  surfaceRaised: BRAND.olive,
  board: BRAND.olive,
  border: withAlpha(BRAND.lime, 0.3),
  borderStrong: withAlpha(BRAND.lime, 0.65),
  text: NEUTRAL.cream,
  textMuted: NEUTRAL.muted,

  accent: BRAND.lime,
  accentHover: '#a6d63c',
  accentText: NEUTRAL.dark,
  focus: '#d4f58a',
  plumLight: '#e0a3c0',

  hero: BRAND.indigo,

  soil: NEUTRAL.soil,
  soilVisited: BRAND.green,
  gridLine: withAlpha(BRAND.olive, 0.22),
  hedge: BRAND.olive,
  hedgeEdge: '#2b3908',
  water: BRAND.indigo,
  waterVisited: '#5a4ca3',
  wave: '#a89fe6',
  mud: BRAND.plum,
  mudVisited: '#8f4a6e',
  mudDot: '#46202f',
  vine: BRAND.lime,
  bloomPetal: BRAND.plum,
  bloomCenter: NEUTRAL.cream,
}