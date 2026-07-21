import React from 'react';

export const LandingAbout: React.FC = () => {
  return (
    <section id="sobre" className="section-pad bg-background">
      <div className="viewport-content max-w-4xl text-center">
        <h2 className="text-label text-primary uppercase tracking-widest mb-4">A nossa essência</h2>
        <h3 className="text-section-title text-foreground mb-8">Onde mora a saudade, nasce o afeto</h3>
        <p className="text-body text-muted-foreground mb-12 max-w-2xl mx-auto">
          Na Memorinhas, acreditamos que a vida é feita de instantes que não voltam, mas que podem ser
          revividos através do olhar. Cada ímã que produzimos em Canoas/RS é fruto de um cuidado
          artesanal rigoroso, transformando papel e memória em algo palpável, caloroso e eterno.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6">
            <h4 className="text-card-title text-foreground mb-2">Cuidado Humano</h4>
            <p className="text-body text-muted-foreground">Cada foto é tratada com o respeito que sua história merece.</p>
          </div>
          <div className="p-6">
            <h4 className="text-card-title text-foreground mb-2">Valor Emocional</h4>
            <p className="text-body text-muted-foreground">Mais que um produto, uma forma de manter quem você ama por perto.</p>
          </div>
          <div className="p-6">
            <h4 className="text-card-title text-foreground mb-2">Simplicidade</h4>
            <p className="text-body text-muted-foreground">O minimalismo que deixa a sua memória brilhar sozinha.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
