import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface LoginPageProps {
    onLogin: (password: string) => void;
}

export const LoginPage = ({ onLogin }: LoginPageProps) => {
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(password);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <Card className="max-w-md w-full p-2">
                <CardHeader className="text-center space-y-4">
                    <div className="flex justify-center mb-2">
                        <Logo size={60} />
                    </div>
                    <CardTitle className="text-2xl">Painel de Gestão</CardTitle>
                    <CardDescription>Acesso restrito para administradores Memorinhas.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">Senha de acesso</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Sua senha"
                                    className="pl-10 h-12 rounded-xl"
                                />
                            </div>
                        </div>
                        <Button className="w-full h-12 rounded-xl text-md font-bold" type="submit">
                            Acessar Painel
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center">
                    <button
                        type="button"
                        onClick={() => { navigate('/'); window.scrollTo(0, 0); }}
                        className="text-muted-foreground text-sm hover:text-foreground transition-colors"
                    >
                        Voltar para a loja
                    </button>
                </CardFooter>
            </Card>
        </div>
    );
};
