import React, { useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Menu } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/use-auth-store';
import { SHOPKEEPER_ROLES } from '@/types/roles';
import { ShopkeeperSidebar } from '@/subdomains/shopkeeper/components/ShopkeeperSidebar';
import { NewOrderWatcher } from '@/subdomains/shopkeeper/components/NewOrderWatcher';
import { useMe } from '@/hooks/queries';
import { resolveRoleNames, hasAnyRole } from '@/lib/auth-utils';

function ShopkeeperPrivateLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { data: me } = useMe();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!token || !user) {
    return <Navigate to="/lojista/login" replace />;
  }

  const roleNames = resolveRoleNames(me?.roles ?? user.roles);
  if (!hasAnyRole(roleNames, SHOPKEEPER_ROLES)) {
    return <Navigate to="/lojista/login" replace />;
  }

  const profile = {
    name: me?.name ?? user.name ?? 'Lojista',
    email: me?.email ?? user.email,
    avatar: me?.avatar_url ?? null,
  };

  const handleLogout = () => {
    logout();
    queryClient.clear();
    navigate('/lojista/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-surface-alt flex flex-col md:flex-row">
      <div className="md:hidden bg-background border-b border-border p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Logo size={32} />
          <span className="text-label text-foreground">Lojista</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle scope="panel" />
          <Button variant="outline" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={20} />
          </Button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-60 md:hidden">
          <div className="w-72 h-full bg-background p-6 animate-in slide-in-from-left duration-300 flex flex-col">
            <ShopkeeperSidebar
              profile={profile}
              isCollapsed={false}
              setIsCollapsed={setIsCollapsed}
              setIsMobileMenuOpen={setIsMobileMenuOpen}
              onLogout={handleLogout}
            />
          </div>
        </div>
      )}

      <aside
        className={cn(
          'hidden md:flex flex-col bg-background border-r border-border fixed h-full z-10 transition-all duration-300 ease-[cubic-bezier(0,0,0.5,1)]',
          isCollapsed ? 'w-20 px-2 py-6 items-center' : 'w-72 p-6',
        )}
      >
        <ShopkeeperSidebar
          profile={profile}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          onLogout={handleLogout}
        />
      </aside>

      <main
        className={cn(
          'grow p-4 md:p-12 transition-all duration-300 ease-in-out',
          isCollapsed ? 'md:ml-20' : 'md:ml-72',
        )}
      >
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
      <NewOrderWatcher />
    </div>
  );
}

export default ShopkeeperPrivateLayout;
