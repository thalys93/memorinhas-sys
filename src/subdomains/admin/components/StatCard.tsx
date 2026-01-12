import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    sub: string;
}

export const StatCard = ({ icon, label, value, sub }: StatCardProps) => (
    <Card className="rounded-[1.5rem] md:rounded-[2rem]">
        <CardContent className="p-4 md:p-8">
            <div className="flex items-center justify-between mb-2 md:mb-4">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-secondary flex items-center justify-center">{icon}</div>
            </div>
            <h4 className="text-muted-foreground text-[10px] md:text-sm mb-1">{label}</h4>
            <p className="text-xl md:text-3xl font-serif text-foreground mb-1 md:mb-2">{value}</p>
            <p className="text-[8px] md:text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{sub}</p>
        </CardContent>
    </Card>
);
