import React from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface NavItemProps {
  active: boolean
  icon: React.ReactNode
  label: string
  onClick: () => void
  isCollapsed: boolean
  badge?: number
}

export const NavItem = ({
  active,
  icon,
  label,
  onClick,
  isCollapsed,
  badge,
}: NavItemProps) => (
  <Button
    variant={active ? 'default' : 'ghost'}
    size={isCollapsed ? 'icon' : 'default'}
    onClick={onClick}
    title={label}
    className={cn(
      'relative',
      isCollapsed ? 'h-10 w-10 rounded-xl' : 'w-full justify-start gap-3 rounded-full',
      !active && 'text-muted-foreground hover:text-foreground',
    )}
  >
    <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
      {icon}
      {isCollapsed && badge ? (
        <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium text-destructive-foreground">
          {badge > 9 ? '9+' : badge}
        </span>
      ) : null}
    </span>
    {!isCollapsed ? (
      <>
        <span className="text-label whitespace-nowrap grow text-left">{label}</span>
        {badge ? (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-medium text-destructive-foreground">
            {badge > 9 ? '9+' : badge}
          </span>
        ) : null}
      </>
    ) : null}
  </Button>
)
