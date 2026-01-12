import React, { useState } from 'react';
import {
    Plus,
    Save,
    LayoutGrid,
    List as ListIcon,
    Trash2,
    Layers,
    CircleDollarSign,
    TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useOutletContext } from 'react-router-dom';

export const PricesPage = () => {
    const { config, onSave } = useOutletContext<{ config: any, onSave: (v: any) => void }>();
    const [kits, setKits] = useState(config?.kits || []);
    const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');

    const addKit = () => setKits([...kits, { quantity: 0, price: 0 }]);
    const removeKit = (idx: number) => setKits(kits.filter((_: any, i: number) => i !== idx));
    const updateKit = (idx: number, field: string, value: string) => {
        const updated = [...kits];
        updated[idx][field] = field === 'quantity' ? parseInt(value) || 0 : parseFloat(value) || 0;
        setKits(updated);
    };

    return (
        <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif text-foreground mb-1">Preços</h1>
                    <p className="text-muted-foreground text-sm">Gerencie seus kits de fotos.</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 md:gap-4">
                    <div className="flex bg-background p-1 rounded-xl border shadow-sm">
                        <Button
                            size="sm"
                            variant={viewMode === 'cards' ? 'default' : 'ghost'}
                            onClick={() => setViewMode('cards')}
                            className="rounded-lg px-3"
                        >
                            <LayoutGrid size={14} className="mr-2" />
                            <span className="hidden sm:inline">Cards</span>
                        </Button>
                        <Button
                            size="sm"
                            variant={viewMode === 'list' ? 'default' : 'ghost'}
                            onClick={() => setViewMode('list')}
                            className="rounded-lg px-3"
                        >
                            <ListIcon size={14} className="mr-2" />
                            <span className="hidden sm:inline">Lista</span>
                        </Button>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                        <Button variant="outline" size="sm" onClick={addKit} className="rounded-xl flex-1 sm:flex-none">
                            <Plus size={16} className="mr-2" /> Novo
                        </Button>
                        <Button size="sm" onClick={() => onSave({ ...config, kits })} className="rounded-xl flex-1 sm:flex-none">
                            <Save size={16} className="mr-2" /> Salvar
                        </Button>
                    </div>
                </div>
            </div>

            {viewMode === 'cards' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {kits.map((kit: any, idx: number) => (
                        <Card key={idx} className="group relative rounded-[2.5rem] p-4 md:p-6 hover:shadow-xl transition-all">
                            <CardHeader className="flex flex-row items-center justify-between pb-6">
                                <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-2xl font-bold text-[10px] uppercase tracking-widest">
                                    Plano #{idx + 1}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeKit(idx)}
                                    className="rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <Layers size={14} className="text-primary" />
                                        <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Fotos</Label>
                                    </div>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            value={kit.quantity}
                                            onChange={(e) => updateKit(idx, 'quantity', e.target.value)}
                                            className="rounded-xl pl-4 pr-12 font-bold bg-muted/30"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-[10px] font-bold">UN.</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <CircleDollarSign size={14} className="text-emerald-500" />
                                        <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Preço</Label>
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">R$</span>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={kit.price}
                                            onChange={(e) => updateKit(idx, 'price', e.target.value)}
                                            className="rounded-xl pl-10 font-bold bg-muted/30"
                                        />
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="pt-6 border-t flex justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[8px] text-muted-foreground uppercase font-bold tracking-widest">Custo p/ íma</span>
                                    <span className="text-base font-serif">
                                        R$ {kit.quantity > 0 ? (kit.price / kit.quantity).toFixed(2).replace('.', ',') : '0,00'}
                                    </span>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                                    <TrendingUp size={14} />
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="rounded-[1.5rem] md:rounded-[2.5rem] overflow-x-auto">
                    <div className="min-w-[600px]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-muted/50 border-b">
                                    <th className="px-6 py-4 text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Plano</th>
                                    <th className="px-6 py-4 text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Fotos</th>
                                    <th className="px-6 py-4 text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Valor</th>
                                    <th className="px-6 py-4 text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Unid.</th>
                                    <th className="px-6 py-4 text-right text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {kits.map((kit: any, idx: number) => (
                                    <tr key={idx} className="group hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-1 rounded-lg">#{idx + 1}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Input
                                                type="number"
                                                value={kit.quantity}
                                                onChange={(e) => updateKit(idx, 'quantity', e.target.value)}
                                                className="w-20 h-8 font-bold text-sm"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                <span className="text-muted-foreground text-[10px] font-bold">R$</span>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    value={kit.price}
                                                    onChange={(e) => updateKit(idx, 'price', e.target.value)}
                                                    className="w-24 h-8 font-bold text-emerald-600 text-sm"
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-medium text-muted-foreground">
                                                R$ {kit.quantity > 0 ? (kit.price / kit.quantity).toFixed(2).replace('.', ',') : '0,00'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="icon" onClick={() => removeKit(idx)} className="text-muted-foreground hover:text-destructive">
                                                <Trash2 size={16} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}
        </div>
    );
};
