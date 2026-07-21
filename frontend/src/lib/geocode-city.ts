export type CityCoords = { lat: number; lng: number }

export type CitySuggestion = {
  label: string
  name: string
  coords: CityCoords
}

type OpenMeteoResult = {
  name: string
  latitude: number
  longitude: number
  admin1?: string
}

const cache = new Map<string, CityCoords | null>()

export function normalizeCityKey(name: string): string {
  return name.trim().toLowerCase()
}

export function rememberCityCoords(name: string, coords: CityCoords) {
  cache.set(normalizeCityKey(name), coords)
}

function formatSuggestion(hit: OpenMeteoResult): CitySuggestion {
  const name = hit.name
  const label = hit.admin1 ? `${name}, ${hit.admin1}` : name
  return {
    label,
    name,
    coords: { lat: hit.latitude, lng: hit.longitude },
  }
}

async function fetchOpenMeteo(
  name: string,
  count: number,
  signal?: AbortSignal,
): Promise<OpenMeteoResult[]> {
  const url = new URL('https://geocoding-api.open-meteo.com/v1/search')
  url.searchParams.set('name', name.trim())
  url.searchParams.set('count', String(count))
  url.searchParams.set('language', 'pt')
  url.searchParams.set('countryCode', 'BR')
  const res = await fetch(url, { signal })
  if (!res.ok) return []
  const data = (await res.json()) as { results?: OpenMeteoResult[] }
  return data.results ?? []
}

export async function geocodeCity(name: string): Promise<CityCoords | null> {
  const key = normalizeCityKey(name)
  if (!key) return null
  if (cache.has(key)) return cache.get(key) ?? null

  try {
    const hits = await fetchOpenMeteo(name, 1)
    const hit = hits[0]
    const coords = hit ? { lat: hit.latitude, lng: hit.longitude } : null
    cache.set(key, coords)
    return coords
  } catch {
    cache.set(key, null)
    return null
  }
}

export async function suggestCities(
  query: string,
  signal?: AbortSignal,
): Promise<CitySuggestion[]> {
  const q = query.trim()
  if (q.length < 2) return []
  try {
    const hits = await fetchOpenMeteo(q, 6, signal)
    const seen = new Set<string>()
    const out: CitySuggestion[] = []
    for (const hit of hits) {
      const suggestion = formatSuggestion(hit)
      const key = normalizeCityKey(suggestion.name)
      if (seen.has(key)) continue
      seen.add(key)
      out.push(suggestion)
    }
    return out
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') throw err
    return []
  }
}

export async function geocodeCities(
  names: string[],
): Promise<Array<{ name: string; coords: CityCoords }>> {
  const results: Array<{ name: string; coords: CityCoords }> = []
  for (const name of names) {
    const coords = await geocodeCity(name)
    if (coords) results.push({ name, coords })
  }
  return results
}
