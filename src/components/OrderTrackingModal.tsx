import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, Clock, ChefHat, Sparkles, Navigation, Thermometer, ShieldCheck } from 'lucide-react';
import { useFood } from '../context/FoodContext';

export const OrderTrackingModal: React.FC = () => {
  const { activeOrder, isTrackingOpen, setIsTrackingOpen, setActiveOrder } = useFood();
  const [currentStatus, setCurrentStatus] = useState<'queued' | 'preparing' | 'plating' | 'in_transit' | 'delivered'>('queued');

  useEffect(() => {
    if (!activeOrder) return;
    setCurrentStatus(activeOrder.status);

    // Poll status from server
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${activeOrder.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.order) {
            setCurrentStatus(data.order.status);
            setActiveOrder(data.order);
          }
        }
      } catch (e) {}
    }, 3000);

    return () => clearInterval(interval);
  }, [activeOrder, setActiveOrder]);

  if (!isTrackingOpen || !activeOrder) return null;

  const steps = [
    { id: 'queued', label: 'Order Queued', desc: 'Atomic inventory verified' },
    { id: 'preparing', label: 'Sous-Vide & Sear', desc: '480°C hearth activation' },
    { id: 'plating', label: 'Plating & Cryo-QC', desc: 'Chef inspection passed' },
    { id: 'in_transit', label: 'In Thermal Transit', desc: 'Courier dispatch active' },
    { id: 'delivered', label: 'Delivered', desc: 'Served at peak temperature' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStatus);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsTrackingOpen(false)}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          className="relative w-full max-w-xl bg-[#0D0F18] border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 z-10 space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  {activeOrder.id}
                </span>
                <span className="text-xs font-mono text-neutral-400">Rapid Order Processing Active</span>
              </div>
              <h3 className="font-display font-bold text-xl text-white mt-1">Live Kitchen & Courier Stream</h3>
            </div>

            <button
              onClick={() => setIsTrackingOpen(false)}
              className="p-2 rounded-xl bg-white/[0.05] text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ETA Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Clock className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <p className="text-[11px] font-mono text-neutral-400 uppercase">Estimated Arrival</p>
                <p className="text-xl font-bold font-mono text-white">
                  {activeOrder.estimatedMinutes} Minutes
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-500/30 block">
                Insulated Pod: 65°C Locked
              </span>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="space-y-4 py-2">
            {steps.map((step, idx) => {
              const isCompleted = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div key={step.id} className="flex items-start gap-3.5 relative">
                  {/* Vertical connector line */}
                  {idx < steps.length - 1 && (
                    <div
                      className={`absolute left-4 top-8 w-0.5 h-8 transition-colors ${
                        idx < currentStepIndex ? 'bg-emerald-400' : 'bg-white/10'
                      }`}
                    />
                  )}

                  {/* Step icon */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${
                      isCompleted
                        ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/30'
                        : isCurrent
                        ? 'bg-amber-400 text-black ring-4 ring-amber-400/20 shadow-md shadow-amber-400/40 animate-pulse'
                        : 'bg-white/10 text-neutral-500'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <span className="text-xs font-mono font-bold">{idx + 1}</span>
                    )}
                  </div>

                  {/* Step Details */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-bold font-display ${
                        isCurrent ? 'text-amber-300' : isCompleted ? 'text-white' : 'text-neutral-500'
                      }`}
                    >
                      {step.label}
                    </p>
                    <p className="text-xs text-neutral-400 font-light mt-0.5">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Items Summary */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-neutral-400 pb-2 border-b border-white/[0.06]">
              <span>Destination: {activeOrder.address}</span>
              <span className="text-amber-400 font-bold">${activeOrder.total.toFixed(2)} Total</span>
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {activeOrder.items.map((it, i) => (
                <div key={i} className="flex justify-between text-xs text-neutral-300">
                  <span>
                    {it.quantity}x {it.name}
                  </span>
                  <span className="font-mono">${(it.price * it.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
