import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Package, 
  Clock, 
  RotateCcw, 
  MapPin, 
  CheckCircle2, 
  UtensilsCrossed, 
  ChevronRight, 
  Trash2,
  Receipt,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useFood } from '../context/FoodContext';
import { animateDrawerSlideIn } from '../utils/animeAnimations';

export const OrdersDrawer: React.FC = () => {
  const { 
    isOrderHistoryOpen, 
    setIsOrderHistoryOpen, 
    ordersHistory, 
    activeOrder, 
    setIsTrackingOpen, 
    reorder, 
    clearOrderHistory 
  } = useFood();

  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOrderHistoryOpen && drawerRef.current) {
      animateDrawerSlideIn(drawerRef.current);
    }
  }, [isOrderHistoryOpen]);

  return (
    <AnimatePresence>
      {isOrderHistoryOpen && (
        <div id="orders-slide-bar-container" className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOrderHistoryOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
          />

          {/* Slide Bar Drawer */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
            <div
              ref={drawerRef}
              className="w-screen max-w-md bg-[#0D0F17] border-l border-neutral-800/80 shadow-2xl flex flex-col justify-between relative text-neutral-100"
            >
              {/* Header */}
              <div className="p-5 sm:p-6 border-b border-neutral-800/80 flex items-center justify-between bg-[#111420]/80 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold font-display tracking-tight text-white flex items-center gap-2">
                      Orders Vault
                      <span className="text-xs font-sans px-2 py-0.5 rounded-full bg-neutral-800 text-amber-400 border border-amber-500/20 font-medium">
                        {ordersHistory.length}
                      </span>
                    </h2>
                    <p className="text-xs text-neutral-400">
                      Saved locally & synced with Kitchen Gateway
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {ordersHistory.length > 0 && (
                    <button
                      onClick={clearOrderHistory}
                      title="Clear History"
                      className="p-2 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-neutral-800/60 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setIsOrderHistoryOpen(false)}
                    className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800/80 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {/* Active Order Spotlight */}
                {activeOrder && (
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/15 via-[#161A28] to-[#121520] border border-amber-500/40 shadow-lg relative overflow-hidden">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                        </span>
                        <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                          Active In Preparation
                        </span>
                      </div>
                      <span className="text-xs font-mono text-neutral-400">#{activeOrder.id}</span>
                    </div>

                    <div className="mb-3">
                      <h4 className="font-semibold text-white text-sm">
                        {activeOrder.items.length} dishes in queue
                      </h4>
                      <p className="text-xs text-neutral-400 flex items-center gap-1.5 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{activeOrder.address}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-amber-500/20">
                      <span className="font-bold text-amber-400 text-base font-mono">
                        ${activeOrder.total.toFixed(2)}
                      </span>
                      <button
                        onClick={() => {
                          setIsOrderHistoryOpen(false);
                          setIsTrackingOpen(true);
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-md"
                      >
                        Track Live
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Orders List */}
                {ordersHistory.length === 0 && !activeOrder ? (
                  <div className="text-center py-16 px-4">
                    <div className="w-16 h-16 rounded-2xl bg-neutral-800/60 border border-neutral-700/50 mx-auto flex items-center justify-center text-neutral-500 mb-4">
                      <UtensilsCrossed className="w-8 h-8 opacity-40" />
                    </div>
                    <h3 className="text-base font-semibold text-white mb-1 font-display">
                      No saved orders yet
                    </h3>
                    <p className="text-sm text-neutral-400 max-w-xs mx-auto mb-6 leading-relaxed">
                      Every order you place is automatically saved right here in your Orders Vault so you can track, review, and reorder anytime.
                    </p>
                    <button
                      onClick={() => setIsOrderHistoryOpen(false)}
                      className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-sm transition-colors border border-neutral-700"
                    >
                      Explore Menu
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-neutral-400 font-medium px-1 pt-1">
                      <span>SAVED ORDER HISTORY</span>
                      <span>{ordersHistory.length} TOTAL</span>
                    </div>

                    {ordersHistory.map((order) => {
                      const dateFormatted = new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      });

                      const statusColor = 
                        order.status === 'delivered' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                        order.status === 'in_transit' ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' :
                        'text-amber-400 bg-amber-500/10 border-amber-500/20';

                      return (
                        <div
                          key={order.id}
                          className="p-4 rounded-xl bg-[#131622] border border-neutral-800/80 hover:border-neutral-700/80 transition-all space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-mono font-bold text-white text-sm">
                                #{order.id}
                              </span>
                              <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-0.5">
                                <Clock className="w-3 h-3 text-neutral-500" />
                                {dateFormatted}
                              </div>
                            </div>

                            <span className={`text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full border ${statusColor}`}>
                              {order.status.replace('_', ' ')}
                            </span>
                          </div>

                          {/* Items summary */}
                          <div className="space-y-1.5 py-1 text-xs border-y border-neutral-800/60">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center text-neutral-300">
                                <span className="truncate pr-2">
                                  <span className="font-semibold text-amber-400/90">{item.quantity}x</span> {item.name}
                                </span>
                                <span className="font-mono text-neutral-400 shrink-0">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <div>
                              <span className="text-xs text-neutral-400 block">Total</span>
                              <span className="font-mono font-bold text-white text-base">
                                ${order.total.toFixed(2)}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setIsOrderHistoryOpen(false);
                                  setIsTrackingOpen(true);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-medium transition-colors"
                              >
                                View Status
                              </button>
                              <button
                                onClick={() => reorder(order)}
                                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs transition-colors flex items-center gap-1 shadow-sm"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                Reorder
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer Banner */}
              <div className="p-4 border-t border-neutral-800/80 bg-[#10121D]">
                <div className="flex items-center gap-3 text-xs text-neutral-400">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <p>Orders are automatically recorded and backed up to your browser session & Aura Gastrolab server.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
