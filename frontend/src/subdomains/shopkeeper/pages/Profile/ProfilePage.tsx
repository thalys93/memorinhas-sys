import { useState, useEffect } from 'react'
import { Save, Edit2, User as UserIcon, Mail, Lock, Upload } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useMe, useUpdateMe } from '@/hooks/queries'
import { useAuthStore } from '@/store/use-auth-store'
import { toast } from '@/lib/toast'
import { getInitials } from '@/lib/user-display'
import { cn } from '@/lib/utils'
import { AvatarUploadModal } from './components/AvatarUploadModal'

export const ProfilePage = () => {
  const { data: me } = useMe()
  const authUser = useAuthStore((s) => s.user)
  const updateMe = useUpdateMe()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [avatarBroken, setAvatarBroken] = useState(false)
  const [avatarModalOpen, setAvatarModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const userId = me?.id ?? authUser?.id

  useEffect(() => {
    if (!me) return
    setName(me.name ?? '')
    setEmail(me.email ?? '')
    setAvatarUrl(me.avatar_url ?? '')
    setAvatarBroken(false)
  }, [me])

  const handleSave = async () => {
    if (!userId) return
    setSaving(true)
    try {
      await updateMe.mutateAsync({ name: name.trim() })
      toast('Perfil atualizado com sucesso')
    } catch {
      toast('Não foi possível salvar o perfil')
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarSaved = async (nextUrl: string) => {
    await updateMe.mutateAsync({ avatar_url: nextUrl })
    setAvatarUrl(nextUrl)
    setAvatarBroken(false)
  }

  const showAvatar = !!avatarUrl && !avatarBroken
  const displayName = name || me?.name || ''

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-section-title text-foreground mb-1">Meu Perfil</h1>
          <p className="text-muted-foreground text-sm">Gerencie sua conta de lojista.</p>
        </div>
        <Button size="sm" onClick={handleSave} disabled={saving} className="w-full md:w-auto rounded-xl">
          <Save size={16} className="mr-2" /> {saving ? 'Salvando...' : 'Atualizar'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <div className="md:col-span-1">
          <Card className="rounded-2xl p-6 text-center">
            <CardContent className="pt-6 space-y-4">
              <button
                type="button"
                disabled={saving}
                onClick={() => setAvatarModalOpen(true)}
                className={cn(
                  'w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full overflow-hidden border-2 border-dashed border-border bg-muted relative block transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  showAvatar && 'border-solid',
                )}
              >
                {showAvatar ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    onError={() => setAvatarBroken(true)}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-muted-foreground">
                    <Upload size={20} />
                    <span className="text-sm font-medium">{getInitials(displayName)}</span>
                  </div>
                )}
              </button>
              <CardTitle className="text-lg md:text-xl mb-1">{displayName}</CardTitle>
              <CardDescription className="text-xs">Lojista</CardDescription>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-xl"
                disabled={saving || !userId}
                onClick={() => setAvatarModalOpen(true)}
              >
                <Upload size={14} className="mr-2" />
                {showAvatar ? 'Trocar foto' : 'Escolher foto'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="rounded-2xl p-2">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-2xl bg-secondary flex items-center justify-center text-primary border">
                <Edit2 size={18} />
              </div>
              <CardTitle className="text-lg">Dados da Conta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground ml-1">Nome</Label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-xl h-12 pl-12 bg-muted/30"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground ml-1">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input
                    type="email"
                    value={email}
                    readOnly
                    disabled
                    className="rounded-xl h-12 pl-12 pr-12 bg-muted/50 cursor-not-allowed"
                  />
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {userId ? (
        <AvatarUploadModal
          open={avatarModalOpen}
          onOpenChange={setAvatarModalOpen}
          currentAvatarUrl={avatarUrl}
          displayName={displayName}
          userId={userId}
          onSaved={handleAvatarSaved}
        />
      ) : null}
    </div>
  )
}
