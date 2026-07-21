import api from './api';
import type {
  CreateUserPayload,
  PaginatedResponse,
  UpdateUserPayload,
  User,
} from '@/types/api';

export const userService = {
  list: (page = 1, limit = 10) =>
    api
      .get<PaginatedResponse<User>>('/auth/users', { params: { page, limit } })
      .then((r) => r.data),

  getById: (id: string) => api.get<User>(`/auth/users/${id}`).then((r) => r.data),

  create: (payload: CreateUserPayload) =>
    api.post<User>('/auth/users', payload).then((r) => r.data),

  update: (id: string, payload: UpdateUserPayload) =>
    api.patch(`/auth/users/update/${id}`, payload),

  updateMe: (payload: UpdateUserPayload) =>
    api.patch('/auth/users/update/me', payload),

  remove: (id: string) => api.delete(`/auth/users/delete/${id}`),
};
