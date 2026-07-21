import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser, useRoles } from '@/hooks/queries';
import { resolveRoleNames } from '@/lib/auth-utils';
import { toast } from '@/lib/toast';
import type { User } from '@/types/api';

function RoleCheckboxes({
  selected,
  onChange,
  roles,
}: {
  selected: string[];
  onChange: (roles: string[]) => void;
  roles: { id: number; name: string }[];
}) {
  const toggle = (name: string) => {
    onChange(
      selected.includes(name)
        ? selected.filter((r) => r !== name)
        : [...selected, name],
    );
  };

  return (
    <div className="flex flex-wrap gap-3">
      {roles.map((role) => (
        <label key={role.id} className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={selected.includes(role.name)}
            onChange={() => toggle(role.name)}
            className="rounded border-input"
          />
          {role.name}
        </label>
      ))}
    </div>
  );
}

export function UsersPage() {
  const { data, isLoading } = useUsers();
  const { data: rolesData } = useRoles();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const roles = rolesData?.items ?? [];
  const [form, setForm] = useState({ name: '', email: '', roles: [] as string[] });
  const [editing, setEditing] = useState<User | null>(null);
  const [editingRoles, setEditingRoles] = useState<string[]>([]);

  const handleCreate = async () => {
    if (!form.name || !form.email || !form.roles.length) return;
    await createUser.mutateAsync({
      name: form.name,
      email: form.email,
      roles: form.roles,
    });
    toast(`Usuário "${form.name}" criado. E-mail com senha enviado.`);
    setForm({ name: '', email: '', roles: [] });
  };

  const openEdit = (user: User) => {
    setEditing({ ...user });
    setEditingRoles(resolveRoleNames(user.roles));
  };

  const handleUpdate = async () => {
    if (!editing || !editingRoles.length) return;
    await updateUser.mutateAsync({
      id: editing.id,
      payload: { name: editing.name, email: editing.email, roles: editingRoles },
    });
    setEditing(null);
    setEditingRoles([]);
  };

  if (isLoading) return <p className="text-sm text-muted-foreground">Carregando usuários...</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-section-title mb-1">Usuários</h1>
        <p className="text-muted-foreground text-sm">Gerencie contas da plataforma.</p>
      </div>

      <Card className="p-6 rounded-2xl space-y-4">
        <h2 className="font-medium text-sm text-muted-foreground">Novo usuário</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label>E-mail</Label>
            <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-xl" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Papéis</Label>
          <RoleCheckboxes
            roles={roles}
            selected={form.roles}
            onChange={(rolesSelected) => setForm({ ...form, roles: rolesSelected })}
          />
        </div>
        <Button onClick={handleCreate} className="rounded-xl" disabled={!form.roles.length}>
          <Plus size={16} className="mr-2" /> Criar usuário
        </Button>
      </Card>

      <Card className="rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground">Nome</th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground">E-mail</th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground">Papéis</th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {(data?.items ?? []).map((user) => (
              <tr key={user.id} className="hover:bg-muted/20">
                <td className="px-6 py-4 font-medium">{user.name}</td>
                <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                <td className="px-6 py-4">
                  {resolveRoleNames(user.roles).join(', ') || '—'}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(user)}>
                    <Pencil size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => deleteUser.mutate(user.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-6 rounded-2xl space-y-4">
            <h3 className="text-xl font-semibold tracking-tight">Editar usuário</h3>
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input
                type="email"
                value={editing.email}
                onChange={(e) => setEditing({ ...editing, email: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Papéis</Label>
              <RoleCheckboxes
                roles={roles}
                selected={editingRoles}
                onChange={setEditingRoles}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setEditing(null)} className="rounded-xl">
                Cancelar
              </Button>
              <Button onClick={handleUpdate} className="rounded-xl" disabled={!editingRoles.length}>
                Salvar
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
