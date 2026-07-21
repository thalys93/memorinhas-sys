import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { resolveTheme, useThemeStore } from '@/store/use-theme-store'
import { usePanelThemeStore } from '@/store/use-panel-theme-store'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  className?: string
  variant?: 'ghost' | 'outline'
  layout?: 'icon' | 'row'
  isCollapsed?: boolean
  scope?: 'app' | 'panel'
}

export function ThemeToggle({
  className,
  variant = 'ghost',
  layout = 'icon',
  isCollapsed = false,
  scope = 'app',
}: ThemeToggleProps) {
  const appTheme = useThemeStore((s) => s.theme)
  const toggleAppTheme = useThemeStore((s) => s.toggleTheme)
  const panelTheme = usePanelThemeStore((s) => s.theme)
  const togglePanelTheme = usePanelThemeStore((s) => s.toggleTheme)

  const theme = scope === 'panel' ? panelTheme : appTheme
  const toggleTheme = scope === 'panel' ? togglePanelTheme : toggleAppTheme
  const isDark = resolveTheme(theme) === 'dark'

  if (layout === 'row' && !isCollapsed) {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={cn(
          'w-full flex items-center gap-3 p-3 mb-2 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors text-left',
          className,
        )}
        aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
      >
        <span className="w-8 h-8 rounded-full bg-background border flex items-center justify-center shrink-0">
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </span>
        <div>
          <p className="text-sm font-medium text-foreground">Tema</p>
          <p className="text-xs text-muted-foreground">{isDark ? 'Escuro' : 'Claro'}</p>
        </div>
      </button>
    )
  }

  return (
    <Button
      type="button"
      variant={variant}
      size="icon"
      onClick={toggleTheme}
      className={cn('h-10 w-10 rounded-xl shrink-0', className)}
      aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </Button>
  )
}
