
import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Camera, MessageCircle, Info, Check, MapPin, Calculator, Truck } from 'lucide-react';

interface CustomizerProps {
  initialKitSize: number;
  onBack: () => void;
}

const getRotation = (index: number) => {
  const rotations = [-3, 2.5, -1.8, 3.2, -4, 2, -2.8, 4];
  return rotations[index % rotations.length];
};

export const Customizer: React.FC<CustomizerProps> = ({ initialKitSize, onBack }) => {
  const [photos, setPhotos] = useState<string[]>([]);
  const [kitSize, setKitSize] = useState(initialKitSize);
  const [address, setAddress] = useState('');
  const [cep, setCep] = useState('');
  const [shippingPrice, setShippingPrice] = useState<number | null>(null);
  const [config, setConfig] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('memorinhas_config');
    if (saved) setConfig(JSON.parse(saved));
  }, []);

  const [lastPhotoCount, setLastPhotoCount] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPhotos = files.map(file => URL.createObjectURL(file));
    setPhotos(prev => {
      setLastPhotoCount(prev.length);
      return [...prev, ...newPhotos].slice(0, 20);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const calculateShipping = () => {
    if (!config || cep.length < 8) return;
    const prefix = config.shipping.localPrefix;
    if (cep.startsWith(prefix)) {
      setShippingPrice(config.shipping.localRate);
    } else {
      setShippingPrice(config.shipping.standardRate);
    }
  };

  const currentKit = config?.kits.find((k: any) => k.quantity === kitSize) || config?.kits[0] || { price: 0 };
  const total = currentKit.price + (shippingPrice || 0);
  const isKitFull = photos.length >= kitSize;

  const handleWhatsAppOrder = () => {
    const shippingText = shippingPrice !== null ? `Frete: R$ ${shippingPrice.toFixed(2)}` : 'Frete a combinar';
    const addressText = address ? `Endereço: ${address}` : 'Endereço a informar';
    const message = `Olá! Gostaria de fazer um orçamento do Kit de ${kitSize} ímãs na Memorinhas.
- Fotos selecionadas: ${photos.length}
- ${addressText}
- CEP: ${cep}
- ${shippingText}
- Total: R$ ${total.toFixed(2).replace('.', ',')}`;
    
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/5551999999999?text=${encoded}`, '_blank');
  };

  if (!config) return null;

  return (
    <div className="pt-24 min-h-screen bg-slate-100/50 pb-20">
      <style>{`
        @keyframes magnet-pop {
          0% { transform: scale(0.5) rotate(0deg); opacity: 0; }
          70% { transform: scale(1.05) rotate(var(--rot)); opacity: 1; }
          100% { transform: scale(1) rotate(var(--rot)); opacity: 1; }
        }
        .animate-magnet {
          animation: magnet-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          opacity: 0;
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12 gap-6">
          <div>
            <h1 className="text-2xl md:text-4xl font-serif text-slate-900 mb-1">Personalize seu Mural</h1>
            <p className="text-slate-500 text-sm">Eternize suas melhores memórias.</p>
          </div>
          <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-full border border-slate-200 shadow-sm overflow-x-auto w-full md:w-auto no-scrollbar">
            {config.kits.map((kit: any) => (
              <button
                key={kit.quantity}
                onClick={() => setKitSize(kit.quantity)}
                className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                  kitSize === kit.quantity 
                  ? 'bg-[#b99778] text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {kit.quantity} un.
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 md:gap-12 items-start">
          <div className="lg:col-span-2 space-y-8 md:space-y-12">
            
            {/* Delivery Info Section */}
            <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 border border-slate-100 shadow-xl shadow-slate-200/30">
              <div className="flex items-center gap-3 mb-6 md:mb-8">
                <div className="w-10 h-10 rounded-full bg-[#b99778]/10 text-[#b99778] flex items-center justify-center">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-serif text-slate-900">Onde entregamos?</h3>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">Informações de entrega</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-3">
                  <label className="block text-xs font-medium text-slate-700 ml-1">Seu CEP</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="00000-000"
                      maxLength={9}
                      value={cep}
                      onChange={(e) => setCep(e.target.value)}
                      className="w-full pl-4 pr-24 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#b99778]/20 focus:border-[#b99778] transition-all text-sm"
                    />
                    <button 
                      onClick={calculateShipping}
                      className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-white border border-slate-100 rounded-lg text-[10px] font-bold text-[#b99778] hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <Calculator size={12} />
                      Calcular
                    </button>
                  </div>
                  {shippingPrice !== null && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-100 text-green-700 animate-in fade-in slide-in-from-top-2 duration-500">
                      <Truck size={16} />
                      <span className="text-xs font-medium">
                        Frete: <strong>R$ {shippingPrice.toFixed(2).replace('.', ',')}</strong>
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-medium text-slate-700 ml-1">Endereço Completo</label>
                  <input 
                    type="text" 
                    placeholder="Rua, número, bairro..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#b99778]/20 focus:border-[#b99778] transition-all text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Upload Area */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 text-center cursor-pointer transition-all duration-300 ${
                isKitFull 
                ? 'bg-slate-100 border-slate-200 opacity-60 pointer-events-none' 
                : 'bg-white border-slate-200 hover:border-[#b99778]'
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                multiple 
                accept="image/*" 
                onChange={handleFileChange}
              />
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-[#b99778]/10 text-[#b99778] rounded-full flex items-center justify-center mb-4 md:mb-6">
                  {/* Fix: removed invalid md:size prop and used tailwind classes for responsiveness */}
                  <Upload className="w-7 h-7 md:w-9 md:h-9" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl md:text-2xl font-serif text-slate-900 mb-1">
                  {isKitFull ? 'Mural pronto!' : 'Escolha suas fotos'}
                </h3>
                <p className="text-slate-500 text-xs max-w-xs mx-auto">
                  Toque para selecionar imagens da sua galeria.
                </p>
              </div>
            </div>

            {/* Preview Grid */}
            <div className="relative">
              <div className="flex items-center justify-between mb-8 md:mb-10">
                <h3 className="text-xl md:text-2xl font-serif text-slate-900 flex items-center gap-2">
                  Seu Mural
                  <span className="text-[10px] font-sans font-semibold text-[#b99778] bg-[#b99778]/10 px-3 py-1 rounded-full">
                    {photos.length}/{kitSize}
                  </span>
                </h3>
                {photos.length > 0 && (
                  <button 
                    onClick={() => setPhotos([])}
                    className="text-[10px] uppercase tracking-widest text-slate-400 hover:text-red-500 font-medium"
                  >
                    Limpar
                  </button>
                )}
              </div>

              {photos.length === 0 ? (
                <div className="bg-white/40 backdrop-blur-sm rounded-[2rem] md:rounded-[3rem] p-12 md:p-24 text-center border border-white shadow-inner border-dashed border-slate-200">
                  <Camera size={48} strokeWidth={1} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-400 font-light text-base md:text-xl">Sua prévia aparecerá aqui.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-x-10 md:gap-y-14">
                  {photos.map((src, idx) => {
                    const rot = getRotation(idx);
                    const isNew = idx >= lastPhotoCount;
                    const staggerDelay = isNew ? (idx - lastPhotoCount) * 0.15 : 0;

                    return (
                      <div 
                        key={`${src}-${idx}`} 
                        style={{ 
                          '--rot': `${rot}deg`,
                          animationDelay: `${staggerDelay}s`
                        } as React.CSSProperties}
                        className={`group relative transition-all duration-500 hover:z-20 hover:scale-105 ${isNew ? 'animate-magnet' : ''}`}
                      >
                        <div 
                          className="relative aspect-square transition-all duration-500 transform group-hover:rotate-0"
                          style={{ transform: `rotate(${rot}deg)` }}
                        >
                          <div className="w-full h-full bg-white p-2 md:p-3 rounded-[1.5rem] md:rounded-[2rem] shadow-lg border-b-2 border-slate-200 relative overflow-hidden">
                            <div className="w-full h-full rounded-[1.2rem] md:rounded-[1.4rem] overflow-hidden bg-slate-100 relative">
                              <img src={src} className="w-full h-full object-cover" alt={`Foto ${idx}`} />
                              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 pointer-events-none"></div>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => removePhoto(idx)}
                          className="absolute -top-2 -right-2 w-7 h-7 bg-white text-red-500 rounded-full flex items-center justify-center shadow-lg border border-slate-100 z-30"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    );
                  })}
                  
                  {Array.from({ length: Math.max(0, kitSize - photos.length) }).map((_, i) => (
                    <div 
                      key={`empty-${i}`} 
                      className="aspect-square rounded-[1.5rem] md:rounded-[2rem] border-2 border-dashed border-slate-200 bg-white/30 flex flex-col items-center justify-center text-slate-300"
                    >
                      <span className="text-lg font-serif">+</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-32 space-y-6 md:space-y-8">
            <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-8 md:p-10 border border-slate-100 shadow-2xl shadow-slate-200/40">
              <div className="flex items-center gap-2 mb-6 md:mb-8">
                <div className="w-2 h-2 rounded-full bg-[#b99778]"></div>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">Resumo</h4>
              </div>
              
              <div className="space-y-4 md:space-y-6 mb-8 md:mb-12">
                <div className="flex justify-between items-center pb-3 md:pb-4 border-b border-slate-50">
                  <span className="text-xs md:text-sm text-slate-500">Kit</span>
                  <span className="font-semibold text-slate-900 text-sm">{kitSize} Ímãs</span>
                </div>
                <div className="flex justify-between items-center pb-3 md:pb-4 border-b border-slate-50">
                  <span className="text-xs md:text-sm text-slate-500">Adicionadas</span>
                  <span className={`font-bold px-3 py-1 rounded-full text-[10px] ${photos.length === kitSize ? 'bg-green-50 text-green-600' : 'bg-[#b99778]/5 text-[#b99778]'}`}>
                    {photos.length}/{kitSize}
                  </span>
                </div>
                {shippingPrice !== null && (
                  <div className="flex justify-between items-center pb-3 md:pb-4 border-b border-slate-50">
                    <span className="text-xs md:text-sm text-slate-500">Frete</span>
                    <span className="font-semibold text-slate-900 text-sm">R$ {shippingPrice.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
              </div>

              <div className="mb-8 md:mb-10 text-right">
                <span className="text-slate-400 text-[10px] uppercase tracking-widest block mb-1">Investimento Total</span>
                <span className="text-3xl md:text-5xl font-serif text-slate-900 tracking-tight">
                  <span className="text-sm md:text-lg font-sans align-top mr-1">R$</span>
                  {total.toFixed(2).replace('.', ',')}
                </span>
              </div>

              <button 
                disabled={photos.length === 0}
                onClick={handleWhatsAppOrder}
                className={`w-full py-4 md:py-5 rounded-2xl font-bold text-base md:text-lg flex items-center justify-center gap-3 transition-all active:scale-95 ${
                  photos.length > 0 
                  ? 'bg-[#b99778] text-white hover:bg-[#a6866a] shadow-xl shadow-[#b99778]/20' 
                  : 'bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200'
                }`}
              >
                {/* Fix: removed invalid md:size prop and used tailwind classes for responsiveness */}
                <MessageCircle className={`w-5 h-5 md:w-[22px] md:h-[22px] ${photos.length > 0 ? "fill-white/10" : ""}`} />
                Finalizar Pedido
              </button>

              <div className="mt-6 md:mt-8 p-4 md:p-6 bg-slate-50 rounded-[1.5rem] md:rounded-[2.5rem] flex items-start gap-3 md:gap-4 border border-slate-100">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white flex items-center justify-center text-[#b99778] shrink-0 shadow-sm">
                  {/* Fix: removed invalid md:size prop and used tailwind classes for responsiveness */}
                  <Info className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                </div>
                <p className="text-[10px] md:text-[12px] text-slate-500 leading-relaxed">
                  Confirmaremos todos os detalhes e enviaremos o link de pagamento pelo WhatsApp.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
