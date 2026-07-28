import LandingPage from '@/subdomains/app/pages/landing/LandingPage';
import CustomizerPage from '@/subdomains/app/pages/Customizer/CustomizerPage';
import { ProductsCatalogPage } from '@/subdomains/app/pages/products/ProductsCatalogPage';
import { ProductDetailPage } from '@/subdomains/app/pages/products/ProductDetailPage';
import TermsOfUsePage from '@/subdomains/app/pages/legal/TermsOfUsePage';
import PrivacyPolicyPage from '@/subdomains/app/pages/legal/PrivacyPolicyPage';
import PublicLayout from '@/layouts/public-layout';
import ShopkeeperPrivateLayout from '@/layouts/shopkeeper-private-layout';
import AdminPrivateLayout from '@/layouts/admin-private-layout';
import { DashboardPage } from '@/subdomains/shopkeeper/pages/Dashboard/DashboardPage';
import { ProductsPage } from '@/subdomains/shopkeeper/pages/Products/ProductsPage';
import { ProductFormPage } from '@/subdomains/shopkeeper/pages/Products/ProductFormPage';
import { ShippingPage } from '@/subdomains/shopkeeper/pages/Shipping/ShippingPage';
import { ProfilePage } from '@/subdomains/shopkeeper/pages/Profile/ProfilePage';
import { StorePage } from '@/subdomains/shopkeeper/pages/Store/StorePage';
import { OrdersPage } from '@/subdomains/shopkeeper/pages/Orders/OrdersPage';
import { OrderDetailPage } from '@/subdomains/shopkeeper/pages/Orders/OrderDetailPage';
import { ShopkeeperLoginPage } from '@/subdomains/shopkeeper/pages/Login/ShopkeeperLoginPage';
import { AdminLoginPage } from '@/subdomains/admin/pages/Login/AdminLoginPage';
import { AdminDashboardPage } from '@/subdomains/admin/pages/Dashboard/AdminDashboardPage';
import { StoresPage } from '@/subdomains/admin/pages/Stores/StoresPage';
import { UsersPage } from '@/subdomains/admin/pages/Users/UsersPage';
import { RolesPage } from '@/subdomains/admin/pages/Roles/RolesPage';
import { ProductTypesPage } from '@/subdomains/admin/pages/ProductTypes/ProductTypesPage';
import { ProductAttributeFieldsPage } from '@/subdomains/admin/pages/ProductAttributeFields/ProductAttributeFieldsPage';
import { NotFoundPage } from '@/pages/not-found';
import type { RoutesGroup } from '@/types/routes.types';

export const PublicRoutes: RoutesGroup = {
  prefix: '',
  publicMiddleware: PublicLayout,
  public: [
    { path: '', element: LandingPage },
    { path: 'produtos', element: ProductsCatalogPage },
    { path: 'produtos/:id', element: ProductDetailPage },
    { path: 'customizar', element: CustomizerPage },
    { path: 'termos', element: TermsOfUsePage },
    { path: 'privacidade', element: PrivacyPolicyPage },
  ],
};

export const ShopkeeperRoutes: RoutesGroup = {
  prefix: 'lojista',
  public: [{ path: 'login', element: ShopkeeperLoginPage }],
  private: [
    { path: '', element: DashboardPage },
    { path: 'pedidos', element: OrdersPage },
    { path: 'pedidos/:id', element: OrderDetailPage },
    { path: 'produtos', element: ProductsPage },
    { path: 'produtos/novo', element: ProductFormPage },
    { path: 'produtos/:id', element: ProductFormPage },
    { path: 'entrega', element: ShippingPage },
    { path: 'loja', element: StorePage },
    { path: 'perfil', element: ProfilePage },
  ],
  privateMiddleware: ShopkeeperPrivateLayout,
};

export const AdminRoutes: RoutesGroup = {
  prefix: 'admin',
  public: [{ path: 'login', element: AdminLoginPage }],
  private: [
    { path: '', element: AdminDashboardPage },
    { path: 'loja', element: StoresPage },
    { path: 'lojas', element: StoresPage },
    { path: 'usuarios', element: UsersPage },
    { path: 'papeis', element: RolesPage },
    { path: 'tipos-produto', element: ProductTypesPage },
    { path: 'campos-produto', element: ProductAttributeFieldsPage },
  ],
  privateMiddleware: AdminPrivateLayout,
};

export const AllRoutes: RoutesGroup[] = [PublicRoutes, ShopkeeperRoutes, AdminRoutes];

export { NotFoundPage };
