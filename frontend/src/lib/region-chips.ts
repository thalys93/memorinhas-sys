export function parseRegionChips(value?: string): string[] {
  if (!value?.trim()) return []
  return value
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
}

export function joinRegionChips(chips: string[]): string {
  return chips.map((c) => c.trim()).filter(Boolean).join(', ')
}
