import { useMemo, useState } from 'react'
import { CheckCircle2, Minus, Plus, ShoppingBag, Trash2, X, ImageIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCartStore } from '@/store/use-cart-store'
import { useStoreBranding } from '@/hooks/use-store-branding'
import { useCreateOrder } from '@/hooks/queries'
import { whatsappUrl } from '@/lib/store-contact'
import {
  computeFreight,
  digitsOnlyCep,
  formatCep,
  formatMoney,
} from '@/lib/freight'
import { cn } from '@/lib/utils'
import {
  DEFAULT_PAYMENT_METHODS,
  type Order,
} from '@/types/api'

function digitsOnlyPhone(value: string) {
  return value.replace(/\D/g, '').slice(0, 15)
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function CartSidebar() {
  const navigate = useNavigate()
  const { store } = useStoreBranding()
  const items = useCartStore((s) => s.items)
  const isOpen = useCartStore((s) => s.isOpen)
  const closeCart = useCartStore((s) => s.closeCart)
  const removeItem = useCartStore((s) => s.removeItem)
  const setQuantity = useCartStore((s) => s.setQuantity)
  const clear = useCartStore((s) => s.clear)
  const subtotal = useCartStore((s) => s.subtotal)

  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [cep, setCep] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [error, setError] = useState('')
  const [successOrder, setSuccessOrder] = useState<Order | null>(null)
  const [whatsappMessage, setWhatsappMessage] = useState('')

  const createOrder = useCreateOrder()

  const shipping = store?.settings?.shipping
  const paymentMethods =
    store?.settings?.contact?.paymentMethods?.length
      ? store.settings.contact.paymentMethods
      : DEFAULT_PAYMENT_METHODS
  const whatsapp = store?.settings?.contact?.whatsapp
  const selectedPayment = paymentMethod || paymentMethods[0] || ''

  const freight = useMemo(() => {
    const allFree = items.length > 0 && items.every((i) => i.freight)
    return computeFreight({
      allItemsFreeFreight: allFree,
      cep: digitsOnlyCep(cep),
      localPrefix: shipping?.localPrefix,
      localRate: shipping?.localRate,
      standardRate: shipping?.standardRate,
    })
  }, [items, cep, shipping])

  const cartSubtotal = subtotal()
  const total = cartSubtotal + freight.amount

  const buildWhatsappMessage = (order: Order) => {
    const lines = items.map((item) => {
      const customized = item.customization?.imageUrls?.length
        ? ` (personalizado: ${item.customization.imageUrls.length} fotos)`
        : item.isCustomizable
          ? ' (sem personalização)'
          : ''
      return `- ${item.quantity}x ${item.name} — R$ ${formatMoney(Number(item.value) * item.quantity)}${customized}`
    })
    const freightLabel =
      order.freightType === 'free'
        ? 'Frete grátis'
        : order.freightType === 'local'
          ? 'Frete local'
          : 'Frete estadual'
    return [
      `Olá! Gostaria de confirmar o pedido #${order.id.slice(0, 8)}.`,
      '',
      ...lines,
      '',
      `${freightLabel}: R$ ${formatMoney(Number(order.freightAmount))}`,
      `Total: R$ ${formatMoney(Number(order.total))}`,
      '',
      `Nome: ${order.customerName}`,
      `Telefone: ${order.customerPhone}`,
      `E-mail: ${order.customerEmail}`,
      `CEP: ${formatCep(order.cep)}`,
      `Pagamento: ${order.paymentMethod}`,
    ].join('\n')
  }

  const handleCheckout = async () => {
    setError('')
    const name = customerName.trim()
    const phone = digitsOnlyPhone(customerPhone)
    const email = customerEmail.trim().toLowerCase()
    const cepDigits = digitsOnlyCep(cep)

    if (
      !name ||
      phone.length < 10 ||
      !isValidEmail(email) ||
      cepDigits.length !== 8 ||
      !selectedPayment
    ) {
      setError('Preencha nome, telefone, e-mail, CEP e forma de pagamento.')
      return
    }
    if (!whatsapp) {
      setError('WhatsApp da loja não configurado.')
      return
    }
    if (items.length === 0) return

    try {
      const order = await createOrder.mutateAsync({
        customerName: name,
        customerPhone: phone,
        customerEmail: email,
        cep: cepDigits,
        paymentMethod: selectedPayment,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          customization: item.customization?.imageUrls?.length
            ? { imageUrls: item.customization.imageUrls }
            : undefined,
        })),
      })
      const message = buildWhatsappMessage(order)
      setWhatsappMessage(message)
      setSuccessOrder(order)
      clear()
      setCustomerName('')
      setCustomerPhone('')
      setCustomerEmail('')
      setCep('')
      setPaymentMethod('')
      closeCart()
    } catch {
      setError('Não foi possível criar o pedido. Tente novamente.')
    }
  }

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-60 bg-black/40 transition-opacity',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
        onClick={closeCart}
      />
      <aside
        className={cn(
          'fixed top-0 right-0 z-70 h-full w-full max-w-md bg-background border-l border-border shadow-xl flex flex-col transition-transform duration-300',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex items-center justify-between px-5 h-14 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} />
            <h2 className="font-semibold text-sm">Carrinho</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={closeCart}>
            <X size={18} />
          </Button>
        </div>

        <div className="grow overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">
              Seu carrinho está vazio.
            </p>
          ) : (
            <>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 border border-border rounded-lg p-3"
                >
                  <div className="w-16 h-16 rounded-md bg-muted overflow-hidden shrink-0 flex items-center justify-center">
                    {item.customization?.imageUrls?.[0] || item.imageUrl ? (
                      <img
                        src={item.customization?.imageUrls?.[0] || item.imageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon size={20} className="text-muted-foreground" />
                    )}
                  </div>
                  <div className="grow min-w-0 space-y-2">
                    <div className="flex justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        {item.customizableSlots ? (
                          <p className="text-xs text-muted-foreground">
                            {item.customizableSlots} fotos
                          </p>
                        ) : null}
                        <p className="text-sm text-primary">
                          R$ {formatMoney(Number(item.value))}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => setQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus size={12} />
                        </Button>
                        <span className="w-6 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => setQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus size={12} />
                        </Button>
                      </div>
                      {item.isCustomizable ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-7"
                          onClick={() => {
                            closeCart()
                            navigate(
                              `/customizar?cartItemId=${item.id}&productId=${item.productId}`,
                            )
                          }}
                        >
                          {item.customization?.imageUrls?.length
                            ? 'Editar fotos'
                            : 'Personalizar'}
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}

              <div className="space-y-3 pt-2 border-t">
                <p className="text-sm font-medium">Dados do pedido</p>
                <Input
                  placeholder="Seu nome"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
                <Input
                  placeholder="Telefone com DDD"
                  inputMode="numeric"
                  value={customerPhone}
                  onChange={(e) =>
                    setCustomerPhone(digitsOnlyPhone(e.target.value))
                  }
                />
                <Input
                  type="email"
                  placeholder="E-mail"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
                <Input
                  placeholder="CEP"
                  inputMode="numeric"
                  value={formatCep(cep)}
                  onChange={(e) => setCep(digitsOnlyCep(e.target.value))}
                />
                <Select
                  value={selectedPayment}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  {paymentMethods.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </Select>
              </div>
            </>
          )}
        </div>

        {items.length > 0 ? (
          <div className="border-t p-5 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>R$ {formatMoney(cartSubtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {freight.type === 'free'
                  ? 'Frete'
                  : freight.type === 'local'
                    ? 'Frete local'
                    : 'Frete estadual'}
              </span>
              <span>
                {freight.type === 'free'
                  ? 'Grátis'
                  : `R$ ${formatMoney(freight.amount)}`}
              </span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>R$ {formatMoney(total)}</span>
            </div>
            {error ? (
              <p className="text-xs text-destructive text-center">{error}</p>
            ) : null}
            <Button
              className="w-full"
              disabled={!whatsapp || createOrder.isPending}
              onClick={handleCheckout}
            >
              {createOrder.isPending ? 'Enviando...' : 'Finalizar pedido'}
            </Button>
            {!whatsapp ? (
              <p className="text-xs text-muted-foreground text-center">
                WhatsApp da loja não configurado.
              </p>
            ) : null}
          </div>
        ) : null}
      </aside>

      <Dialog
        open={Boolean(successOrder)}
        onOpenChange={(open) => {
          if (!open) {
            setSuccessOrder(null)
            setWhatsappMessage('')
          }
        }}
      >
        <DialogContent className="max-w-md sm:max-w-lg py-10">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2 className="h-12 w-12 text-emerald-500" strokeWidth={1.5} />
            </div>
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-center text-2xl">
                Pedido finalizado!
              </DialogTitle>
              <DialogDescription className="text-center text-base">
                Seu pedido foi registrado com sucesso. Abra o WhatsApp para
                confirmar com a loja.
              </DialogDescription>
            </DialogHeader>
          </div>
          <DialogFooter className="sm:justify-center pt-2">
            <Button
              className="w-full sm:w-auto min-w-48"
              disabled={!whatsapp || !whatsappMessage}
              onClick={() => {
                if (!whatsapp) return
                window.open(whatsappUrl(whatsapp, whatsappMessage), '_blank')
                setSuccessOrder(null)
                setWhatsappMessage('')
              }}
            >
              Abrir WhatsApp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
