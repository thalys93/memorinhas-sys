import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/use-auth-store'
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useStore,
} from '@/hooks/queries'
import { UploadTemplates } from '@/enums/upload-templates'
import { uploadToCloudinary, buildCloudinaryPublicId } from '@/lib/cloudinary-upload'
import { toast } from '@/lib/toast'
import { ProductForm } from './components/ProductForm'
import {
  emptyProductFormState,
  productToFormState,
  revokePreviews,
  sanitizeAttributes,
  type ProductFormState,
} from './components/product-form-utils'

export const ProductFormPage = () => {
  const { id } = useParams<{ id: string }>()
  const isNew = !id

  const navigate = useNavigate()
  const activeStoreId = useAuthStore((s) => s.activeStoreId)
  const setActiveStore = useAuthStore((s) => s.setActiveStore)
  const { data: store, isLoading: storeLoading, isError: storeError } = useStore()
  const { data: productsData, isLoading } = useProducts()
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()

  const [form, setForm] = useState<ProductFormState>(emptyProductFormState)
  const [saving, setSaving] = useState(false)
  const [ready, setReady] = useState(isNew)
  const hydratedIdRef = useRef<string | null>(null)

  useEffect(() => {
    if (store?.id) setActiveStore(store.id)
  }, [store, setActiveStore])

  useEffect(() => {
    if (isNew) {
      hydratedIdRef.current = null
      setForm(emptyProductFormState())
      setReady(true)
      return
    }
    if (!productsData?.items) return
    const product = productsData.items.find((p) => p.id === id)
    if (!product) {
      setReady(true)
      return
    }
    if (hydratedIdRef.current === id) return
    hydratedIdRef.current = id
    setForm(productToFormState(product))
    setReady(true)
  }, [id, isNew, productsData])

  useEffect(() => {
    return () => revokePreviews(form.pendingPreviews)
  }, [])

  const storeId = store?.id ?? activeStoreId

  const handleSave = async () => {
    if (!storeId) return
    if (!form.name.trim() || form.value < 0) {
      toast('Preencha nome e preço válidos')
      return
    }
    if (!form.productTypeId) {
      toast('Selecione o tipo do produto')
      return
    }

    setSaving(true)
    try {
      const uploaded: string[] = []
      for (const file of form.pendingFiles) {
        const url = await uploadToCloudinary(file, {
          publicId: buildCloudinaryPublicId(
            form.name,
            `${storeId}_${crypto.randomUUID().slice(0, 8)}`,
          ),
          uploadPreset: UploadTemplates.Assets,
          displayName: form.name,
        })
        uploaded.push(url)
      }

      const product_imgs = [...form.product_imgs, ...uploaded]
      const payload = {
        name: form.name.trim(),
        value: form.value,
        productTypeId: form.productTypeId,
        customizableSlots: form.customizableSlots || undefined,
        product_imgs,
        freight: form.freight,
        description: form.description.trim() || null,
        attributes: sanitizeAttributes(form.attributes),
      }

      revokePreviews(form.pendingPreviews)

      if (isNew) {
        const created = await createProduct.mutateAsync(payload)
        toast('Produto criado')
        navigate(`/lojista/produtos/${created.id}`, { replace: true })
      } else if (id) {
        const updated = await updateProduct.mutateAsync({ id, payload })
        hydratedIdRef.current = id
        setForm({
          ...productToFormState(updated),
          pendingFiles: [],
          pendingPreviews: [],
        })
        toast('Produto atualizado')
      }
    } catch {
      toast('Não foi possível salvar o produto')
    } finally {
      setSaving(false)
    }
  }

  if (storeLoading) {
    return <p className="text-muted-foreground text-sm">Carregando...</p>
  }

  if (storeError || !store) {
    return (
      <p className="text-muted-foreground text-sm">Nenhuma loja vinculada à sua conta.</p>
    )
  }

  if (!isNew && isLoading && !ready) {
    return <p className="text-muted-foreground text-sm">Carregando produto...</p>
  }

  if (!isNew && ready && !productsData?.items.find((p) => p.id === id)) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground text-sm">Produto não encontrado.</p>
        <Link to="/lojista/produtos" className="text-primary text-sm underline">
          Voltar para produtos
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="space-y-2">
          <Link
            to="/lojista/produtos"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={14} /> Produtos
          </Link>
          <h1 className="text-section-title text-foreground">
            {isNew ? 'Novo produto' : 'Editar produto'}
          </h1>
          <p className="text-muted-foreground text-sm">
            {isNew ? 'Cadastre um kit, ímã ou acessório.' : 'Atualize os dados do produto.'}
          </p>
        </div>
        <Button size="sm" className="rounded-sm" disabled={saving} onClick={handleSave}>
          <Save size={16} className="mr-2" />
          {saving ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>

      <Card className="rounded-sm p-2 w-full">
        <CardHeader>
          <CardTitle className="text-lg">Dados do produto</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm value={form} onChange={setForm} disabled={saving} />
        </CardContent>
      </Card>
    </div>
  )
}
