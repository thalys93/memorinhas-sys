import { useEffect, useRef } from 'react'
import { useOrders } from '@/hooks/queries'
import { toast } from '@/lib/toast'

const STORAGE_KEY = 'shopkeeper-last-order-id'

export function NewOrderWatcher() {
  const { data } = useOrders(1, { refetchInterval: 20000 })
  const ready = useRef(false)

  useEffect(() => {
    const newest = data?.items?.[0]
    if (!newest) return

    const prev = localStorage.getItem(STORAGE_KEY)
    if (!ready.current) {
      ready.current = true
      localStorage.setItem(STORAGE_KEY, newest.id)
      return
    }

    if (prev && newest.id !== prev && newest.status === 'pending') {
      toast(`Novo pedido de ${newest.customerName}`)
    }
    if (newest.id !== prev) {
      localStorage.setItem(STORAGE_KEY, newest.id)
    }
  }, [data?.items])

  return null
}
