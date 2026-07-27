import api from './api';
import type {
  CreateProductPayload,
  PaginatedResponse,
  Product,
  PublicProductFilters,
  UpdateProductPayload,
} from '@/types/api';
import { env } from '@/constants/env';

export const productService = {
  list: (page = 1, limit = 50) =>
    api
      .get<PaginatedResponse<Product>>('/auth/products', {
        params: { page, limit },
      })
      .then((r) => r.data),

  listPublic: (filters: PublicProductFilters = {}, brandUrl = env.storeBrandUrl) =>
    api
      .get<PaginatedResponse<Product>>(`/store/${brandUrl}/products`, {
        params: filters,
      })
      .then((r) => r.data),

  getPublicById: (id: string, brandUrl = env.storeBrandUrl) =>
    api
      .get<{ found: Product }>(`/store/${brandUrl}/products/${id}`)
      .then((r) => r.data.found),

  getById: (id: string) =>
    api
      .get<{ found: Product }>(`/auth/products/${id}`)
      .then((r) => r.data.found),

  create: (payload: CreateProductPayload) =>
    api
      .post<{ product: Product }>('/auth/products/create', payload)
      .then((r) => r.data.product),

  update: (id: string, payload: UpdateProductPayload) =>
    api
      .patch<{ product: Product }>(`/auth/products/update/${id}`, payload)
      .then((r) => r.data.product),

  remove: (id: string) => api.delete(`/auth/products/delete/${id}`),
};
