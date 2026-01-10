
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Products } from './components/Products';
import { Features } from './components/Features';
import { InstagramSection } from './components/InstagramSection';
import { Footer } from './components/Footer';
import { Customizer } from './components/Customizer';
import { AdminPortal } from './components/Admin/AdminPortal';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'customizer' | 'admin'>('landing');
  const [selectedKit, setSelectedKit] = useState<number | null>(null);

  // Initialize data if not present
  useEffect(() => {
    if (!localStorage.getItem('memorinhas_config')) {
      const defaultConfig = {
        kits: [
          { quantity: 3, price: 29.99 },
          { quantity: 5, price: 44.99 },
          { quantity: 10, price: 79.99 },
          { quantity: 15, price: 119.99 },
        ],
        shipping: {
          localPrefix: '92',
          localRate: 5.00,
          standardRate: 15.00,
          regions: 'Canoas, Porto Alegre, RS'
        }
      };
      localStorage.setItem('memorinhas_config', JSON.stringify(defaultConfig));
    }
  }, []);

  const handleStartCustomization = (quantity: number) => {
    setSelectedKit(quantity);
    setView('customizer');
    window.scrollTo(0, 0);
  };

  const handleBackToHome = () => {
    setView('landing');
    window.scrollTo(0, 0);
  };

  if (view === 'admin') {
    return <AdminPortal onExit={() => setView('landing')} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar onNavigateHome={handleBackToHome} isCustomizer={view === 'customizer'} />
      <main className="flex-grow">
        {view === 'landing' ? (
          <>
            <Hero />
            <About />
            <Products onSelectKit={handleStartCustomization} />
            <Features />
            <InstagramSection />
          </>
        ) : (
          <Customizer initialKitSize={selectedKit || 5} onBack={handleBackToHome} />
        )}
      </main>
      <Footer onAdminClick={() => setView('admin')} />
    </div>
  );
};

export default App;
