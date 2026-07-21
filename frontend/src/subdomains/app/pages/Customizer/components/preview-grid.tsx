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
            <h3 className="text-card-title text-foreground flex items-center gap-2">
                Seu mural
                <span className="text-label font-normal text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {photos.length}/{kitSize}
                </span>
            </h3>
            {photos.length > 0 && (
                <Button
                    variant="ghost"
                    onClick={() => setPhotos([])}
                    className="text-label uppercase tracking-widest text-muted-foreground hover:text-destructive font-normal"
                >
                    Limpar
                </Button>
            )}
        </div>
    )
}

export default PreviewGrid
