import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Star, Heart, Plus, Sparkles, Flame } from 'lucide-react';
import { FoodItem } from '../types';
import { useFood } from '../context/FoodContext';
import { animateButtonTactile } from '../utils/animeAnimations';

interface FoodCardProps {
  food: FoodItem;
  index: number;
}

export const FoodCard: React.FC<FoodCardProps> = ({ food, index }) => {
  const { addToCart, favorites, toggleFavorite, setActiveDetailDish, inventory } = useFood();
  const isFav = favorites.includes(food.id);
  const cardRef = useRef<HTMLDivElement>(null);

  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const currentStock = inventory[food.id] !== undefined ? inventory[food.id] : food.inStock;
  const isOutOfStock = currentStock <= 0;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 14, y: y * -14 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.08 }}
      className="food-card-anime relative perspective-[1000px]"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={() => setActiveDetailDish(food)}
        style={{
          transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
          transformStyle: 'preserve-3d',
        }}
        className={`group relative rounded-3xl bg-[#0E1017]/90 border transition-all duration-300 ease-out cursor-pointer overflow-hidden ${
          isHovered
            ? 'border-amber-500/40 shadow-[0_15px_40px_-10px_rgba(245,158,11,0.2)] bg-[#111420]'
            : 'border-white/[0.08] shadow-lg shadow-black/40'
        }`}
      >
        {/* Top Badges: Category & Favorite */}
        <div className="absolute top-4 inset-x-4 z-20 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 pointer-events-auto">
            <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-mono font-medium text-amber-300 border border-white/10">
              {food.category}
            </span>
            {food.badge && (
              <span className="px-2 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black text-[10px] font-bold uppercase tracking-wider font-mono">
                {food.badge}
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(food.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-all pointer-events-auto ${
              isFav
                ? 'bg-rose-500/20 text-rose-500 border border-rose-500/40'
                : 'bg-black/50 text-neutral-400 hover:text-white border border-white/10'
            }`}
            aria-label="Add to favorites"
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
          </button>
        </div>

        {/* Large Food Image Container */}
        <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-black/40">
          <img
            src={food.image}
            alt={food.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E1017] via-[#0E1017]/30 to-transparent" />

          {/* Quick Metrics Overlay on Image Hover */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-neutral-300">
            <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-white">{food.rating.toFixed(2)}</span>
              <span className="text-neutral-400">({food.reviewsCount})</span>
            </div>

            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
              <span>{food.calories} kcal</span>
              <span className="text-neutral-500">•</span>
              <span>{food.prepTime}</span>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 sm:p-6 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-bold text-lg text-white group-hover:text-amber-300 transition-colors line-clamp-1">
              {food.name}
            </h3>
          </div>

          <p className="text-xs text-neutral-400 font-light line-clamp-2 leading-relaxed">
            {food.description}
          </p>

          {/* Ingredients Preview */}
          <div className="flex flex-wrap gap-1 pt-1">
            {food.ingredients.slice(0, 3).map((ing) => (
              <span
                key={ing}
                className="text-[10px] text-neutral-400 bg-white/[0.04] px-2 py-0.5 rounded-md border border-white/[0.05]"
              >
                {ing}
              </span>
            ))}
            {food.ingredients.length > 3 && (
              <span className="text-[10px] text-amber-400/80 px-1 py-0.5 font-mono">
                +{food.ingredients.length - 3} more
              </span>
            )}
          </div>

          {/* Footer: Price, Stock, & Add to Cart */}
          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-amber-400 font-mono">
                  ${food.price.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isOutOfStock ? 'bg-red-500' : currentStock < 8 ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
                  }`}
                />
                <span className="text-[10px] font-mono text-neutral-400">
                  {isOutOfStock ? 'Sold Out' : currentStock < 8 ? `Only ${currentStock} left` : `${currentStock} available`}
                </span>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!isOutOfStock) {
                  animateButtonTactile(e.currentTarget);
                  addToCart(food, 1, {}, e);
                }
              }}
              disabled={isOutOfStock}
              className={`relative px-4 py-2 rounded-xl font-semibold text-xs transition-all duration-300 flex items-center gap-1.5 active:scale-95 ${
                isOutOfStock
                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  : 'bg-amber-500 hover:bg-amber-400 text-black shadow-md shadow-amber-500/20 hover:shadow-amber-500/40'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>{isOutOfStock ? 'Depleted' : 'Add'}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
