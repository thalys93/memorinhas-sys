import { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { Upload } from 'lucide-react';
import PreviewGrid from './components/preview-grid';
import PhotosList from './components/photos-list';
import CustomizerSidebar from './components/customizer-sidebar';
import { StoreNotConfigured } from '@/components/store-not-configured';
import { useStoreBranding } from '@/hooks/use-store-branding';
import { useCartStore } from '@/store/use-cart-store';
import {
  buildCloudinaryPublicId,
  uploadToCloudinaryPublic,
} from '@/lib/cloudinary-upload';
import { toast } from '@/lib/toast';
import type { Product } from '@/types/api';

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
`;

const CustomizerPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cartItemId = searchParams.get('cartItemId');
  const productId = searchParams.get('productId');
  const { store, isLoading, isConfigured } = useStoreBranding();

  const items = useCartStore((s) => s.items);
  const updateCustomization = useCartStore((s) => s.updateCustomization);
  const openCart = useCartStore((s) => s.openCart);

  const cartItem = items.find((i) => i.id === cartItemId);
  const product = (store?.products ?? []).find(
    (p: Product) => p.id === (productId || cartItem?.productId),
  );

  const kitSize =
    product?.customizableSlots ||
    cartItem?.customizableSlots ||
    5;

  const [photos, setPhotos] = useState<string[]>(
    cartItem?.customization?.imageUrls ?? [],
  );
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [lastPhotoCount, setLastPhotoCount] = useState(0);

  useEffect(() => {
    if (cartItem?.customization?.imageUrls?.length) {
      setPhotos(cartItem.customization.imageUrls);
    }
  }, [cartItemId]);

  if (!cartItemId || !cartItem) {
    return <Navigate to="/produtos" replace />;
  }

  if (!product?.productType?.isCustomizable && !cartItem.isCustomizable) {
    return <Navigate to="/produtos" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-muted-foreground text-body pt-24">
        Carregando...
      </div>
    );
  }

  if (!isConfigured || !store) {
    return (
      <div className="pt-24">
        <StoreNotConfigured />
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const room = Math.max(kitSize - photos.length, 0);
    const accepted = files.slice(0, room);
    const newPhotos = accepted.map((file) => URL.createObjectURL(file));
    setPhotos((prev) => {
      setLastPhotoCount(prev.length);
      return [...prev, ...newPhotos];
    });
    setPhotoFiles((prev) => [...prev, ...accepted]);
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => {
      const url = prev[index];
      const blobIndex = prev
        .slice(0, index)
        .filter((p) => p.startsWith('blob:')).length;
      if (url?.startsWith('blob:')) {
        URL.revokeObjectURL(url);
        setPhotoFiles((files) => files.filter((_, i) => i !== blobIndex));
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleConfirm = async () => {
    if (photos.length === 0) return;
    setSaving(true);
    try {
      const kept = photos.filter(
        (p) => p.startsWith('http') && !p.startsWith('blob:'),
      );
      const uploaded: string[] = [];
      for (let i = 0; i < photoFiles.length; i++) {
        const file = photoFiles[i];
        const url = await uploadToCloudinaryPublic(
          file,
          buildCloudinaryPublicId(
            cartItem.name,
            `${cartItem.id}_${i}_${crypto.randomUUID().slice(0, 6)}`,
          ),
          cartItem.name,
        );
        uploaded.push(url);
      }
      updateCustomization(cartItem.id, {
        imageUrls: [...kept, ...uploaded],
      });
      toast('Personalização salva no carrinho');
      navigate('/');
      openCart();
    } catch {
      toast('Não foi possível enviar as fotos');
    } finally {
      setSaving(false);
    }
  };

  const isKitFull = photos.length >= kitSize;

  return (
    <div className="pt-16 min-h-screen bg-surface-alt pb-20">
      <style>{inlineStyle}</style>

      <div className="viewport-content max-w-6xl py-6 md:py-12">
        <div className="stagger-fade-in flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12 gap-6">
          <div>
            <h1 className="text-section-title text-foreground mb-1">
              Personalize seu mural
            </h1>
            <p className="text-body text-muted-foreground">
              {cartItem.name} — até {kitSize} fotos
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 md:gap-12 items-start">
          <div className="lg:col-span-2 space-y-8 md:space-y-12">
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-lg p-8 md:p-12 text-center cursor-pointer transition-all duration-300 ease-[cubic-bezier(0,0,0.5,1)] ${
                isKitFull
                  ? 'bg-muted border-border opacity-60 pointer-events-none'
                  : 'bg-card border-border hover:border-primary'
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
                <div className="w-16 h-16 md:w-20 md:w-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 md:mb-6">
                  <Upload className="w-7 h-7 md:w-9 md:h-9" strokeWidth={1.5} />
                </div>
                <h3 className="text-card-title text-foreground mb-1">
                  {isKitFull ? 'Mural pronto!' : 'Escolha suas fotos'}
                </h3>
                <p className="text-body text-muted-foreground max-w-xs mx-auto">
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
            saving={saving}
            onConfirm={handleConfirm}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomizerPage;
