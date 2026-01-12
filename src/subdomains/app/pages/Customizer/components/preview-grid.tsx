import { Button } from '@/components/ui/button';
import React from 'react'

interface PreviewGridProps {
    photos: string[];
    setPhotos: React.Dispatch<React.SetStateAction<string[]>>;
    kitSize: number;
}

function PreviewGrid({ photos, setPhotos, kitSize }: PreviewGridProps) {
    return (
        <div className="flex items-center justify-between mb-8 md:mb-10">
            <h3 className="text-xl md:text-2xl font-serif text-slate-900 flex items-center gap-2">
                Seu Mural
                <span className="text-[10px] font-sans font-semibold text-[#b99778] bg-[#b99778]/10 px-3 py-1 rounded-full">
                    {photos.length}/{kitSize}
                </span>
            </h3>
            {photos.length > 0 && (
                <Button
                    onClick={() => setPhotos([])}
                    className="text-[10px] uppercase tracking-widest text-slate-400 hover:text-red-500 font-medium"
                >
                    Limpar
                </Button>
            )}
        </div>
    )
}

export default PreviewGrid