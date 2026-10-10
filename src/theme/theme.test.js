import { describe, it, expect } from 'vitest'
import { THEME, withAlpha } from './palette'
import { toCssVarName } from './applyTheme'

const COLOR = /^(#[0-9a-f]{6}|rgba\(\d+, \d+, \d+, [\d.]+\))$/i

describe('palette', () => {
  it('keeps the five brand colors exactly as specified', () => {
    expect(THEME.lime).toBe('#92c12e')
    expect(THEME.green).toBe('#446d44')
    expect(THEME.olive).toBe('#44580f')
    expect(THEME.plum).toBe('#69334b')
    expect(THEME.indigo).toBe('#3e3465')
  })

  it('only contains valid color strings', () => {
    for (const [key, value] of Object.entries(THEME)) {
      expect(value, key).toMatch(COLOR)
    }
  })

  it('keeps the board frame distinct from explored tiles', () => {
    expect(THEME.board).not.toBe(THEME.soilVisited)
  })

  it('converts hex to rgba', () => {
    expect(withAlpha('#92c12e', 0.5)).toBe('rgba(146, 193, 46, 0.5)')
  })
})

describe('toCssVarName', () => {
  it('converts camelCase keys to kebab-case CSS variables', () => {
    expect(toCssVarName('bg')).toBe('--bg')
    expect(toCssVarName('surfaceRaised')).toBe('--surface-raised')
    expect(toCssVarName('accentGlow')).toBe('--accent-glow')
  })
})