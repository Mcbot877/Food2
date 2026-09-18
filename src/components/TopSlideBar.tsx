import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Truck, Tag, Award, ChevronLeft, ChevronRight, Pause, Play, Flame } from 'lucide-react';
import { animateButtonTactile } from '../utils/animeAnimations';

interface SlideAnnouncement {
  id: number;
  icon: React.ReactNode;
  badge: string;
  badgeColor: string;
  title: string;
  highlight: string;
  actionText?: string;
  actionHref?: string;
}

const SLIDES: SlideAnnouncement[] = [
  {
    id: 1,
    icon: <Flame className="w-3.5 h-3.5 text-orange-400" />,
    badge: "Seasonal Harvest",
    badgeColor: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    title: "Miyazaki A5 Wagyu & Perigord Autumn Truffles",
    highlight: "Fresh Batch Plated Today",
    actionText: "Taste Wagyu",
    actionHref: "#menu",
  },
  {
    id: 2,
    icon: <Truck className="w-3.5 h-3.5 text-emerald-400" />,
    badge: "Express Thermal",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    title: "18-Min Hyper-Insulated Kitchen Delivery",
    highlight: "Free on orders over $35",
    actionText: "Order Now",
    actionHref: "#menu",
  },
  {
    id: 3,
    icon: <Tag className="w-3.5 h-3.5 text-amber-400" />,
    badge: "Exclusive Promo",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    title: "Welcome to BiteWithTaste: Save 15% on First Order",
    highlight: "Use code BITEWITHTASTE",
    actionText: "Claim 15%",
    actionHref: "#menu",
  },
  {
    id: 4,
    icon: <Award className="w-3.5 h-3.5 text-purple-400" />,
    badge: "Michelin Distinction",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    title: "Ranked #1 Modern Gastronomy Experience 2026",
    highlight: "4.96/5.0 Critic Score",
    actionText: "Read Reviews",
    actionHref: "#reviews",
  },
];

export const TopSlideBar: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const slideDuration = 4500; // 4.5 seconds per slide
  const slideContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPaused) return;

    const intervalTime = 50;
    const step = (intervalTime / slideDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((curr) => (curr + 1) % SLIDES.length);
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPaused, currentIndex]);

  const handleNext = (e: React.MouseEvent) => {
    animateButtonTactile(e.currentTarget as HTMLElement);
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    setProgress(0);
  };

  const handlePrev = (e: React.MouseEvent) => {
    animateButtonTactile(e.currentTarget as HTMLElement);
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    setProgress(0);
  };

  const currentSlide = SLIDES[currentIndex];

  const handleActionClick = (e: React.MouseEvent, href?: string) => {
    if (!href) return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div
      id="top-slide-bar"
      className="relative z-50 bg-[#06070A] border-b border-white/[0.08] text-xs select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Animated Glowing Gradient Underline */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
      
      {/* Real-time Progress Bar Slider */}
      <div className="absolute bottom-0 left-0 h-[2px] bg-neutral-800 w-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-500 via-orange-400 to-amber-300 transition-all duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-3">
        {/* Left: BiteWithTaste Brand Accent */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
          </span>
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-400">
            BiteWithTaste Live
          </span>
        </div>

        {/* Center: Animated Slide Content */}
        <div ref={slideContainerRef} className="flex-1 overflow-hidden min-h-[26px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="flex items-center justify-center gap-2 sm:gap-3 text-center truncate px-1"
            >
              {/* Icon & Badge */}
              <div className="flex items-center gap-1.5 shrink-0">
                {currentSlide.icon}
                <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${currentSlide.badgeColor}`}>
                  {currentSlide.badge}
                </span>
              </div>

              {/* Slide Title */}
              <span className="text-neutral-200 font-medium text-xs truncate max-w-[220px] sm:max-w-md">
                {currentSlide.title}
              </span>

              {/* Highlight */}
              <span className="hidden sm:inline-block font-mono text-[11px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {currentSlide.highlight}
              </span>

              {/* Action Link */}
              {currentSlide.actionText && currentSlide.actionHref && (
                <a
                  href={currentSlide.actionHref}
                  onClick={(e) => handleActionClick(e, currentSlide.actionHref)}
                  className="hidden lg:inline-flex items-center text-[11px] font-bold text-amber-400 hover:text-amber-300 underline underline-offset-2 ml-1"
                >
                  {currentSlide.actionText} →
                </a>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: Slide Bar Controls (Prev / Play-Pause / Next) */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Slide Pips */}
          <div className="hidden sm:flex items-center gap-1 mr-2">
            {SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => {
                  setCurrentIndex(idx);
                  setProgress(0);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? 'w-5 bg-amber-400' : 'w-1.5 bg-neutral-700 hover:bg-neutral-500'
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Prev button */}
          <button
            onClick={handlePrev}
            aria-label="Previous announcement"
            className="p-1 rounded text-neutral-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* Play / Pause toggle */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            aria-label={isPaused ? "Play slide bar" : "Pause slide bar"}
            className="p-1 rounded text-neutral-400 hover:text-amber-400 hover:bg-white/[0.06] transition-colors"
            title={isPaused ? "Resume auto-slide" : "Pause auto-slide"}
          >
            {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
          </button>

          {/* Next button */}
          <button
            onClick={handleNext}
            aria-label="Next announcement"
            className="p-1 rounded text-neutral-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
