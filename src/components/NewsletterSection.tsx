import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Sparkles, CheckCircle2 } from 'lucide-react';
import { triggerCelebrationConfetti } from '../utils/confetti';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    setIsSubmitted(true);
    triggerCelebrationConfetti();
  };

  return (
    <section className="py-24 relative overflow-hidden bg-[#07080C]">
      {/* Floating ingredients background */}
      <div className="absolute -top-10 left-10 text-4xl opacity-20 animate-subtle-float pointer-events-none">
        🍄
      </div>
      <div className="absolute top-1/2 right-12 text-4xl opacity-20 animate-subtle-float-reverse pointer-events-none">
        🌿
      </div>
      <div className="absolute bottom-6 left-1/4 text-4xl opacity-20 animate-subtle-float pointer-events-none">
        ✨
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl bg-gradient-to-b from-[#121522] to-[#0A0C14] border border-amber-500/30 p-8 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Private Gastronomy Dispatch</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Reserve Your Place In The <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">
              Future of Flavor.
            </span>
          </h2>

          <p className="text-neutral-400 text-sm sm:text-base max-w-lg mx-auto font-light leading-relaxed">
            Receive invitation-only seasonal tasting degustations, secret chef reserve drops, and molecular cocktail recipes directly to your inbox.
          </p>

          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 max-w-md mx-auto flex items-center justify-center gap-3 text-emerald-300"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-semibold">Welcome to the Inner Circle. Dispatch confirmed.</span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 pt-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your VIP email address..."
                required
                className="flex-1 px-4 py-3.5 rounded-2xl bg-black/60 border border-white/15 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 font-medium"
              />
              <button
                type="submit"
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold text-sm hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95"
              >
                <span>Subscribe</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}

          <p className="text-[11px] font-mono text-neutral-500">
            No spam. Strictly curated gastronomic drops. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
};
