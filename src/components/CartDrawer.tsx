import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Tag, Loader2, Sparkles } from 'lucide-react';
import { useFood } from '../context/FoodContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateQuantity,
    removeFromCart,
    subtotal,
    deliveryFee,
    discountAmount,
    total,
    activePromo,
    applyPromo,
    placeOrder,
  } = useFood();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('Alexandra Thorne');
  const [address, setAddress] = useState('Skyline Penthouse 42B, Neo Horizon Blvd');
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'details'>('cart');

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromo(promoInput);
    if (!res.success) {
      setPromoError(res.message);
    } else {
      setPromoError(null);
      setPromoInput('');
    }
  };

  const handleFinalCheckout = async () => {
    if (!customerName.trim() || !address.trim()) {
      alert('Please enter your name and delivery address.');
      return;
    }

    setIsProcessingOrder(true);
    try {
      const result = await placeOrder({
        name: customerName,
        address,
      });

      if (!result.success) {
        alert(result.error || 'Checkout failed. Please try again.');
      }
    } finally {
      setIsProcessingOrder(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartOpen(false)}
          className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        />

        {/* Drawer Sliding from Right */}
        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="w-screen max-w-md bg-[#0D0F17] border-l border-white/10 shadow-2xl flex flex-col justify-between"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-white">Your Tasting Order</h3>
                  <p className="text-[11px] font-mono text-neutral-400">
                    {cart.length} unique {cart.length === 1 ? 'creation' : 'creations'} selected
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-xl bg-white/[0.04] text-neutral-400 hover:text-white transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List or Checkout Form */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-20 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto text-neutral-500">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h4 className="font-display text-lg text-white">Your cart is currently empty</h4>
                  <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                    Explore our curated categories and select high-end molecular gastronomy dishes to begin.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4 px-5 py-2.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold hover:bg-amber-500/20"
                  >
                    Browse Full Menu
                  </button>
                </div>
              ) : checkoutStep === 'cart' ? (
                <>
                  {/* Item Cards */}
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div
                        key={item.cartId}
                        className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/10 transition-all flex items-center gap-3"
                      >
                        {/* Thumbnail */}
                        <img
                          src={item.food.image}
                          alt={item.food.name}
                          className="w-16 h-16 rounded-xl object-cover shrink-0"
                        />

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h5 className="font-display font-bold text-sm text-white truncate">
                            {item.food.name}
                          </h5>
                          
                          {/* Customizations summary */}
                          {item.selectedCustomizations && Object.keys(item.selectedCustomizations).length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-0.5">
                              {Object.entries(item.selectedCustomizations).map(([k, v]) => (
                                <span key={k} className="text-[9px] font-mono text-amber-300/80 bg-white/[0.04] px-1.5 py-0.2 rounded">
                                  {v}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center justify-between mt-2">
                            <span className="font-mono font-bold text-sm text-amber-400">
                              ${item.itemTotal.toFixed(2)}
                            </span>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2 bg-black/40 px-2 py-1 rounded-lg border border-white/10">
                              <button
                                onClick={() => updateQuantity(item.cartId, -1)}
                                className="w-5 h-5 flex items-center justify-center text-neutral-400 hover:text-white"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="font-mono text-xs font-bold text-white w-4 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.cartId, 1)}
                                className="w-5 h-5 flex items-center justify-center text-neutral-400 hover:text-white"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.cartId)}
                          className="p-1.5 text-neutral-500 hover:text-rose-400 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Promo Code Input */}
                  <form onSubmit={handleApplyPromo} className="pt-2">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
                        <input
                          type="text"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                          placeholder="Promo code (e.g. AURA20)"
                          className="w-full pl-9 pr-3 py-2 bg-black/50 rounded-xl border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 uppercase font-mono"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-xs font-bold text-white transition-all"
                      >
                        Apply
                      </button>
                    </div>
                    {promoError && (
                      <p className="text-[11px] text-rose-400 mt-1 font-mono">{promoError}</p>
                    )}
                    {activePromo && (
                      <div className="mt-2 flex items-center justify-between text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                        <span>Code <strong>{activePromo.code}</strong> Applied</span>
                        <span>{activePromo.percent}% OFF</span>
                      </div>
                    )}
                  </form>
                </>
              ) : (
                /* Delivery details step */
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <h4 className="font-display font-bold text-white text-sm">Delivery Coordinates</h4>
                    <button
                      onClick={() => setCheckoutStep('cart')}
                      className="text-xs text-amber-400 hover:underline"
                    >
                      Edit Cart
                    </button>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-neutral-400 uppercase block mb-1">
                      Recipient Name
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-neutral-400 uppercase block mb-1">
                      Delivery Address / Suite
                    </label>
                    <textarea
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
                    />
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Hyper-Speed Precision Delivery Included</span>
                    </div>
                    <p className="text-[11px] text-neutral-300 font-light leading-relaxed">
                      Your order will be dispatched in a sealed thermal vacuum chamber maintained at optimal serving temperature.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer: Pricing Totals & Final Action */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-[#0A0C13] space-y-3">
                <div className="space-y-1.5 text-xs text-neutral-400">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Promo Discount ({activePromo?.percent}%)</span>
                      <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Thermal Courier Transit</span>
                    <span className="font-mono text-white">
                      {deliveryFee === 0 ? <span className="text-emerald-400">FREE</span> : `$${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-white/10 flex justify-between text-base font-extrabold text-white">
                    <span>Total Amount</span>
                    <span className="font-mono text-amber-400 text-lg">${total.toFixed(2)}</span>
                  </div>
                </div>

                {checkoutStep === 'cart' ? (
                  <button
                    onClick={() => setCheckoutStep('details')}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-black font-bold text-sm hover:shadow-[0_0_25px_rgba(245,158,11,0.35)] transition-all flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Delivery ({cart.length} items)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleFinalCheckout}
                    disabled={isProcessingOrder}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-bold text-sm hover:shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {isProcessingOrder ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Reserving Inventory & Queuing...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Authorize & Submit Order (${total.toFixed(2)})</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
