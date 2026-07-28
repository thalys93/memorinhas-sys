import { useState } from 'react';
import { Plus, Pencil, Trash2, Power } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import {
  useProductAttributeFields,
  useCreateProductAttributeField,
  useUpdateProductAttributeField,
  useDeleteProductAttributeField,
} from '@/hooks/queries';
import { toast } from '@/lib/toast';
import type {
  ProductAttributeField,
  ProductAttributeFieldType,
} from '@/types/api';

const FIELD_TYPE_LABELS: Record<ProductAttributeFieldType, string> = {
  text: 'Texto',
  number: 'Número',
  boolean: 'Sim/Não',
  color_list: 'Cores',
  select: 'Seleção múltipla',
};

const FIELD_TYPES = Object.keys(FIELD_TYPE_LABELS) as ProductAttributeFieldType[];

function emptyCreateState() {
  return {
    name: '',
    type: 'text' as ProductAttributeFieldType,
    optionsText: '',
    sortOrder: 0,
  };
}

export function ProductAttributeFieldsPage() {
  const { data, isLoading } = useProductAttributeFields();
  const createField = useCreateProductAttributeField();
  const updateField = useUpdateProductAttributeField();
  const deleteField = useDeleteProductAttributeField();

  const [createForm, setCreateForm] = useState(emptyCreateState());
  const [editing, setEditing] = useState<ProductAttributeField | null>(null);
  const [editingOptionsText, setEditingOptionsText] = useState('');

  const parseOptions = (text: string) =>
    text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

  const handleCreate = async () => {
    if (!createForm.name.trim()) return;
    const options =
      createForm.type === 'select'
        ? parseOptions(createForm.optionsText)
        : undefined;
    if (createForm.type === 'select' && (!options || options.length === 0)) {
      toast('Informe ao menos uma opção');
      return;
    }
    await createField.mutateAsync({
      name: createForm.name.trim(),
      type: createForm.type,
      options,
      sortOrder: createForm.sortOrder,
    });
    toast(`Campo "${createForm.name.trim()}" criado`);
    setCreateForm(emptyCreateState());
  };

  const openEdit = (field: ProductAttributeField) => {
    setEditing({ ...field });
    setEditingOptionsText((field.options ?? []).join('\n'));
  };

  const handleUpdate = async () => {
    if (!editing) return;
    const options =
      editing.type === 'select' ? parseOptions(editingOptionsText) : [];
    if (editing.type === 'select' && options.length === 0) {
      toast('Informe ao menos uma opção');
      return;
    }
    await updateField.mutateAsync({
      id: editing.id,
      payload: {
        name: editing.name,
        type: editing.type,
        options,
        active: editing.active,
        sortOrder: editing.sortOrder,
      },
    });
    toast('Campo atualizado');
    setEditing(null);
  };

  const handleToggleActive = async (field: ProductAttributeField) => {
    await updateField.mutateAsync({
      id: field.id,
      payload: { active: !field.active },
    });
    toast(field.active ? 'Campo desativado' : 'Campo ativado');
  };

  const handleDelete = async (field: ProductAttributeField) => {
    const confirmed = window.confirm(
      `Excluir o campo "${field.name}"? Produtos que já usam esse campo mantêm o valor como legado.`,
    );
    if (!confirmed) return;
    await deleteField.mutateAsync(field.id);
    toast('Campo excluído');
  };

  if (isLoading) {
    return (
      <p className="text-sm text-muted-foreground">Carregando campos...</p>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-section-title mb-1">Campos de produto</h1>
        <p className="text-muted-foreground text-sm">
          Catálogo global de informações extras usadas pelos lojistas.
        </p>
      </div>

      <Card className="p-6 rounded-2xl space-y-4">
        <h2 className="font-medium text-sm text-muted-foreground">Novo campo</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input
              value={createForm.name}
              onChange={(e) =>
                setCreateForm((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Material"
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select
              value={createForm.type}
              onChange={(e) =>
                setCreateForm((prev) => ({
                  ...prev,
                  type: e.target.value as ProductAttributeFieldType,
                }))
              }
              className="rounded-xl"
            >
              {FIELD_TYPES.map((type) => (
                <option key={type} value={type}>
                  {FIELD_TYPE_LABELS[type]}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Ordem</Label>
            <Input
              type="number"
              min={0}
              value={createForm.sortOrder}
              onChange={(e) =>
                setCreateForm((prev) => ({
                  ...prev,
                  sortOrder: Number(e.target.value) || 0,
                }))
              }
              className="rounded-xl"
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleCreate} className="rounded-xl w-full sm:w-auto">
              <Plus size={16} className="mr-2" /> Criar
            </Button>
          </div>
        </div>
        {createForm.type === 'select' ? (
          <div className="space-y-2 max-w-md">
            <Label>Opções (uma por linha)</Label>
            <textarea
              value={createForm.optionsText}
              onChange={(e) =>
                setCreateForm((prev) => ({
                  ...prev,
                  optionsText: e.target.value,
                }))
              }
              rows={4}
              placeholder={'P\nM\nG\nGG'}
              className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm"
            />
          </div>
        ) : null}
      </Card>

      <Card className="rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground">
                Nome
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground">
                Tipo
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-muted-foreground">
                Ordem
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
            {(data?.items ?? []).map((field) => (
              <tr key={field.id} className="hover:bg-muted/20">
                <td className="px-6 py-4 font-medium">{field.name}</td>
                <td className="px-6 py-4">
                  {FIELD_TYPE_LABELS[field.type]}
                </td>
                <td className="px-6 py-4">{field.sortOrder}</td>
                <td className="px-6 py-4">
                  {field.active ? 'Ativo' : 'Inativo'}
                </td>
                <td className="px-6 py-4 text-right space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(field)}
                    aria-label="Editar campo"
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleActive(field)}
                    aria-label={
                      field.active ? 'Desativar campo' : 'Ativar campo'
                    }
                  >
                    <Power size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => handleDelete(field)}
                    aria-label="Excluir campo"
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
            <h3 className="text-xl font-semibold tracking-tight">
              Editar campo
            </h3>
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
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select
                value={editing.type}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    type: e.target.value as ProductAttributeFieldType,
                  })
                }
                className="rounded-xl"
              >
                {FIELD_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {FIELD_TYPE_LABELS[type]}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Ordem</Label>
              <Input
                type="number"
                min={0}
                value={editing.sortOrder}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    sortOrder: Number(e.target.value) || 0,
                  })
                }
                className="rounded-xl"
              />
            </div>
            {editing.type === 'select' ? (
              <div className="space-y-2">
                <Label>Opções (uma por linha)</Label>
                <textarea
                  value={editingOptionsText}
                  onChange={(e) => setEditingOptionsText(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm"
                />
              </div>
            ) : null}
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
