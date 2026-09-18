import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { FoodCard } from './FoodCard';
import { useFood } from '../context/FoodContext';
import { FoodCategory } from '../types';
import { CATEGORIES } from '../data/mockData';
import { Search, SlidersHorizontal, RefreshCw, Flame } from 'lucide-react';

export const MenuSection: React.FC = () => {
  const { foodItems, selectedCategory, setSelectedCategory, inventory } = useFood();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-low' | 'price-high' | 'rating'>('recommended');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Compute filtered & sorted items
  const displayedItems = useMemo(() => {
    let list = [...foodItems];

    // Filter by Category
    if (selectedCategory !== 'All') {
      list = list.filter((item) => item.category === selectedCategory);
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
  }, [foodItems, selectedCategory, searchQuery, sortBy]);

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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono uppercase tracking-widest mb-3">
              <Flame className="w-3.5 h-3.5" />
              <span>Epicurean Catalog</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Signature <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-500">Gastronomy</span>
            </h2>
          </div>

          {/* Quick Stats & Live Refresh Indicator */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefreshInventory}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-neutral-300 border border-white/10 transition-colors"
              title="Sync live inventory with kitchen"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
              <span>Live Kitchen Stock</span>
            </button>
            <div className="text-xs font-mono text-neutral-400 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
              Showing <span className="text-amber-300 font-bold">{displayedItems.length}</span> dishes
            </div>
          </div>
        </div>

        {/* Filters Bar: Categories & Sorting */}
        <div className="space-y-4 mb-12">
          {/* Scrollable Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {allCategoryTabs.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 flex items-center gap-1.5 ${
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

          {/* Search Input & Sort Dropdown */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 rounded-2xl bg-[#0C0E16]/80 border border-white/[0.08]">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dish, truffle, wagyu, matcha..."
                className="w-full pl-10 pr-4 py-2 bg-black/40 rounded-xl border border-white/[0.06] text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400/50 transition-colors"
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

            {/* Sort Controller */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400" />
              <span className="text-xs text-neutral-400 font-mono">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-black/50 text-xs text-neutral-200 border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400/50 cursor-pointer"
              >
                <option value="recommended">Chef Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
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
            <p className="text-lg font-display text-neutral-300">No gastronomy items match your query.</p>
            <p className="text-xs text-neutral-500 mt-1">Try clearing your search query or choosing another category.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
