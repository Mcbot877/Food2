import React from 'react';
import { motion } from 'motion/react';
import { CATEGORIES } from '../data/mockData';
import { useFood } from '../context/FoodContext';
import { FoodCategory } from '../types';
import { Flame } from 'lucide-react';

export const CategoriesSection: React.FC = () => {
  const { selectedCategory, setSelectedCategory } = useFood();

  const handleSelect = (category: FoodCategory) => {
    setSelectedCategory(selectedCategory === category ? 'All' : category);
    const menuEl = document.getElementById('menu');
    if (menuEl) {
      menuEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="categories" className="py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono uppercase tracking-widest mb-3">
              <Flame className="w-3.5 h-3.5" />
              <span>Curated Dimensions</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Culinary <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-500">Categories</span>
            </h2>
          </div>
          <p className="text-neutral-400 text-sm sm:text-base max-w-md font-light">
            Filter through eight distinct culinary horizons, from flame-seared Wagyu to botanical molecular tonics.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES.map((cat, index) => {
            const isSelected = selectedCategory === cat.id;

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(cat.id)}
                className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border ${
                  isSelected
                    ? 'border-amber-400/80 shadow-[0_0_25px_rgba(245,158,11,0.3)] bg-[#121520]'
                    : 'border-white/[0.08] hover:border-amber-400/40 bg-[#0C0E16]/80'
                }`}
              >
                {/* Background Image with Dark Vignette */}
                <div className="relative h-36 sm:h-44 w-full overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0C0E16] via-[#0C0E16]/60 to-transparent" />
                  
                  {/* Glowing active indicator dot */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-bold tracking-wider font-mono">
                      ACTIVE
                    </div>
                  )}
                </div>

                {/* Content Overlay */}
                <div className="p-4 sm:p-5 relative -mt-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors font-display">
                      {cat.name}
                    </h3>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/[0.06] text-neutral-400 border border-white/[0.06]">
                      {cat.count} items
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1 font-light line-clamp-1 group-hover:text-neutral-300 transition-colors">
                    {cat.tagline}
                  </p>
                </div>

                {/* Ambient bottom glow line */}
                <div
                  className={`h-0.5 w-full transition-all duration-300 ${
                    isSelected ? 'bg-amber-400' : 'bg-transparent group-hover:bg-amber-400/50'
                  }`}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
