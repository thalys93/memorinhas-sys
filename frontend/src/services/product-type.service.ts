import api from './api';
import type {
  CreateProductTypePayload,
  PaginatedResponse,
  ProductTypeEntity,
  UpdateProductTypePayload,
} from '@/types/api';

export const productTypeService = {
  list: (page = 1, limit = 50) =>
    api
      .get<PaginatedResponse<ProductTypeEntity>>('/auth/product-types', {
        params: { page, limit },
      })
      .then((r) => r.data),

  listActive: () =>
    api
      .get<ProductTypeEntity[]>('/auth/product-types/active')
      .then((r) => r.data),

  listActivePublic: () =>
    api.get<ProductTypeEntity[]>('/product-types/active').then((r) => r.data),

  create: (payload: CreateProductTypePayload) =>
    api
      .post<{ productType: ProductTypeEntity }>(
        '/auth/product-types/create',
        payload,
      )
      .then((r) => r.data.productType),

  update: (id: string, payload: UpdateProductTypePayload) =>
    api
      .patch<{ productType: ProductTypeEntity }>(
        `/auth/product-types/update/${id}`,
        payload,
      )
      .then((r) => r.data.productType),

  remove: (id: string) => api.delete(`/auth/product-types/delete/${id}`),
};
