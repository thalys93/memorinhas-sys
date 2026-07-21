import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { resolveTheme, useThemeStore } from '@/store/use-theme-store'
import { usePanelThemeStore } from '@/store/use-panel-theme-store'

function isPanelPath(pathname: string) {
  return pathname.startsWith('/lojista') || pathname.startsWith('/admin')
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const appTheme = useThemeStore((s) => s.theme)
  const panelTheme = usePanelThemeStore((s) => s.theme)
  const onPanel = isPanelPath(location.pathname)
  const activeTheme = onPanel ? panelTheme : appTheme

  useEffect(() => {
    const root = document.documentElement
    const apply = () => {
      root.classList.toggle('dark', resolveTheme(activeTheme) === 'dark')
    }

    apply()

    if (activeTheme !== 'system') return

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [activeTheme])

  return children
}
