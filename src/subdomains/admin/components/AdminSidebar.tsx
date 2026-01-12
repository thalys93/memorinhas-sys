import React from 'react';
import {
    ChevronLeft,
    ChevronRight,
    X,
    Eye,
    LogOut,
    LayoutDashboard,
    Tag,
    Truck,
    User as UserIcon
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { NavItem } from './NavItem';
import { useNavigate, useLocation } from 'react-router-dom';

interface AdminSidebarProps {
    profile: any;
    isCollapsed: boolean;
    setIsCollapsed: (v: boolean) => void;
    setIsMobileMenuOpen: (v: boolean) => void;
    onLogout: () => void;
}

export const AdminSidebar = ({
    profile,
    isCollapsed,
    setIsCollapsed,
    setIsMobileMenuOpen,
    onLogout
}: AdminSidebarProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const activeTab = location.pathname.split('/').pop() || 'dashboard';

    const navItems = [
        { id: 'dashboard', label: 'Visão Geral', icon: <LayoutDashboard size={20} /> },
        { id: 'precos', label: 'Kits & Preços', icon: <Tag size={20} /> },
        { id: 'entrega', label: 'Região & Frete', icon: <Truck size={20} /> },
        { id: 'perfil', label: 'Meu Perfil', icon: <UserIcon size={20} /> },
    ];

    return (
        <>
            <div className={cn("flex items-center mb-12", isCollapsed ? 'justify-center' : 'justify-between')}>
                <div className={cn("flex items-center gap-3 overflow-hidden transition-all duration-300", isCollapsed ? 'w-0' : 'w-auto')}>
                    <Logo size={32} />
                    <span className="font-semibold text-slate-900 tracking-tight uppercase text-xs whitespace-nowrap">Gestão</span>
                </div>
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 hover:bg-slate-100 rounded-xl text-muted-foreground hover:text-foreground transition-colors hidden md:block"
                >
                    {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
                <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 hover:bg-slate-100 rounded-xl text-muted-foreground hover:text-foreground transition-colors md:hidden"
                >
                    <X size={20} />
                </button>
            </div>

            <nav className="grow space-y-1">
                {navItems.map((item) => (
                    <NavItem
                        key={item.id}
                        active={activeTab === item.id}
                        icon={item.icon}
                        label={item.label}
                        onClick={() => {
                            const path = item.id === 'dashboard' ? '' : item.id;
                            navigate(`/admin/${path}`);
                            setIsMobileMenuOpen(false);
                        }}
                        isCollapsed={isCollapsed}
                    />
                ))}
            </nav>

            <div className="pt-8 border-t space-y-2">
                <div className={cn("flex items-center gap-3 p-3 mb-2 rounded-2xl bg-secondary/50", isCollapsed && "justify-center")}>
                    <img src={profile.avatar} className="w-8 h-8 rounded-full object-cover border shrink-0" alt="Avatar" />
                    <div className={cn("overflow-hidden transition-all duration-300", isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100')}>
                        <p className="text-[10px] font-bold text-foreground truncate">{profile.name}</p>
                        <p className="text-[8px] text-muted-foreground uppercase tracking-widest">Admin</p>
                    </div>
                </div>

                <Button
                    variant="ghost"
                    onClick={() => { navigate('/'); window.scrollTo(0, 0); }}
                    className={cn("w-full justify-start gap-3", isCollapsed && "justify-center px-0")}
                >
                    <Eye size={18} className="shrink-0" />
                    {!isCollapsed && <span>Loja</span>}
                </Button>

                <Button
                    variant="ghost"
                    onClick={onLogout}
                    className={cn("w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50", isCollapsed && "justify-center px-0")}
                >
                    <LogOut size={18} className="shrink-0" />
                    {!isCollapsed && <span>Sair</span>}
                </Button>
            </div>
        </>
    );
};
