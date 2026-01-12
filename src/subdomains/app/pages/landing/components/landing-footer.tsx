import { Button } from '@/components/ui/button'
import { Instagram, Send } from 'lucide-react'

function LandingFooter() {
    const handleNavigate = (link: string) => {
        window.open(link, '_blank')
    };

    return (
        <div className="bg-white rounded-3xl p-10 md:p-20 text-center shadow-sm mb-20 border border-slate-100">
            <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-6 max-w-2xl mx-auto">
                Suas melhores lembranças merecem um lugar especial
            </h2>
            <p className="text-slate-500 mb-12 text-lg">Pronta para eternizar seus momentos mais queridos?</p>

            {/* CTA Buttons - Cleaned up version */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                    // onClick={() => handleNavigate("https://wa.me/5551999999999")}
                    disabled
                    className="w-full sm:w-auto px-10 py-4 bg-[#b99778] text-white rounded-full font-medium flex items-center justify-center gap-2 hover:bg-[#a6866a] transition-all hover:shadow-lg hover:shadow-[#b99778]/20 active:scale-95"
                >
                    Pedir pelo WhatsApp
                    <Send size={18} />
                </Button>
                <Button
                    onClick={() => handleNavigate("https://instagram.com/memorinha__")}
                    className="w-full sm:w-auto px-10 py-4 bg-transparent border border-slate-200 text-slate-700 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-95"
                >
                    Ver mais no Instagram
                    <Instagram size={18} />
                </Button>
            </div>
        </div>
    )
}

export default LandingFooter