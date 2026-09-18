import React from 'react';
import { Instagram, Twitter, Linkedin, MapPin, Phone, Mail, Clock, UtensilsCrossed } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050608] border-t border-white/[0.08] pt-16 pb-12 relative overflow-hidden text-neutral-400">
      {/* Ambient background light */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/[0.08]">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center p-[1px]">
                <div className="w-full h-full bg-[#08090D] rounded-[11px] flex items-center justify-center">
                  <UtensilsCrossed className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <span className="font-display font-bold text-xl text-white tracking-tight">
                BiteWith<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Taste</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed max-w-sm">
              Artisanal gourmet cuisine delivered fresh from our master kitchens. Dedicated to exceptional flavor, temperature perfection, and culinary craft.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-amber-500/20 hover:text-amber-400 border border-white/10 flex items-center justify-center text-neutral-300 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-amber-500/20 hover:text-amber-400 border border-white/10 flex items-center justify-center text-neutral-300 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-amber-500/20 hover:text-amber-400 border border-white/10 flex items-center justify-center text-neutral-300 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#hero" className="hover:text-amber-300 transition-colors">
                  Grand Horizon
                </a>
              </li>
              <li>
                <a href="#categories" className="hover:text-amber-300 transition-colors">
                  Flavor Categories
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-amber-300 transition-colors">
                  Full Gastronomy Catalog
                </a>
              </li>
              <li>
                <a href="#featured" className="hover:text-amber-300 transition-colors">
                  Chef Spotlight
                </a>
              </li>
              <li>
                <a href="#popular" className="hover:text-amber-300 transition-colors">
                  Most Celebrated
                </a>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Laboratory Service Hours
            </h4>
            <div className="space-y-2 text-xs font-mono">
              <div>
                <span className="text-neutral-500 block">MON - THU:</span>
                <span className="text-neutral-200">11:30 AM — 11:00 PM</span>
              </div>
              <div>
                <span className="text-neutral-500 block">FRI - SAT:</span>
                <span className="text-amber-400">11:30 AM — 01:00 AM</span>
              </div>
              <div>
                <span className="text-neutral-500 block">SUNDAY:</span>
                <span className="text-neutral-200">12:00 PM — 10:30 PM</span>
              </div>
            </div>
          </div>

          {/* Contact Coordinates */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Lab Coordinates
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>888 Pavilion Center, Quantum Wing, Silicon District</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="font-mono">+1 (800) 580-BITE</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>concierge@bitewithtaste.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal & Live System Heartbeat */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-500">
          <p>© 2026 BITEWITHTASTE INC. ALL RIGHTS RESERVED.</p>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Kitchen Dispatch Systems Nominal
            </span>
            <span>•</span>
            <span className="hover:text-neutral-400 cursor-pointer">Privacy Protocol</span>
            <span>•</span>
            <span className="hover:text-neutral-400 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
