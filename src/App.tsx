import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  Sparkles, 
  Map, 
  ShieldCheck, 
  Globe2, 
  Share2,
  Loader2
} from 'lucide-react';
import TravelForm from './components/TravelForm';
import ItineraryDisplay from './components/ItineraryDisplay';
import SupportChat from './components/SupportChat';
import { generateItinerary, chatWithItinerary } from './services/geminiService';
import { TravelPreferences, ChatMessage } from './types';

export default function App() {
  const [itinerary, setItinerary] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [language, setLanguage] = React.useState('es');
  const [origin, setOrigin] = React.useState('');
  const [destination, setDestination] = React.useState('');

  const handleGenerate = async (prefs: TravelPreferences) => {
    setIsLoading(true);
    setError(null);
    setLanguage(prefs.language);
    setOrigin(prefs.origin);
    setDestination(prefs.destination);
    try {
      const response = await generateItinerary(prefs);
      if (!response) throw new Error("La IA no devolvió ninguna respuesta.");
      setItinerary(response);
    } catch (err: any) {
      console.error('Error generating itinerary:', err);
      setError(err?.message || "Ocurrió un error inesperado al generar el viaje.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = async (feedback: string) => {
    if (!itinerary) return;
    setIsLoading(true);
    setError(null);
    try {
      const mockHistory: ChatMessage[] = [
        { role: 'user', content: `Generar viaje de ${origin} a ${destination}` },
        { role: 'model', content: itinerary }
      ];
      const response = await chatWithItinerary(mockHistory, feedback, language);
      if (!response) throw new Error("No se pudo actualizar el itinerario.");
      setItinerary(response);
    } catch (err: any) {
      console.error('Error in feedback chat:', err);
      setError("Error al ajustar el itinerario. Por favor, inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] overflow-x-hidden">
      {/* Background Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-indigo/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-orange/5 blur-[120px] pointer-events-none rounded-full" />

      {/* Header */}
      <header className="relative py-6 px-6 lg:px-12 border-b border-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div 
            onClick={() => setItinerary(null)}
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="bg-brand-indigo p-2.5 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.5)]">
              <Compass className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-white tracking-tight">NomadAI</h1>
              <p className="text-[10px] text-neutral-500 font-medium tracking-widest uppercase">Tu Guía Personal</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>Privacidad Garantizada</span>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-6xl mx-auto px-6 py-12 lg:py-24 z-10">
        <AnimatePresence mode="wait">
          {!itinerary ? (
            <motion.section
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center"
            >
              <div className="lg:col-span-7 space-y-8">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="inline-flex items-center gap-2 bg-brand-orange/10 border border-brand-orange/20 px-4 py-1.5 rounded-full text-[10px] font-bold text-brand-orange uppercase tracking-widest"
                >
                  <Sparkles size={12} />
                  IA Experta en Viajes RAG
                </motion.div>
                
                <h2 className="text-5xl lg:text-7xl font-display font-bold text-white leading-[1.1] tracking-tight">
                  Diseña tu viaje <br/>ideal en <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-orange-400">Segundos.</span>
                </h2>
                
                <p className="text-neutral-400 text-lg max-w-lg leading-relaxed">
                  Sin cuentas, sin registros. Solo tú, tu destino y la información más actualizada de la web generada por inteligencia artificial.
                </p>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 bg-brand-orange/10 border border-brand-orange/30 rounded-xl text-brand-orange text-sm font-medium"
                  >
                    {error}
                  </motion.div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 max-w-xl">
                  <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                    <Map className="text-indigo-400 mb-2 w-5 h-5" />
                    <h3 className="text-sm font-semibold text-white">Rutas Optimizadas</h3>
                  </div>
                  <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                    <Globe2 className="text-orange-400 mb-2 w-5 h-5" />
                    <h3 className="text-sm font-semibold text-white">Costes Reales</h3>
                  </div>
                  <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                    <ShieldCheck className="text-emerald-400 mb-2 w-5 h-5" />
                    <h3 className="text-sm font-semibold text-white">Verificación RAG</h3>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5">
                <TravelForm onSubmit={handleGenerate} isLoading={isLoading} />
              </div>
            </motion.section>
          ) : (
            <motion.section
              key="itinerary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <button
                  onClick={() => setItinerary(null)}
                  className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
                >
                  ← Planificar otro viaje
                </button>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (itinerary) {
                        navigator.clipboard.writeText(itinerary);
                        alert("Itinerario copiado al portapapeles");
                      }
                    }}
                    className="bg-brand-indigo/10 text-brand-indigo px-4 py-2 rounded-xl text-xs font-bold border border-brand-indigo/20 flex items-center gap-2 hover:bg-brand-indigo/20 transition-all"
                  >
                    <Share2 size={14} /> Copiar Itinerario
                  </button>
                </div>
              </div>

              {isLoading && itinerary ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                  <div className="bg-neutral-900 border border-white/10 p-8 rounded-2xl flex flex-col items-center gap-4">
                    <Loader2 size={40} className="text-brand-indigo animate-spin" />
                    <p className="text-white font-medium">Refinando tu plan...</p>
                  </div>
                </div>
              ) : null}

              <ItineraryDisplay 
                itinerary={itinerary} 
                onFeedback={handleFeedback}
                isLoading={isLoading} 
              />

              <SupportChat tripId="local-session" language={language} />
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-12 border-t border-white/5 text-center mt-20">
        <p className="text-neutral-600 text-[10px] font-bold tracking-[0.2em] uppercase">
          © 2026 NomadAI Personal Travel Assistant | Powered by Google AI Studio
        </p>
      </footer>
    </div>
  );
}
