import { Store, Users, Shield, TrendingUp } from 'lucide-react';
import { StatCard } from '@/subdomains/shopkeeper/components/StatCard';
import { useStore, useUsers, useRoles } from '@/hooks/queries';

export function AdminDashboardPage() {
  const { data: store } = useStore();
  const { data: users } = useUsers();
  const { data: roles } = useRoles();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-section-title text-foreground mb-1">Plataforma Memorinhas Sys</h1>
        <p className="text-muted-foreground text-sm">Visão geral da administração.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          icon={<Store size={18} className="text-primary" />}
          label="Loja"
          value={store?.name ?? '—'}
          sub={store?.brand_url ?? 'Não configurada'}
        />
        <StatCard
          icon={<Users size={18} className="text-blue-500" />}
          label="Usuários"
          value={String(users?.meta.totalItems ?? 0)}
          sub="No sistema"
        />
        <StatCard
          icon={<Shield size={18} className="text-purple-500" />}
          label="Papéis"
          value={String(roles?.meta.totalItems ?? 0)}
          sub="Definidos"
        />
        <StatCard
          icon={<TrendingUp size={18} className="text-emerald-500" />}
          label="Vendas"
          value={String(store?.sales ?? 0)}
          sub="Da loja"
        />
      </div>
    </div>
  );
}
