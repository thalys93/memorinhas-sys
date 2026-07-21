import api from './api';
import type {
  CreateRolePayload,
  PaginatedResponse,
  Role,
  UpdateRolePayload,
} from '@/types/api';

export const roleService = {
  list: (page = 1, limit = 10) =>
    api
      .get<PaginatedResponse<Role>>('/security/roles', { params: { page, limit } })
      .then((r) => r.data),

  getById: (id: number) =>
    api.get<Role>(`/security/roles/${id}`).then((r) => r.data),

  create: (payload: CreateRolePayload) =>
    api.post<Role>('/security/roles/admin/create', payload).then((r) => r.data),

  update: (id: number, payload: UpdateRolePayload) =>
    api.patch(`/security/roles/admin/update/${id}`, payload),

  remove: (id: number) => api.delete(`/security/roles/admin/delete/${id}`),
};
