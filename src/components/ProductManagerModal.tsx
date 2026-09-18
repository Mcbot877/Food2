import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Database,
  Plus,
  Trash2,
  RotateCcw,
  Check,
  Edit2,
  DollarSign,
  Package,
  Sparkles,
  Download,
  Flame,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useFood } from '../context/FoodContext';
import { FoodCategory, FoodItem } from '../types';
import { CATEGORIES } from '../data/mockData';
import { animateButtonTactile } from '../utils/animeAnimations';

export const ProductManagerModal: React.FC = () => {
  const {
    isProductManagerOpen,
    setIsProductManagerOpen,
    foodItems,
    inventory,
    addCustomDish,
    updateDish,
    deleteDish,
    resetDefaultProducts,
    showToast,
  } = useFood();

  const [activeTab, setActiveTab] = useState<'catalog' | 'add'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [editingDishId, setEditingDishId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);

  // New Dish Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<FoodCategory>('Burgers');
  const [price, setPrice] = useState('24.00');
  const [stock, setStock] = useState('25');
  const [description, setDescription] = useState('');
  const [prepTime, setPrepTime] = useState('12 min');
  const [calories, setCalories] = useState('450');
  const [image, setImage] = useState(
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=85'
  );

  const totalStockUnits = Object.values(inventory).reduce((acc, curr) => acc + curr, 0);

  const filteredItems = foodItems.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleStartEdit = (dish: FoodItem) => {
    setEditingDishId(dish.id);
    setEditPrice(dish.price);
    setEditStock(inventory[dish.id] !== undefined ? inventory[dish.id] : dish.inStock);
  };

  const handleSaveEdit = (dishId: string) => {
    updateDish(dishId, {
      price: Number(editPrice) || 12,
      inStock: Number(editStock) || 0,
    });
    setEditingDishId(null);
  };

  const handleCreateDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please specify a dish name');
      return;
    }

    addCustomDish({
      name: name.trim(),
      category,
      price: parseFloat(price) || 20,
      rating: 4.95,
      reviewsCount: 1,
      description: description.trim() || 'Exquisite house-curated specialty cooked to order.',
      fullStory: 'Handcrafted fresh daily with premium organic ingredients and local seasonal harvests.',
      image: image || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=85',
      badge: 'Local Special',
      calories: parseInt(calories) || 400,
      prepTime: prepTime || '15 min',
      protein: '24g',
      inStock: parseInt(stock) || 20,
      ingredients: ['Seasonal Harvest', 'Extra Virgin Olive Oil', 'Artisanal Herbs', 'Maldon Flake Salt'],
    });

    // Reset Form
    setName('');
    setDescription('');
    setActiveTab('catalog');
  };

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(foodItems, null, 2);
    navigator.clipboard.writeText(jsonStr);
    showToast('Product catalog JSON copied to clipboard!');
  };

  const PRESET_IMAGES = [
    { label: 'Wagyu Steak', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=85' },
    { label: 'Pasta', url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1000&q=85' },
    { label: 'Sushi', url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1000&q=85' },
    { label: 'Dessert', url: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=1000&q=85' },
    { label: 'Cocktail', url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1000&q=85' },
  ];

  return (
    <AnimatePresence>
      {isProductManagerOpen && (
        <div id="product-manager-modal" className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsProductManagerOpen(false)}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-[#0B0D14] border border-amber-500/30 shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden z-10 text-white"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-white/[0.08] bg-[#0E111B] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold font-display tracking-tight text-white">
                      Website Local Data Hub
                    </h2>
                    <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      Live localStorage Sync
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 font-mono mt-0.5">
                    Storage Key: <span className="text-amber-400">bitewithtaste_products</span> • Changes persist in your browser
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportJSON}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-neutral-300 border border-white/10 flex items-center gap-1.5 transition-colors"
                  title="Copy full JSON"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Export JSON</span>
                </button>
                <button
                  onClick={() => setIsProductManagerOpen(false)}
                  className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/[0.08] transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-black/40 border-b border-white/[0.06] text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <span className="text-neutral-500 block text-[10px]">TOTAL DISHES</span>
                <span className="text-amber-400 font-bold text-base">{foodItems.length} Products</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <span className="text-neutral-500 block text-[10px]">TOTAL INVENTORY</span>
                <span className="text-emerald-400 font-bold text-base">{totalStockUnits} Portions</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <span className="text-neutral-500 block text-[10px]">STORAGE TYPE</span>
                <span className="text-purple-300 font-bold text-base">Client Browser</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <span className="text-neutral-500 block text-[10px]">STATUS</span>
                <span className="text-emerald-300 font-bold text-base flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Active Sync
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-white/[0.08] bg-[#0C0E17] px-6">
              <button
                onClick={() => setActiveTab('catalog')}
                className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === 'catalog'
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Product Catalog & Inline Editor ({foodItems.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('add')}
                className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === 'add'
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Add New Local Dish</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {activeTab === 'catalog' ? (
                <div>
                  {/* Filter & Search Toolbar */}
                  <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <input
                        type="text"
                        placeholder="Search product name or category..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-black/50 rounded-xl border border-white/[0.08] text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400/50"
                      />
                    </div>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-2 bg-black/50 rounded-xl border border-white/[0.08] text-xs text-neutral-300 focus:outline-none focus:border-amber-400/50"
                    >
                      <option value="All">All Categories</option>
                      {CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Products Table/List */}
                  <div className="space-y-2.5">
                    {filteredItems.map((dish) => {
                      const isEditing = editingDishId === dish.id;
                      const currentStock = inventory[dish.id] !== undefined ? inventory[dish.id] : dish.inStock;

                      return (
                        <div
                          key={dish.id}
                          className="p-3.5 rounded-2xl bg-[#10131E] border border-white/[0.06] hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          {/* Left: Thumbnail & Info */}
                          <div className="flex items-center gap-3.5 min-w-0">
                            <img
                              src={dish.image}
                              alt={dish.name}
                              className="w-14 h-14 rounded-xl object-cover shrink-0 border border-white/10"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-sm text-white truncate">{dish.name}</h4>
                                <span className="px-2 py-0.5 rounded-full bg-white/[0.06] text-[10px] font-mono text-amber-300 shrink-0">
                                  {dish.category}
                                </span>
                              </div>
                              <p className="text-xs text-neutral-400 line-clamp-1 font-light mt-0.5">
                                {dish.description}
                              </p>
                              <div className="flex items-center gap-3 text-[10px] font-mono text-neutral-500 mt-1">
                                <span>Prep: {dish.prepTime}</span>
                                <span>•</span>
                                <span>{dish.calories} kcal</span>
                              </div>
                            </div>
                          </div>

                          {/* Right: Inline Edit or Stats */}
                          <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                            {isEditing ? (
                              <div className="flex items-center gap-2 bg-black/60 p-1.5 rounded-xl border border-amber-500/40">
                                <div className="flex items-center gap-1">
                                  <span className="text-xs text-amber-400 font-mono">$</span>
                                  <input
                                    type="number"
                                    step="0.5"
                                    value={editPrice}
                                    onChange={(e) => setEditPrice(Number(e.target.value))}
                                    className="w-16 bg-neutral-900 px-2 py-1 rounded text-xs font-mono text-white text-center border border-white/10 focus:outline-none focus:border-amber-400"
                                  />
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-[10px] text-neutral-400 font-mono">Qty:</span>
                                  <input
                                    type="number"
                                    value={editStock}
                                    onChange={(e) => setEditStock(Number(e.target.value))}
                                    className="w-14 bg-neutral-900 px-2 py-1 rounded text-xs font-mono text-white text-center border border-white/10 focus:outline-none focus:border-amber-400"
                                  />
                                </div>
                                <button
                                  onClick={() => handleSaveEdit(dish.id)}
                                  className="p-1.5 rounded bg-emerald-500 text-black hover:bg-emerald-400 transition-colors"
                                  title="Save to local data"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setEditingDishId(null)}
                                  className="p-1.5 rounded bg-neutral-800 text-neutral-400 hover:text-white"
                                  title="Cancel"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-3">
                                <div className="text-right">
                                  <p className="font-extrabold text-amber-400 font-mono text-sm">
                                    ${dish.price.toFixed(2)}
                                  </p>
                                  <p className="text-[10px] font-mono text-neutral-400">
                                    {currentStock} in stock
                                  </p>
                                </div>

                                <button
                                  onClick={() => handleStartEdit(dish)}
                                  className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 hover:text-amber-400 transition-colors"
                                  title="Edit Price & Stock"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => deleteDish(dish.id)}
                                  className="p-2 rounded-xl bg-white/[0.04] hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 transition-colors"
                                  title="Delete from local data"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Add New Dish Form */
                <form onSubmit={handleCreateDish} className="space-y-4">
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-neutral-300 flex items-start gap-3">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-amber-300 font-mono">Create A New Local Dish</p>
                      <p className="text-neutral-400 mt-0.5">
                        This item will be saved directly into your website's local storage and appear immediately across your menu, category filters, and checkout cart.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-neutral-400 mb-1.5">Dish Name *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Saffron Butter Chilean Sea Bass"
                        className="w-full px-3.5 py-2.5 bg-black/50 rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-neutral-400 mb-1.5">Category *</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as FoodCategory)}
                        className="w-full px-3.5 py-2.5 bg-black/50 rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-neutral-400 mb-1.5">Price (USD $) *</label>
                      <input
                        type="number"
                        step="0.5"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-black/50 rounded-xl border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-neutral-400 mb-1.5">Initial Stock Units *</label>
                      <input
                        type="number"
                        required
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-black/50 rounded-xl border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-neutral-400 mb-1.5">Preparation Time</label>
                      <input
                        type="text"
                        value={prepTime}
                        onChange={(e) => setPrepTime(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-black/50 rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-neutral-400 mb-1.5">Calories (kcal)</label>
                      <input
                        type="number"
                        value={calories}
                        onChange={(e) => setCalories(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-black/50 rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1.5">Description & Tasting Notes</label>
                    <textarea
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the textures, cooking technique, and aromatics..."
                      className="w-full px-3.5 py-2 bg-black/50 rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1.5">Image URL</label>
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="w-full px-3.5 py-2 bg-black/50 rounded-xl border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-[10px] text-neutral-500 font-mono self-center">Presets:</span>
                      {PRESET_IMAGES.map((p) => (
                        <button
                          key={p.label}
                          type="button"
                          onClick={() => setImage(p.url)}
                          className="px-2 py-0.5 rounded bg-white/[0.05] hover:bg-white/[0.1] text-[10px] text-amber-300 font-mono border border-white/[0.08]"
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-black font-bold text-sm hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Save Dish to Website Local Data</span>
                  </button>
                </form>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-white/[0.08] bg-[#0E111B] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <button
                onClick={() => {
                  if (window.confirm('Reset all products back to default factory catalog? Your custom local products will be restored to defaults.')) {
                    resetDefaultProducts();
                  }
                }}
                className="text-neutral-400 hover:text-red-400 flex items-center gap-1.5 transition-colors font-mono"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Factory Defaults</span>
              </button>

              <button
                onClick={() => setIsProductManagerOpen(false)}
                className="px-5 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white font-medium transition-colors"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
