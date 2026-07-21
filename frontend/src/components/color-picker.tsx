import { useCallback, useEffect, useRef, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DEFAULT_STORE_PRIMARY,
  hexToHsv,
  hsvToHex,
  normalizeHex,
} from '@/lib/theme-color'
import { cn } from '@/lib/utils'

type ColorPickerProps = {
  value: string
  onChange: (hex: string) => void
  defaultColor?: string
  disabled?: boolean
  className?: string
}

export function ColorPicker({
  value,
  onChange,
  defaultColor = DEFAULT_STORE_PRIMARY,
  disabled,
  className,
}: ColorPickerProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const hueRef = useRef<HTMLDivElement>(null)
  const dragging = useRef<'sv' | 'hue' | null>(null)

  const normalized = normalizeHex(value) ?? defaultColor
  const hsv = hexToHsv(normalized)
  const [hexDraft, setHexDraft] = useState(normalized.toUpperCase())

  useEffect(() => {
    setHexDraft(normalized.toUpperCase())
  }, [normalized])

  const commitHsv = useCallback(
    (h: number, s: number, v: number) => {
      onChange(hsvToHex(h, s, v))
    },
    [onChange],
  )

  const pickSv = useCallback(
    (clientX: number, clientY: number) => {
      const el = panelRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const s = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
      const v = Math.min(1, Math.max(0, 1 - (clientY - rect.top) / rect.height))
      commitHsv(hsv.h, s, v)
    },
    [commitHsv, hsv.h],
  )

  const pickHue = useCallback(
    (clientX: number) => {
      const el = hueRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const h = Math.min(359, Math.max(0, ((clientX - rect.left) / rect.width) * 360))
      commitHsv(h, hsv.s, hsv.v)
    },
    [commitHsv, hsv.s, hsv.v],
  )

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (dragging.current === 'sv') pickSv(e.clientX, e.clientY)
      if (dragging.current === 'hue') pickHue(e.clientX)
    }
    const onUp = () => {
      dragging.current = null
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [pickHue, pickSv])

  const hueColor = hsvToHex(hsv.h, 1, 1)
  const isDefault = normalized.toLowerCase() === defaultColor.toLowerCase()

  return (
    <div className={cn('space-y-3', className)}>
      <div
        ref={panelRef}
        role="slider"
        aria-label="Saturação e brilho"
        aria-valuenow={Math.round(hsv.s * 100)}
        className={cn(
          'relative h-40 w-full select-none overflow-hidden rounded-sm border border-border touch-none',
          disabled && 'pointer-events-none opacity-60',
        )}
        style={{
          background: `
            linear-gradient(to top, #000, transparent),
            linear-gradient(to right, #fff, ${hueColor})
          `,
        }}
        onPointerDown={(e) => {
          if (disabled) return
          dragging.current = 'sv'
          panelRef.current?.setPointerCapture(e.pointerId)
          pickSv(e.clientX, e.clientY)
        }}
      >
        <span
          className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md"
          style={{
            left: `${hsv.s * 100}%`,
            top: `${(1 - hsv.v) * 100}%`,
            backgroundColor: normalized,
          }}
        />
      </div>

      <div
        ref={hueRef}
        role="slider"
        aria-label="Matiz"
        aria-valuenow={Math.round(hsv.h)}
        className={cn(
          'relative h-3 w-full cursor-pointer select-none rounded-sm touch-none',
          disabled && 'pointer-events-none opacity-60',
        )}
        style={{
          background:
            'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)',
        }}
        onPointerDown={(e) => {
          if (disabled) return
          dragging.current = 'hue'
          hueRef.current?.setPointerCapture(e.pointerId)
          pickHue(e.clientX)
        }}
      >
        <span
          className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md"
          style={{
            left: `${(hsv.h / 360) * 100}%`,
            backgroundColor: hueColor,
          }}
        />
      </div>

      <div className="flex items-center gap-2">
        <Input
          value={hexDraft}
          disabled={disabled}
          onChange={(e) => {
            const next = e.target.value
            setHexDraft(next)
            const parsed = normalizeHex(next)
            if (parsed) onChange(parsed)
          }}
          onBlur={() => {
            const parsed = normalizeHex(hexDraft)
            if (parsed) {
              setHexDraft(parsed.toUpperCase())
              onChange(parsed)
            } else {
              setHexDraft(normalized.toUpperCase())
            }
          }}
          spellCheck={false}
          placeholder="#8A6240"
          className="rounded-sm h-10 bg-muted/30 font-mono uppercase"
        />
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="rounded-sm w-full"
        disabled={disabled || isDefault}
        onClick={() => onChange(defaultColor)}
      >
        <RotateCcw size={14} className="mr-2" />
        Restaurar
      </Button>
    </div>
  )
}
