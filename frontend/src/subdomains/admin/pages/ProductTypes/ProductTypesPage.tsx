import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  useProductTypes,
  useCreateProductType,
  useUpdateProductType,
  useDeleteProductType,
} from '@/hooks/queries';
import { toast } from '@/lib/toast';
import type { ProductTypeEntity } from '@/types/api';

export function ProductTypesPage() {
  const { data, isLoading } = useProductTypes();
  const createType = useCreateProductType();
  const updateType = useUpdateProductType();
  const deleteType = useDeleteProductType();

  const [name, setName] = useState('');
  const [isCustomizable, setIsCustomizable] = useState(false);
  const [editing, setEditing] = useState<ProductTypeEntity | null>(null);

  const handleCreate = async () => {
    if (!name.trim()) return;
    await createType.mutateAsync({
      name: name.trim(),
      isCustomizable,
    });
    toast(`Tipo "${name.trim()}" criado`);
    setName('');
    setIsCustomizable(false);
  };

  const handleUpdate = async () => {
    if (!editing) return;
    await updateType.mutateAsync({
      id: editing.id,
      payload: {
        name: editing.name,
        isCustomizable: editing.isCustomizable,
        active: editing.active,
      },
    });
    toast('Tipo atualizado');
    setEditing(null);
  };

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Carregando tipos...</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-section-title mb-1">Tipos de produto</h1>
        <p className="text-muted-foreground text-sm">
          Catálogo global usado pelas lojas ao cadastrar produtos.
        </p>
      </div>

      <Card className="p-6 rounded-2xl space-y-4">
        <h2 className="font-medium text-sm text-muted-foreground">Novo tipo</h2>
        <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
          <div className="space-y-2 grow max-w-xs">
            <Label>Nome</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Kit"
              className="rounded-xl"
            />
          </div>
          <label className="flex items-center gap-2 h-10 cursor-pointer">
            <input
              type="checkbox"
              checked={isCustomizable}
              onChange={(e) => setIsCustomizable(e.target.checked)}
              className="rounded border-input"
            />
            <span className="text-sm text-muted-foreground">Customizável</span>
          </label>
          <Button onClick={handleCreate} className="rounded-xl">
            <Plus size={16} className="mr-2" /> Criar
          </Button>
        </div>
      </Card>

      <Card className="rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground">
                Nome
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground">
                Customizável
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground">
                Status
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground text-right">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {(data?.items ?? []).map((type) => (
              <tr key={type.id} className="hover:bg-muted/20">
                <td className="px-6 py-4 font-medium">{type.name}</td>
                <td className="px-6 py-4">
                  {type.isCustomizable ? 'Sim' : 'Não'}
                </td>
                <td className="px-6 py-4">
                  {type.active ? 'Ativo' : 'Inativo'}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditing({ ...type })}
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    disabled={!type.active}
                    onClick={() => deleteType.mutate(type.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {editing ? (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-6 rounded-2xl space-y-4">
            <h3 className="text-xl font-semibold tracking-tight">Editar tipo</h3>
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input
                value={editing.name}
                onChange={(e) =>
                  setEditing({ ...editing, name: e.target.value })
                }
                className="rounded-xl"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editing.isCustomizable}
                onChange={(e) =>
                  setEditing({ ...editing, isCustomizable: e.target.checked })
                }
                className="rounded border-input"
              />
              <span className="text-sm text-muted-foreground">Customizável</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editing.active}
                onChange={(e) =>
                  setEditing({ ...editing, active: e.target.checked })
                }
                className="rounded border-input"
              />
              <span className="text-sm text-muted-foreground">Ativo</span>
            </label>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setEditing(null)}
                className="rounded-xl"
              >
                Cancelar
              </Button>
              <Button onClick={handleUpdate} className="rounded-xl">
                Salvar
              </Button>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
