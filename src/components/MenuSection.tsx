import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { FoodCard } from './FoodCard';
import { useFood } from '../context/FoodContext';
import { FoodCategory } from '../types';
import { CATEGORIES } from '../data/mockData';
import { Search, SlidersHorizontal, RefreshCw, Flame, DollarSign, Sparkles, Check } from 'lucide-react';
import { animateCardsStagger, animateSliderPulse, animateButtonTactile } from '../utils/animeAnimations';

export const MenuSection: React.FC = () => {
  const { foodItems, selectedCategory, setSelectedCategory, inventory } = useFood();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-low' | 'price-high' | 'rating'>('recommended');
  const [maxPrice, setMaxPrice] = useState<number>(45);
  const [onlyChefSpecials, setOnlyChefSpecials] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const priceBadgeRef = React.useRef<HTMLSpanElement>(null);

  // Compute filtered & sorted items
  const displayedItems = useMemo(() => {
    let list = [...foodItems];

    // Filter by Category
    if (selectedCategory !== 'All') {
      list = list.filter((item) => item.category === selectedCategory);
    }

    // Filter by Max Price Slide Bar
    list = list.filter((item) => item.price <= maxPrice);

    // Filter by Chef Specials toggle
    if (onlyChefSpecials) {
      list = list.filter((item) => item.chefSpecial);
    }

    // Filter by In-Stock toggle
    if (onlyInStock) {
      list = list.filter((item) => {
        const stock = inventory[item.id] !== undefined ? inventory[item.id] : item.inStock;
        return stock > 0;
      });
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.ingredients.some((ing) => ing.toLowerCase().includes(q))
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'recommended':
      default:
        // Chef specials first then highest rating
        list.sort((a, b) => (b.chefSpecial ? 1 : 0) - (a.chefSpecial ? 1 : 0) || b.rating - a.rating);
        break;
    }

    return list;
  }, [foodItems, selectedCategory, searchQuery, sortBy, maxPrice, onlyChefSpecials, onlyInStock, inventory]);

  // Run Anime.js stagger on filter or category change
  useEffect(() => {
    animateCardsStagger('.food-card-anime');
  }, [selectedCategory, sortBy, maxPrice, onlyChefSpecials, onlyInStock]);

  const handleRefreshInventory = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/inventory');
      if (res.ok) {
        await res.json();
      }
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const allCategoryTabs: Array<FoodCategory | 'All'> = [
    'All',
    'Burgers',
    'Pizza',
    'Chicken',
    'Pasta',
    'Desserts',
    'Drinks',
    'Healthy',
    'Fast Food',
  ];

  return (
    <section id="menu" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono uppercase tracking-widest mb-3">
              <Flame className="w-3.5 h-3.5" />
              <span>Epicurean Catalog</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
              Signature <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-500">Gastronomy</span>
            </h2>
          </div>

          {/* Quick Stats & Live Refresh Indicator */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRefreshInventory}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-neutral-300 border border-white/10 transition-colors active:scale-95"
              title="Sync live inventory with kitchen"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
              <span>Live Kitchen Stock</span>
            </button>
            <div className="text-xs font-mono text-neutral-400 bg-black/40 px-3.5 py-2 rounded-xl border border-white/10">
              Showing <span className="text-amber-300 font-bold">{displayedItems.length}</span> dishes
            </div>
          </div>
        </div>

        {/* Filters Bar: Categories, Interactive Slide Bar & Sorting */}
        <div className="space-y-4 mb-10">
          {/* Scrollable Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {allCategoryTabs.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 flex items-center gap-1.5 active:scale-95 ${
                    isSelected
                      ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30'
                      : 'bg-white/[0.04] text-neutral-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
                  }`}
                >
                  <span>{cat}</span>
                  {cat !== 'All' && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isSelected ? 'bg-black/20 text-black' : 'bg-white/10 text-neutral-400'
                      }`}
                    >
                      {CATEGORIES.find((c) => c.id === cat)?.count || 0}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Interactive Slide Bar Control Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 rounded-2xl bg-[#0C0E16]/80 border border-white/[0.08] backdrop-blur-md">
            {/* Search Input */}
            <div className="lg:col-span-4 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dish, truffle, wagyu, matcha..."
                className="w-full pl-10 pr-8 py-2.5 bg-black/40 rounded-xl border border-white/[0.08] text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400/50 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Interactive Price Range Slide Bar with Real-time Animation */}
            <div className="lg:col-span-4 flex flex-col justify-center px-2">
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <span className="text-neutral-300 flex items-center gap-1 font-semibold">
                  <DollarSign className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>Price Slide Bar:</span>
                </span>
                <span
                  ref={priceBadgeRef}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold font-mono text-xs shadow-[0_0_10px_rgba(245,158,11,0.2)] transition-transform"
                >
                  Max ${maxPrice}.00
                </span>
              </div>

              {/* Animated Track Container */}
              <div className="relative w-full py-2">
                {/* Background base track */}
                <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2 bg-neutral-900 rounded-full overflow-hidden border border-white/[0.06]">
                  {/* Glowing Animated Gradient Track Fill */}
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 via-orange-400 to-amber-300 rounded-full transition-all duration-150 relative"
                    style={{ width: `${((maxPrice - 12) / (45 - 12)) * 100}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </div>
                </div>

                {/* Range Input Slider overlaid */}
                <input
                  id="menu-price-slider"
                  type="range"
                  min="12"
                  max="45"
                  step="1"
                  value={maxPrice}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setMaxPrice(val);
                    if (priceBadgeRef.current) animateSliderPulse(priceBadgeRef.current);
                  }}
                  className="relative z-10 w-full h-2 bg-transparent appearance-none cursor-pointer accent-amber-400 focus:outline-none"
                />
              </div>

              {/* Animated Quick Presets */}
              <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400 mt-0.5">
                {[12, 20, 30, 45].map((preset) => (
                  <button
                    key={preset}
                    onClick={(e) => {
                      animateButtonTactile(e.currentTarget);
                      setMaxPrice(preset);
                      if (priceBadgeRef.current) animateSliderPulse(priceBadgeRef.current);
                    }}
                    className={`px-1.5 py-0.5 rounded transition-all active:scale-90 ${
                      maxPrice === preset
                        ? 'bg-amber-500/30 text-amber-300 font-bold border border-amber-500/50'
                        : 'hover:text-amber-300 hover:bg-white/[0.04]'
                    }`}
                  >
                    ${preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Toggles & Sort Dropdown */}
            <div className="lg:col-span-4 flex flex-wrap items-center justify-between lg:justify-end gap-2">
              {/* Chef Specials Toggle */}
              <button
                onClick={() => setOnlyChefSpecials(!onlyChefSpecials)}
                className={`px-3 py-2 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all border ${
                  onlyChefSpecials
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-white/[0.03] text-neutral-400 border-white/[0.06] hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Chef Specials</span>
              </button>

              {/* In Stock Toggle */}
              <button
                onClick={() => setOnlyInStock(!onlyInStock)}
                className={`px-3 py-2 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all border ${
                  onlyInStock
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-white/[0.03] text-neutral-400 border-white/[0.06] hover:text-white'
                }`}
              >
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>In Stock</span>
              </button>

              {/* Sort Controller */}
              <div className="flex items-center gap-1.5">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-black/60 text-xs text-neutral-200 border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400/50 cursor-pointer font-mono"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Food Items Grid */}
        {displayedItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayedItems.map((food, index) => (
              <FoodCard key={food.id} food={food} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 rounded-3xl bg-white/[0.02] border border-white/[0.06]">
            <p className="text-lg font-display text-neutral-300">No gastronomy items match your criteria.</p>
            <p className="text-xs text-neutral-500 mt-1">Try moving the price slide bar higher or resetting filters.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setMaxPrice(45);
                setOnlyChefSpecials(false);
                setOnlyInStock(false);
              }}
              className="mt-4 px-5 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold hover:bg-amber-500/20 transition-all"
            >
              Reset Filters & Slide Bar
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
