import React from 'react';
import { Logo } from '../../../../../components/Logo';
import type { Store } from '@/types/api';
import {
  instagramEmbedUrl,
  normalizeInstagramHandle,
} from '@/lib/store-contact';

interface LandingInstagramSectionProps {
  store: Store;
}

export const LandingInstagramSection: React.FC<LandingInstagramSectionProps> = ({
  store,
}) => {
  const handle = normalizeInstagramHandle(store.settings?.contact?.instagram);
  if (!handle) return null;

  const location = store.settings?.profile?.location?.trim() || 'Canoas, RS';

  return (
    <section className="section-pad bg-background border-y border-border">
      <div className="viewport-content text-center">
        <h2 className="text-label text-primary uppercase tracking-widest mb-4">
          No nosso dia a dia
        </h2>
        <h3 className="text-section-title text-foreground mb-12">
          Siga a nossa jornada afetiva
        </h3>

        <div className="max-w-md mx-auto rounded-lg overflow-hidden border border-border bg-card">
          <div className="p-5 flex items-center gap-3 border-b border-border bg-card">
            <div className="w-10 h-10 rounded-full bg-linear-to-tr from-yellow-400 to-purple-600 p-0.5">
              <div className="w-full h-full rounded-full bg-card flex items-center justify-center overflow-hidden">
                <Logo size={24} />
              </div>
            </div>
            <div className="text-left">
              <span className="block text-label text-foreground">{handle}</span>
              <span className="block text-[10px] text-muted-foreground uppercase tracking-wider">
                {location}
              </span>
            </div>
          </div>
          <div className="aspect-square bg-muted relative">
            <iframe
              src={instagramEmbedUrl(handle)}
              className="w-full h-full border-none"
              scrolling="no"
              allowTransparency={true}
              frameBorder="0"
              title="Instagram Feed"
            ></iframe>
          </div>
        </div>

        <p className="mt-10 text-body text-muted-foreground">
          &quot;Cada detalhe é pensado para levar mais cor e saudade boa para o seu lar.&quot;
        </p>
      </div>
    </section>
  );
};
