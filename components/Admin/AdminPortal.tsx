
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Tag, 
  Truck, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Users, 
  TrendingUp, 
  Camera, 
  Save, 
  Plus, 
  Trash2,
  Lock,
  Eye,
  ShoppingBag,
  ArrowUpRight,
  Calculator,
  MapPin,
  Info,
  DollarSign,
  Layers,
  Map as MapIcon,
  CircleDollarSign,
  Check,
  LayoutGrid,
  List as ListIcon,
  User as UserIcon,
  Mail,
  Edit2,
  Menu,
  X
} from 'lucide-react';
import { Logo } from '../Logo';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

interface AdminPortalProps {
  onExit: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onExit }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'prices' | 'shipping' | 'profile'>('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [config, setConfig] = useState<any>(null);
  const [profile, setProfile] = useState({
    name: 'Administradora Memorinhas',
    email: 'contato@memorinhas.com.br',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop'
  });

  useEffect(() => {
    const savedConfig = localStorage.getItem('memorinhas_config');
    if (savedConfig) setConfig(JSON.parse(savedConfig));

    const savedProfile = localStorage.getItem('memorinhas_admin_profile');
    if (savedProfile) setProfile(JSON.parse(savedProfile));
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsLoggedIn(true);
    } else {
      alert('Senha incorreta. Tente "admin123" para demonstração.');
    }
  };

  const saveConfig = (newConfig: any) => {
    setConfig(newConfig);
    localStorage.setItem('memorinhas_config', JSON.stringify(newConfig));
  };

  const saveProfile = (newProfile: any) => {
    setProfile(newProfile);
    localStorage.setItem('memorinhas_admin_profile', JSON.stringify(newProfile));
  };

  if (!isLoggedIn) {
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
            <form onSubmit={handleLogin} className="space-y-4">
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
            <button type="button" onClick={onExit} className="text-muted-foreground text-sm hover:text-foreground transition-colors">
              Voltar para a loja
            </button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const navItems = [
    { id: 'dashboard', label: 'Visão Geral', icon: <LayoutDashboard size={20} /> },
    { id: 'prices', label: 'Kits & Preços', icon: <Tag size={20} /> },
    { id: 'shipping', label: 'Região & Frete', icon: <Truck size={20} /> },
    { id: 'profile', label: 'Meu Perfil', icon: <UserIcon size={20} /> },
  ];

  const sidebarContent = (
    <>
      <div className={cn("flex items-center mb-12", isCollapsed ? 'justify-center' : 'justify-between')}>
        <div className={cn("flex items-center gap-3 overflow-hidden transition-all duration-300", isCollapsed ? 'w-0' : 'w-auto')}>
          <Logo size={32} />
          <span className="font-semibold text-slate-900 tracking-tight uppercase text-xs whitespace-nowrap">Gestão</span>
        </div>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-slate-100 rounded-xl text-muted-foreground hover:text-foreground transition-colors hidden md:block"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
        <button 
          onClick={() => setIsMobileMenuOpen(false)}
          className="p-2 hover:bg-slate-100 rounded-xl text-muted-foreground hover:text-foreground transition-colors md:hidden"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-grow space-y-1">
        {navItems.map((item) => (
          <NavItem 
            key={item.id}
            active={activeTab === item.id} 
            icon={item.icon} 
            label={item.label} 
            onClick={() => {
              setActiveTab(item.id as any);
              setIsMobileMenuOpen(false);
            }} 
            isCollapsed={isCollapsed} 
          />
        ))}
      </nav>

      <div className="pt-8 border-t space-y-2">
        <div className={cn("flex items-center gap-3 p-3 mb-2 rounded-2xl bg-secondary/50", isCollapsed && "justify-center")}>
          <img src={profile.avatar} className="w-8 h-8 rounded-full object-cover border shrink-0" alt="Avatar" />
          <div className={cn("overflow-hidden transition-all duration-300", isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100')}>
            <p className="text-[10px] font-bold text-foreground truncate">{profile.name}</p>
            <p className="text-[8px] text-muted-foreground uppercase tracking-widest">Admin</p>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          onClick={onExit}
          className={cn("w-full justify-start gap-3", isCollapsed && "justify-center px-0")}
        >
          <Eye size={18} className="shrink-0" />
          {!isCollapsed && <span>Loja</span>}
        </Button>
        
        <Button 
          variant="ghost" 
          onClick={() => setIsLoggedIn(false)}
          className={cn("w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50", isCollapsed && "justify-center px-0")}
        >
          <LogOut size={18} className="shrink-0" />
          {!isCollapsed && <span>Sair</span>}
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <div className="md:hidden bg-background border-b p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Logo size={32} />
          <span className="font-semibold text-foreground uppercase text-xs">Gestão</span>
        </div>
        <Button variant="outline" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
          <Menu size={20} />
        </Button>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] md:hidden">
          <div className="w-72 h-full bg-background p-6 animate-in slide-in-from-left duration-300 flex flex-col">
            {sidebarContent}
          </div>
        </div>
      )}

      <aside 
        className={cn(
          "hidden md:flex flex-col bg-background border-r p-6 fixed h-full z-10 shadow-sm transition-all duration-300 ease-in-out",
          isCollapsed ? 'w-20' : 'w-72'
        )}
      >
        {sidebarContent}
      </aside>

      <main className={cn(
        "flex-grow p-4 md:p-12 transition-all duration-300 ease-in-out",
        isCollapsed ? 'md:ml-20' : 'md:ml-72'
      )}>
        <div className="max-w-7xl mx-auto">
          {activeTab === 'dashboard' && <Dashboard config={config} profile={profile} />}
          {activeTab === 'prices' && <PricesManager config={config} onSave={saveConfig} />}
          {activeTab === 'shipping' && <ShippingManager config={config} onSave={saveConfig} />}
          {activeTab === 'profile' && <ProfileManager profile={profile} onSave={saveProfile} />}
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ active, icon, label, onClick, isCollapsed }: { active: boolean, icon: React.ReactNode, label: string, onClick: () => void, isCollapsed: boolean }) => (
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

const Dashboard = ({ config, profile }: any) => {
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
                  <p className="text-xs md:text-sm font-bold">{config?.kits.length} Planos Ativos</p>
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
                  <p className="text-xs md:text-sm font-bold">Entrega: {config?.shipping.regions.split(',')[0]}</p>
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
                  Notamos que o Kit de {config?.kits[2]?.quantity || 10} fotos é o mais acessado.
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

const StatCard = ({ icon, label, value, sub }: any) => (
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

const PricesManager = ({ config, onSave }: any) => {
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

const ShippingManager = ({ config, onSave }: any) => {
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

const ProfileManager = ({ profile, onSave }: any) => {
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
