import Markdown from 'react-markdown';
import { motion } from 'motion/react';
import { Sparkles, MessageSquare } from 'lucide-react';
import React from 'react';

interface ItineraryDisplayProps {
  itinerary: string;
  onFeedback: (feedback: string) => void;
  isLoading: boolean;
}

export default function ItineraryDisplay({ itinerary, onFeedback, isLoading }: ItineraryDisplayProps) {
  const [feedback, setFeedback] = React.useState('');

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim() || isLoading) return;
    onFeedback(feedback);
    setFeedback('');
  };

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 border border-white/10 rounded-3xl p-6 lg:p-10 backdrop-blur-xl"
      >
        <div className="inline-flex items-center gap-2 text-brand-indigo mb-6">
          <Sparkles size={20} />
          <span className="text-sm font-bold uppercase tracking-widest">Itinerario Generado por IA</span>
        </div>

        <div className="markdown-body">
          <Markdown>{itinerary}</Markdown>
        </div>
      </motion.div>

      {/* Refinement Panel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-brand-indigo/5 border border-brand-indigo/10 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <MessageSquare className="text-brand-indigo" size={18} />
          <h3 className="font-bold text-sm uppercase tracking-wider text-brand-indigo">¿Quieres ajustar algo?</h3>
        </div>
        <p className="text-sm text-neutral-400 mb-4">
          Puedes pedir cambios específicos: "Quiero más actividades al aire libre", "Cambia el día 2 por algo más relajado" o "Sugiere alojamientos económicos".
        </p>
        <form onSubmit={handleSendFeedback} className="relative">
          <input
            type="text"
            placeholder="Escribe tus ajustes aquí..."
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 pr-24 focus:border-brand-indigo outline-none transition-all text-sm"
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="absolute right-2 top-1.5 bottom-1.5 px-4 bg-brand-indigo text-white rounded-lg text-xs font-bold hover:bg-brand-indigo/80 disabled:opacity-50 transition-all"
            disabled={isLoading}
          >
            Ajustar
          </button>
        </form>
      </motion.div>
    </div>
  );
}
