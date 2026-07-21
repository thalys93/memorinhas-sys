import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { clearShopkeeperSitePreview } from '@/lib/shopkeeper-preview'

interface AuthUser {
  id: string
  email: string
  roles: string[]
  name?: string
}

interface AuthState {
  token: string | null
  user: AuthUser | null
  activeStoreId: string | null
  setSession: (token: string, user: AuthUser) => void
  setActiveStore: (storeId: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      activeStoreId: null,
      setSession: (token, user) => set({ token, user }),
      setActiveStore: (storeId) => set({ activeStoreId: storeId }),
      logout: () => {
        set({ token: null, user: null, activeStoreId: null })
        localStorage.removeItem('auth-storage')
        clearShopkeeperSitePreview()
      },
    }),
    { name: 'auth-storage' },
  ),
)
