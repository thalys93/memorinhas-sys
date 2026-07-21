export interface ProductTypeEntity {
  id: string;
  name: string;
  isCustomizable: boolean;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface StoreContactSettings {
  whatsapp?: string;
  whatsappMessage?: string;
  instagram?: string;
  paymentMethods?: string[];
}

export interface StoreShippingSettings {
  localPrefix?: string;
  localRate?: number;
  standardRate?: number;
  regions?: string;
}

export interface StoreThemeSettings {
  accentColor?: string;
  logoUrl?: string;
  heroImageUrl?: string;
}

export interface StoreProfileSettings {
  bio?: string;
  location?: string;
}

export interface StoreSettings {
  contact?: StoreContactSettings;
  shipping?: StoreShippingSettings;
  theme?: StoreThemeSettings;
  profile?: StoreProfileSettings;
}

export interface Product {
  id: string;
  name: string;
  value: number;
  productType: ProductTypeEntity;
  customizableSlots?: number | null;
  product_imgs: string[];
  freight: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Store {
  id: string;
  name: string;
  brand_url: string;
  sales: number;
  settings: StoreSettings;
  products?: Product[];
  keepers?: User[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Role {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  cellphone?: string;
  avatar_url?: string;
  roles?: Role[];
  created_at?: string;
  updated_at?: string;
}

export interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface LoginResponse {
  token: string;
  userData: {
    id: string;
    email: string;
    roles: string[] | Role[];
    name?: string;
  };
}

export interface UpdateStorePayload {
  name?: string;
  brand_url?: string;
  sales?: number;
  settings?: Partial<StoreSettings>;
}

export interface CreateProductPayload {
  name: string;
  value: number;
  productTypeId: string;
  customizableSlots?: number;
  product_imgs?: string[];
  freight?: boolean;
}

export interface UpdateProductPayload {
  name?: string;
  value?: number;
  productTypeId?: string;
  customizableSlots?: number;
  product_imgs?: string[];
  freight?: boolean;
}

export interface CreateProductTypePayload {
  name: string;
  isCustomizable?: boolean;
  active?: boolean;
}

export interface UpdateProductTypePayload {
  name?: string;
  isCustomizable?: boolean;
  active?: boolean;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  roles: string[];
  avatar_url?: string;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
  avatar_url?: string;
  roles?: string[];
}

export interface CreateRolePayload {
  name: string;
}

export interface UpdateRolePayload {
  name?: string;
}

export interface AssignKeepersPayload {
  keeperIds: string[];
}

export interface PublicProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  productTypeId?: string;
  minValue?: number;
  maxValue?: number;
  freight?: boolean;
}

export type OrderStatus = 'pending' | 'shipped' | 'completed' | 'cancelled';
export type FreightType = 'local' | 'standard' | 'free';
export type FulfillmentMode = 'delivery' | 'pickup';

export interface OrderItem {
  id: string;
  quantity: number;
  unitValue: number;
  freight: boolean;
  customization?: { imageUrls: string[] } | null;
  product?: Product;
}

export interface Order {
  id: string;
  status: OrderStatus;
  fulfillmentMode?: FulfillmentMode | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  cep: string;
  paymentMethod: string;
  freightAmount: number;
  freightType: FreightType;
  subtotal: number;
  total: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderSummary {
  pendingCount: number;
  completedCount: number;
  cancelledCount: number;
  revenue: number;
  averageTicket: number;
}

export interface CreateOrderPayload {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  cep: string;
  paymentMethod: string;
  items: {
    productId: string;
    quantity: number;
    customization?: { imageUrls: string[] };
  }[];
}

export interface UpdateOrderStatusPayload {
  status: OrderStatus;
  fulfillmentMode?: FulfillmentMode;
}

export interface NotifyOrderPayload {
  message?: string;
}

export const DEFAULT_PAYMENT_METHODS = ['Pix', 'Dinheiro', 'Cartão'];

