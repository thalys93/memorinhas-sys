import React from 'react';

export const LandingAbout: React.FC = () => {
  return (
    <section id="sobre" className="section-pad bg-background">
      <div className="viewport-content max-w-4xl text-center">
        <p className="text-label text-primary uppercase tracking-widest mb-4">A nossa essência</p>
        <h2 className="text-section-title text-foreground mb-8">
          Memórias que você vê todos os dias
        </h2>
        <p className="text-body text-muted-foreground mb-12 max-w-2xl mx-auto">
          A Memorinhas transforma suas fotos em ímãs artesanais em Canoas/RS. Cada peça
          é impressa em papel fotográfico premium e montada com cuidado — para a saudade
          ganhar lugar na geladeira, no quadro ou no presente.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6">
            <h3 className="text-card-title text-foreground mb-2">Feito à mão</h3>
            <p className="text-body text-muted-foreground">
              Cada foto recebe atenção real, do corte ao acabamento.
            </p>
          </div>
          <div className="p-6">
            <h3 className="text-card-title text-foreground mb-2">Presente que fica</h3>
            <p className="text-body text-muted-foreground">
              Uma forma simples de manter quem você ama por perto.
            </p>
          </div>
          <div className="p-6">
            <h3 className="text-card-title text-foreground mb-2">Foto em primeiro plano</h3>
            <p className="text-body text-muted-foreground">
              Design limpo para a memória brilhar sozinha.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
