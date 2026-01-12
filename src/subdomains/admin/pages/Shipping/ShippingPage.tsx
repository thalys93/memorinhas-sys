import React, { useState } from 'react';
import { Save, Calculator, Map as MapIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useOutletContext } from 'react-router-dom';

export const ShippingPage = () => {
    const { config, onSave } = useOutletContext<{ config: any, onSave: (v: any) => void }>();
    const [shipping, setShipping] = useState(config?.shipping || {});

    return (
        <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif text-foreground mb-1">Entrega</h1>
                    <p className="text-muted-foreground text-sm">Logística e taxas.</p>
                </div>
                <Button size="sm" onClick={() => onSave({ ...config, shipping })} className="rounded-xl">
                    <Save size={16} className="mr-2" /> Salvar
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
                <div className="lg:col-span-1">
                    <Card className="rounded-[2rem] p-2">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center text-primary border"><Calculator size={20} /></div>
                            <CardTitle className="text-lg">Taxas</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">CEP Local (Prefixo)</Label>
                                <Input
                                    value={shipping.localPrefix}
                                    placeholder="Ex: 92"
                                    onChange={(e) => setShipping({ ...shipping, localPrefix: e.target.value })}
                                    className="rounded-xl h-12 bg-muted/30"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Frete Local (R$)</Label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">R$</span>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={shipping.localRate}
                                        onChange={(e) => setShipping({ ...shipping, localRate: parseFloat(e.target.value) || 0 })}
                                        className="rounded-xl h-12 pl-10 bg-muted/30"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Frete RS (R$)</Label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">R$</span>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={shipping.standardRate}
                                        onChange={(e) => setShipping({ ...shipping, standardRate: parseFloat(e.target.value) || 0 })}
                                        className="rounded-xl h-12 pl-10 bg-muted/30"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-2">
                    <Card className="rounded-[2.5rem] p-2">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center text-primary border"><MapIcon size={20} /></div>
                            <CardTitle className="text-lg">Cobertura</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Cidades Atendidas</Label>
                                <Input
                                    value={shipping.regions}
                                    onChange={(e) => setShipping({ ...shipping, regions: e.target.value })}
                                    className="rounded-xl h-12 bg-muted/30"
                                />
                            </div>

                            <div className="relative rounded-[2rem] overflow-hidden border-4 border-muted h-[300px] md:h-[400px]">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    allowFullScreen
                                    src={`https://www.google.com/maps?q=${encodeURIComponent(shipping.regions || 'Canoas, RS')}&output=embed`}
                                    className="grayscale"
                                ></iframe>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
