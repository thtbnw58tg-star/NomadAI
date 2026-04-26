import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, User, Bot, Loader2 } from 'lucide-react';
import { chatWithItinerary } from '../services/geminiService';
import { ChatMessage } from '../types';

interface SupportChatProps {
  tripId: string;
  language: string;
}

export default function SupportChat({ tripId, language }: SupportChatProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    { role: 'model', content: language === 'es' ? '¡Hola! Soy tu conserje NomadAI. ¿Tienes alguna pregunta sobre tu viaje?' : 'Hi! I am your NomadAI concierge. Do you have any questions about your trip?' }
  ]);
  const [input, setInput] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    try {
      const response = await chatWithItinerary(messages, userMsg, language);
      setMessages(prev => [...prev, { role: 'model', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', content: 'Lo siento, tuve un problema al procesar tu duda. Intenta de nuevo.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 w-[350px] max-w-[calc(100vw-48px)] h-[500px] bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 bg-brand-indigo flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot size={18} />
                <span className="font-bold text-sm">Conserje NomadAI</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:opacity-70 transition-opacity">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0a0a0a]">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-2 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`p-1.5 rounded-full h-fit mt-1 ${m.role === 'user' ? 'bg-brand-orange' : 'bg-brand-indigo'}`}>
                      {m.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                    </div>
                    <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      m.role === 'user' ? 'bg-brand-orange/10 text-white border border-brand-orange/20' : 'bg-white/5 text-neutral-300 border border-white/5'
                    }`}>
                      {m.content}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-3 rounded-2xl border border-white/5 flex items-center gap-2">
                    <Loader2 size={12} className="animate-spin text-brand-indigo" />
                    <span className="text-[10px] text-neutral-500 uppercase font-bold">Escribiendo...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-3 border-t border-white/5 bg-neutral-900 flex gap-2">
              <input
                type="text"
                placeholder="Pregunta lo que quieras..."
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs focus:border-brand-indigo outline-none"
                value={input}
                onChange={e => setInput(e.target.value)}
              />
              <button type="submit" className="bg-brand-indigo p-2 rounded-xl hover:bg-brand-indigo/80 transition-all">
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-brand-indigo h-14 w-14 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(99,102,241,0.4)] hover:bg-brand-indigo/90 transition-all"
      >
        <MessageCircle size={24} />
      </motion.button>
    </div>
  );
}
