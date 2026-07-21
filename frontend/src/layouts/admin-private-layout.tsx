import React, { useEffect, useRef, useState } from 'react';
import { Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Shield,
  Store,
  Upload,
  Users,
  X,
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { UserAvatar } from '@/components/user-avatar';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/use-auth-store';
import { ADMIN_ROLES } from '@/types/roles';
import { useMe, useUpdateMe } from '@/hooks/queries';
import { resolveRoleNames, hasAnyRole } from '@/lib/auth-utils';
import { NavItem } from '@/subdomains/shopkeeper/components/NavItem';
import { UploadTemplates } from '@/enums/upload-templates';
import { uploadToCloudinary, buildCloudinaryPublicId } from '@/lib/cloudinary-upload';
import { toast } from '@/lib/toast';
import { getInitials } from '@/lib/user-display';

function AdminPrivateLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { data: me } = useMe();
  const updateMe = useUpdateMe();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profileEdit, setProfileEdit] = useState<{ name: string; email: string } | null>(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState('');
  const [avatarBroken, setAvatarBroken] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    return () => {
      if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
    };
  }, [localPreviewUrl]);

  if (!token || !user) {
    return <Navigate to="/admin/login" replace />;
  }

  const roleNames = resolveRoleNames(me?.roles ?? user.roles);
  if (!hasAnyRole(roleNames, ADMIN_ROLES)) {
    return <Navigate to="/admin/login" replace />;
  }

  const profile = {
    name: me?.name ?? user.name ?? 'Admin',
    email: me?.email ?? user.email,
    avatar: me?.avatar_url ?? null,
  };

  const userId = me?.id ?? user.id;

  const navItems = [
    { id: '', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'loja', label: 'Loja', icon: <Store size={20} /> },
    { id: 'usuarios', label: 'Usuários', icon: <Users size={20} /> },
    { id: 'papeis', label: 'Papéis', icon: <Shield size={20} /> },
    { id: 'tipos-produto', label: 'Tipos de produto', icon: <Package size={20} /> },
  ];

  const activeTab = location.pathname.replace('/admin', '').replace(/^\//, '') || '';

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const openProfileEdit = () => {
    setProfileEdit({
      name: me?.name ?? user.name ?? '',
      email: me?.email ?? user.email ?? '',
    });
    setAvatarUrl(me?.avatar_url ?? '');
    setPendingFile(null);
    setAvatarBroken(false);
    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
      setLocalPreviewUrl('');
    }
    setIsMobileMenuOpen(false);
  };

  const selectAvatarFile = (file: File) => {
    if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
    setPendingFile(file);
    setLocalPreviewUrl(URL.createObjectURL(file));
    setAvatarBroken(false);
  };

  const handleProfileSave = async () => {
    if (!profileEdit || !userId) return;
    setSaving(true);
    try {
      let nextAvatarUrl = avatarUrl;

      if (pendingFile) {
        nextAvatarUrl = await uploadToCloudinary(pendingFile, {
          publicId: buildCloudinaryPublicId(
            profileEdit.name.trim() || profile.name || 'user',
            userId,
          ),
          uploadPreset: UploadTemplates.Avatars,
          displayName: profileEdit.name.trim() || profile.name || 'Avatar',
        });
        setAvatarUrl(nextAvatarUrl);
        setPendingFile(null);
        if (localPreviewUrl) {
          URL.revokeObjectURL(localPreviewUrl);
          setLocalPreviewUrl('');
        }
      }

      await updateMe.mutateAsync({
        name: profileEdit.name.trim(),
        email: profileEdit.email.trim(),
        avatar_url: nextAvatarUrl || undefined,
      });
      toast('Perfil atualizado com sucesso');
      setProfileEdit(null);
    } catch {
      toast('Não foi possível salvar o perfil');
    } finally {
      setSaving(false);
    }
  };

  const previewSrc = localPreviewUrl || avatarUrl;
  const showAvatar = !!previewSrc && !avatarBroken;

  const sidebar = (
    <>
      <div className={cn('flex items-center mb-12', isCollapsed ? 'justify-center' : 'justify-between')}>
        <div
          className={cn(
            'flex items-center gap-3 overflow-hidden transition-all duration-300',
            isCollapsed ? 'w-0' : 'w-auto',
          )}
        >
          <Logo size={32} />
          <span className="text-label text-foreground tracking-tight text-sm whitespace-nowrap">
            Plataforma
          </span>
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-accent rounded-xl text-muted-foreground hover:text-foreground transition-colors hidden md:block"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="p-2 hover:bg-accent rounded-xl text-muted-foreground hover:text-foreground transition-colors md:hidden"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="grow space-y-1">
        {navItems.map((item) => (
          <NavItem
            key={item.id || 'dashboard'}
            active={activeTab === item.id}
            icon={item.icon}
            label={item.label}
            onClick={() => {
              navigate(item.id ? `/admin/${item.id}` : '/admin');
              setIsMobileMenuOpen(false);
            }}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>

      <div className="pt-8 border-t space-y-2">
        <ThemeToggle layout="row" isCollapsed={isCollapsed} scope="panel" />
        <button
          type="button"
          onClick={openProfileEdit}
          className={cn(
            'w-full flex items-center gap-3 p-3 mb-2 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors text-left',
            isCollapsed && 'justify-center',
          )}
        >
          <UserAvatar
            name={profile.name}
            src={profile.avatar}
            className="w-8 h-8 shrink-0 border"
            textClassName="text-[10px]"
          />
          <div
            className={cn(
              'overflow-hidden transition-all duration-300',
              isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100',
            )}
          >
            <p className="text-label text-foreground truncate">{profile.name}</p>
            <p className="text-label font-normal text-muted-foreground">Admin</p>
          </div>
        </button>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            'w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-500/10',
            isCollapsed && 'justify-center px-0',
          )}
        >
          <LogOut size={18} className="shrink-0" />
          {!isCollapsed && <span>Sair</span>}
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-surface-alt flex flex-col md:flex-row">
      <div className="md:hidden bg-background border-b border-border p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Logo size={32} />
          <span className="text-label text-foreground">Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle scope="panel" />
          <Button variant="outline" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={20} />
          </Button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-60 md:hidden">
          <div className="w-72 h-full bg-background p-6 flex flex-col">{sidebar}</div>
        </div>
      )}

      <aside
        className={cn(
          'hidden md:flex flex-col bg-background border-r border-border p-6 fixed h-full z-10 transition-all duration-300 ease-[cubic-bezier(0,0,0.5,1)]',
          isCollapsed ? 'w-20' : 'w-72',
        )}
      >
        {sidebar}
      </aside>

      <main
        className={cn(
          'grow p-4 md:p-12 transition-all duration-300 ease-in-out',
          isCollapsed ? 'md:ml-20' : 'md:ml-72',
        )}
      >
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      {profileEdit && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-6 space-y-4">
            <h3 className="text-card-title">Meu perfil</h3>
            <div className="flex flex-col items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) selectAvatarFile(file);
                  e.target.value = '';
                }}
              />
              <button
                type="button"
                disabled={saving}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  'w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-border bg-muted relative block transition-colors hover:border-primary/50',
                  showAvatar && 'border-solid',
                )}
              >
                {showAvatar ? (
                  <img
                    src={previewSrc}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    onError={() => setAvatarBroken(true)}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-muted-foreground">
                    <Upload size={18} />
                    <span className="text-sm font-medium">{getInitials(profileEdit.name)}</span>
                  </div>
                )}
              </button>
              {pendingFile ? (
                <p className="text-xs text-muted-foreground">Preview local — será enviada ao salvar</p>
              ) : null}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-xl"
                disabled={saving}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={14} className="mr-2" />
                {showAvatar ? 'Trocar foto' : 'Escolher foto'}
              </Button>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Nome</Label>
              <Input
                value={profileEdit.name}
                onChange={(e) => setProfileEdit({ ...profileEdit, name: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">E-mail</Label>
              <Input
                type="email"
                value={profileEdit.email}
                onChange={(e) => setProfileEdit({ ...profileEdit, email: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setProfileEdit(null)}
                disabled={saving}
                className="rounded-xl"
              >
                Cancelar
              </Button>
              <Button onClick={handleProfileSave} disabled={saving} className="rounded-xl">
                {saving ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default AdminPrivateLayout;
