import api from './api';
import type { LoginResponse, User } from '@/types/api';

export const authService = {
  login: (email: string, password: string) =>
    api.post<LoginResponse>('/auth/login', { email, password }).then((r) => r.data),

  me: () =>
    api.get<User | { found: User }>('/auth/me').then((r) => {
      const data = r.data;
      return 'found' in data ? data.found : data;
    }),
};
