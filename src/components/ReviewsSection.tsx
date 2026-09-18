import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { REVIEWS } from '../data/mockData';

export const ReviewsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % REVIEWS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const activeReview = REVIEWS[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % REVIEWS.length);
  };

  return (
    <section id="reviews" className="py-24 relative overflow-hidden bg-[#090A10]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono uppercase tracking-widest">
            <Quote className="w-3.5 h-3.5" />
            <span>Critique & Acclaim</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Distinguished <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-500">Impressions</span>
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base font-light">
            Read what prominent gastronomic critics and discerning patrons share about their sensory journey.
          </p>
        </div>

        {/* Testimonial Stage */}
        <div className="max-w-4xl mx-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeReview.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="rounded-3xl bg-[#0F121C] border border-white/10 p-6 sm:p-10 shadow-2xl relative overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
            >
              {/* Left Column: Review Text & Critic Bio */}
              <div className="md:col-span-8 space-y-6">
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(activeReview.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                  <span className="text-xs font-mono text-neutral-400 ml-2">{activeReview.date}</span>
                </div>

                <p className="text-base sm:text-xl text-neutral-200 font-light italic leading-relaxed">
                  "{activeReview.comment}"
                </p>

                {/* Profile */}
                <div className="flex items-center gap-4 pt-2">
                  <img
                    src={activeReview.avatar}
                    alt={activeReview.name}
                    className="w-12 h-12 rounded-full object-cover border border-amber-400/40"
                  />
                  <div>
                    <h4 className="font-display font-bold text-white text-base">
                      {activeReview.name}
                    </h4>
                    <p className="text-xs text-amber-400/90 font-mono">{activeReview.role}</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Dish Highlight */}
              <div className="md:col-span-4 p-4 rounded-2xl bg-black/40 border border-white/[0.06] text-center space-y-3">
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <img
                    src={activeReview.dishImage}
                    alt={activeReview.dishName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-neutral-400 block">Ordered Experience</span>
                  <p className="text-xs font-bold text-white font-display mt-0.5">{activeReview.dishName}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Arrows */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={handlePrev}
              className="p-3 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 transition-colors"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              {REVIEWS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === currentIndex ? 'w-6 bg-amber-400' : 'w-2 bg-white/20'
                  }`}
                  aria-label={`Jump to review ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-3 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 transition-colors"
              aria-label="Next review"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
