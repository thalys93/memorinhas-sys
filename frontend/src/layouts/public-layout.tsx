import { Outlet } from 'react-router-dom';
import { CookieConsent } from '@/components/cookie-consent';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { CartSidebar } from '@/components/cart-sidebar';

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="grow">
        <Outlet />
      </main>
      <Footer />
      <CartSidebar />
      <CookieConsent />
    </div>
  );
}

export default PublicLayout;
