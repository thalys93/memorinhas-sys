import React, { useState, useRef, useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import PublicLayout from '@/subdomains/app/components/public-layout/PublicLayout';
import { Upload, MapPin, Calculator, Truck } from 'lucide-react';
import PreviewGrid from './components/preview-grid';
import PhotosList from './components/photos-list';
import CustomizerSidebar from './components/customizer-sidebar';

const inlineStyle = `
          @keyframes magnet-pop {
            0% { transform: scale(0.5) rotate(0deg); opacity: 0; }
            70% { transform: scale(1.05) rotate(var(--rot)); opacity: 1; }
            100% { transform: scale(1) rotate(var(--rot)); opacity: 1; }
          }
          
          .animate-magnet {
            animation: magnet-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            opacity: 0;
          }
`

const CustomizerPage = () => {
  const [searchParams] = useSearchParams();
  const kitParam = searchParams.get('kit');
  const initialKitSize = kitParam ? parseInt(kitParam) : 5;

  if (!initialKitSize || initialKitSize < 1 || initialKitSize > 15) {
    return <Navigate to="/" />
  }

  const [photos, setPhotos] = useState<string[]>([]);
  const [kitSize, setKitSize] = useState(initialKitSize);
  const [address, setAddress] = useState('');
  const [cep, setCep] = useState('');
  const [shippingPrice, setShippingPrice] = useState<number | null>(null);
  const [config, setConfig] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // todo: isso virá do backend (vulgo ensupa base)
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

  if (!config) return null;

  return (
    <PublicLayout>
      <div className="pt-24 min-h-screen bg-slate-100/50 pb-20">
        <style>{inlineStyle}</style>

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
                  className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap ${kitSize === kit.quantity
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
                className={`relative border-2 border-dashed rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 text-center cursor-pointer transition-all duration-300 ${isKitFull
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

              <div className="relative">
                <PreviewGrid photos={photos} setPhotos={setPhotos} kitSize={kitSize} />

                <PhotosList
                  photos={photos}
                  setPhotos={setPhotos}
                  removePhoto={removePhoto}
                  kitSize={kitSize}
                  lastPhotoCount={lastPhotoCount}
                />
              </div>
            </div>

            <CustomizerSidebar
              kitSize={kitSize}
              photos={photos}
              shippingPrice={shippingPrice}
              address={address}
              cep={cep}
              total={total}
            />
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default CustomizerPage;

