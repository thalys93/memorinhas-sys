import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRoles, useCreateRole, useUpdateRole, useDeleteRole } from '@/hooks/queries';
import { toast } from '@/lib/toast';
import type { Role } from '@/types/api';

export function RolesPage() {
  const { data, isLoading } = useRoles();
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();
  const deleteRole = useDeleteRole();

  const [name, setName] = useState('');
  const [editing, setEditing] = useState<Role | null>(null);

  const handleCreate = async () => {
    if (!name.trim()) return;
    await createRole.mutateAsync({ name: name.trim() });
    toast(`Papel "${name.trim()}" criado com sucesso`);
    setName('');
  };

  const handleUpdate = async () => {
    if (!editing) return;
    await updateRole.mutateAsync({ id: editing.id, payload: { name: editing.name } });
    setEditing(null);
  };

  if (isLoading) return <p className="text-sm text-muted-foreground">Carregando papéis...</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-section-title mb-1">Papéis</h1>
        <p className="text-muted-foreground text-sm">Gerencie roles de acesso.</p>
      </div>

      <Card className="p-6 rounded-2xl space-y-4">
        <h2 className="font-medium text-sm text-muted-foreground">Novo papel</h2>
        <div className="flex gap-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Shopkeeper"
            className="rounded-xl max-w-xs"
          />
          <Button onClick={handleCreate} className="rounded-xl">
            <Plus size={16} className="mr-2" /> Criar
          </Button>
        </div>
      </Card>

      <Card className="rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground">ID</th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground">Nome</th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {(data?.items ?? []).map((role) => (
              <tr key={role.id} className="hover:bg-muted/20">
                <td className="px-6 py-4 text-muted-foreground">{role.id}</td>
                <td className="px-6 py-4 font-medium">{role.name}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => setEditing({ ...role })}>
                    <Pencil size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => deleteRole.mutate(role.id)}
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
            <h3 className="text-xl font-semibold tracking-tight">Editar papel</h3>
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setEditing(null)} className="rounded-xl">
                Cancelar
              </Button>
              <Button onClick={handleUpdate} className="rounded-xl">Salvar</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
