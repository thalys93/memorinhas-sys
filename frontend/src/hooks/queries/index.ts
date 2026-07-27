import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { storeService } from '@/services/store.service';
import { productService } from '@/services/product.service';
import { productTypeService } from '@/services/product-type.service';
import { userService } from '@/services/user.service';
import { roleService } from '@/services/role.service';
import { authService } from '@/services/auth.service';
import { orderService } from '@/services/order.service';
import { env } from '@/constants/env';
import type {
  AssignKeepersPayload,
  CreateOrderPayload,
  CreateProductPayload,
  CreateProductTypePayload,
  CreateRolePayload,
  CreateUserPayload,
  NotifyOrderPayload,
  PublicProductFilters,
  UpdateOrderStatusPayload,
  UpdateProductPayload,
  UpdateProductTypePayload,
  UpdateRolePayload,
  UpdateStorePayload,
  UpdateUserPayload,
} from '@/types/api';

export const queryKeys = {
  publicStore: (brand: string) => ['store', 'public', brand] as const,
  publicProducts: (brand: string, filters: PublicProductFilters) =>
    ['products', 'public', brand, filters] as const,
  publicProduct: (brand: string, id: string) =>
    ['products', 'public', brand, id] as const,
  store: ['store', 'canonical'] as const,
  products: ['products'] as const,
  productTypes: (page?: number) => ['product-types', page] as const,
  productTypesActive: ['product-types', 'active'] as const,
  users: (page?: number, limit?: number) => ['users', page, limit] as const,
  roles: (page?: number) => ['roles', page] as const,
  me: ['auth', 'me'] as const,
  orders: (page?: number) => ['orders', page] as const,
  ordersSummary: ['orders', 'summary'] as const,
  order: (id: string) => ['orders', 'detail', id] as const,
};

export function usePublicStore(brandUrl = env.storeBrandUrl) {
  return useQuery({
    queryKey: queryKeys.publicStore(brandUrl),
    queryFn: () => storeService.getPublic(brandUrl),
    retry: false,
    staleTime: Infinity,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useStore(enabled = true) {
  return useQuery({
    queryKey: queryKeys.store,
    queryFn: () => storeService.get(),
    enabled,
  });
}

export function useProducts() {
  return useQuery({
    queryKey: queryKeys.products,
    queryFn: () => productService.list(),
  });
}

export function usePublicProducts(
  filters: PublicProductFilters = {},
  brandUrl = env.storeBrandUrl,
) {
  return useQuery({
    queryKey: queryKeys.publicProducts(brandUrl, filters),
    queryFn: () => productService.listPublic(filters, brandUrl),
  });
}

export function usePublicProduct(id: string, brandUrl = env.storeBrandUrl) {
  return useQuery({
    queryKey: queryKeys.publicProduct(brandUrl, id),
    queryFn: () => productService.getPublicById(id, brandUrl),
    enabled: Boolean(id),
    retry: false,
  });
}

export function useProductTypes(page = 1) {
  return useQuery({
    queryKey: queryKeys.productTypes(page),
    queryFn: () => productTypeService.list(page),
  });
}

export function useActiveProductTypes(auth = true) {
  return useQuery({
    queryKey: [...queryKeys.productTypesActive, auth] as const,
    queryFn: () =>
      auth
        ? productTypeService.listActive()
        : productTypeService.listActivePublic(),
  });
}

export function useMe() {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: () => authService.me(),
  });
}

export function useUsers(page = 1, limit = 10) {
  return useQuery({
    queryKey: queryKeys.users(page, limit),
    queryFn: () => userService.list(page, limit),
  });
}

export function useRoles(page = 1) {
  return useQuery({
    queryKey: queryKeys.roles(page),
    queryFn: () => roleService.list(page),
  });
}

export function useUpdateStore() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateStorePayload) => storeService.update(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.store });
      qc.removeQueries({ queryKey: ['store', 'public'] });
    },
  });
}

export function useAssignKeepers() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: AssignKeepersPayload) =>
      storeService.assignKeepers(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.store }),
  });
}

export function useRemoveKeeper() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => storeService.removeKeeper(userId),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.store }),
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProductPayload) => productService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.products }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateProductPayload }) =>
      productService.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.products }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.products }),
  });
}

export function useUpdateMe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateUserPayload) => userService.updateMe(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.me }),
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateUserPayload) => userService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
      userService.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useCreateRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateRolePayload) => roleService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['roles'] }),
  });
}

export function useUpdateRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateRolePayload }) =>
      roleService.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['roles'] }),
  });
}

export function useDeleteRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => roleService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['roles'] }),
  });
}

export function useCreateProductType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProductTypePayload) =>
      productTypeService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['product-types'] });
    },
  });
}

export function useUpdateProductType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateProductTypePayload;
    }) => productTypeService.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['product-types'] });
    },
  });
}

export function useDeleteProductType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productTypeService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['product-types'] });
    },
  });
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) =>
      orderService.createPublic(payload),
  });
}

export function useOrders(page = 1, options?: { refetchInterval?: number }) {
  return useQuery({
    queryKey: queryKeys.orders(page),
    queryFn: () => orderService.list(page),
    refetchInterval: options?.refetchInterval,
  });
}

export function useOrder(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.order(id),
    queryFn: () => orderService.get(id),
    enabled: Boolean(id) && enabled,
  });
}

export function useOrdersSummary(options?: { refetchInterval?: number }) {
  return useQuery({
    queryKey: queryKeys.ordersSummary,
    queryFn: () => orderService.summary(),
    refetchInterval: options?.refetchInterval,
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateOrderStatusPayload;
    }) => orderService.updateStatus(id, payload),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['orders'] });
      qc.invalidateQueries({ queryKey: queryKeys.order(vars.id) });
    },
  });
}

export function useNotifyOrderEmail() {
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload?: NotifyOrderPayload;
    }) => orderService.notifyEmail(id, payload),
  });
}

export function useDeleteOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => orderService.remove(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: ['orders'] });
      qc.invalidateQueries({ queryKey: queryKeys.ordersSummary });
      qc.removeQueries({ queryKey: queryKeys.order(id) });
    },
  });
}
