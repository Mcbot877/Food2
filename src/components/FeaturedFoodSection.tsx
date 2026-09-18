import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Star, Sparkles, Plus, Flame, Clock, Award, CheckCircle2 } from 'lucide-react';
import { useFood } from '../context/FoodContext';

export const FeaturedFoodSection: React.FC = () => {
  const { foodItems, addToCart, setActiveDetailDish } = useFood();
  // Dish 4: Obsidian Squid Ink Tagliolini
  const featuredDish = foodItems.find((f) => f.id === 'dish-4') || foodItems[3];

  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const plateRotate = useTransform(scrollYProgress, [0, 1], [-15, 25]);
  const plateScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.05, 0.95]);

  if (!featuredDish) return null;

  return (
    <section
      id="featured"
      ref={sectionRef}
      className="py-24 relative overflow-hidden bg-gradient-to-b from-transparent via-[#0B0D14]/70 to-transparent"
    >
      {/* Background radial atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-amber-500/10 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-mono uppercase tracking-widest">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Master Sommelier Spotlight</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Cinematic <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-amber-200">Featured Dish</span>
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base font-light">
            An extraordinary convergence of Hokkaido dayboat scallops and sea urchin emulsion over fresh cuttlefish ink pasta.
          </p>
        </div>

        {/* Featured Showcase Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Cinematic Image with Floating Orbiters */}
          <div className="lg:col-span-7 relative flex items-center justify-center">
            {/* Glowing Backdrop Ring */}
            <div className="absolute w-[320px] sm:w-[460px] aspect-square rounded-full border border-amber-500/20 animate-pulse pointer-events-none" />
            <div className="absolute w-[260px] sm:w-[380px] aspect-square rounded-full bg-gradient-to-tr from-amber-500/20 to-purple-600/15 blur-3xl pointer-events-none" />

            {/* Main Rotating Dish Container */}
            <motion.div
              style={{
                rotate: plateRotate,
                scale: plateScale,
              }}
              className="relative z-10 cursor-pointer group"
              onClick={() => setActiveDetailDish(featuredDish)}
            >
              <div className="w-[280px] sm:w-[400px] aspect-square rounded-full p-2.5 bg-gradient-to-br from-white/20 via-white/5 to-white/10 border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-md">
                <div className="w-full h-full rounded-full overflow-hidden relative">
                  <img
                    src={featuredDish.image}
                    alt={featuredDish.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
                </div>
              </div>
            </motion.div>

            {/* Floating Ingredient Orbiters */}
            <div className="absolute -top-3 left-4 sm:left-12 px-3.5 py-2 rounded-2xl glass-panel border border-amber-400/30 shadow-xl flex items-center gap-2.5 animate-subtle-float">
              <span className="text-lg">🐚</span>
              <div>
                <p className="text-[11px] font-bold text-white leading-tight">Hokkaido Scallops</p>
                <p className="text-[9px] text-amber-300 font-mono">Flame Torched</p>
              </div>
            </div>

            <div className="absolute -bottom-4 right-4 sm:right-12 px-3.5 py-2 rounded-2xl glass-panel border border-orange-400/30 shadow-xl flex items-center gap-2.5 animate-subtle-float-reverse">
              <span className="text-lg">🌊</span>
              <div>
                <p className="text-[11px] font-bold text-white leading-tight">Sea Urchin Uni</p>
                <p className="text-[9px] text-orange-300 font-mono">Meyer Lemon Emulsion</p>
              </div>
            </div>

            <div className="absolute bottom-1/3 -left-4 sm:left-4 px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-neutral-300">
              <span className="text-amber-400 font-bold">100%</span> Handmade Daily
            </div>
          </div>

          {/* Right: Technical Composition & Ordering */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider border border-amber-500/30">
                {featuredDish.category}
              </span>
              <div className="flex items-center gap-1 text-amber-400 text-xs font-mono">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span className="font-bold">{featuredDish.rating}</span>
                <span className="text-neutral-500">({featuredDish.reviewsCount} reviews)</span>
              </div>
            </div>

            <h3 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight font-display">
              {featuredDish.name}
            </h3>

            <p className="text-neutral-300 text-sm leading-relaxed font-light">
              {featuredDish.fullStory}
            </p>

            {/* Molecular Gastronomy Tech Badges */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3">
                <Flame className="w-4 h-4 text-orange-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-neutral-400 uppercase font-mono">Flame Curve</p>
                  <p className="text-xs font-bold text-white">480°C Binchotan</p>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-neutral-400 uppercase font-mono">Prep Precision</p>
                  <p className="text-xs font-bold text-white">{featuredDish.prepTime}</p>
                </div>
              </div>
            </div>

            {/* Nutrition & Specs */}
            <div className="flex items-center gap-6 py-3 border-y border-white/[0.08] text-xs font-mono text-neutral-300">
              <div>
                <span className="text-neutral-500 block text-[10px]">ENERGY</span>
                <span className="text-white font-bold text-sm">{featuredDish.calories} kcal</span>
              </div>
              <div className="h-6 w-px bg-white/10" />
              <div>
                <span className="text-neutral-500 block text-[10px]">PROTEIN</span>
                <span className="text-white font-bold text-sm">{featuredDish.protein}</span>
              </div>
              <div className="h-6 w-px bg-white/10" />
              <div>
                <span className="text-neutral-500 block text-[10px]">INVENTORY</span>
                <span className="text-emerald-400 font-bold text-sm">{featuredDish.inStock} Portions Left</span>
              </div>
            </div>

            {/* Price & Action Button */}
            <div className="flex items-center gap-5 pt-2">
              <div>
                <span className="text-[10px] uppercase font-mono text-neutral-400 block">Tasting Price</span>
                <span className="text-3xl font-extrabold text-amber-400 font-mono">
                  ${featuredDish.price.toFixed(2)}
                </span>
              </div>

              <button
                id="featured-add-cart-btn"
                onClick={(e) => addToCart(featuredDish, 1, {}, e)}
                className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-black font-bold text-sm hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Reserve Signature Portion</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
