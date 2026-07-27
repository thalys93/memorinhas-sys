import React from 'react';
import { Sparkles, Printer, Gift, Home } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'Produção artesanal',
    desc: 'Montagem manual, com atenção aos detalhes de cada peça.',
  },
  {
    icon: Printer,
    title: 'Impressão que dura',
    desc: 'Papel fotográfico premium para cores vivas e nítidas.',
  },
  {
    icon: Gift,
    title: 'Presente afetivo',
    desc: 'Ideal para aniversário, casamento, chá de bebê ou só porque sim.',
  },
  {
    icon: Home,
    title: 'Feito em Canoas',
    desc: 'Produzido no RS, com entrega em Canoas e região metropolitana.',
  },
];

export const LandingFeatures: React.FC = () => {
  return (
    <section id="por-que-nos" className="section-pad bg-background">
      <div className="viewport-content">
        <div className="text-center mb-14">
          <p className="text-label text-primary uppercase tracking-widest mb-4">
            Por que a Memorinhas
          </p>
          <h2 className="text-section-title text-foreground">
            Qualidade que você sente no toque
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-start">
              <div className="text-primary mb-4">
                <Icon size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-card-title text-foreground mb-2">{title}</h3>
              <p className="text-body text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
