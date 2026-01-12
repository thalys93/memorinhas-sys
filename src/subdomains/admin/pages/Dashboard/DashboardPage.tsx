import React from 'react';
import {
    TrendingUp,
    Camera,
    ShoppingBag,
    Users,
    Tag,
    Truck,
    ArrowUpRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/Logo';
import { StatCard } from '../../components/StatCard';
import { useOutletContext } from 'react-router-dom';

export const DashboardPage = () => {
    const { config, profile } = useOutletContext<{ config: any, profile: any }>();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif text-foreground mb-1">Olá, {profile.name.split(' ')[0]}!</h1>
                    <p className="text-muted-foreground text-sm">Confira o desempenho da Memorinhas.</p>
                </div>
                <div className="flex items-center gap-2 text-green-600 font-bold text-[10px] md:text-xs bg-green-50 px-3 py-1 rounded-full border border-green-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    LOJA ONLINE
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <StatCard icon={<TrendingUp size={18} className="text-emerald-500" />} label="Conversão" value="4.8%" sub="Média" />
                <StatCard icon={<Camera size={18} className="text-primary" />} label="Fotos" value="1.2k" sub="+18%" />
                <StatCard icon={<ShoppingBag size={18} className="text-blue-500" />} label="Pedidos" value="42" sub="7 dias" />
                <StatCard icon={<Users size={18} className="text-purple-500" />} label="Visitas" value="850" sub="Hoje" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                <Card className="rounded-[2rem]">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg">Configurações</CardTitle>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Atual</span>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-background rounded-xl flex items-center justify-center text-primary shadow-sm border">
                                    <Tag size={18} />
                                </div>
                                <div>
                                    <p className="text-xs md:text-sm font-bold">{config?.kits?.length || 0} Planos Ativos</p>
                                    <p className="text-[8px] md:text-[10px] text-muted-foreground uppercase tracking-widest">Kits polaroid</p>
                                </div>
                            </div>
                            <ArrowUpRight size={16} className="text-muted-foreground" />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-background rounded-xl flex items-center justify-center text-primary shadow-sm border">
                                    <Truck size={18} />
                                </div>
                                <div>
                                    <p className="text-xs md:text-sm font-bold">Entrega: {config?.shipping?.regions?.split(',')[0] || 'N/A'}</p>
                                    <p className="text-[8px] md:text-[10px] text-muted-foreground uppercase tracking-widest">Frete fixo</p>
                                </div>
                            </div>
                            <ArrowUpRight size={16} className="text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-primary text-primary-foreground rounded-[2rem] relative overflow-hidden">
                    <CardContent className="p-8 md:p-10 relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <CardTitle className="text-lg md:text-xl mb-4 text-primary-foreground">Dica de Gestão</CardTitle>
                            <p className="text-primary-foreground/80 text-sm md:text-base leading-relaxed mb-6">
                                Notamos que o Kit de {config?.kits?.[2]?.quantity || 10} fotos é o mais acessado.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                                <p className="text-[8px] md:text-[10px] uppercase font-bold text-white/60 mb-1">Ticket Médio</p>
                                <p className="text-lg md:text-xl font-serif">R$ 54,00</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                                <p className="text-[8px] md:text-[10px] uppercase font-bold text-white/60 mb-1">Taxa de Zap</p>
                                <p className="text-lg md:text-xl font-serif">12%</p>
                            </div>
                        </div>
                    </CardContent>
                    <div className="absolute -bottom-10 -right-10 opacity-10 rotate-12 scale-150"><Logo size={150} /></div>
                </Card>
            </div>
        </div>
    );
};
