import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Theme } from '@/store/use-theme-store'
import { resolveTheme } from '@/store/use-theme-store'

interface PanelThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export const usePanelThemeStore = create<PanelThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => {
        const current = get().theme
        const resolved = resolveTheme(current)
        set({ theme: resolved === 'dark' ? 'light' : 'dark' })
      },
    }),
    { name: 'panel-theme-storage' },
  ),
)
