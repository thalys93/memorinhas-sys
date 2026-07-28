import api from './api';
import type {
  CreateProductAttributeFieldPayload,
  PaginatedResponse,
  ProductAttributeField,
  UpdateProductAttributeFieldPayload,
} from '@/types/api';

export const productAttributeFieldService = {
  list: (page = 1, limit = 50) =>
    api
      .get<PaginatedResponse<ProductAttributeField>>(
        '/auth/product-attribute-fields',
        { params: { page, limit } },
      )
      .then((r) => r.data),

  listActive: () =>
    api
      .get<ProductAttributeField[]>('/auth/product-attribute-fields/active')
      .then((r) => r.data),

  create: (payload: CreateProductAttributeFieldPayload) =>
    api
      .post<{ field: ProductAttributeField }>(
        '/auth/product-attribute-fields/create',
        payload,
      )
      .then((r) => r.data.field),

  update: (id: string, payload: UpdateProductAttributeFieldPayload) =>
    api
      .patch<{ field: ProductAttributeField }>(
        `/auth/product-attribute-fields/update/${id}`,
        payload,
      )
      .then((r) => r.data.field),

  remove: (id: string) =>
    api.delete(`/auth/product-attribute-fields/delete/${id}`),
};
