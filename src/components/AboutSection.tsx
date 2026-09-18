import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { Award, Flame, HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react';

interface CounterProps {
  from?: number;
  to: number;
  suffix?: string;
  duration?: number;
}

const AnimatedNumber: React.FC<CounterProps> = ({ from = 0, to, suffix = '', duration = 1.8 }) => {
  const [count, setCount] = useState(from);
  const ref = React.useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      // Ease out quartic
      const ease = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(ease * (to - from) + from));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(to);
      }
    };

    requestAnimationFrame(step);
  }, [isInView, from, to, duration]);

  return (
    <span ref={ref} className="font-mono font-extrabold">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

export const AboutSection: React.FC = () => {
  return (
    <section id="story" className="py-24 relative overflow-hidden bg-[#090A10]">
      {/* Subtle ambient light */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-amber-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-orange-500/10 blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Collage with 3D Depth */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Laboratory Kitchen Visual */}
              <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative aspect-[4/3] group">
                <img
                  src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1000&q=85"
                  alt="Modernist Culinary Lab"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block mb-1">
                    Binchotan Hearth & Cryo-Station
                  </span>
                  <h4 className="text-lg font-bold text-white font-display">
                    Where Ancestral Fire Meets Cryogenic Science
                  </h4>
                </div>
              </div>

              {/* Floating Award Trophy Plaque */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="absolute -bottom-8 -right-4 sm:-right-8 p-5 rounded-2xl glass-panel border border-amber-500/40 shadow-2xl max-w-xs space-y-1.5"
              >
                <div className="flex items-center gap-2 text-amber-400">
                  <Award className="w-5 h-5 fill-amber-400" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider">
                    Michelin Honor 2024
                  </span>
                </div>
                <p className="text-xs text-neutral-300 font-light leading-relaxed">
                  Recognized for redefining high-throughput gastronomic delivery with laboratory precision.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Right Column: Story & Philosophy */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>The Gastrolab Genesis</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Reimagining The Art Of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-amber-200">
                Sensory Dining.
              </span>
            </h2>

            <p className="text-neutral-300 text-sm sm:text-base font-light leading-relaxed">
              Founded in 2021 by modernist chefs and culinary artisans, BiteWithTaste was born from a singular obsession: Why should world-class culinary craftsmanship be restricted to static tablecloth dining?
            </p>

            <p className="text-neutral-400 text-sm font-light leading-relaxed">
              We engineered a bespoke smart kitchen pipeline where binchotan charcoal char, 72-hour sourdough levain, and liquid nitrogen texture stabilizers harmonize. Each dish is individually monitored, heat-sealed, and dispatched at the exact moment of peak flavor chemistry.
            </p>

            {/* Value Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
                <div className="flex items-center gap-2 text-amber-300 text-xs font-bold font-mono">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span>Micro-Climate Cooking</span>
                </div>
                <p className="text-xs text-neutral-400 font-light">
                  Sous-vide circulators and custom ceramic ovens controlled to ±0.1°C tolerance.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold font-mono">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Zero-Plastic Thermal Pods</span>
                </div>
                <p className="text-xs text-neutral-400 font-light">
                  100% biodegradable bamboo fiber with vacuum-insulated heat retention seals.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Animated Statistics Counter Row */}
        <div className="mt-20 pt-12 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center space-y-1">
            <p className="text-3xl sm:text-5xl text-amber-400">
              <AnimatedNumber to={48500} suffix="+" />
            </p>
            <p className="text-xs sm:text-sm text-neutral-400 font-medium">Orders Delivered</p>
          </div>

          <div className="text-center space-y-1">
            <p className="text-3xl sm:text-5xl text-white">
              <AnimatedNumber to={99} suffix=".6%" />
            </p>
            <p className="text-xs sm:text-sm text-neutral-400 font-medium">Guest Satisfaction</p>
          </div>

          <div className="text-center space-y-1">
            <p className="text-3xl sm:text-5xl text-amber-400">
              <AnimatedNumber to={18} suffix=" Yrs" />
            </p>
            <p className="text-xs sm:text-sm text-neutral-400 font-medium">Mother Sourdough Age</p>
          </div>

          <div className="text-center space-y-1">
            <p className="text-3xl sm:text-5xl text-emerald-400">
              <AnimatedNumber to={14} suffix=" Min" />
            </p>
            <p className="text-xs sm:text-sm text-neutral-400 font-medium">Avg Kitchen Prep Precision</p>
          </div>
        </div>
      </div>
    </section>
  );
};
