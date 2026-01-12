
import React from 'react';
import { Sparkles, Printer, Gift, Home } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: "Produção Artesanal",
    desc: "Feito à mão com atenção aos mínimos detalhes."
  },
  {
    icon: Printer,
    title: "Alta Qualidade",
    desc: "Impressão fotográfica premium que não desbota."
  },
  {
    icon: Gift,
    title: "Presente Afetivo",
    desc: "Uma forma carinhosa de presentear quem se ama."
  },
  {
    icon: Home,
    title: "Orgulho do RS",
    desc: "Produzido com carinho e dedicação em Canoas - RS."
  }
];

export const LandingFeatures: React.FC = () => {
  return (
    <section id="por-que-nos" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {features.map(({ icon: Icon, title, desc }, idx) => (
            <div key={idx} className="flex flex-col items-start">
              <div className="text-[#b99778] mb-4">
                {/* Fix: Directly use the Icon component with desired props instead of using React.cloneElement which had type mismatch issues */}
                <Icon size={32} strokeWidth={1.5} />
              </div>
              <h4 className="text-xl font-medium text-slate-900 mb-2">{title}</h4>
              <p className="text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
