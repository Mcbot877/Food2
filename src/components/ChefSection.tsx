import React from 'react';
import { motion } from 'motion/react';
import { Award, Utensils, Star, Instagram, Twitter, Linkedin } from 'lucide-react';
import { CHEFS } from '../data/mockData';

export const ChefSection: React.FC = () => {
  return (
    <section id="chefs" className="py-24 relative z-10 bg-[#07080C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono uppercase tracking-widest">
            <Utensils className="w-3.5 h-3.5" />
            <span>Master Visionaries</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            The Culinary <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-500">Architects</span>
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base font-light">
            Led by globally celebrated culinary directors from Copenhagen, Paris, and Tokyo.
          </p>
        </div>

        {/* Chefs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CHEFS.map((chef, idx) => (
            <motion.div
              key={chef.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              whileHover={{ y: -8 }}
              className="group relative rounded-3xl bg-[#0E1017] border border-white/[0.08] hover:border-amber-400/40 transition-all duration-500 overflow-hidden shadow-xl"
            >
              {/* Chef Portrait */}
              <div className="relative h-80 w-full overflow-hidden bg-black/60">
                <img
                  src={chef.image}
                  alt={chef.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E1017] via-[#0E1017]/30 to-transparent" />

                {/* Signature Dish Pill */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-amber-300">
                  Signature: {chef.signatureDish}
                </div>

                {/* Social icons on hover overlay */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="p-2 rounded-full bg-black/70 backdrop-blur-md text-white hover:text-amber-400 cursor-pointer border border-white/10">
                    <Instagram className="w-3.5 h-3.5" />
                  </span>
                  <span className="p-2 rounded-full bg-black/70 backdrop-blur-md text-white hover:text-amber-400 cursor-pointer border border-white/10">
                    <Twitter className="w-3.5 h-3.5" />
                  </span>
                  <span className="p-2 rounded-full bg-black/70 backdrop-blur-md text-white hover:text-amber-400 cursor-pointer border border-white/10">
                    <Linkedin className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* Chef Details */}
              <div className="p-6 space-y-3">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors font-display">
                    {chef.name}
                  </h3>
                  <p className="text-xs font-mono text-amber-400/90 mt-0.5">{chef.role}</p>
                </div>

                <div className="text-[11px] font-mono text-neutral-400 bg-white/[0.03] px-2.5 py-1 rounded-lg border border-white/[0.05]">
                  Focus: <span className="text-white font-medium">{chef.specialty}</span>
                </div>

                <p className="text-xs text-neutral-400 font-light leading-relaxed">
                  {chef.bio}
                </p>

                {/* Awards List */}
                <div className="pt-3 border-t border-white/[0.06] space-y-1">
                  {chef.awards.map((award) => (
                    <div key={award} className="flex items-center gap-2 text-[11px] text-neutral-300 font-mono">
                      <Award className="w-3 h-3 text-amber-400 shrink-0" />
                      <span className="truncate">{award}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
