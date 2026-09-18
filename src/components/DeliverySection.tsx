import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Navigation, ShieldCheck, Thermometer, Clock, Zap, MapPin } from 'lucide-react';

export const DeliverySection: React.FC = () => {
  const [transitProgress, setTransitProgress] = useState(65);

  useEffect(() => {
    const interval = setInterval(() => {
      setTransitProgress((prev) => (prev >= 95 ? 20 : prev + 1));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="delivery" className="py-24 relative overflow-hidden bg-[#07080C]">
      {/* Glow background */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Tech Description & Metrics */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-mono uppercase tracking-widest">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Hyper-Speed Precision Logistics</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Surgical Dispatch. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-300 to-amber-300">
                18-Minute Horizon.
              </span>
            </h2>

            <p className="text-neutral-300 text-sm sm:text-base font-light leading-relaxed">
              Every creation leaves our kitchen inside our custom insulated telemetry pods. Dynamic thermal chambers preserve sear crispness, delicate emulsifications, and chilled gelato textures without condensation.
            </p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold">
                  <Thermometer className="w-4 h-4" />
                  <span>Dual-Zone Thermal Pods</span>
                </div>
                <p className="text-xs text-neutral-400 font-light">
                  Active heating preserves Wagyu at 65°C while isolated chambers keep botanical elixirs at 3°C.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold">
                  <Clock className="w-4 h-4" />
                  <span>Under 20 Mins Guaranteed</span>
                </div>
                <p className="text-xs text-neutral-400 font-light">
                  Algorithmically coordinated routing with dedicated high-speed urban couriers.
                </p>
              </div>
            </div>

            {/* Live Telemetry Bar */}
            <div className="p-4 rounded-2xl bg-[#0D101A] border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                </span>
                <div>
                  <span className="text-xs font-mono text-white font-bold block">Urban Fleet Active</span>
                  <span className="text-[10px] text-neutral-400 font-mono">98.4% on-time dispatch rate today</span>
                </div>
              </div>

              <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                14m 20s Avg ETA
              </span>
            </div>
          </div>

          {/* Right Column: Animated Cyber Delivery Map Simulation */}
          <div className="lg:col-span-6 relative">
            <div className="rounded-3xl bg-[#0C0E17] border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
              {/* Top Navigation Status */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-mono font-bold text-white uppercase">Live Fleet Route #742</h4>
                    <p className="text-[10px] text-neutral-400 font-mono">Courier: Falcon-09 • Electric Rapid Pod</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono text-emerald-400 font-bold block">12 MINS AWAY</span>
                  <span className="text-[10px] text-neutral-500 font-mono">65.2°C Temperature Locked</span>
                </div>
              </div>

              {/* Animated Map Graphic Container */}
              <div className="relative h-60 w-full rounded-2xl bg-[#08090E] border border-white/[0.06] overflow-hidden flex items-center justify-center p-4">
                {/* Cyber Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]" />

                {/* SVG Route Path */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200" fill="none">
                  {/* Background route glow */}
                  <path
                    d="M 40 160 C 120 160, 160 60, 260 80 C 310 90, 340 40, 370 40"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="4"
                    strokeDasharray="6 6"
                  />
                  {/* Active energized line */}
                  <path
                    d="M 40 160 C 120 160, 160 60, 260 80 C 310 90, 340 40, 370 40"
                    stroke="url(#routeGradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="routeGradient" x1="0" y1="1" x2="1" y2="0">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="50%" stopColor="#38BDF8" />
                      <stop offset="100%" stopColor="#F59E0B" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Origin Pin: Gastrolab Kitchen */}
                <div className="absolute bottom-6 left-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 text-xs font-mono font-bold shadow-lg">
                    Λ
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400 bg-black/60 px-2 py-0.5 rounded border border-white/10">
                    Aura Kitchen Lab
                  </span>
                </div>

                {/* Destination Pin: Guest Residence */}
                <div className="absolute top-6 right-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 text-xs shadow-lg">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-emerald-300 bg-black/60 px-2 py-0.5 rounded border border-emerald-500/30">
                    Your Penthouse
                  </span>
                </div>

                {/* Moving Courier Pod Simulation Marker */}
                <div
                  className="absolute transition-all duration-300"
                  style={{
                    left: `${transitProgress}%`,
                    top: `${140 - transitProgress * 1.1}px`,
                  }}
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-black font-bold shadow-[0_0_20px_rgba(16,185,129,0.7)]">
                      🛵
                    </div>
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                  </div>
                </div>
              </div>

              {/* Progress Bar with Steps */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-neutral-400">
                  <span className="text-emerald-400">● Kitchen Finished</span>
                  <span className="text-emerald-400">● Vacuum Sealed</span>
                  <span className="text-white font-bold">● In Transit</span>
                  <span className="text-neutral-600">○ Arrived</span>
                </div>
                <div className="h-2 w-full bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all duration-300"
                    style={{ width: `${transitProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
