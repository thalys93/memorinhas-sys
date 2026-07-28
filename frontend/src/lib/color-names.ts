import { normalizeHex } from '@/lib/theme-color'

export type NamedColor = {
  name: string
  hex: string
}

const NAMED_COLORS: NamedColor[] = [
  { name: 'Branco', hex: '#FFFFFF' },
  { name: 'Gelo', hex: '#F5F5F5' },
  { name: 'Prata', hex: '#C0C0C0' },
  { name: 'Cinza claro', hex: '#D1D5DB' },
  { name: 'Cinza', hex: '#6B7280' },
  { name: 'Cinza escuro', hex: '#374151' },
  { name: 'Carvão', hex: '#1F2937' },
  { name: 'Preto', hex: '#1A1A1A' },
  { name: 'Preto puro', hex: '#000000' },

  { name: 'Vermelho', hex: '#EF4444' },
  { name: 'Vermelho vivo', hex: '#DC2626' },
  { name: 'Carmim', hex: '#9F1239' },
  { name: 'Bordô', hex: '#7F1D1D' },
  { name: 'Coral', hex: '#FB7185' },
  { name: 'Salmão', hex: '#FDA4AF' },
  { name: 'Rosa', hex: '#EC4899' },
  { name: 'Rosa claro', hex: '#F9A8D4' },
  { name: 'Magenta', hex: '#D946EF' },
  { name: 'Fúcsia', hex: '#C026D3' },

  { name: 'Laranja', hex: '#F97316' },
  { name: 'Laranja queimado', hex: '#C2410C' },
  { name: 'Pêssego', hex: '#FDBA74' },
  { name: 'Âmbar', hex: '#F59E0B' },
  { name: 'Dourado', hex: '#EAB308' },
  { name: 'Amarelo', hex: '#FACC15' },
  { name: 'Creme', hex: '#FEF3C7' },
  { name: 'Mostarda', hex: '#CA8A04' },

  { name: 'Verde limão', hex: '#A3E635' },
  { name: 'Verde', hex: '#22C55E' },
  { name: 'Verde floresta', hex: '#15803D' },
  { name: 'Verde musgo', hex: '#3F6212' },
  { name: 'Oliva', hex: '#65A30D' },
  { name: 'Menta', hex: '#6EE7B7' },
  { name: 'Turquesa', hex: '#14B8A6' },
  { name: 'Verde-água', hex: '#2DD4BF' },
  { name: 'Esmeralda', hex: '#059669' },

  { name: 'Céu', hex: '#0EA5E9' },
  { name: 'Azul claro', hex: '#7DD3FC' },
  { name: 'Azul', hex: '#3B82F6' },
  { name: 'Azul royal', hex: '#2563EB' },
  { name: 'Azul índigo', hex: '#2E45BF' },
  { name: 'Azul marinho', hex: '#1E3A8A' },
  { name: 'Azul petróleo', hex: '#0F766E' },
  { name: 'Anil', hex: '#4338CA' },
  { name: 'Lavanda', hex: '#A5B4FC' },

  { name: 'Roxo', hex: '#8B5CF6' },
  { name: 'Violeta', hex: '#7C3AED' },
  { name: 'Uva', hex: '#6D28D9' },
  { name: 'Lilás', hex: '#C4B5FD' },
  { name: 'Ameixa', hex: '#581C87' },

  { name: 'Marrom', hex: '#8A6240' },
  { name: 'Café', hex: '#78350F' },
  { name: 'Chocolate', hex: '#7C2D12' },
  { name: 'Areia', hex: '#C4A484' },
  { name: 'Bege', hex: '#E7D5C4' },
  { name: 'Caramelo', hex: '#B45309' },
  { name: 'Terracota', hex: '#C2410C' },
  { name: 'Pedra', hex: '#78716C' },
  { name: 'Khaki', hex: '#A8A29E' },
]

type Rgb = { r: number; g: number; b: number }

function hexToRgb(hex: string): Rgb | null {
  const normalized = normalizeHex(hex)
  if (!normalized) return null
  return {
    r: parseInt(normalized.slice(1, 3), 16),
    g: parseInt(normalized.slice(3, 5), 16),
    b: parseInt(normalized.slice(5, 7), 16),
  }
}

function rgbToLab({ r, g, b }: Rgb): [number, number, number] {
  const toLinear = (channel: number) => {
    const c = channel / 255
    return c > 0.04045 ? ((c + 0.055) / 1.055) ** 2.4 : c / 12.92
  }

  const rl = toLinear(r)
  const gl = toLinear(g)
  const bl = toLinear(b)

  const x = (rl * 0.4124564 + gl * 0.3575761 + bl * 0.1804375) / 0.95047
  const y = (rl * 0.2126729 + gl * 0.7151522 + bl * 0.072175)
  const z = (rl * 0.0193339 + gl * 0.119192 + bl * 0.9503041) / 1.08883

  const f = (t: number) =>
    t > 0.008856 ? Math.cbrt(t) : 7.787037 * t + 16 / 116

  const fx = f(x)
  const fy = f(y)
  const fz = f(z)

  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)]
}

function labDistance(a: [number, number, number], b: [number, number, number]) {
  const dl = a[0] - b[0]
  const da = a[1] - b[1]
  const db = a[2] - b[2]
  return dl * dl + da * da + db * db
}

const NAMED_COLORS_LAB = NAMED_COLORS.map((color) => {
  const rgb = hexToRgb(color.hex)!
  return {
    ...color,
    hex: color.hex.toLowerCase(),
    lab: rgbToLab(rgb),
  }
})

export function nearestNamedColor(hex: string): NamedColor | null {
  const rgb = hexToRgb(hex)
  if (!rgb) return null

  const normalized = normalizeHex(hex)!.toLowerCase()
  const exact = NAMED_COLORS_LAB.find((color) => color.hex === normalized)
  if (exact) {
    return { name: exact.name, hex: exact.hex }
  }

  const targetLab = rgbToLab(rgb)
  let best = NAMED_COLORS_LAB[0]
  let bestDistance = Number.POSITIVE_INFINITY

  for (const color of NAMED_COLORS_LAB) {
    const distance = labDistance(targetLab, color.lab)
    if (distance < bestDistance) {
      bestDistance = distance
      best = color
    }
  }

  return { name: best.name, hex: best.hex }
}

export function resolveColorName(hex: string): string {
  const nearest = nearestNamedColor(hex)
  return nearest?.name ?? hex.toUpperCase()
}
