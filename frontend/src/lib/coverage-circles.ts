import type { CityCoords } from './geocode-city'

export const COVERAGE_RADIUS_M = 10_000

const EARTH_R = 6_371_000

export function haversineMeters(a: CityCoords, b: CityCoords): number {
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_R * Math.asin(Math.min(1, Math.sqrt(h)))
}

export function offsetLatLng(
  center: CityCoords,
  distanceM: number,
  bearingDeg: number,
): CityCoords {
  const br = (bearingDeg * Math.PI) / 180
  const lat1 = (center.lat * Math.PI) / 180
  const lng1 = (center.lng * Math.PI) / 180
  const ang = distanceM / EARTH_R
  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(ang) + Math.cos(lat1) * Math.sin(ang) * Math.cos(br),
  )
  const lng2 =
    lng1 +
    Math.atan2(
      Math.sin(br) * Math.sin(ang) * Math.cos(lat1),
      Math.cos(ang) - Math.sin(lat1) * Math.sin(lat2),
    )
  return { lat: (lat2 * 180) / Math.PI, lng: (lng2 * 180) / Math.PI }
}

export function sampleCircleRing(center: CityCoords, radiusM: number, steps = 48): CityCoords[] {
  const ring: CityCoords[] = []
  for (let i = 0; i < steps; i++) {
    ring.push(offsetLatLng(center, radiusM, (360 * i) / steps))
  }
  return ring
}

export function convexHull(points: CityCoords[]): CityCoords[] {
  if (points.length <= 1) return [...points]
  const sorted = [...points].sort((a, b) => a.lng - b.lng || a.lat - b.lat)
  const cross = (o: CityCoords, a: CityCoords, b: CityCoords) =>
    (a.lng - o.lng) * (b.lat - o.lat) - (a.lat - o.lat) * (b.lng - o.lng)

  const lower: CityCoords[] = []
  for (const p of sorted) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
      lower.pop()
    }
    lower.push(p)
  }

  const upper: CityCoords[] = []
  for (let i = sorted.length - 1; i >= 0; i--) {
    const p = sorted[i]
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
      upper.pop()
    }
    upper.push(p)
  }

  lower.pop()
  upper.pop()
  return lower.concat(upper)
}

export function clusterOverlappingCenters(
  centers: CityCoords[],
  radiusM: number,
): CityCoords[][] {
  const n = centers.length
  if (n === 0) return []
  const link = 2 * radiusM
  const parent = Array.from({ length: n }, (_, i) => i)
  const find = (i: number): number => {
    if (parent[i] !== i) parent[i] = find(parent[i])
    return parent[i]
  }
  const unite = (a: number, b: number) => {
    const ra = find(a)
    const rb = find(b)
    if (ra !== rb) parent[rb] = ra
  }

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (haversineMeters(centers[i], centers[j]) <= link) unite(i, j)
    }
  }

  const groups = new Map<number, CityCoords[]>()
  for (let i = 0; i < n; i++) {
    const root = find(i)
    const list = groups.get(root) ?? []
    list.push(centers[i])
    groups.set(root, list)
  }
  return [...groups.values()]
}

export function mergedCoveragePolygons(
  centers: CityCoords[],
  radiusM = COVERAGE_RADIUS_M,
): CityCoords[][] {
  return clusterOverlappingCenters(centers, radiusM).map((cluster) => {
    const ringPoints = cluster.flatMap((c) => sampleCircleRing(c, radiusM))
    return convexHull(ringPoints)
  })
}
