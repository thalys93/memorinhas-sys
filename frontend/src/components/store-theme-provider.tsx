import { useEffect } from 'react'
import { usePublicStore, useStore } from '@/hooks/queries'
import { useAuthStore } from '@/store/use-auth-store'
import {
  DEFAULT_STORE_PRIMARY,
  applyStorePrimaryColor,
} from '@/lib/theme-color'

export function StoreThemeProvider({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token)
  const { data: publicStore } = usePublicStore()
  const { data: privateStore } = useStore(!!token)

  const accent =
    (token ? privateStore?.settings?.theme?.accentColor : undefined) ||
    publicStore?.settings?.theme?.accentColor ||
    DEFAULT_STORE_PRIMARY

  useEffect(() => {
    applyStorePrimaryColor(accent)
  }, [accent])

  return children
}
