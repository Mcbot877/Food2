import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Send, Loader2, ArrowRight, Plus } from 'lucide-react';
import { useFood } from '../context/FoodContext';

export const AISommelierModal: React.FC = () => {
  const { isAIOpen, setIsAIOpen, foodItems, addToCart } = useFood();

  const [mood, setMood] = useState('Opulent Truffle & Wagyu Umami');
  const [dietary, setDietary] = useState('No Restrictions');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    recommendation: string;
    suggestedDishId: string;
    flavorNotes: string[];
  } | null>(null);

  if (!isAIOpen) return null;

  const moodPresets = [
    'Opulent Truffle & Wagyu Umami',
    'Crisp Botanical & Effervescent',
    'Rich Velvety Dark Chocolate & Espresso',
    'Fiery Fermented Chili & Honey Crunch',
    'Fresh Ocean Scallops & Citrus',
  ];

  const handleGeneratePairing = async (selectedMood = mood) => {
    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/ai-recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tastePreference: selectedMood,
          dietary,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResult({
          recommendation: data.recommendation,
          suggestedDishId: data.suggestedDishId || 'dish-6',
          flavorNotes: data.flavorNotes || ['Smoked Citrus', 'Earthy Truffle', 'Umami Core'],
        });
      }
    } catch (e) {
      // Fallback
      setResult({
        recommendation: `We recommend pairing your craving with our Liquid Lumina Botanical Elixir to cut through rich fats while accentuating aromatic woodsmoke and aged cheeses.`,
        suggestedDishId: 'dish-6',
        flavorNotes: ['Botanical Citrus Yuzu', 'Deep Umami Finish', 'Dry-Ice Mist'],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedDish = foodItems.find((f) => f.id === result?.suggestedDishId) || foodItems[5];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsAIOpen(false)}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          className="relative w-full max-w-2xl bg-[#0F121C] border border-amber-500/30 rounded-3xl shadow-2xl p-6 sm:p-8 z-10 space-y-6 overflow-hidden"
        >
          {/* Futuristic ambient light glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 blur-[100px] pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-white">AI Gastronomy Sommelier</h3>
                <p className="text-xs font-mono text-amber-400/90">Molecular Sensory Matching Engine</p>
              </div>
            </div>

            <button
              onClick={() => setIsAIOpen(false)}
              className="p-2 rounded-xl bg-white/[0.05] text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cravings Presets */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-neutral-400 block">
              Describe Your Palate Cravings:
            </label>
            <div className="flex flex-wrap gap-2">
              {moodPresets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    setMood(preset);
                    handleGeneratePairing(preset);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all border ${
                    mood === preset
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                      : 'bg-white/[0.03] border-white/[0.08] text-neutral-400 hover:text-white'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={() => handleGeneratePairing()}
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-black font-bold text-sm hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Synthesizing Molecular Harmony...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Calculate Perfect Pairing</span>
              </>
            )}
          </button>

          {/* Result Card */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl bg-black/50 border border-amber-500/30 space-y-4"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 block">
                  Sommelier Analysis
                </span>
                <p className="text-xs sm:text-sm text-neutral-200 font-light leading-relaxed">
                  {result.recommendation}
                </p>
              </div>

              {/* Flavor tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {result.flavorNotes.map((note) => (
                  <span
                    key={note}
                    className="px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-300 text-[11px] font-mono border border-amber-500/20"
                  >
                    ✦ {note}
                  </span>
                ))}
              </div>

              {/* Suggested Dish Quick Add */}
              {suggestedDish && (
                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={suggestedDish.image}
                      alt={suggestedDish.name}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="font-display font-bold text-sm text-white">
                        {suggestedDish.name}
                      </h4>
                      <span className="font-mono text-amber-400 text-xs font-bold">
                        ${suggestedDish.price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      addToCart(suggestedDish, 1, {}, e);
                      setIsAIOpen(false);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/30 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Order</span>
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
