import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';

interface CustomizerSidebarProps {
  kitSize: number;
  photos: string[];
  saving?: boolean;
  onConfirm: () => void;
}

function CustomizerSidebar({
  kitSize,
  photos,
  saving,
  onConfirm,
}: CustomizerSidebarProps) {
  return (
    <aside className="lg:sticky lg:top-16 space-y-6 md:space-y-8">
      <div className="bg-card rounded-lg p-8 md:p-10 border border-border/60">
        <div className="flex items-center gap-2 mb-6 md:mb-8">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          <h4 className="text-label uppercase tracking-[0.25em] text-muted-foreground">
            Resumo
          </h4>
        </div>

        <div className="space-y-4 md:space-y-6 mb-8 md:mb-12">
          <div className="flex justify-between items-center pb-3 md:pb-4 border-b border-border">
            <span className="text-body text-muted-foreground">Slots</span>
            <span className="font-semibold text-foreground text-body">
              {kitSize} fotos
            </span>
          </div>
          <div className="flex justify-between items-center pb-3 md:pb-4 border-b border-border">
            <span className="text-body text-muted-foreground">Adicionadas</span>
            <span
              className={`font-semibold px-3 py-1 rounded-full text-label ${
                photos.length === kitSize
                  ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                  : 'bg-primary/10 text-primary'
              }`}
            >
              {photos.length}/{kitSize}
            </span>
          </div>
        </div>

        <Button
          disabled={photos.length === 0 || saving}
          size="lg"
          onClick={onConfirm}
          className="w-full gap-3"
        >
          {saving ? 'Salvando...' : 'Salvar no carrinho'}
        </Button>

        <div className="mt-6 md:mt-8 p-4 md:p-6 bg-muted rounded-lg flex items-start gap-3 md:gap-4 border border-border">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-card flex items-center justify-center text-primary shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <p className="text-label font-normal text-muted-foreground">
            A personalização é opcional. Depois você finaliza o pedido pelo
            carrinho no WhatsApp.
          </p>
        </div>
      </div>
    </aside>
  );
}

export default CustomizerSidebar;
