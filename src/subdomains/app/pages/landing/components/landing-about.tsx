
import React from 'react';

export const LandingAbout: React.FC = () => {
  return (
    <section id="sobre" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-sm font-medium text-[#b99778] uppercase tracking-widest mb-4">A nossa essência</h2>
        <h3 className="text-3xl md:text-4xl font-serif text-slate-900 mb-8">Onde mora a saudade, nasce o afeto</h3>
        <p className="text-xl text-slate-600 leading-relaxed font-light mb-12 italic">
          "Na Memorinhas, acreditamos que a vida é feita de instantes que não voltam, mas que podem ser revividos através do olhar. Cada ímã que produzimos em Canoas/RS é fruto de um cuidado artesanal rigoroso, transformando papel e memória em algo palpável, caloroso e eterno."
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6">
            <h4 className="font-semibold text-slate-900 mb-2">Cuidado Humano</h4>
            <p className="text-sm text-slate-500">Cada foto é tratada com o respeito que sua história merece.</p>
          </div>
          <div className="p-6">
            <h4 className="font-semibold text-slate-900 mb-2">Valor Emocional</h4>
            <p className="text-sm text-slate-500">Mais que um produto, uma forma de manter quem você ama por perto.</p>
          </div>
          <div className="p-6">
            <h4 className="font-semibold text-slate-900 mb-2">Simplicidade</h4>
            <p className="text-sm text-slate-500">O minimalismo que deixa a sua memória brilhar sozinha.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
