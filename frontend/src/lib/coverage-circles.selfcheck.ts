import {
  clusterOverlappingCenters,
  convexHull,
  haversineMeters,
  mergedCoveragePolygons,
  COVERAGE_RADIUS_M,
} from './coverage-circles'

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message)
}

const poa = { lat: -30.0346, lng: -51.2177 }
const canoas = { lat: -29.9178, lng: -51.1836 }
const manaus = { lat: -3.119, lng: -60.0217 }

assert(haversineMeters(poa, poa) < 1, 'zero distance')
assert(haversineMeters(poa, canoas) < 2 * COVERAGE_RADIUS_M, 'metro overlap')
assert(haversineMeters(poa, manaus) > 2 * COVERAGE_RADIUS_M, 'far cities')

const clusters = clusterOverlappingCenters([poa, canoas, manaus], COVERAGE_RADIUS_M)
assert(clusters.length === 2, 'two clusters')
assert(
  clusters.some((c) => c.length === 2) && clusters.some((c) => c.length === 1),
  'pair + singleton',
)

const hull = convexHull([
  { lat: 0, lng: 0 },
  { lat: 0, lng: 1 },
  { lat: 1, lng: 1 },
  { lat: 1, lng: 0 },
  { lat: 0.5, lng: 0.5 },
])
assert(hull.length === 4, 'inner point dropped')

const polys = mergedCoveragePolygons([poa, canoas, manaus])
assert(polys.length === 2, 'two coverage blobs')

console.log('coverage-circles: ok')
