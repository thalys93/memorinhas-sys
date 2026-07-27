import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import DOMPurify from 'dompurify'
import { ArrowLeft, Camera, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StoreNotConfigured } from '@/components/store-not-configured'
import { useStoreBranding } from '@/hooks/use-store-branding'
import { usePublicProduct } from '@/hooks/queries'
import { productTypeLabel } from '@/lib/product-utils'
import { useCartStore } from '@/store/use-cart-store'
import { cn } from '@/lib/utils'
import type { Product } from '@/types/api'

function buildCartItemPayload(product: Product) {
  return {
    productId: product.id,
    name: product.name,
    value: Number(product.value),
    freight: product.freight,
    isCustomizable: Boolean(product.productType?.isCustomizable),
    customizableSlots: product.customizableSlots,
    imageUrl: product.product_imgs?.[0],
  }
}

export function ProductDetailPage() {
  const { id = '' } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const {
    store,
    location: storeLocation,
    isLoading: storeLoading,
    isConfigured,
  } = useStoreBranding()
  const { data: product, isLoading, isError } = usePublicProduct(id)
  const addItem = useCartStore((s) => s.addItem)
  const setStoreId = useCartStore((s) => s.setStoreId)
  const [activeImage, setActiveImage] = useState(0)
  const [imageBroken, setImageBroken] = useState(false)

  useEffect(() => {
    setActiveImage(0)
    setImageBroken(false)
  }, [id])

  if (storeLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-muted-foreground text-sm pt-24">
        Carregando...
      </div>
    )
  }

  if (!isConfigured || !store) {
    return (
      <div className="pt-24">
        <StoreNotConfigured />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="pt-16 min-h-screen bg-surface-alt pb-20">
        <div className="mx-4 md:mx-12 py-8 md:py-12">
          <div className="bg-background rounded-lg p-5 md:p-8">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
              <div className="w-full lg:w-[42%] max-w-[450px] aspect-square rounded-lg bg-muted animate-pulse shrink-0" />
              <div className="flex-1 w-full space-y-4">
                <div className="h-7 w-3/4 rounded bg-muted animate-pulse" />
                <div className="h-14 w-full rounded bg-muted animate-pulse" />
                <div className="h-10 w-1/2 rounded bg-muted animate-pulse" />
                <div className="h-12 w-full rounded bg-muted animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isError || !product) {
    return (
      <div className="pt-24 viewport-content space-y-4">
        <p className="text-muted-foreground text-sm">Produto não encontrado.</p>
        <Link to="/produtos" className="text-primary text-sm underline">
          Voltar ao catálogo
        </Link>
      </div>
    )
  }

  const images = product.product_imgs ?? []
  const selectedUrl = images[activeImage] ?? images[0]
  const showImage = !!selectedUrl && !imageBroken
  const attributes = (product.attributes ?? []).filter(
    (row) => row.label?.trim() && row.value?.trim(),
  )
  const descriptionHtml = product.description
    ? DOMPurify.sanitize(product.description)
    : ''
  const isCustomizable = Boolean(product.productType?.isCustomizable)
  const priceLabel = `R$ ${Number(product.value).toFixed(2).replace('.', ',')}`

  const handleAdd = () => {
    setStoreId(store.id)
    addItem(buildCartItemPayload(product))
  }

  const handleCustomize = () => {
    setStoreId(store.id)
    const cartItemId = addItem(buildCartItemPayload(product))
    navigate(`/customizar?cartItemId=${cartItemId}&productId=${product.id}`)
  }

  return (
    <div className="pt-16 min-h-screen bg-surface-alt pb-20">
      <div className="mx-4 md:mx-12 py-8 md:py-12 space-y-4">
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground px-1">
          <Link
            to="/produtos"
            className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <ArrowLeft size={14} />
            Catálogo
          </Link>
          <span aria-hidden>/</span>
          <span className="text-foreground truncate">{product.name}</span>
        </nav>

        <div className="bg-background rounded-lg p-5 md:p-8 space-y-10">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
            <div className="w-full lg:w-[42%] max-w-[450px] shrink-0 space-y-3 mx-auto lg:mx-0">
              <div className="aspect-square rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                {showImage ? (
                  <img
                    key={selectedUrl}
                    src={selectedUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={() => setImageBroken(true)}
                  />
                ) : (
                  <Camera size={44} strokeWidth={1.5} className="text-primary" />
                )}
              </div>
              {images.length > 1 ? (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((url, index) => (
                    <button
                      key={`${url}-${index}`}
                      type="button"
                      onClick={() => {
                        setActiveImage(index)
                        setImageBroken(false)
                      }}
                      className={cn(
                        'shrink-0 w-14 h-14 rounded-md overflow-hidden border-2 transition-colors',
                        index === activeImage
                          ? 'border-primary'
                          : 'border-transparent opacity-70 hover:opacity-100',
                      )}
                    >
                      <img
                        src={url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="flex-1 min-w-0 w-full space-y-5">
              <div className="space-y-2">
                <p className="text-label text-muted-foreground uppercase tracking-wider">
                  {productTypeLabel(product.productType?.name)}
                  {product.customizableSlots
                    ? ` · ${product.customizableSlots} fotos`
                    : ''}
                </p>
                <h1 className="text-section-title text-foreground leading-snug">
                  {product.name}
                </h1>
              </div>

              <div className="rounded-lg bg-muted/70 px-4 py-3">
                <p className="text-2xl md:text-3xl font-semibold text-primary tracking-tight">
                  {priceLabel}
                </p>
              </div>

              <div className="flex gap-3 items-start">
                <Truck
                  size={20}
                  strokeWidth={1.75}
                  className="text-primary shrink-0 mt-0.5"
                />
                <div className="min-w-0 space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Enviado de{' '}
                    <span className="font-medium text-foreground">
                      {storeLocation}
                    </span>
                  </p>
                  {product.freight ? (
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
                      Frete grátis
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                {isCustomizable ? (
                  <>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={handleAdd}
                      className="w-full sm:flex-1 h-11 sm:h-10 text-[15px] sm:text-[14px] rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      Adicionar ao carrinho
                    </Button>
                    <Button
                      size="lg"
                      onClick={handleCustomize}
                      className="w-full sm:flex-1 h-11 sm:h-10 text-[15px] sm:text-[14px] rounded-full"
                    >
                      Personalizar aqui
                    </Button>
                  </>
                ) : (
                  <Button
                    size="lg"
                    onClick={handleAdd}
                    className="w-full sm:max-w-xs h-11 sm:h-10 text-[15px] sm:text-[14px] rounded-full"
                  >
                    Adicionar ao carrinho
                  </Button>
                )}
              </div>
            </div>
          </div>

          {descriptionHtml ? (
            <section className="space-y-3 max-w-3xl border-t border-border/60 pt-8">
              <h2 className="text-card-title text-foreground">Descrição</h2>
              <div
                className="prose-product text-body text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: descriptionHtml }}
              />
            </section>
          ) : null}

          {attributes.length > 0 ? (
            <section className="space-y-3 max-w-3xl border-t border-border/60 pt-8">
              <h2 className="text-card-title text-foreground">Detalhes</h2>
              <dl className="divide-y divide-border/60 border-y border-border/60">
                {attributes.map((row) => (
                  <div
                    key={`${row.label}-${row.value}`}
                    className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-8 py-3"
                  >
                    <dt className="sm:w-40 shrink-0 text-sm font-medium text-foreground">
                      {row.label}
                    </dt>
                    <dd className="text-sm text-muted-foreground">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  )
}
