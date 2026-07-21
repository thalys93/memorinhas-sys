import { useState } from 'react';
import { Lock, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { authService } from '@/services/auth.service';
import api from '@/services/api';
import { useAuthStore } from '@/store/use-auth-store';
import { resolveRoleNames, hasAnyRole, toAuthUser } from '@/lib/auth-utils';
import { SHOPKEEPER_ROLES } from '@/types/roles';
import type { Store } from '@/types/api';

export function ShopkeeperLoginPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  const setActiveStore = useAuthStore((s) => s.setActiveStore);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token, userData } = await authService.login(email, password);
      const roleNames = resolveRoleNames(userData.roles);
      if (!hasAnyRole(roleNames, SHOPKEEPER_ROLES)) {
        setError('Esta conta não tem acesso ao painel do lojista.');
        return;
      }
      setSession(token, toAuthUser(userData));
      try {
        const { data } = await api.get<{ found: Store }>('/auth/store', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setActiveStore(data.found.id);
      } catch {
        setError('Sua conta não está vinculada à loja.');
        return;
      }
      navigate('/lojista');
    } catch {
      setError('Email ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle variant="outline" scope="panel" />
      </div>
      <Card className="max-w-md w-full p-2">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center mb-2">
            <Logo size={60} />
          </div>
          <CardTitle className="text-card-title">Painel do Lojista</CardTitle>
          <CardDescription className="text-body">Gerencie sua loja Memorinhas.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
            <Button className="w-full" size="lg" type="submit" disabled={loading}>
              {loading ? 'Entrando...' : 'Acessar painel'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <button
            type="button"
            onClick={() => {
              navigate('/');
              window.scrollTo(0, 0);
            }}
            className="text-muted-foreground text-sm hover:text-foreground transition-colors"
          >
            Voltar para a loja
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}
