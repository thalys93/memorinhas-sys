import { useEffect, useRef, useState } from 'react'
import { Save, Upload } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { UploadTemplates } from '@/enums/upload-templates'
import { uploadToCloudinary, buildCloudinaryPublicId } from '@/lib/cloudinary-upload'
import { toast } from '@/lib/toast'
import { getInitials } from '@/lib/user-display'
import { cn } from '@/lib/utils'

type AvatarUploadModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentAvatarUrl?: string
  displayName: string
  userId: string
  onSaved: (avatarUrl: string) => void
}

export function AvatarUploadModal({
  open,
  onOpenChange,
  currentAvatarUrl,
  displayName,
  userId,
  onSaved,
}: AvatarUploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [discardOpen, setDiscardOpen] = useState(false)

  useEffect(() => {
    if (!open) {
      setPendingFile(null)
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setPreviewUrl('')
    }
  }, [open])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const selectFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPendingFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const requestClose = () => {
    if (pendingFile) {
      setDiscardOpen(true)
      return
    }
    onOpenChange(false)
  }

  const discardAndClose = () => {
    setDiscardOpen(false)
    setPendingFile(null)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl('')
    onOpenChange(false)
  }

  const handleSave = async () => {
    if (!pendingFile) return
    setSaving(true)
    try {
      const avatarUrl = await uploadToCloudinary(pendingFile, {
        publicId: buildCloudinaryPublicId(displayName || 'user', userId),
        uploadPreset: UploadTemplates.Avatars,
        displayName: displayName || 'Avatar',
      })
      await onSaved(avatarUrl)
      setPendingFile(null)
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setPreviewUrl('')
      onOpenChange(false)
      toast('Foto atualizada com sucesso')
    } catch {
      toast('Não foi possível enviar a foto')
    } finally {
      setSaving(false)
    }
  }

  const shownSrc = previewUrl || currentAvatarUrl || ''

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (!next) requestClose()
          else onOpenChange(true)
        }}
      >
        <DialogContent
          className="sm:max-w-md"
          onPointerDownOutside={(e) => {
            if (pendingFile) {
              e.preventDefault()
              setDiscardOpen(true)
            }
          }}
          onEscapeKeyDown={(e) => {
            if (pendingFile) {
              e.preventDefault()
              setDiscardOpen(true)
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>Foto de perfil</DialogTitle>
            <DialogDescription>
              Arraste uma imagem ou clique para escolher. Salve para enviar.
            </DialogDescription>
          </DialogHeader>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) selectFile(file)
              e.target.value = ''
            }}
          />

          <button
            type="button"
            disabled={saving}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            onDrop={(e) => {
              e.preventDefault()
              e.stopPropagation()
              const file = e.dataTransfer.files?.[0]
              if (file) selectFile(file)
            }}
            className={cn(
              'mx-auto flex h-40 w-40 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-border bg-muted transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              shownSrc && 'border-solid',
            )}
          >
            {shownSrc ? (
              <img src={shownSrc} alt="Preview do avatar" className="h-full w-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Upload size={28} />
                <span className="text-sm font-medium">{getInitials(displayName)}</span>
              </div>
            )}
          </button>

          <p className="text-center text-xs text-muted-foreground">
            {pendingFile ? pendingFile.name : 'Clique ou arraste uma foto'}
          </p>

          <DialogFooter>
            <Button type="button" variant="outline" disabled={saving} onClick={requestClose}>
              Cancelar
            </Button>
            <Button type="button" disabled={!pendingFile || saving} onClick={handleSave}>
              <Save size={16} className="mr-2" />
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={discardOpen} onOpenChange={setDiscardOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Descartar alterações?</AlertDialogTitle>
            <AlertDialogDescription>
              Você escolheu uma nova foto que ainda não foi salva. Deseja descartar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuar editando</AlertDialogCancel>
            <AlertDialogAction onClick={discardAndClose}>Descartar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
