import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { geocodeCities, geocodeCity } from '@/lib/geocode-city'
import { COVERAGE_RADIUS_M, mergedCoveragePolygons } from '@/lib/coverage-circles'

const BRAZIL_CENTER: L.LatLngExpression = [-14.235, -51.9253]
const DEBOUNCE_MS = 300
const MARKER_COLOR = '#8a6240'

const coverageStyle: L.PathOptions = {
  color: MARKER_COLOR,
  weight: 2,
  dashArray: '6 8',
  fillColor: MARKER_COLOR,
  fillOpacity: 0.14,
}

const coverageMarkerIcon = L.divIcon({
  className: 'coverage-map-marker',
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 24 36" aria-hidden="true">
    <path fill="${MARKER_COLOR}" stroke="#fff" stroke-width="1.25" d="M12 1.5c-4.7 0-8.5 3.8-8.5 8.5 0 6.4 8.5 17 8.5 17s8.5-10.6 8.5-17c0-4.7-3.8-8.5-8.5-8.5z"/>
    <circle cx="12" cy="10" r="3.25" fill="#fff"/>
  </svg>`,
  iconSize: [28, 36],
  iconAnchor: [14, 36],
  popupAnchor: [0, -34],
})

type CoverageMapProps = {
  cities: string[]
  fallbackCenter?: string
  className?: string
}

export function CoverageMap({ cities, fallbackCenter, className }: CoverageMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const layerRef = useRef<L.LayerGroup | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el || mapRef.current) return

    const map = L.map(el, { scrollWheelZoom: false }).setView(BRAZIL_CENTER, 4)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map)

    layerRef.current = L.layerGroup().addTo(map)
    mapRef.current = map

    requestAnimationFrame(() => map.invalidateSize())

    return () => {
      map.remove()
      mapRef.current = null
      layerRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    const layer = layerRef.current
    if (!map || !layer) return

    let cancelled = false
    const timer = window.setTimeout(async () => {
      layer.clearLayers()

      const points = await geocodeCities(cities)
      if (cancelled) return

      if (points.length === 0) {
        const fallback = fallbackCenter?.trim()
          ? await geocodeCity(fallbackCenter)
          : null
        if (cancelled) return
        if (fallback) {
          map.setView([fallback.lat, fallback.lng], 10)
        } else {
          map.setView(BRAZIL_CENTER, 4)
        }
        return
      }

      for (const { name, coords } of points) {
        L.marker([coords.lat, coords.lng], { icon: coverageMarkerIcon })
          .bindPopup(name)
          .addTo(layer)
      }

      const polygons = mergedCoveragePolygons(
        points.map((p) => p.coords),
        COVERAGE_RADIUS_M,
      )

      let bounds: L.LatLngBounds | null = null
      for (const ring of polygons) {
        const latLngs = ring.map((p) => [p.lat, p.lng] as L.LatLngTuple)
        const poly = L.polygon(latLngs, coverageStyle).addTo(layer)
        bounds = bounds ? bounds.extend(poly.getBounds()) : poly.getBounds()
      }

      if (bounds?.isValid()) {
        map.fitBounds(bounds, { padding: [28, 28], maxZoom: 12 })
      }
      requestAnimationFrame(() => map.invalidateSize())
    }, DEBOUNCE_MS)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [cities, fallbackCenter])

  return (
    <>
      <style>{`.coverage-map-marker{background:transparent;border:none}`}</style>
      <div ref={containerRef} className={className ?? 'h-full w-full'} />
    </>
  )
}
