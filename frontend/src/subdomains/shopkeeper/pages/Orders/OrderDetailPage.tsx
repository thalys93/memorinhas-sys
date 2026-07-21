import { Link, useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { ArrowLeft, Mail, MessageCircle, Trash2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { OrderStatusSelect } from '@/components/order-status-select'
import { useDeleteOrder, useNotifyOrderEmail, useOrder } from '@/hooks/queries'
import { formatCep, formatMoney } from '@/lib/freight'
import {
  FREIGHT_TYPE_LABEL,
  FULFILLMENT_MODE_LABEL,
  ORDER_STATUS_LABEL,
  OrderStatusBadge,
} from '@/lib/order-status'
import { whatsappUrl } from '@/lib/store-contact'
import { toast } from '@/lib/toast'

export const OrderDetailPage = () => {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const { data: order, isLoading, isError } = useOrder(id)
  const notifyEmail = useNotifyOrderEmail()
  const deleteOrder = useDeleteOrder()

  if (isLoading) {
    return (
      <p className="text-muted-foreground text-sm">Carregando pedido...</p>
    )
  }

  if (isError || !order) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground text-sm">Pedido não encontrado.</p>
        <Link to="/lojista/pedidos" className="text-primary text-sm underline">
          Voltar aos pedidos
        </Link>
      </div>
    )
  }

  const handleWhatsApp = () => {
    const message = [
      `Olá ${order.customerName}!`,
      `Sobre o pedido #${order.id.slice(0, 8)}:`,
      `Status: ${ORDER_STATUS_LABEL[order.status]}`,
      `Total: R$ ${formatMoney(Number(order.total))}`,
    ].join('\n')
    window.open(whatsappUrl(order.customerPhone, message), '_blank')
  }

  const handleEmail = async () => {
    try {
      await notifyEmail.mutateAsync({ id: order.id })
      toast('E-mail enviado ao cliente')
    } catch {
      toast('Não foi possível enviar o e-mail')
    }
  }

  const handleDelete = async () => {
    try {
      await deleteOrder.mutateAsync(order.id)
      toast('Pedido excluído')
      navigate('/lojista/pedidos')
    } catch {
      toast('Não foi possível excluir o pedido')
    }
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <Link
            to="/lojista/pedidos"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={14} /> Pedidos
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-section-title text-foreground">
              Pedido #{order.id.slice(0, 8)}
            </h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-muted-foreground text-sm">
            {new Date(order.createdAt).toLocaleString('pt-BR')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle className="text-lg">Itens solicitados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(order.items ?? []).map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 border-b border-border pb-4 last:border-0 last:pb-0"
                >
                  <div className="w-16 h-16 rounded-md bg-muted overflow-hidden shrink-0">
                    {item.customization?.imageUrls?.[0] ||
                    item.product?.product_imgs?.[0] ? (
                      <img
                        src={
                          item.customization?.imageUrls?.[0] ||
                          item.product?.product_imgs?.[0]
                        }
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {item.product?.name ?? 'Produto'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity}× R$ {formatMoney(Number(item.unitValue))}
                    </p>
                  </div>
                  <p className="font-medium shrink-0">
                    R${' '}
                    {formatMoney(Number(item.unitValue) * item.quantity)}
                  </p>
                </div>
              ))}

              <div className="space-y-1 pt-2 border-t text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>R$ {formatMoney(Number(order.subtotal))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Frete ({FREIGHT_TYPE_LABEL[order.freightType]})
                  </span>
                  <span>R$ {formatMoney(Number(order.freightAmount))}</span>
                </div>
                <div className="flex justify-between font-semibold text-base pt-1">
                  <span>Total</span>
                  <span>R$ {formatMoney(Number(order.total))}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle className="text-lg">Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">Nome:</span>{' '}
                {order.customerName}
              </p>
              <p>
                <span className="text-muted-foreground">Telefone:</span>{' '}
                {order.customerPhone}
              </p>
              <p>
                <span className="text-muted-foreground">E-mail:</span>{' '}
                {order.customerEmail}
              </p>
              <p>
                <span className="text-muted-foreground">CEP:</span>{' '}
                {formatCep(order.cep)}
              </p>
              <p>
                <span className="text-muted-foreground">Pagamento:</span>{' '}
                {order.paymentMethod}
              </p>
              {order.fulfillmentMode ? (
                <p>
                  <span className="text-muted-foreground">Entrega:</span>{' '}
                  {FULFILLMENT_MODE_LABEL[order.fulfillmentMode]}
                </p>
              ) : null}
            </CardContent>
          </Card>

          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle className="text-lg">Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Status</Label>
                <OrderStatusSelect order={order} />
              </div>

              <div className="space-y-2 pt-2 border-t">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleWhatsApp}
                >
                  <MessageCircle size={16} className="mr-2" />
                  Mensagem no WhatsApp
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={notifyEmail.isPending}
                  onClick={handleEmail}
                >
                  <Mail size={16} className="mr-2" />
                  {notifyEmail.isPending ? 'Enviando...' : 'Enviar e-mail'}
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-destructive hover:text-destructive"
                  onClick={() => setConfirmOpen(true)}
                >
                  <Trash2 size={16} className="mr-2" />
                  Excluir pedido
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir pedido?</AlertDialogTitle>
            <AlertDialogDescription>
              Ao excluir o pedido #{order.id.slice(0, 8)}, os dados associados
              podem se perder e esta ação não poderá ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteOrder.isPending}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              disabled={deleteOrder.isPending}
              onClick={(event) => {
                event.preventDefault()
                void handleDelete()
              }}
            >
              {deleteOrder.isPending ? 'Excluindo...' : 'Excluir pedido'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
