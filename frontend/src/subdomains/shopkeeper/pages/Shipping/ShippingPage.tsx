import { useState, useEffect } from 'react'
import { Save, Calculator, Map as MapIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CitiesChipsInput } from '@/components/cities-chips-input'
import { CoverageMap } from '@/components/coverage-map'
import { useStore, useUpdateStore } from '@/hooks/queries'
import { joinRegionChips, parseRegionChips } from '@/lib/region-chips'
import { standardFreightLabel } from '@/lib/parse-store-uf'
import { toast } from '@/lib/toast'
import type { StoreShippingSettings } from '@/types/api'

export const ShippingPage = () => {
  const { data: store, isLoading, isError } = useStore()
  const updateStore = useUpdateStore()
  const [shipping, setShipping] = useState<StoreShippingSettings>({})
  const [cities, setCities] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!store?.settings?.shipping) return
    setShipping(store.settings.shipping)
    setCities(parseRegionChips(store.settings.shipping.regions))
  }, [store])

  const freightLabel = standardFreightLabel(store?.settings?.profile?.location)

  const handleSave = async () => {
    if (!store) return
    setSaving(true)
    try {
      const nextShipping: StoreShippingSettings = {
        ...shipping,
        regions: joinRegionChips(cities) || undefined,
      }
      await updateStore.mutateAsync({
        settings: { ...store.settings, shipping: nextShipping },
      })
      setShipping(nextShipping)
      toast('Entrega atualizada com sucesso')
    } catch {
      toast('Não foi possível salvar a entrega')
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) {
    return <p className="text-muted-foreground text-sm">Carregando...</p>
  }

  if (isError || !store) {
    return <p className="text-muted-foreground text-sm">Nenhuma loja vinculada.</p>
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-section-title text-foreground mb-1">Entrega</h1>
          <p className="text-muted-foreground text-sm">Logística e taxas.</p>
        </div>
        <Button size="sm" onClick={handleSave} disabled={saving} className="rounded-xl">
          <Save size={16} className="mr-2" /> {saving ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>

      <Card className="rounded-lg p-2">
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center text-primary border">
            <Calculator size={20} />
          </div>
          <CardTitle className="text-lg">Taxas</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground ml-1">CEP local (prefixo)</Label>
            <Input
              value={shipping.localPrefix ?? ''}
              placeholder="Ex: 92"
              onChange={(e) => setShipping({ ...shipping, localPrefix: e.target.value })}
              className="rounded-xl h-12 bg-muted/30"
            />
            <p className="text-xs text-muted-foreground ml-1">
              Prefixo dos CEPs da região de entrega local.
            </p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground ml-1">Frete local (R$)</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">
                R$
              </span>
              <Input
                type="number"
                step="0.01"
                value={shipping.localRate ?? ''}
                onChange={(e) =>
                  setShipping({ ...shipping, localRate: parseFloat(e.target.value) || 0 })
                }
                className="rounded-xl h-12 pl-10 bg-muted/30"
              />
            </div>
            <p className="text-xs text-muted-foreground ml-1">
              Valor cobrado para entregas na região do CEP local.
            </p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground ml-1">{freightLabel} (R$)</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">
                R$
              </span>
              <Input
                type="number"
                step="0.01"
                value={shipping.standardRate ?? ''}
                onChange={(e) =>
                  setShipping({ ...shipping, standardRate: parseFloat(e.target.value) || 0 })
                }
                className="rounded-xl h-12 pl-10 bg-muted/30"
              />
            </div>
            <p className="text-xs text-muted-foreground ml-1">
              Entrega no estado da loja
              {store.settings?.profile?.location
                ? ` (${store.settings.profile.location})`
                : '. Defina a localização em Loja.'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-lg p-2">
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center text-primary border">
            <MapIcon size={20} />
          </div>
          <CardTitle className="text-lg">Cobertura</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground ml-1">Cidades atendidas</Label>
            <CitiesChipsInput
              value={cities}
              onChange={setCities}
              placeholder="Canoas, Novo Hamburgo…"
              citySuggest
            />
            <p className="text-xs text-muted-foreground ml-1">
              Digite para buscar cidades; Enter ou vírgula também adiciona.
            </p>
          </div>
          <div className="relative rounded-lg overflow-hidden border-4 border-muted h-[300px] md:h-[400px]">
            <CoverageMap
              cities={cities}
              fallbackCenter={store.settings?.profile?.location}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
