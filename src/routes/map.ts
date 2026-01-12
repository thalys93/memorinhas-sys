import LandingPage from '@/subdomains/app/pages/landing/LandingPage';
import CustomizerPage from '@/subdomains/app/pages/Customizer/CustomizerPage';
import AdminPortal from '@/subdomains/admin/pages/Admin/AdminPortal';
import { DashboardPage } from '@/subdomains/admin/pages/Dashboard/DashboardPage';
import { PricesPage } from '@/subdomains/admin/pages/Prices/PricesPage';
import { ShippingPage } from '@/subdomains/admin/pages/Shipping/ShippingPage';
import { ProfilePage } from '@/subdomains/admin/pages/Profile/ProfilePage';

export const PublicRoutes = {
    prefix: "/",
    public: [
        { path: "", element: LandingPage },
        { path: "customizar", element: CustomizerPage },
    ],
}

export const AdminRoutes = {
    prefix: "/admin",
    layout: AdminPortal,
    pages: [
        { path: "", element: DashboardPage },
        { path: "precos", element: PricesPage },
        { path: "entrega", element: ShippingPage },
        { path: "perfil", element: ProfilePage },
    ]
}

export const AllRoutes = [PublicRoutes, AdminRoutes];