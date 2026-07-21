import { LandingHero } from '@/subdomains/app/pages/landing/components/landing-hero';
import { LandingAbout } from '@/subdomains/app/pages/landing/components/landing-about';
import { LandingProducts } from '@/subdomains/app/pages/landing/components/landing-products';
import { LandingInstagramSection } from '@/subdomains/app/pages/landing/components/landing-instagram-section';
import LandingFooter from './components/landing-footer';
import { LandingFeatures } from './components/landing-features';
import { StoreNotConfigured } from '@/components/store-not-configured';
import { useStoreBranding } from '@/hooks/use-store-branding';
import { useEffect } from 'react';
import { useCartStore } from '@/store/use-cart-store';

const LandingPage = () => {
  const { store, isLoading, isConfigured } = useStoreBranding();
  const setStoreId = useCartStore((s) => s.setStoreId);

  useEffect(() => {
    if (store?.id) setStoreId(store.id);
  }, [store?.id, setStoreId]);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-muted-foreground text-sm">
        Carregando loja...
      </div>
    );
  }

  if (!isConfigured || !store) {
    return <StoreNotConfigured />;
  }

  return (
    <>
      <LandingHero store={store} />
      <LandingAbout />
      <LandingProducts store={store} />
      <LandingFeatures />
      <LandingInstagramSection store={store} />
      <LandingFooter store={store} />
    </>
  );
};

export default LandingPage;
