import { Camera, X } from 'lucide-react';
import React from 'react'

interface PhotosListProps {
  photos: string[];
  setPhotos: React.Dispatch<React.SetStateAction<string[]>>;
  removePhoto: (index: number) => void;
  kitSize: number;
  lastPhotoCount: number;
}

function PhotosList({ photos, setPhotos, removePhoto, kitSize, lastPhotoCount }: PhotosListProps) {
  const getRotation = (index: number) => {
    const rotations = [-3, 2.5, -1.8, 3.2, -4, 2, -2.8, 4];
    return rotations[index % rotations.length];
  };

  return photos.length === 0 ? (
    <div className="bg-card/40 backdrop-blur-sm rounded-lg p-12 md:p-24 text-center border border-dashed border-border">
      <Camera size={48} strokeWidth={1} className="mx-auto text-muted-foreground mb-4" />
      <p className="text-muted-foreground text-body">Sua prévia aparecerá aqui.</p>
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
            className={`group relative transition-all duration-300 ease-[cubic-bezier(0,0,0.5,1)] hover:z-20 hover:scale-105 ${isNew ? 'animate-magnet' : ''}`}
          >
            <div
              className="relative aspect-square transition-all duration-300 transform group-hover:rotate-0"
              style={{ transform: `rotate(${rot}deg)` }}
            >
              <div className="w-full h-full bg-card p-2 md:p-3 rounded-lg border border-border relative overflow-hidden">
                <div className="w-full h-full rounded-[12px] overflow-hidden bg-muted relative">
                  <img src={src} className="w-full h-full object-cover" alt={`Photo ${idx}`} />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 pointer-events-none"></div>
                </div>
              </div>
            </div>
            <button
              onClick={() => removePhoto(idx)}
              className="absolute -top-2 -right-2 w-7 h-7 bg-card text-destructive rounded-full flex items-center justify-center border border-border z-30"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}

      {Array.from({ length: Math.max(0, kitSize - photos.length) }).map((_, i) => (
        <div
          key={`empty-${i}`}
          className="aspect-square rounded-lg border-2 border-dashed border-border bg-card/30 flex flex-col items-center justify-center text-muted-foreground"
        >
          <span className="text-card-title">+</span>
        </div>
      ))}
    </div>
  )
}

export default PhotosList
