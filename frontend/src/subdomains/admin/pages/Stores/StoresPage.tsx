import { useEffect, useState } from 'react'
import { UserMinus, UserPlus } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import {
  useStore,
  useUpdateStore,
  useAssignKeepers,
  useRemoveKeeper,
  useUsers,
} from '@/hooks/queries'
import { toast } from '@/lib/toast'
import { resolveRoleNames, hasAnyRole } from '@/lib/auth-utils'
import { KEEPER_ELIGIBLE_ROLES } from '@/types/roles'

export function StoresPage() {
  const { data: store, isLoading } = useStore()
  const { data: usersData } = useUsers(1, 100)
  const updateStore = useUpdateStore()
  const assignKeepers = useAssignKeepers()
  const removeKeeper = useRemoveKeeper()

  const eligibleUsers = (usersData?.items ?? []).filter((u) =>
    hasAnyRole(resolveRoleNames(u.roles), KEEPER_ELIGIBLE_ROLES),
  )

  const [name, setName] = useState('')
  const [brandUrl, setBrandUrl] = useState('')
  const [addKeeperId, setAddKeeperId] = useState('')

  useEffect(() => {
    if (!store) return
    setName(store.name)
    setBrandUrl(store.brand_url)
  }, [store])

  const keepers = store?.keepers ?? []
  const keeperIds = new Set(keepers.map((k) => k.id))
  const availableKeepers = eligibleUsers.filter((u) => !keeperIds.has(u.id))

  const handleSave = async () => {
    if (!name.trim() || !brandUrl.trim()) return
    await updateStore.mutateAsync({ name: name.trim(), brand_url: brandUrl.trim() })
    toast('Loja atualizada')
  }

  const handleAssign = async () => {
    if (!addKeeperId) return
    await assignKeepers.mutateAsync({ keeperIds: [addKeeperId] })
    setAddKeeperId('')
    toast('Conta vinculada à loja')
  }

  const handleRemove = async (userId: string) => {
    await removeKeeper.mutateAsync(userId)
    toast('Conta desvinculada')
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Carregando loja...</p>
  }

  if (!store) {
    return <p className="text-sm text-muted-foreground">Loja não encontrada.</p>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-section-title mb-1">Loja</h1>
        <p className="text-muted-foreground text-sm">
          Dados da loja e contas vinculadas.
        </p>
      </div>

      <Card className="p-6 rounded-2xl space-y-4">
        <h2 className="font-medium text-sm text-muted-foreground">Dados</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label>Brand URL</Label>
            <Input
              value={brandUrl}
              onChange={(e) => setBrandUrl(e.target.value)}
              className="rounded-xl"
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Vendas: {store.sales ?? 0}</p>
        <Button onClick={handleSave} disabled={updateStore.isPending} className="rounded-xl">
          Salvar
        </Button>
      </Card>

      <Card className="p-6 rounded-2xl space-y-4">
        <h2 className="font-medium text-sm text-muted-foreground">Keepers</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <Select
            value={addKeeperId}
            onChange={(e) => setAddKeeperId(e.target.value)}
            className="rounded-xl flex-1"
          >
            <option value="">Adicionar conta</option>
            {availableKeepers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </Select>
          <Button
            onClick={handleAssign}
            disabled={!addKeeperId || assignKeepers.isPending}
            className="rounded-xl"
          >
            <UserPlus size={16} className="mr-2" /> Vincular
          </Button>
        </div>

        {keepers.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma conta vinculada.</p>
        ) : (
          <ul className="divide-y rounded-xl border border-border">
            {keepers.map((keeper) => (
              <li
                key={keeper.id}
                className="flex items-center justify-between gap-3 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-sm">{keeper.name}</p>
                  <p className="text-xs text-muted-foreground">{keeper.email}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  onClick={() => handleRemove(keeper.id)}
                  disabled={removeKeeper.isPending}
                >
                  <UserMinus size={16} />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
