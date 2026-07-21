const UF_AFTER_COMMA = /,\s*([A-Za-z]{2})\s*$/

export function parseStoreUf(location?: string): string | null {
  if (!location?.trim()) return null
  const match = location.trim().match(UF_AFTER_COMMA)
  return match?.[1]?.toUpperCase() ?? null
}

export function standardFreightLabel(location?: string): string {
  const uf = parseStoreUf(location)
  return uf ? `Frete ${uf}` : 'Frete estadual'
}
