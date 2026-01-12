import { Button } from '@/components/ui/button';
import { Info, MessageCircle } from 'lucide-react';
import React from 'react'

interface CustomizerSidebarProps {
    kitSize: number;        
    photos: string[];
    shippingPrice: number | null;
    address: string | null;
    cep: string | null;
    total: number;
}

function CustomizerSidebar({ kitSize, photos, shippingPrice, address, cep, total }: CustomizerSidebarProps) {

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
    return (
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

                <Button
                    // disabled={photos.length === 0}
                    disabled
                    // onClick={handleWhatsAppOrder}
                    size='high'
                    className={`w-full py-4 md:py-5 rounded-2xl font-bold text-base md:text-lg flex items-center justify-center gap-3 transition-all active:scale-95 ${photos.length > 0
                        ? 'bg-[#b99778] text-white hover:bg-[#a6866a] shadow-xl shadow-[#b99778]/20'
                        : 'bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200'
                        }`}
                >
                    <MessageCircle className={`w-5 h-5 md:w-5.5 md:h-5.5 ${photos.length > 0 ? "fill-white/10" : ""}`} />
                    Finalizar Pedido
                </Button>

                <div className="mt-6 md:mt-8 p-4 md:p-6 bg-slate-50 rounded-[1.5rem] md:rounded-[2.5rem] flex items-start gap-3 md:gap-4 border border-slate-100">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white flex items-center justify-center text-[#b99778] shrink-0 shadow-sm">
                        <Info className="w-4 h-4 md:w-4.5 md:h-4.5" />
                    </div>
                    <p className="text-[10px] md:text-[12px] text-slate-500 leading-relaxed">
                        Confirmaremos todos os detalhes e enviaremos o link de pagamento pelo WhatsApp.
                    </p>
                </div>
            </div>
        </aside>
    )
}

export default CustomizerSidebar