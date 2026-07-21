import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { rememberCityCoords, suggestCities, type CitySuggestion } from '@/lib/geocode-city'

const SUGGEST_DEBOUNCE_MS = 400
const SUGGEST_MIN_CHARS = 2

type CitiesChipsInputProps = {
  value: string[]
  onChange: (chips: string[]) => void
  placeholder?: string
  className?: string
  citySuggest?: boolean
}

export function CitiesChipsInput({
  value,
  onChange,
  placeholder = 'Digite e pressione Enter',
  className,
  citySuggest = false,
}: CitiesChipsInputProps) {
  const [draft, setDraft] = useState('')
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const blurTimer = useRef<number | null>(null)
  const listId = useId()

  useEffect(() => {
    if (!citySuggest) return
    const q = draft.trim()
    if (q.length < SUGGEST_MIN_CHARS) {
      setSuggestions([])
      setLoading(false)
      setOpen(false)
      setActiveIndex(-1)
      return
    }

    const controller = new AbortController()
    let cancelled = false
    const timer = window.setTimeout(async () => {
      setLoading(true)
      setOpen(true)
      try {
        const hits = await suggestCities(q, controller.signal)
        if (cancelled) return
        const filtered = hits.filter(
          (s) => !value.some((c) => c.toLowerCase() === s.name.toLowerCase()),
        )
        setSuggestions(filtered)
        setActiveIndex(filtered.length ? 0 : -1)
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return
        if (cancelled) return
        setSuggestions([])
        setActiveIndex(-1)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }, SUGGEST_DEBOUNCE_MS)

    return () => {
      cancelled = true
      controller.abort()
      window.clearTimeout(timer)
      setLoading(false)
    }
  }, [draft, citySuggest, value])

  const addChip = (raw: string, coords?: { lat: number; lng: number }) => {
    const parts = raw
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean)
    if (!parts.length) return
    const next = [...value]
    for (const part of parts) {
      if (!next.some((c) => c.toLowerCase() === part.toLowerCase())) {
        next.push(part)
        if (coords && parts.length === 1) rememberCityCoords(part, coords)
      }
    }
    onChange(next)
    setDraft('')
    setSuggestions([])
    setOpen(false)
    setLoading(false)
    setActiveIndex(-1)
  }

  const pickSuggestion = (suggestion: CitySuggestion) => {
    rememberCityCoords(suggestion.name, suggestion.coords)
    addChip(suggestion.name, suggestion.coords)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (open && !loading && suggestions.length) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((i) => (i + 1) % suggestions.length)
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1))
        return
      }
      if (e.key === 'Enter' && activeIndex >= 0) {
        e.preventDefault()
        pickSuggestion(suggestions[activeIndex])
        return
      }
      if (e.key === 'Escape') {
        setOpen(false)
        return
      }
    }

    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addChip(draft)
      return
    }
    if (e.key === 'Backspace' && !draft && value.length) {
      onChange(value.slice(0, -1))
    }
  }

  const showPanel = citySuggest && open && draft.trim().length >= SUGGEST_MIN_CHARS

  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'flex min-h-12 flex-wrap items-center gap-2 rounded-xl border border-input bg-background px-3 py-2 focus-within:ring-2 focus-within:ring-ring',
        )}
      >
        {value.map((chip) => (
          <span
            key={chip}
            className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/15 px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm"
          >
            {chip}
            <button
              type="button"
              aria-label={`Remover ${chip}`}
              className="rounded-full p-0.5 text-muted-foreground hover:bg-primary/20 hover:text-foreground"
              onClick={() => onChange(value.filter((c) => c !== chip))}
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => {
            if (draft.trim().length >= SUGGEST_MIN_CHARS) setOpen(true)
          }}
          onBlur={() => {
            blurTimer.current = window.setTimeout(() => {
              setOpen(false)
              if (draft.trim()) addChip(draft)
            }, 150)
          }}
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-busy={loading}
          placeholder={value.length ? '' : placeholder}
          className="min-w-[120px] flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        {citySuggest && loading ? (
          <Loader2 size={16} className="shrink-0 animate-spin text-muted-foreground" aria-hidden />
        ) : null}
      </div>
      {showPanel ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-50 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-border bg-popover py-1 text-popover-foreground shadow-lg"
        >
          {loading ? (
            <li className="flex items-center gap-2 px-3 py-2.5 text-sm text-muted-foreground">
              <Loader2 size={14} className="animate-spin" />
              Buscando cidades…
            </li>
          ) : suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <li key={suggestion.label}>
                <button
                  type="button"
                  role="option"
                  aria-selected={index === activeIndex}
                  className={cn(
                    'flex w-full px-3 py-2 text-left text-sm hover:bg-accent',
                    index === activeIndex && 'bg-accent',
                  )}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    if (blurTimer.current) window.clearTimeout(blurTimer.current)
                    pickSuggestion(suggestion)
                  }}
                >
                  {suggestion.label}
                </button>
              </li>
            ))
          ) : (
            <li className="px-3 py-2.5 text-sm text-muted-foreground">
              Nenhuma cidade encontrada
            </li>
          )}
        </ul>
      ) : null}
    </div>
  )
}
