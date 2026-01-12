import React, { useState } from 'react';
import { Save, Camera, Edit2, User as UserIcon, Mail, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useOutletContext } from 'react-router-dom';

export const ProfilePage = () => {
    const { profile, onSave } = useOutletContext<{ profile: any, onSave: (v: any) => void }>();
    const [editingProfile, setEditingProfile] = useState(profile);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setEditingProfile({ ...editingProfile, avatar: url });
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif text-foreground mb-1">Meu Perfil</h1>
                    <p className="text-muted-foreground text-sm">Gerencie sua conta admin.</p>
                </div>
                <Button size="sm" onClick={() => onSave(editingProfile)} className="w-full md:w-auto rounded-xl">
                    <Save size={16} className="mr-2" /> Atualizar
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                <div className="md:col-span-1">
                    <Card className="rounded-[2.5rem] p-6 text-center">
                        <CardContent className="pt-6">
                            <div className="relative inline-block mb-6">
                                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 shadow-inner">
                                    <img src={editingProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
                                </div>
                                <label className="absolute bottom-0 right-0 w-8 h-8 md:w-10 md:h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform border-4 border-background">
                                    <Camera size={14} />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                                </label>
                            </div>
                            <CardTitle className="text-lg md:text-xl mb-1">{editingProfile.name}</CardTitle>
                            <CardDescription className="uppercase tracking-widest text-[8px] md:text-[10px] font-bold">Administradora Geral</CardDescription>
                        </CardContent>
                    </Card>
                </div>

                <div className="md:col-span-2">
                    <Card className="rounded-[2.5rem] p-2">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-2xl bg-secondary flex items-center justify-center text-primary border"><Edit2 size={18} /></div>
                            <CardTitle className="text-lg">Dados da Conta</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Nome de Exibição</Label>
                                <div className="relative">
                                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                    <Input
                                        value={editingProfile.name}
                                        onChange={(e) => setEditingProfile({ ...editingProfile, name: e.target.value })}
                                        className="rounded-xl h-12 pl-12 bg-muted/30"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">E-mail de Acesso</Label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                    <Input
                                        type="email"
                                        value={editingProfile.email}
                                        disabled
                                        className="rounded-xl h-12 pl-12 bg-muted text-muted-foreground cursor-not-allowed border-dashed"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                        <Lock size={12} className="text-muted-foreground" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
