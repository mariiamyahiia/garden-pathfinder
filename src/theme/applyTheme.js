import { THEME } from './palette'

export function toCssVarName(key) {
  return '--' + key.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())
}

export function applyTheme(theme = THEME) {
  const root = document.documentElement
  for (const [key, value] of Object.entries(theme)) {
    root.style.setProperty(toCssVarName(key), value)
  }
}