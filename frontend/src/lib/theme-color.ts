export const DEFAULT_STORE_PRIMARY = '#8a6240'
export const DEFAULT_STORE_PRIMARY_DARK = '#c49a72'

export function normalizeHex(value: string): string | null {
  const raw = value.trim().replace(/^#/, '')
  if (/^[0-9a-fA-F]{3}$/.test(raw)) {
    return `#${raw
      .split('')
      .map((c) => c + c)
      .join('')
      .toLowerCase()}`
  }
  if (/^[0-9a-fA-F]{6}$/.test(raw)) {
    return `#${raw.toLowerCase()}`
  }
  return null
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const n = normalizeHex(hex) ?? DEFAULT_STORE_PRIMARY
  return {
    r: parseInt(n.slice(1, 3), 16),
    g: parseInt(n.slice(3, 5), 16),
    b: parseInt(n.slice(5, 7), 16),
  }
}

export function hexToHsv(hex: string): { h: number; s: number; v: number } {
  const { r, g, b } = hexToRgb(hex)
  const rr = r / 255
  const gg = g / 255
  const bb = b / 255
  const max = Math.max(rr, gg, bb)
  const min = Math.min(rr, gg, bb)
  const d = max - min
  let h = 0
  if (d !== 0) {
    if (max === rr) h = ((gg - bb) / d) % 6
    else if (max === gg) h = (bb - rr) / d + 2
    else h = (rr - gg) / d + 4
    h *= 60
    if (h < 0) h += 360
  }
  const s = max === 0 ? 0 : d / max
  return { h, s, v: max }
}

export function hsvToHex(h: number, s: number, v: number): string {
  const c = v * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = v - c
  let r = 0
  let g = 0
  let b = 0
  if (h < 60) [r, g, b] = [c, x, 0]
  else if (h < 120) [r, g, b] = [x, c, 0]
  else if (h < 180) [r, g, b] = [0, c, x]
  else if (h < 240) [r, g, b] = [0, x, c]
  else if (h < 300) [r, g, b] = [x, 0, c]
  else [r, g, b] = [c, 0, x]
  const toHex = (n: number) =>
    Math.round((n + m) * 255)
      .toString(16)
      .padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

export function darkenHex(hex: string, amount = 0.18): string {
  const { r, g, b } = hexToRgb(hex)
  const f = 1 - amount
  const toHex = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n * f)))
      .toString(16)
      .padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

export function lightenHex(hex: string, amount = 0.32): string {
  const { r, g, b } = hexToRgb(hex)
  const mix = (n: number) => Math.round(n + (255 - n) * amount)
  const toHex = (n: number) =>
    Math.max(0, Math.min(255, mix(n)))
      .toString(16)
      .padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

export function contrastForeground(hex: string): string {
  const { r, g, b } = hexToRgb(hex)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.6 ? '#1d1d1f' : '#ffffff'
}

const STORE_THEME_VARS = [
  '--store-primary',
  '--store-primary-hover',
  '--store-primary-foreground',
  '--store-primary-dark',
  '--store-primary-dark-hover',
  '--store-primary-dark-foreground',
] as const

export function applyStorePrimaryColor(hex?: string | null) {
  const root = document.documentElement
  const color = normalizeHex(hex ?? '') ?? DEFAULT_STORE_PRIMARY
  const hover = darkenHex(color)
  const fg = contrastForeground(color)
  const dark = lightenHex(color)
  const darkHover = lightenHex(color, 0.42)
  const darkFg = contrastForeground(dark)

  root.style.setProperty('--store-primary', color)
  root.style.setProperty('--store-primary-hover', hover)
  root.style.setProperty('--store-primary-foreground', fg)
  root.style.setProperty('--store-primary-dark', dark)
  root.style.setProperty('--store-primary-dark-hover', darkHover)
  root.style.setProperty('--store-primary-dark-foreground', darkFg)
}

export function clearStorePrimaryColor() {
  const root = document.documentElement
  STORE_THEME_VARS.forEach((prop) => root.style.removeProperty(prop))
}
