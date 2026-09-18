import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Search, Sparkles, Menu, X, Heart, Clock } from 'lucide-react';
import { useFood } from '../context/FoodContext';

export const Navbar: React.FC = () => {
  const { cartTotalCount, setIsCartOpen, setIsSearchOpen, setIsAIOpen, favorites, activeOrder, setIsTrackingOpen } = useFood();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      setIsScrolled(scrollPos > 30);

      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((scrollPos / totalScroll) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'Menu', href: '#menu' },
    { label: 'Categories', href: '#categories' },
    { label: 'Featured', href: '#featured' },
    { label: 'Popular', href: '#popular' },
    { label: 'Delivery', href: '#delivery' },
    { label: 'Chefs', href: '#chefs' },
    { label: 'Story', href: '#story' },
  ];

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      <div
        id="scroll-progress-bar"
        className="fixed top-0 left-0 right-0 h-[2.5px] z-50 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-300 origin-left transition-all duration-100"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Sticky Navbar */}
      <header
        id="main-navbar"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'py-3.5 bg-[#08090D]/85 backdrop-blur-xl border-b border-white/[0.08] shadow-2xl shadow-black/50'
            : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <a
            id="brand-logo"
            href="#hero"
            onClick={(e) => scrollToSection(e, '#hero')}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 flex items-center justify-center p-[1px] shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-all">
              <div className="w-full h-full bg-[#08090D] rounded-[11px] flex items-center justify-center">
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-tr from-amber-300 to-amber-500 font-display text-lg tracking-wider">
                  Λ
                </span>
              </div>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold tracking-tight text-lg text-white group-hover:text-amber-300 transition-colors">
                  AURA
                </span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  GASTROLAB
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 tracking-wider font-mono hidden sm:block">
                NEXT-GEN MOLECULAR DINING
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full glass-panel-subtle border border-white/[0.06]">
            {navLinks.map((link) => (
              <a
                key={link.label}
                id={`nav-link-${link.label.toLowerCase()}`}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="px-3.5 py-1.5 text-xs font-medium text-neutral-300 hover:text-amber-400 rounded-full transition-all hover:bg-white/[0.04]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2.5">
            {/* Live Kitchen Status / Active Order pill */}
            {activeOrder ? (
              <button
                id="active-order-tracker-btn"
                onClick={() => setIsTrackingOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium hover:bg-emerald-500/25 transition-all animate-pulse"
              >
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Track {activeOrder.id}</span>
              </button>
            ) : (
              <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-[11px] text-neutral-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Kitchen Online</span>
                <span className="text-neutral-500">|</span>
                <span className="text-amber-300/90 font-mono">14m Prep Avg</span>
              </div>
            )}

            {/* AI Gastronomy Concierge Button */}
            <button
              id="ai-sommelier-btn"
              onClick={() => setIsAIOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-purple-500/15 border border-amber-500/30 text-amber-300 hover:border-amber-400 hover:text-amber-200 text-xs font-semibold transition-all hover:shadow-[0_0_15px_rgba(245,158,11,0.25)]"
              title="AI Flavor Pairing & Gastronomy Assistant"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="hidden md:inline">AI Taste Match</span>
            </button>

            {/* Search Trigger Button */}
            <button
              id="navbar-search-btn"
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 hover:text-white border border-white/[0.06] transition-colors"
              aria-label="Search dishes"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Favorites Counter Pill */}
            <a
              id="navbar-favorites-btn"
              href="#menu"
              onClick={(e) => scrollToSection(e, '#menu')}
              className="relative p-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 hover:text-rose-400 border border-white/[0.06] transition-colors"
              aria-label="Favorites"
            >
              <Heart className="w-4 h-4" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white font-mono text-[9px] rounded-full flex items-center justify-center font-bold">
                  {favorites.length}
                </span>
              )}
            </a>

            {/* Cart Drawer Trigger Button */}
            <button
              id="navbar-cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold text-xs transition-all shadow-lg shadow-amber-500/25 active:scale-95"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              <motion.span
                key={cartTotalCount}
                initial={{ scale: 0.6 }}
                animate={{ scale: 1 }}
                className="w-5 h-5 bg-black text-amber-400 font-mono text-[11px] rounded-full flex items-center justify-center font-bold"
              >
                {cartTotalCount}
              </motion.span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              id="mobile-nav-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/[0.04] text-neutral-300 hover:text-white border border-white/[0.06]"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[72px] z-30 p-4 lg:hidden"
          >
            <div className="bg-[#0D0F17]/95 backdrop-blur-2xl rounded-2xl p-6 border border-white/10 shadow-2xl space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="p-3 text-sm font-medium text-neutral-300 hover:text-amber-400 hover:bg-white/[0.04] rounded-xl transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
              <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsAIOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>AI Taste Match Concierge</span>
                </button>
                {activeOrder && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsTrackingOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Track Active Order: {activeOrder.id}</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
