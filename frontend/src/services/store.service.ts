import api from './api';
import type {
  AssignKeepersPayload,
  Store,
  UpdateStorePayload,
} from '@/types/api';

export const storeService = {
  getPublic: (brandUrl: string) =>
    api.get<{ found: Store }>(`/store/${brandUrl}`).then((r) => r.data.found),

  get: () =>
    api.get<{ found: Store }>('/auth/store').then((r) => r.data.found),

  update: (payload: UpdateStorePayload) =>
    api.patch('/auth/store', payload).then((r) => r.data),

  assignKeepers: (payload: AssignKeepersPayload) =>
    api.post('/auth/store/keepers', payload),

  removeKeeper: (userId: string) =>
    api.delete(`/auth/store/keepers/${userId}`),
};
