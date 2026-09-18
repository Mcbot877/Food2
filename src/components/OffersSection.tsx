import React from 'react';
import { motion } from 'motion/react';
import { Tag, Copy, Check, Sparkles } from 'lucide-react';
import { PROMO_OFFERS } from '../data/mockData';
import { useFood } from '../context/FoodContext';

export const OffersSection: React.FC = () => {
  const { applyPromo, showToast } = useFood();

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    applyPromo(code);
    showToast(`Code ${code} copied & applied to your cart!`);
  };

  return (
    <section id="offers" className="py-24 relative overflow-hidden bg-[#090A10]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Privileged Privileges</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Curated <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-500">Privileges & Offers</span>
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base font-light">
            Exclusive gastronomy reservations and complimentary pairings for our community.
          </p>
        </div>

        {/* Promo Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROMO_OFFERS.map((offer, idx) => (
            <motion.div
              key={offer.code}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className="group relative rounded-3xl p-6 bg-[#0E1119] border border-white/10 hover:border-amber-400/40 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl"
            >
              {/* Background gradient subtle glow */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${offer.color} opacity-20 group-hover:opacity-35 transition-opacity pointer-events-none`}
              />

              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs font-mono font-bold text-amber-300 border border-white/10">
                    {offer.badge}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">{offer.expiry}</span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors font-display">
                    {offer.title}
                  </h3>
                  <p className="text-xs text-neutral-400 font-light mt-1.5 leading-relaxed">
                    {offer.description}
                  </p>
                </div>
              </div>

              {/* Copy Code Interactive Button */}
              <div className="relative z-10 pt-6 mt-4 border-t border-white/[0.08]">
                <button
                  onClick={() => handleCopy(offer.code)}
                  className="w-full py-2.5 px-3 rounded-xl bg-white/[0.05] hover:bg-amber-500 hover:text-black group-hover:border-amber-400/30 text-white text-xs font-mono font-bold transition-all border border-white/10 flex items-center justify-center gap-2"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Code: {offer.code}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
