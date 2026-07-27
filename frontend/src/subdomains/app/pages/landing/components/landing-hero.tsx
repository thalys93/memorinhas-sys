import React, { useState } from 'react';
import { ChevronRight, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Store } from '@/types/api';
import { whatsappUrl } from '@/lib/store-contact';

interface LandingHeroProps {
  store: Store;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ store }) => {
  const [imageBroken, setImageBroken] = useState(false);
  const heroImageUrl = store.settings?.theme?.heroImageUrl;
  const whatsapp = store.settings?.contact?.whatsapp;
  const whatsappMessage = store.settings?.contact?.whatsappMessage;
  const showImage = !!heroImageUrl && !imageBroken;
  const brandName = store.name;

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-linear-to-b from-surface-alt via-background to-background" />
      <div className="viewport-content relative pt-28 pb-16 md:pt-36 md:pb-24 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div className="z-10">
          <p className="stagger-fade-in text-page-title text-foreground mb-4">{brandName}</p>
          <h1 className="stagger-fade-in text-section-title text-foreground mb-5 max-w-xl">
            Ímãs artesanais das suas fotos favoritas
          </h1>
          <p className="stagger-fade-in text-body text-muted-foreground mb-10 max-w-md">
            Impressão fotográfica premium, feito à mão em Canoas. Para presentear
            alguém especial ou encher a geladeira de memória boa.
          </p>
          <div className="stagger-fade-in flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => handleScrollTo('produtos')}
              size="lg"
              className="gap-2"
            >
              Escolher meus ímãs
              <ChevronRight size={18} />
            </Button>
            <Button
              disabled={!whatsapp}
              size="lg"
              variant="outline"
              onClick={() => {
                if (whatsapp) window.open(whatsappUrl(whatsapp, whatsappMessage), '_blank');
              }}
              className="gap-2"
            >
              <MessageCircle size={18} className="text-[#25D366]" />
              Pedir no WhatsApp
            </Button>
          </div>
          <div className="stagger-fade-in mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-label text-muted-foreground font-normal">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Entrega em Canoas e região
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Papel fotográfico premium
            </span>
          </div>
        </div>

        <div className="stagger-fade-in relative">
          <div className="aspect-square rounded-lg overflow-hidden relative z-10 bg-surface-alt">
            {showImage ? (
              <img
                src={heroImageUrl}
                alt="Ímãs de fotos artesanais Memorinhas feitos em Canoas"
                className="w-full h-full object-cover"
                onError={() => setImageBroken(true)}
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};
