import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Heart, Plus, Minus, Flame, Clock, Award, ShieldCheck, Check } from 'lucide-react';
import { useFood } from '../context/FoodContext';

export const FoodDetailModal: React.FC = () => {
  const { activeDetailDish, setActiveDetailDish, addToCart, favorites, toggleFavorite, inventory } = useFood();

  const [quantity, setQuantity] = useState(1);
  const [selectedCustomizations, setSelectedCustomizations] = useState<Record<string, string>>({});

  // Reset state on open
  useEffect(() => {
    if (activeDetailDish) {
      setQuantity(1);
      const defaults: Record<string, string> = {};
      activeDetailDish.customizations?.forEach((c) => {
        if (c.options.length > 0) {
          defaults[c.id] = c.options[0].label;
        }
      });
      setSelectedCustomizations(defaults);
    }
  }, [activeDetailDish]);

  if (!activeDetailDish) return null;

  const isFav = favorites.includes(activeDetailDish.id);
  const currentStock = inventory[activeDetailDish.id] !== undefined ? inventory[activeDetailDish.id] : activeDetailDish.inStock;
  const isOutOfStock = currentStock <= 0;

  // Compute total with customization extra costs
  let extraCost = 0;
  activeDetailDish.customizations?.forEach((c) => {
    const selected = selectedCustomizations[c.id];
    if (selected) {
      const opt = c.options.find((o) => o.label === selected);
      if (opt) extraCost += opt.extraPrice;
    }
  });
  const unitPrice = activeDetailDish.price + extraCost;
  const totalPrice = unitPrice * quantity;

  const handleSelectOption = (customizationId: string, label: string) => {
    setSelectedCustomizations((prev) => ({
      ...prev,
      [customizationId]: label,
    }));
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    if (isOutOfStock) return;
    addToCart(activeDetailDish, quantity, selectedCustomizations, e);
    setActiveDetailDish(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop blur with fade */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setActiveDetailDish(null)}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window with scale + fade */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          className="relative w-full max-w-4xl bg-[#0D0F17] rounded-3xl border border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.9)] overflow-hidden z-10 max-h-[90vh] flex flex-col md:flex-row my-auto"
        >
          {/* Close Button */}
          <button
            onClick={() => setActiveDetailDish(null)}
            className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white/80 hover:text-white border border-white/10 backdrop-blur-md transition-all"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Column: Food Imagery & Culinary Credentials */}
          <div className="md:w-1/2 relative bg-black/50 flex flex-col">
            <div className="relative h-64 md:h-full min-h-[300px] w-full overflow-hidden">
              <img
                src={activeDetailDish.image}
                alt={activeDetailDish.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0F17] via-transparent to-black/30" />

              {/* Badges on image */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs font-mono text-amber-300 border border-white/10">
                  {activeDetailDish.category}
                </span>
                {activeDetailDish.badge && (
                  <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black text-[10px] font-bold uppercase font-mono">
                    {activeDetailDish.badge}
                  </span>
                )}
              </div>

              {/* Floating Favorite Button */}
              <button
                onClick={() => toggleFavorite(activeDetailDish.id)}
                className={`absolute bottom-4 left-4 p-2.5 rounded-full backdrop-blur-md transition-all ${
                  isFav
                    ? 'bg-rose-500/20 text-rose-500 border border-rose-500/40'
                    : 'bg-black/60 text-white border border-white/10'
                }`}
                aria-label="Toggle Favorite"
              >
                <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
              </button>

              {/* Nutritional Badges Overlay */}
              <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs font-mono text-neutral-300">
                <span>{activeDetailDish.calories} kcal</span>
                <span className="text-neutral-500">•</span>
                <span>{activeDetailDish.protein} protein</span>
              </div>
            </div>
          </div>

          {/* Right Column: Culinary Details, Customizations, and Action */}
          <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[60vh] md:max-h-[90vh] space-y-6">
            <div>
              {/* Header: Title & Rating */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-mono">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="font-bold text-white text-sm">{activeDetailDish.rating}</span>
                  <span className="text-neutral-400">({activeDetailDish.reviewsCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-400 text-xs font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{activeDetailDish.prepTime}</span>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 font-display">
                {activeDetailDish.name}
              </h2>

              <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed mt-2.5">
                {activeDetailDish.fullStory}
              </p>

              {/* Master Ingredients List */}
              <div className="mt-5 space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                  Key Ingredients & Provenance
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeDetailDish.ingredients.map((ing) => (
                    <span
                      key={ing}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.04] text-neutral-300 text-xs border border-white/[0.06] flex items-center gap-1.5"
                    >
                      <Check className="w-3 h-3 text-amber-400" />
                      <span>{ing}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Customization Options */}
              {activeDetailDish.customizations && activeDetailDish.customizations.length > 0 && (
                <div className="mt-6 space-y-4">
                  {activeDetailDish.customizations.map((cust) => (
                    <div key={cust.id} className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono text-neutral-300">
                        <span className="uppercase text-amber-300 font-bold">{cust.name}</span>
                        <span className="text-neutral-500">Select 1</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {cust.options.map((opt) => {
                          const isSelected = selectedCustomizations[cust.id] === opt.label;
                          return (
                            <button
                              key={opt.label}
                              type="button"
                              onClick={() => handleSelectOption(cust.id, opt.label)}
                              className={`px-3 py-2 rounded-xl text-xs text-left transition-all border flex items-center justify-between ${
                                isSelected
                                  ? 'bg-amber-500/15 border-amber-400 text-white font-semibold'
                                  : 'bg-white/[0.02] border-white/[0.08] text-neutral-400 hover:text-white hover:bg-white/[0.05]'
                              }`}
                            >
                              <span className="truncate">{opt.label}</span>
                              {opt.extraPrice > 0 && (
                                <span className="font-mono text-amber-400 text-[11px] shrink-0 ml-1">
                                  +${opt.extraPrice.toFixed(2)}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Actions: Quantity & Add to Cart */}
            <div className="pt-4 border-t border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-neutral-400 block">Total Price</span>
                  <span className="text-2xl font-extrabold text-amber-400 font-mono">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 bg-white/[0.05] p-1.5 rounded-2xl border border-white/10">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white flex items-center justify-center disabled:opacity-30"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono font-bold text-white text-sm w-5 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                    disabled={quantity >= currentStock}
                    className="w-8 h-8 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white flex items-center justify-center disabled:opacity-30"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                id="modal-add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 active:scale-95 ${
                  isOutOfStock
                    ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-black hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>{isOutOfStock ? 'Sold Out For Current Service' : `Add to Cart • $${totalPrice.toFixed(2)}`}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
