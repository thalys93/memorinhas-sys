import api from './api'
import type {
  CreateOrderPayload,
  NotifyOrderPayload,
  Order,
  OrderSummary,
  PaginatedResponse,
  UpdateOrderStatusPayload,
} from '@/types/api'
import { env } from '@/constants/env'

export const orderService = {
  createPublic: (payload: CreateOrderPayload, brandUrl = env.storeBrandUrl) =>
    api
      .post<Order>(`/store/${brandUrl}/orders`, payload)
      .then((r) => r.data),

  list: (page = 1, limit = 20) =>
    api
      .get<PaginatedResponse<Order>>('/auth/orders', {
        params: { page, limit },
      })
      .then((r) => r.data),

  get: (id: string) =>
    api.get<{ found: Order }>(`/auth/orders/${id}`).then((r) => r.data.found),

  summary: () =>
    api.get<OrderSummary>('/auth/orders/summary').then((r) => r.data),

  updateStatus: (id: string, payload: UpdateOrderStatusPayload) =>
    api
      .patch<{ message: string; order: Order }>(
        `/auth/orders/update/${id}`,
        payload,
      )
      .then((r) => r.data),

  notifyEmail: (id: string, payload: NotifyOrderPayload = {}) =>
    api
      .post<{ message: string }>(`/auth/orders/${id}/notify-email`, payload)
      .then((r) => r.data),

  remove: (id: string) =>
    api
      .delete<{ message: string }>(`/auth/orders/delete/${id}`)
      .then((r) => r.data),
}
