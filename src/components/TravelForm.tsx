import React from 'react';
import { motion } from 'motion/react';
import { Plane, Calendar, Wallet, Users, LayoutGrid, Search, MapPin, Sparkles } from 'lucide-react';
import { TravelPreferences } from '../types';

interface TravelFormProps {
  onSubmit: (prefs: TravelPreferences) => void;
  isLoading: boolean;
}

export default function TravelForm({ onSubmit, isLoading }: TravelFormProps) {
  const [prefs, setPrefs] = React.useState<TravelPreferences>({
    origin: '',
    destination: '',
    duration: '5 Días',
    budget: 'moderate',
    interests: [],
    travelers: 'solo',
    numTravelers: 1,
    numChildren: 0,
    childrenAges: '',
    hasPets: false,
    startDate: '',
    endDate: '',
    language: 'es'
  });

  const interestsList = [
    'Aventura', 'Gastronomía', 'Historia', 'Relajación', 
    'Naturaleza', 'Compras', 'Arte', 'Vida Nocturna', 'Deportes'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prefs.destination) return;
    onSubmit(prefs);
  };

  const toggleInterest = (interest: string) => {
    setPrefs(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  return (
    <div className="w-full bg-[#111] border border-white/10 rounded-[32px] p-8 shadow-2xl relative">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Origin */}
          <div>
            <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2">
              ¿Desde dónde viajas?
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" size={16} />
              <input
                type="text"
                placeholder="Ej: Madrid, España..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-brand-indigo transition-colors placeholder:text-neutral-700 text-white"
                value={prefs.origin}
                onChange={e => setPrefs(p => ({ ...p, origin: e.target.value }))}
                required
              />
            </div>
          </div>

          {/* Destination */}
          <div>
            <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2">
              ¿A dónde quieres ir?
            </label>
            <div className="relative">
              <Plane className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" size={16} />
              <input
                type="text"
                placeholder="Ej: Tokio, Japón..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-brand-indigo transition-colors placeholder:text-neutral-700 text-white"
                value={prefs.destination}
                onChange={e => setPrefs(p => ({ ...p, destination: e.target.value }))}
                required
              />
            </div>
          </div>
        </div>

        {/* Dates Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2">Fecha Inicio</label>
            <input
              type="date"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-indigo transition-colors text-white [color-scheme:dark]"
              value={prefs.startDate}
              onChange={e => setPrefs(p => ({ ...p, startDate: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2">Fecha Fin</label>
            <input
              type="date"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-indigo transition-colors text-white [color-scheme:dark]"
              value={prefs.endDate}
              onChange={e => setPrefs(p => ({ ...p, endDate: e.target.value }))}
              required
            />
          </div>
        </div>

        {/* Travelers & Children Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Users size={12} /> Adultos
            </label>
            <input
              type="number"
              min="1"
              max="20"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-indigo transition-colors text-white"
              value={prefs.numTravelers}
              onChange={e => setPrefs(p => ({ ...p, numTravelers: parseInt(e.target.value) }))}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2 flex items-center gap-2">
              Niños
            </label>
            <input
              type="number"
              min="0"
              max="10"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-indigo transition-colors text-white"
              value={prefs.numChildren}
              onChange={e => setPrefs(p => ({ ...p, numChildren: parseInt(e.target.value) }))}
            />
          </div>
          <div className="flex flex-col">
            <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2">Mascotas</label>
            <button
              type="button"
              onClick={() => setPrefs(p => ({ ...p, hasPets: !p.hasPets }))}
              className={`flex-1 rounded-xl text-[10px] font-bold uppercase transition-all border flex items-center justify-center gap-2 ${
                prefs.hasPets
                  ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                  : 'bg-white/5 border-white/10 text-neutral-500 hover:border-white/20'
              }`}
            >
              {prefs.hasPets ? 'SÍ' : 'NO'}
            </button>
          </div>
        </div>

        {/* Children Ages (Conditional) */}
        {prefs.numChildren > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-2"
          >
            <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
              Edades de los niños
            </label>
            <input
              type="text"
              placeholder="Ej: 5, 8, 12"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-indigo transition-colors text-white"
              value={prefs.childrenAges}
              onChange={e => setPrefs(p => ({ ...p, childrenAges: e.target.value }))}
              required
            />
          </motion.div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2">Presupuesto</label>
            <select
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none appearance-none text-neutral-300 transition-colors hover:border-white/20"
              value={prefs.budget}
              onChange={e => setPrefs(p => ({ ...p, budget: e.target.value as any }))}
            >
              <option value="economy">Económico</option>
              <option value="moderate">Medio</option>
              <option value="luxury">Lujo</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2">Estilo</label>
            <select
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none appearance-none text-neutral-300 transition-colors hover:border-white/20"
              value={prefs.travelers}
              onChange={e => setPrefs(p => ({ ...p, travelers: e.target.value as any }))}
            >
              <option value="solo">Solo</option>
              <option value="couple">Pareja</option>
              <option value="family">Familia</option>
              <option value="group">Grupo</option>
            </select>
          </div>
        </div>

        {/* Interests */}
        <div>
          <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2">Intereses</label>
          <div className="flex flex-wrap gap-2">
            {interestsList.map(interest => (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all border ${
                  prefs.interests.includes(interest)
                    ? 'bg-brand-indigo/20 border-brand-indigo text-indigo-400'
                    : 'bg-white/5 border-white/5 text-neutral-500 hover:border-white/20'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isLoading}
          type="submit"
          className={`w-full py-4 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all shadow-lg ${
            isLoading 
              ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:to-indigo-400 text-white shadow-brand-indigo/20'
          }`}
        >
          {isLoading ? (
            <>Construyendo...</>
          ) : (
            <>
              <Sparkles size={18} />
              Generar Itinerario
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
}
