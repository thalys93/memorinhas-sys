import { useState, useEffect, useRef } from 'react'
import { Save, MessageCircle, Instagram, ImageIcon, Upload, Store as StoreIcon, MapPin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ColorPicker } from '@/components/color-picker'
import { useAuthStore } from '@/store/use-auth-store'
import { useStore, useUpdateStore } from '@/hooks/queries'
import { UploadTemplates } from '@/enums/upload-templates'
import { uploadToCloudinary, buildCloudinaryPublicId } from '@/lib/cloudinary-upload'
import {
  formatBrazilPhone,
  isValidBrazilPhone,
  normalizeInstagramHandle,
  instagramEmbedUrl,
  stripBrazilCountryCode,
  toBrazilWhatsappDigits,
  DEFAULT_WHATSAPP_MESSAGE,
} from '@/lib/store-contact'
import {
  DEFAULT_STORE_PRIMARY,
  applyStorePrimaryColor,
} from '@/lib/theme-color'
import { toast } from '@/lib/toast'
import type { StoreContactSettings } from '@/types/api'
import { DEFAULT_PAYMENT_METHODS } from '@/types/api'
import { CitiesChipsInput } from '@/components/cities-chips-input'
import { cn } from '@/lib/utils'

export const StorePage = () => {
  const setActiveStore = useAuthStore((s) => s.setActiveStore)
  const { data: store, isLoading, isError } = useStore()
  const updateStore = useUpdateStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [storeName, setStoreName] = useState('')
  const [accentColor, setAccentColor] = useState(DEFAULT_STORE_PRIMARY)
  const [location, setLocation] = useState('')
  const [contact, setContact] = useState<StoreContactSettings>({})
  const [heroImageUrl, setHeroImageUrl] = useState('')
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [localPreviewUrl, setLocalPreviewUrl] = useState('')
  const [heroBroken, setHeroBroken] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!store) return
    setActiveStore(store.id)
    setStoreName(store.name ?? '')
    setAccentColor(store.settings?.theme?.accentColor || DEFAULT_STORE_PRIMARY)
    setLocation(store.settings?.profile?.location ?? '')
    setContact({
      ...store.settings?.contact,
      whatsapp: stripBrazilCountryCode(store.settings?.contact?.whatsapp ?? ''),
      paymentMethods:
        store.settings?.contact?.paymentMethods?.length
          ? store.settings.contact.paymentMethods
          : [...DEFAULT_PAYMENT_METHODS],
    })
    setHeroImageUrl(store.settings?.theme?.heroImageUrl ?? '')
    setPendingFile(null)
    setHeroBroken(false)
  }, [store, setActiveStore])

  useEffect(() => {
    applyStorePrimaryColor(accentColor)
  }, [accentColor])

  useEffect(() => {
    return () => {
      if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl)
    }
  }, [localPreviewUrl])

  const selectHeroFile = (file: File) => {
    if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl)
    setPendingFile(file)
    setLocalPreviewUrl(URL.createObjectURL(file))
    setHeroBroken(false)
  }

  const handleSave = async () => {
    if (!store?.id) return

    const whatsappLocal = stripBrazilCountryCode(contact.whatsapp ?? '')
    if (whatsappLocal && !isValidBrazilPhone(whatsappLocal)) {
      toast('Informe um WhatsApp válido no formato 99 9999-9999')
      return
    }

    setSaving(true)
    try {
      let nextHeroUrl = heroImageUrl
      const storeId = store.id

      if (pendingFile) {
        nextHeroUrl = await uploadToCloudinary(pendingFile, {
          publicId: buildCloudinaryPublicId(storeName || store.name || 'loja', storeId),
          uploadPreset: UploadTemplates.Assets,
          displayName: storeName || store.name || 'Hero da loja',
        })
        setHeroImageUrl(nextHeroUrl)
        setPendingFile(null)
        if (localPreviewUrl) {
          URL.revokeObjectURL(localPreviewUrl)
          setLocalPreviewUrl('')
        }
      }

      const whatsapp = whatsappLocal ? toBrazilWhatsappDigits(whatsappLocal) : ''
      const whatsappMessage = contact.whatsappMessage?.trim()
      const instagram = normalizeInstagramHandle(contact.instagram)
      const paymentMethods =
        contact.paymentMethods?.map((m) => m.trim()).filter(Boolean) ?? []
      await updateStore.mutateAsync({
        name: storeName.trim(),
        settings: {
          ...store.settings,
          contact: {
            whatsapp: whatsapp || undefined,
            whatsappMessage: whatsapp ? whatsappMessage || undefined : undefined,
            instagram: instagram || undefined,
            paymentMethods: paymentMethods.length
              ? paymentMethods
              : [...DEFAULT_PAYMENT_METHODS],
          },
          theme: {
            ...store.settings?.theme,
            accentColor: accentColor || undefined,
            heroImageUrl: nextHeroUrl || undefined,
          },
          profile: {
            ...store.settings?.profile,
            location: location.trim() || undefined,
          },
        },
      })
      toast('Loja atualizada com sucesso')
    } catch {
      toast('Não foi possível salvar a loja')
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

  const previewSrc = localPreviewUrl || heroImageUrl
  const showHeroPreview = !!previewSrc && !heroBroken
  const instagramHandle = normalizeInstagramHandle(contact.instagram)

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-section-title text-foreground mb-1">Loja</h1>
          <p className="text-muted-foreground text-sm">Identidade, contatos e imagem do hero.</p>
        </div>
        <Button size="sm" onClick={handleSave} disabled={saving} className="rounded-xl">
          <Save size={16} className="mr-2" /> {saving ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <div className="space-y-6">
          <Card className="rounded-lg p-2">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center text-primary border">
                <StoreIcon size={20} />
              </div>
              <CardTitle className="text-lg">Configurações da loja</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground ml-1">Nome da loja</Label>
                <Input
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="Memorinhas"
                  className="rounded-xl h-12 bg-muted/30"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground ml-1">Cor primária</Label>
                <ColorPicker
                  value={accentColor}
                  onChange={setAccentColor}
                  defaultColor={DEFAULT_STORE_PRIMARY}
                  disabled={saving}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground ml-1">Localização</Label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Canoas, RS"
                    className="rounded-xl h-12 pl-12 bg-muted/30"
                  />
                </div>
                <p className="text-xs text-muted-foreground ml-1">Use o formato Cidade, UF</p>
              </div>
            </CardContent>
          </Card>

          <Accordion type="single" collapsible defaultValue={heroImageUrl ? undefined : 'hero'}>
            <AccordionItem value="hero" className="border rounded-lg px-4 bg-card">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center text-primary border">
                    <ImageIcon size={16} />
                  </div>
                  <span className="text-base font-semibold">Imagem do hero</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) selectHeroFile(file)
                    e.target.value = ''
                  }}
                />
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    'aspect-video w-full rounded-lg overflow-hidden border-2 border-dashed border-border bg-muted relative block transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    showHeroPreview && 'border-solid',
                  )}
                >
                  {showHeroPreview ? (
                    <img
                      src={previewSrc}
                      alt="Preview do hero"
                      className="w-full h-full object-cover"
                      onError={() => setHeroBroken(true)}
                    />
                  ) : (
                    <div className="w-full h-full min-h-[160px] flex flex-col items-center justify-center gap-2 text-muted-foreground text-sm px-4">
                      <Upload size={24} />
                      <span>Clique para escolher a imagem</span>
                    </div>
                  )}
                </button>
                {pendingFile ? (
                  <p className="text-center text-xs text-muted-foreground">
                    Preview local — será enviada ao salvar
                  </p>
                ) : null}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-xl"
                  disabled={saving}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={16} className="mr-2" />
                  {showHeroPreview ? 'Trocar imagem' : 'Escolher imagem'}
                </Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <Card className="rounded-lg p-2">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center text-primary border">
              <MessageCircle size={20} />
            </div>
            <CardTitle className="text-lg">Contato e redes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground ml-1">WhatsApp</Label>
              <div className="relative flex items-center">
                <MessageCircle
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  size={16}
                />
                <span className="absolute left-11 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none select-none">
                  +55
                </span>
                <Input
                  value={formatBrazilPhone(contact.whatsapp ?? '')}
                  placeholder="51 99999-9999"
                  inputMode="numeric"
                  onChange={(e) =>
                    setContact({
                      ...contact,
                      whatsapp: stripBrazilCountryCode(e.target.value),
                    })
                  }
                  className="rounded-xl h-12 pl-[4.75rem] bg-muted/30"
                />
              </div>
              <p className="text-xs text-muted-foreground ml-1">
                Formato: 99 9999-9999 (números do Brasil)
              </p>
            </div>
            {stripBrazilCountryCode(contact.whatsapp ?? '') ? (
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground ml-1">
                  Mensagem do WhatsApp
                </Label>
                <textarea
                  value={contact.whatsappMessage ?? ''}
                  placeholder={DEFAULT_WHATSAPP_MESSAGE}
                  rows={3}
                  onChange={(e) =>
                    setContact({ ...contact, whatsappMessage: e.target.value })
                  }
                  className="flex w-full rounded-xl border border-input bg-muted/30 px-3.5 py-3 text-[15px] tracking-[-0.011em] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-y min-h-[88px]"
                />
                <p className="text-xs text-muted-foreground ml-1">
                  Texto pré-preenchido ao clicar em enviar mensagem. Se vazio, usamos o placeholder.
                </p>
              </div>
            ) : null}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground ml-1">
                Formas de pagamento
              </Label>
              <CitiesChipsInput
                value={contact.paymentMethods ?? [...DEFAULT_PAYMENT_METHODS]}
                onChange={(chips) =>
                  setContact({ ...contact, paymentMethods: chips })
                }
                placeholder="Ex: Pix, Digite e Enter"
              />
              <p className="text-xs text-muted-foreground ml-1">
                Opções exibidas no carrinho. Padrão: Pix, Dinheiro, Cartão.
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground ml-1">Instagram</Label>
              <div className="relative">
                <Instagram
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={16}
                />
                <Input
                  value={contact.instagram ?? ''}
                  placeholder="memorinha__"
                  onChange={(e) => setContact({ ...contact, instagram: e.target.value })}
                  className="rounded-xl h-12 pl-12 bg-muted/30"
                />
              </div>
            </div>
            {instagramHandle ? (
              <div className="space-y-2 pt-2">
                <Label className="text-sm text-muted-foreground ml-1">Preview do Instagram</Label>
                <div className="overflow-hidden rounded-xl border bg-muted/20">
                  <iframe
                    title="Preview Instagram"
                    src={instagramEmbedUrl(instagramHandle)}
                    className="w-full h-[420px] border-0"
                    loading="lazy"
                  />
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
