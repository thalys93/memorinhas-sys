import { useRef } from 'react'
import { ImagePlus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

type ProductImagesFieldProps = {
  images: string[]
  pendingPreviews: string[]
  disabled?: boolean
  onAddFiles: (files: FileList | null) => void
  onRemoveImage: (index: number) => void
  onRemovePending: (index: number) => void
}

export function ProductImagesField({
  images,
  pendingPreviews,
  disabled,
  onAddFiles,
  onRemoveImage,
  onRemovePending,
}: ProductImagesFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm text-muted-foreground">Imagens</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-xl h-8"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus size={14} className="mr-1" />
          Adicionar
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            onAddFiles(e.target.files)
            e.target.value = ''
          }}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {images.map((url, i) => (
          <div key={url} className="relative w-16 h-16 rounded-xl overflow-hidden border">
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              disabled={disabled}
              onClick={() => onRemoveImage(i)}
              className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-background/90 text-muted-foreground hover:text-destructive"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        {pendingPreviews.map((url, i) => (
          <div
            key={url}
            className="relative w-16 h-16 rounded-xl overflow-hidden border border-dashed"
          >
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              disabled={disabled}
              onClick={() => onRemovePending(i)}
              className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-background/90 text-muted-foreground hover:text-destructive"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
