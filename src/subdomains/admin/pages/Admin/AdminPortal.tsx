import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Components
import { AdminSidebar } from '../../components/AdminSidebar';

// Pages
import { LoginPage } from '../Login/LoginPage';

const AdminPortal = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [config, setConfig] = useState<any>(null);
  const [profile, setProfile] = useState({
    name: 'Administradora Memorinhas',
    email: 'contato@memorinhas.com.br',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop'
  });

  useEffect(() => {
    const savedConfig = localStorage.getItem('memorinhas_config');
    if (savedConfig) setConfig(JSON.parse(savedConfig));

    const savedProfile = localStorage.getItem('memorinhas_admin_profile');
    if (savedProfile) setProfile(JSON.parse(savedProfile));
  }, []);

  const handleLogin = (password: string) => {
    if (password === 'admin123') {
      setIsLoggedIn(true);
    } else {
      alert('Senha incorreta. Tente "admin123" para demonstração.');
    }
  };

  const saveConfig = (newConfig: any) => {
    setConfig(newConfig);
    localStorage.setItem('memorinhas_config', JSON.stringify(newConfig));
  };

  const saveProfile = (newProfile: any) => {
    setProfile(newProfile);
    localStorage.setItem('memorinhas_admin_profile', JSON.stringify(newProfile));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/admin');
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-background border-b p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Logo size={32} />
          <span className="font-semibold text-foreground uppercase text-xs">Gestão</span>
        </div>
        <Button variant="outline" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
          <Menu size={20} />
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-60 md:hidden">
          <div className="w-72 h-full bg-background p-6 animate-in slide-in-from-left duration-300 flex flex-col">
            <AdminSidebar
              profile={profile}
              isCollapsed={false}
              setIsCollapsed={setIsCollapsed}
              setIsMobileMenuOpen={setIsMobileMenuOpen}
              onLogout={handleLogout}
            />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col bg-background border-r p-6 fixed h-full z-10 shadow-sm transition-all duration-300 ease-in-out",
          isCollapsed ? 'w-20' : 'w-72'
        )}
      >
        <AdminSidebar
          profile={profile}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          onLogout={handleLogout}
        />
      </aside>

      {/* Main Content Area */}
      <main className={cn(
        "grow p-4 md:p-12 transition-all duration-300 ease-in-out",
        isCollapsed ? 'md:ml-20' : 'md:ml-72'
      )}>
        <div className="max-w-7xl mx-auto">
          <Outlet context={{ config, profile, onSave: saveConfig, saveProfile }} />
        </div>
      </main>
    </div>
  );
};

export default AdminPortal;
