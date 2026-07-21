import { Camera } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { productTypeLabel } from '@/lib/product-utils';

interface ProductCardProps {
  name: string;
  typeName: string;
  price: number;
  imageUrl?: string;
  slots?: number | null;
  freight?: boolean;
  onAdd?: () => void;
}

function ProductCard({
  name,
  typeName,
  price,
  imageUrl,
  slots,
  freight,
  onAdd,
}: ProductCardProps) {
  const [imageBroken, setImageBroken] = useState(false);
  const showImage = !!imageUrl && !imageBroken;

  return (
    <div className="group bg-card border border-border/60 p-8 rounded-lg tile-hover flex flex-col items-center text-center">
      <div className="w-full aspect-square rounded-lg overflow-hidden mb-6 bg-muted flex items-center justify-center">
        {showImage ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 ease-[cubic-bezier(0,0,0.5,1)] group-hover:scale-105"
            onError={() => setImageBroken(true)}
          />
        ) : (
          <Camera
            size={40}
            strokeWidth={1.5}
            className="text-primary transition-transform duration-300 group-hover:scale-110"
          />
        )}
      </div>
      <h4 className="text-card-title text-foreground mb-2">{name}</h4>
      <p className="text-muted-foreground text-label font-normal mb-2 uppercase tracking-wider">
        {productTypeLabel(typeName)}
      </p>
      {slots ? (
        <p className="text-xs text-muted-foreground mb-2">{slots} fotos</p>
      ) : null}
      {freight ? (
        <p className="text-xs text-green-600 dark:text-green-400 mb-4">Frete grátis</p>
      ) : (
        <div className="mb-4" />
      )}
      <div className="mt-auto w-full">
        <span className="text-card-title text-primary">
          R$ {price.toFixed(2).replace('.', ',')}
        </span>
        {onAdd ? (
          <Button
            variant="outline"
            onClick={onAdd}
            className="w-full mt-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            Adicionar
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export default ProductCard;
