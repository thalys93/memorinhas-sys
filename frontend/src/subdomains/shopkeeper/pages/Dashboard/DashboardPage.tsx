import { Link } from 'react-router-dom'
import {
  Tag,
  Truck,
  ShoppingBag,
  Plus,
  Store,
  MapPin,
  User,
  MessageCircle,
  Instagram,
  Palette,
  CircleDollarSign,
  Clock,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatCard } from '../../components/StatCard'
import { useMe, useOrdersSummary, useProducts, useStore } from '@/hooks/queries'
import { formatMoney } from '@/lib/freight'
import { normalizeInstagramHandle } from '@/lib/store-contact'

export const DashboardPage = () => {
  const { data: me } = useMe()
  const { data: storeData } = useStore()
  const { data: productsData } = useProducts()
  const { data: summary } = useOrdersSummary()

  const store = storeData
  const kitCount =
    productsData?.items.filter((p) => p.productType?.isCustomizable).length ?? 0
  const productCount = productsData?.items.length ?? 0
  const location = store?.settings?.profile?.location
  const whatsapp = store?.settings?.contact?.whatsapp
  const instagram = normalizeInstagramHandle(store?.settings?.contact?.instagram)
  const accentColor = store?.settings?.theme?.accentColor || '#8a6240'

  const completedCount = summary?.completedCount ?? 0
  const pendingCount = summary?.pendingCount ?? 0
  const revenue = summary?.revenue ?? 0
  const averageTicket = summary?.averageTicket ?? 0

  const quickActions = [
    { to: '/lojista/pedidos', label: 'Ver pedidos', icon: ShoppingBag },
    { to: '/lojista/produtos/novo', label: 'Criar novo produto', icon: Plus },
    { to: '/lojista/loja', label: 'Configurar loja', icon: Store },
    { to: '/lojista/entrega', label: 'Configurar frete', icon: Truck },
    { to: '/lojista/perfil', label: 'Meu perfil', icon: User },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-section-title text-foreground mb-1">
            Olá, {me?.name?.split(' ')[0] ?? 'Lojista'}!
          </h1>
          <p className="text-muted-foreground text-sm">
            {store?.name ?? 'Sua loja'} — painel de gestão.
          </p>
        </div>
        <div className="flex items-center gap-2 text-green-600 font-medium text-xs bg-green-50 px-3 py-1 rounded-full border border-green-100">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          LOJA ONLINE
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          icon={<ShoppingBag size={18} className="text-emerald-500" />}
          label="Finalizados"
          value={String(completedCount)}
          sub="Pedidos"
        />
        <StatCard
          icon={<CircleDollarSign size={18} className="text-primary" />}
          label="Receita"
          value={`R$ ${formatMoney(Number(revenue))}`}
          sub="Vendas concluídas"
        />
        <StatCard
          icon={<Clock size={18} className="text-amber-500" />}
          label="Pendentes"
          value={String(pendingCount)}
          sub="Aguardando"
        />
        <StatCard
          icon={<Tag size={18} className="text-blue-500" />}
          label="Ticket médio"
          value={`R$ ${formatMoney(Number(averageTicket))}`}
          sub={`${productCount} produtos · ${kitCount} kits`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <Card className="rounded-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Acesso rápido</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickActions.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-3 p-4 rounded-xl border border-border bg-muted/30 transition-colors hover:bg-muted/60 hover:border-primary/30"
              >
                <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center text-primary border border-border">
                  <Icon size={18} />
                </div>
                <span className="text-sm font-medium">{label}</span>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Sua loja</CardTitle>
            <Link to="/lojista/loja" className="text-xs text-primary hover:underline">
              Editar
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-lg font-semibold text-foreground">{store?.name ?? '—'}</p>
              <p className="text-sm text-muted-foreground">{productCount} produtos ativos</p>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin size={16} className="shrink-0" />
                <span>{location?.trim() || 'Localização não definida'}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageCircle size={16} className="shrink-0" />
                <span>{whatsapp || 'WhatsApp não definido'}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Instagram size={16} className="shrink-0" />
                <span>{instagram ? `@${instagram}` : 'Instagram não definido'}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Palette size={16} className="shrink-0" />
                <span
                  className="inline-block h-4 w-4 rounded-full border"
                  style={{ backgroundColor: accentColor }}
                />
                <span className="font-mono uppercase text-xs">{accentColor}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
