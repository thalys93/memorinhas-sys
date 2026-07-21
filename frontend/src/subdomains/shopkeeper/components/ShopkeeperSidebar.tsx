import React from 'react'
import {
  ChevronLeft,
  ChevronRight,
  X,
  Eye,
  LogOut,
  LayoutDashboard,
  Tag,
  Truck,
  Store,
  ShoppingBag,
} from 'lucide-react'
import { Logo } from '@/components/Logo'
import { UserAvatar } from '@/components/user-avatar'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { cn } from '@/lib/utils'
import { enableShopkeeperSitePreview } from '@/lib/shopkeeper-preview'
import { NavItem } from './NavItem'
import { useNavigate, useLocation } from 'react-router-dom'
import { useOrdersSummary } from '@/hooks/queries'

interface ShopkeeperSidebarProps {
  profile: { name: string; email: string; avatar?: string | null }
  isCollapsed: boolean
  setIsCollapsed: (v: boolean) => void
  setIsMobileMenuOpen: (v: boolean) => void
  onLogout: () => void
}

export const ShopkeeperSidebar = ({
  profile,
  isCollapsed,
  setIsCollapsed,
  setIsMobileMenuOpen,
  onLogout,
}: ShopkeeperSidebarProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const segment = location.pathname.replace('/lojista', '').replace(/^\//, '')
  const activeTab = segment.split('/')[0] || 'dashboard'
  const { data: summary } = useOrdersSummary({ refetchInterval: 20000 })
  const pendingCount = summary?.pendingCount ?? 0

  const navItems = [
    { id: 'dashboard', label: 'Visão Geral', icon: <LayoutDashboard size={20} /> },
    {
      id: 'pedidos',
      label: 'Pedidos',
      icon: <ShoppingBag size={20} />,
      badge: pendingCount || undefined,
    },
    { id: 'produtos', label: 'Produtos', icon: <Tag size={20} /> },
    { id: 'entrega', label: 'Região & Frete', icon: <Truck size={20} /> },
    { id: 'loja', label: 'Loja', icon: <Store size={20} /> },
  ] as const

  const goToProfile = () => {
    navigate('/lojista/perfil')
    setIsMobileMenuOpen(false)
  }

  return (
    <div className={cn('flex h-full flex-col', isCollapsed && 'items-center')}>
      <div
        className={cn(
          'mb-10 flex w-full items-center',
          isCollapsed ? 'justify-center' : 'justify-between',
        )}
      >
        {!isCollapsed ? (
          <div className="flex items-center gap-3 min-w-0">
            <Logo size={32} />
            <span className="text-label text-foreground tracking-tight whitespace-nowrap">
              Lojista
            </span>
          </div>
        ) : null}
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          aria-label={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(false)}
          className="md:hidden flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          aria-label="Fechar menu"
        >
          <X size={20} />
        </button>
      </div>

      <nav className={cn('grow space-y-1 w-full', isCollapsed && 'flex flex-col items-center')}>
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            active={activeTab === item.id}
            icon={item.icon}
            label={item.label}
            badge={'badge' in item ? item.badge : undefined}
            onClick={() => {
              const path = item.id === 'dashboard' ? '' : item.id
              navigate(path ? `/lojista/${path}` : '/lojista')
              setIsMobileMenuOpen(false)
            }}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>

      <div
        className={cn(
          'w-full pt-6 border-t space-y-2',
          isCollapsed && 'flex flex-col items-center',
        )}
      >
        <ThemeToggle
          layout={isCollapsed ? 'icon' : 'row'}
          isCollapsed={isCollapsed}
          scope="panel"
          className={isCollapsed ? 'mb-0' : undefined}
        />

        <button
          type="button"
          onClick={goToProfile}
          title={profile.name}
          className={cn(
            'flex items-center rounded-xl transition-colors',
            isCollapsed
              ? 'h-10 w-10 justify-center hover:bg-secondary/70'
              : 'w-full gap-3 p-3 text-left bg-secondary/50 hover:bg-secondary/70',
            activeTab === 'perfil' && 'ring-1 ring-border',
          )}
        >
          <UserAvatar
            name={profile.name}
            src={profile.avatar}
            className="h-8 w-8 shrink-0 border"
            textClassName="text-[10px]"
          />
          {!isCollapsed ? (
            <div className="min-w-0 flex-1">
              <p className="text-label text-foreground truncate">{profile.name}</p>
              <p className="text-label font-normal text-muted-foreground">Lojista</p>
            </div>
          ) : null}
        </button>

        <Button
          variant="ghost"
          size={isCollapsed ? 'icon' : 'default'}
          title="Ver site"
          onClick={() => {
            enableShopkeeperSitePreview()
            navigate('/?from=painel')
            window.scrollTo(0, 0)
          }}
          className={cn(
            isCollapsed ? 'h-10 w-10 rounded-xl' : 'w-full justify-start gap-3',
          )}
        >
          <Eye size={18} className="shrink-0" />
          {!isCollapsed ? <span>Ver site</span> : null}
        </Button>

        <Button
          variant="ghost"
          size={isCollapsed ? 'icon' : 'default'}
          title="Sair"
          onClick={onLogout}
          className={cn(
            'text-red-500 hover:text-red-600 hover:bg-red-500/10',
            isCollapsed ? 'h-10 w-10 rounded-xl' : 'w-full justify-start gap-3',
          )}
        >
          <LogOut size={18} className="shrink-0" />
          {!isCollapsed ? <span>Sair</span> : null}
        </Button>
      </div>
    </div>
  )
}
