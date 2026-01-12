import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavItemProps {
    active: boolean;
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    isCollapsed: boolean;
}

export const NavItem = ({ active, icon, label, onClick, isCollapsed }: NavItemProps) => (
    <Button
        variant={active ? "default" : "ghost"}
        onClick={onClick}
        className={cn(
            "w-full justify-start gap-3",
            isCollapsed && "justify-center px-0",
            !active && "text-muted-foreground hover:text-foreground"
        )}
        title={isCollapsed ? label : ""}
    >
        <div className="flex shrink-0 w-5 h-5 items-center justify-center">{icon}</div>
        <div className={cn("overflow-hidden transition-all duration-300", isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100')}>
            <span className="text-sm font-semibold whitespace-nowrap">{label}</span>
        </div>
    </Button>
);
