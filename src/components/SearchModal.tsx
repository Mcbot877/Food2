import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Star, ArrowRight, Sparkles } from 'lucide-react';
import { useFood } from '../context/FoodContext';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, foodItems, setActiveDetailDish, addToCart } = useFood();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const quickTags = ['Wagyu', 'Truffle', 'Pizza', 'Scallops', 'Matcha', 'Ganache', 'Botanical', 'Spicy'];

  const results = query.trim()
    ? foodItems.filter(
        (f) =>
          f.name.toLowerCase().includes(query.toLowerCase()) ||
          f.category.toLowerCase().includes(query.toLowerCase()) ||
          f.description.toLowerCase().includes(query.toLowerCase()) ||
          f.ingredients.some((i) => i.toLowerCase().includes(query.toLowerCase()))
      )
    : foodItems.slice(0, 4); // Default to top recommendations if no query

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-6">
        {/* Blurred backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsSearchOpen(false)}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl"
        />

        {/* Search Box */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.96 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-2xl bg-[#0F121C] border border-white/15 rounded-3xl shadow-2xl overflow-hidden z-10 space-y-4 p-6"
        >
          {/* Search Header Bar */}
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-amber-400 absolute left-4" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search gastronomy items, ingredients, pairings..."
              className="w-full pl-12 pr-12 py-4 bg-white/[0.04] rounded-2xl border border-white/10 text-base text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 font-medium"
            />
            <button
              onClick={() => setIsSearchOpen(false)}
              className="absolute right-3.5 p-2 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Suggestions / Trending Tags */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-mono text-neutral-500 uppercase">Trending:</span>
            {quickTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="px-2.5 py-1 rounded-full bg-white/[0.03] hover:bg-white/[0.08] text-neutral-300 text-xs font-mono transition-colors border border-white/[0.05]"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Search Results List */}
          <div className="pt-2 max-h-[55vh] overflow-y-auto space-y-2">
            <div className="text-[11px] font-mono uppercase text-neutral-500 px-1">
              {query.trim() ? `Found ${results.length} Matches` : 'Curator Recommendations'}
            </div>

            {results.length === 0 ? (
              <div className="text-center py-10 text-neutral-400 text-sm">
                No molecular dishes found matching "{query}".
              </div>
            ) : (
              results.map((dish) => (
                <div
                  key={dish.id}
                  onClick={() => {
                    setActiveDetailDish(dish);
                    setIsSearchOpen(false);
                  }}
                  className="p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] transition-all flex items-center justify-between gap-3 cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-display font-bold text-sm text-white group-hover:text-amber-300 transition-colors truncate">
                          {dish.name}
                        </h4>
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-white/[0.05] text-neutral-400">
                          {dish.category}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 truncate max-w-sm font-light mt-0.5">
                        {dish.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="font-mono font-bold text-sm text-amber-400 block">
                        ${dish.price.toFixed(2)}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] text-amber-400/90 font-mono">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{dish.rating}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
