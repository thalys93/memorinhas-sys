
import React from 'react';
import { ChevronRight, MessageCircle } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div className="z-10">
          <span className="inline-block py-1.5 px-4 bg-[#b99778]/10 text-[#b99778] text-xs font-bold rounded-full mb-8 uppercase tracking-[0.2em]">
            Ímãs Personalizados • Canoas/RS
          </span>
          <h1 className="text-6xl md:text-8xl font-serif font-bold text-slate-950 leading-[1.05] tracking-tight mb-8">
            Transforme suas fotos favoritas em <span className="text-[#b99778] italic font-normal block mt-2">ímãs artesanais</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-800 mb-12 max-w-xl leading-relaxed font-light">
            Eternize seus melhores momentos com acabamento premium e entrega rápida. O presente perfeito para decorar seu lar ou surpreender quem você ama.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="#produtos"
              className="px-10 py-5 bg-[#b99778] text-white rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#a6866a] hover:shadow-2xl hover:shadow-[#b99778]/30 transition-all active:scale-95 shadow-lg"
            >
              Ver kits e preços
              <ChevronRight size={20} />
            </a>
            <a 
              href="https://wa.me/5551999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-5 bg-white border border-slate-200 text-slate-800 rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:border-[#b99778] hover:text-[#b99778] transition-all"
            >
              <MessageCircle size={20} className="text-[#25D366]" />
              WhatsApp
            </a>
          </div>
          <div className="mt-10 flex items-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#b99778]"></span>
              Entrega em Canoas
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#b99778]"></span>
              Papel Fotográfico Premium
            </span>
          </div>
        </div>
        
        <div className="relative">
          <div className="aspect-square rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] transition-all duration-700 hover:scale-[1.03] border-[12px] border-white relative z-10">
            <img 
              src="https://instagram.fpoa28-1.fna.fbcdn.net/v/t51.82787-15/610881390_17843039967672368_7156074900679198786_n.jpg?stp=dst-jpg_e35_tt6&_nc_ohc=11CwIU3iBloQ7kNvwFsggbN&_nc_oc=Adl2XBT24_8C26ur0-3mZvlbnWTPhjBMTouhYiodCo8JURWedTqi-vR-8tg7HNTNW7LMEM-jkKMqz48LAhynAtTq&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fpoa28-1.fna&_nc_gid=1hA43tQW6oUfj8MZEaiPHg&oh=00_AfrmC-6Ps-Qsj7VggEVL5D3O-9lRywsvJ2als2uaRg-vQg&oe=696888A6" 
              alt="Ímãs de fotos artesanais Memorinhas" 
              className="w-full h-full object-cover"
            />
          </div>
          {/* Decorative elements */}
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[#b99778]/10 rounded-full -z-0 blur-3xl"></div>
          <div className="absolute -top-10 -left-10 w-48 h-48 bg-[#b99778]/5 rounded-full -z-0 blur-2xl"></div>
        </div>
      </div>
    </section>
  );
};
