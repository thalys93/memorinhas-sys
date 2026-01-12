
import React from 'react';
import { Logo } from '../../../../../components/Logo';

export const LandingInstagramSection: React.FC = () => {
  return (
    <section className="py-24 bg-white border-y border-slate-50">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-sm font-medium text-[#b99778] uppercase tracking-widest mb-4">No nosso dia a dia</h2>
        <h3 className="text-3xl md:text-4xl font-serif text-slate-900 mb-12">Siga a nossa jornada afetiva</h3>

        <div className="max-w-md mx-auto rounded-3xl overflow-hidden shadow-xl border border-slate-100 bg-white">
          <div className="p-5 flex items-center gap-3 border-b border-slate-50 bg-white">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600 p-[2px]">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                <Logo size={24} />
              </div>
            </div>
            <div className="text-left">
              <span className="block text-sm font-bold text-slate-800">memorinha__</span>
              <span className="block text-[10px] text-slate-400 uppercase tracking-wider">Canoas, RS</span>
            </div>
          </div>
          <div className="aspect-square bg-slate-50 relative">
            <iframe
              src="https://www.instagram.com/memorinha__/embed"
              className="w-full h-full border-none"
              scrolling="no"
              allowTransparency={true}
              frameBorder="0"
              title="Memorinhas Instagram Feed"
            ></iframe>
          </div>
        </div>

        <p className="mt-10 text-slate-500 italic font-light">
          "Cada detalhe é pensado para levar mais cor e saudade boa para o seu lar."
        </p>
      </div>
    </section>
  );
};
