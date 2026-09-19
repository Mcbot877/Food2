import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Sparkles, Star, Flame, Clock, Award, Plus, ShieldCheck } from 'lucide-react';
import { useFood } from '../context/FoodContext';
import { animateHeroEntrance, initContinuousFloating, animateButtonTactile } from '../utils/animeAnimations';

export const HeroSection: React.FC = () => {
  const { foodItems, addToCart, setActiveDetailDish, setIsAdminOpen, adminOrders } = useFood();
  const heroDish = foodItems[0]; // Cyber Truffle Wagyu Burger

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const heroButtonRef = useRef<HTMLButtonElement>(null);

  // Parallax scroll effects
  const { scrollY } = useScroll();
  const scrollParallaxY = useTransform(scrollY, [0, 600], [0, 140]);
  const heroRotate = useTransform(scrollY, [0, 600], [0, 15]);

  useEffect(() => {
    // Run Anime.js entrance timeline
    animateHeroEntrance('.anime-hero-title', '.anime-hero-sub', '.anime-hero-badge');
    const floatAnim = initContinuousFloating('.anime-float-tag');

    return () => {
      if (floatAnim) floatAnim.pause();
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToMenu = () => {
    const menuEl = document.getElementById('menu');
    if (menuEl) {
      menuEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-[90vh] pt-28 sm:pt-36 pb-16 sm:pb-24 flex items-center justify-center overflow-hidden"
    >
      {/* Dynamic Animated Ambient Background Glows */}
      <div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-amber-500/10 blur-[140px] pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${mousePos.x * -40}px, ${mousePos.y * -40}px)`,
        }}
      />
      <div
        className="absolute top-1/3 -right-40 w-[550px] h-[550px] rounded-full bg-orange-600/10 blur-[130px] pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${mousePos.x * 50}px, ${mousePos.y * 50}px)`,
        }}
      />
      <div
        className="absolute -bottom-20 left-1/3 w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -30}px)`,
        }}
      />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Main Hero Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-6 space-y-7 text-center lg:text-left">
            {/* Gastronomy Badge & Admin Quick Launch */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              <div className="anime-hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-semibold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>BiteWithTaste • Haute Cuisine</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              </div>

              <button
                id="hero-admin-btn"
                onClick={() => setIsAdminOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all shadow-sm active:scale-95"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Panel</span>
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-zinc-950 font-mono text-[10px]">
                  {adminOrders.filter((o) => o.status !== 'delivered').length} Active Orders
                </span>
              </button>
            </div>

            {/* Massive Hero Headline */}
            <div className="anime-hero-title">
              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-white leading-[1.1] font-display">
                Every Bite <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-orange-500">
                  Crafted With Taste.
                </span>
              </h1>
            </div>

            {/* Supporting Copy */}
            <p className="anime-hero-sub text-base sm:text-lg text-neutral-300/90 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Where heritage culinary arts meet modernist molecular gastronomy. Hand-selected A5 Wagyu, 72-hour fermented sourdoughs, and rare autumn truffles — prepared with surgical precision and delivered in hyper-insulated thermal lockers.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                id="hero-order-now-btn"
                ref={heroButtonRef}
                onClick={(e) => {
                  if (heroButtonRef.current) animateButtonTactile(heroButtonRef.current);
                  if (heroDish) {
                    addToCart(heroDish, 1, {}, e);
                  }
                }}
                className="group relative px-7 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-black font-bold text-sm hover:shadow-[0_0_30px_rgba(245,158,11,0.45)] transition-all flex items-center gap-2.5 active:scale-95"
              >
                <span>Order Signature Wagyu ($28.50)</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                id="hero-explore-menu-btn"
                onClick={scrollToMenu}
                className="px-6 py-3.5 rounded-full bg-white/[0.04] hover:bg-white/[0.09] text-white font-semibold text-sm border border-white/10 hover:border-white/20 transition-all backdrop-blur-md active:scale-95"
              >
                Explore Full Menu
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="pt-6 border-t border-white/[0.08] flex items-center justify-center lg:justify-start gap-8"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Star className="w-5 h-5 fill-amber-400" />
                </div>
                <div className="text-left">
                  <p className="font-extrabold text-white text-base font-mono">4.96 / 5.0</p>
                  <p className="text-xs text-neutral-400">1,200+ Verified Critics</p>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-extrabold text-white text-base font-mono">14 Mins</p>
                  <p className="text-xs text-neutral-400">Precision Prep Time</p>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Award className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-extrabold text-white text-base font-mono">Michelin</p>
                  <p className="text-xs text-neutral-400">Culinary Innovation</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: 3D Parallax Food Showcase */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            {/* Outer Decorative Orbit Rings */}
            <div
              className="absolute w-[440px] h-[440px] sm:w-[540px] sm:h-[540px] rounded-full border border-amber-500/20 animate-spin pointer-events-none"
              style={{ animationDuration: '45s' }}
            />
            <div
              className="absolute w-[360px] h-[360px] sm:w-[440px] sm:h-[440px] rounded-full border border-dashed border-white/10 animate-spin pointer-events-none"
              style={{ animationDuration: '30s', animationDirection: 'reverse' }}
            />

            {/* Glowing Backdrop Plate Aura */}
            <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-amber-500/25 via-orange-500/20 to-rose-500/15 blur-3xl pointer-events-none" />

            {/* Main 3D Floating Dish Card Container */}
            <motion.div
              style={{
                y: scrollParallaxY,
                rotate: heroRotate,
                perspective: 1200,
              }}
              className="relative z-10"
            >
              <div
                className="relative cursor-pointer transition-transform duration-200 ease-out"
                style={{
                  transform: `rotateY(${mousePos.x * 22}deg) rotateX(${mousePos.y * -22}deg) translateZ(30px)`,
                  transformStyle: 'preserve-3d',
                }}
                onClick={() => heroDish && setActiveDetailDish(heroDish)}
              >
                {/* Food Plate Visual */}
                <div className="relative w-[300px] sm:w-[420px] aspect-square rounded-full p-2 bg-gradient-to-b from-white/15 to-white/5 border border-white/15 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-sm group">
                  <div className="w-full h-full rounded-full overflow-hidden relative shadow-inner">
                    <img
                      src={heroDish?.image || 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=1000&q=85'}
                      alt="Cyber Truffle Wagyu Burger"
                      className="w-full h-full object-cover rounded-full scale-105 group-hover:scale-110 transition-transform duration-700 ease-out"
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                  </div>

                  {/* Shimmer Light Reflection Effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
                </div>

                {/* Floating Ingredient Node 1: Black Truffle Carpaccio */}
                <div
                  className="anime-float-tag absolute -top-4 -left-2 sm:-left-10 px-3.5 py-2 rounded-2xl glass-panel border border-amber-400/30 flex items-center gap-2.5 shadow-xl"
                  style={{
                    transform: `translate(${mousePos.x * -25}px, ${mousePos.y * -25}px) translateZ(50px)`,
                  }}
                >
                  <span className="text-xl">🍄</span>
                  <div>
                    <p className="text-[11px] font-bold text-white leading-tight">Perigord Truffle</p>
                    <p className="text-[9px] text-amber-300 font-mono">Shaved Tableside</p>
                  </div>
                </div>

                {/* Floating Ingredient Node 2: A5 Wagyu Marrow */}
                <div
                  className="anime-float-tag absolute -bottom-6 -right-2 sm:-right-8 px-4 py-2.5 rounded-2xl glass-panel border border-orange-400/30 flex items-center gap-3 shadow-xl"
                  style={{
                    transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px) translateZ(60px)`,
                  }}
                >
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-white leading-tight">A5 Miyazaki Wagyu</p>
                    <p className="text-[9px] text-orange-300 font-mono">Binchotan Smoked</p>
                  </div>
                </div>

                {/* Floating Price & Add Tag */}
                <div
                  className="anime-float-tag absolute top-1/2 -right-4 sm:-right-12 -translate-y-1/2 px-4 py-2.5 rounded-2xl bg-[#08090D]/90 border border-amber-500/40 backdrop-blur-xl shadow-2xl flex items-center gap-3"
                  style={{
                    transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px) translateZ(70px)`,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (heroDish) addToCart(heroDish, 1, {}, e);
                  }}
                >
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-mono block">Signature</span>
                    <span className="text-base font-extrabold text-amber-300 font-mono">$28.50</span>
                  </div>
                  <button
                    className="w-8 h-8 rounded-full bg-amber-500 text-black flex items-center justify-center hover:bg-amber-400 transition-colors shadow-md shadow-amber-500/30"
                    title="Quick Add to Order"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
