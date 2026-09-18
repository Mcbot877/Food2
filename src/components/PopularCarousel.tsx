import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Star, Plus, Flame, Sparkles } from 'lucide-react';
import { useFood } from '../context/FoodContext';
import { FoodItem } from '../types';
import { animateButtonTactile } from '../utils/animeAnimations';

export const PopularCarousel: React.FC = () => {
  const { foodItems, addToCart, setActiveDetailDish } = useFood();
  // Filter dishes with rating >= 4.9 or top rated
  const popularDishes = foodItems.slice(0, 7);

  const [activeIndex, setActiveIndex] = useState(2);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Auto movement with pause on hover
  useEffect(() => {
    if (isPaused) return;

    autoPlayRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % popularDishes.length);
    }, 4500);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isPaused, popularDishes.length]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + popularDishes.length) % popularDishes.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % popularDishes.length);
  };

  return (
    <section
      id="popular"
      className="py-24 relative overflow-hidden bg-[#07080D]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-amber-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-orange-600/10 blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Epicurean Reverence</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Most Celebrated <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-500">Creations</span>
            </h2>
          </div>

          {/* Carousel Navigation Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              className="p-3 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 hover:border-amber-400/40 transition-all active:scale-95"
              aria-label="Previous popular dish"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="p-3 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 hover:border-amber-400/40 transition-all active:scale-95"
              aria-label="Next popular dish"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Visual Stage */}
        <div className="relative min-h-[440px] flex items-center justify-center py-6">
          <div className="flex items-center justify-center gap-4 sm:gap-6 w-full max-w-5xl mx-auto">
            {popularDishes.map((dish, index) => {
              // Calculate distance from active index
              const count = popularDishes.length;
              let diff = (index - activeIndex + count) % count;
              if (diff > count / 2) diff -= count;

              // Only render items within visual range (-2, -1, 0, 1, 2)
              if (Math.abs(diff) > 2) return null;

              const isCenter = diff === 0;
              const isAdjacent = Math.abs(diff) === 1;

              return (
                <motion.div
                  key={dish.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: isCenter ? 1 : isAdjacent ? 0.65 : 0.3,
                    scale: isCenter ? 1.05 : isAdjacent ? 0.9 : 0.8,
                    x: diff * 40,
                    zIndex: isCenter ? 30 : 10,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  onClick={() => {
                    if (isCenter) {
                      setActiveDetailDish(dish);
                    } else {
                      setActiveIndex(index);
                    }
                  }}
                  className={`w-[260px] sm:w-[320px] rounded-3xl cursor-pointer p-5 transition-all duration-300 shrink-0 ${
                    isCenter
                      ? 'bg-[#121522] border border-amber-500/40 shadow-[0_20px_50px_rgba(245,158,11,0.25)]'
                      : 'bg-[#0E1018]/90 border border-white/[0.06] hover:border-white/20'
                  }`}
                >
                  {/* Dish Thumbnail */}
                  <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 bg-black/40">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono text-amber-300 border border-white/10">
                      {dish.category}
                    </div>
                    {isCenter && (
                      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-amber-500 text-black text-[9px] font-bold font-mono uppercase">
                        Featured
                      </div>
                    )}
                  </div>

                  {/* Title & Stats */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-amber-400 text-xs font-mono">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="font-bold">{dish.rating}</span>
                        <span className="text-neutral-500">({dish.reviewsCount})</span>
                      </div>
                      <span className="text-[11px] font-mono text-neutral-400">{dish.prepTime}</span>
                    </div>

                    <h4 className="font-display font-bold text-base text-white line-clamp-1">
                      {dish.name}
                    </h4>

                    <p className="text-xs text-neutral-400 font-light line-clamp-2">
                      {dish.description}
                    </p>

                    <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                      <span className="text-lg font-extrabold text-amber-400 font-mono">
                        ${dish.price.toFixed(2)}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(dish, 1, {}, e);
                        }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 ${
                          isCenter
                            ? 'bg-amber-500 text-black hover:bg-amber-400 shadow-md shadow-amber-500/20'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Order</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Animated Carousel Slide Bar */}
        <div className="max-w-md mx-auto mt-8 px-4">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-2">
            <span>Dish 0{activeIndex + 1} of 0{popularDishes.length}</span>
            <span className="text-amber-400 font-semibold">{popularDishes[activeIndex]?.name}</span>
          </div>

          <div className="relative h-2 bg-neutral-900 rounded-full overflow-hidden border border-white/[0.08]">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full transition-all duration-300 relative"
              style={{ width: `${((activeIndex + 1) / popularDishes.length) * 100}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mt-4">
            {popularDishes.map((dish, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  animateButtonTactile(e.currentTarget);
                  setActiveIndex(idx);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === activeIndex
                    ? 'w-10 bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                    : 'w-2.5 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
                title={dish.name}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
