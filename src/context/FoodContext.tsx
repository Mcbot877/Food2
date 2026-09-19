import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { FoodItem, CartItem, FoodCategory, Order } from '../types';
import { INITIAL_FOOD_ITEMS, PROMO_OFFERS } from '../data/mockData';
import { triggerCartParticleBurst, triggerCelebrationConfetti } from '../utils/confetti';

interface FoodContextType {
  foodItems: FoodItem[];
  inventory: Record<string, number>;
  cart: CartItem[];
  favorites: string[];
  selectedCategory: FoodCategory | 'All';
  isCartOpen: boolean;
  isSearchOpen: boolean;
  isAIOpen: boolean;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  adminOrders: Order[];
  fetchAdminOrders: () => Promise<void>;
  isAdminLoading: boolean;
  markOrderAsDelivered: (orderId: string) => Promise<{ success: boolean; error?: string }>;
  seedDemoOrders: () => Promise<{ success: boolean; message: string }>;
  activeDetailDish: FoodItem | null;
  activeOrder: Order | null;
  isTrackingOpen: boolean;
  ordersHistory: Order[];
  isOrderHistoryOpen: boolean;
  isProductManagerOpen: boolean;
  setIsProductManagerOpen: (open: boolean) => void;
  addCustomDish: (dish: Omit<FoodItem, 'id'>) => void;
  updateDish: (id: string, updates: Partial<FoodItem>) => void;
  deleteDish: (id: string) => void;
  resetDefaultProducts: () => void;
  setIsOrderHistoryOpen: (open: boolean) => void;
  reorder: (order: Order) => void;
  clearOrderHistory: () => void;
  activePromo: { code: string; percent: number; freeDelivery?: boolean } | null;
  toastMessage: string | null;
  setSelectedCategory: (cat: FoodCategory | 'All') => void;
  setIsCartOpen: (open: boolean) => void;
  setIsSearchOpen: (open: boolean) => void;
  setIsAIOpen: (open: boolean) => void;
  setActiveDetailDish: (dish: FoodItem | null) => void;
  setIsTrackingOpen: (open: boolean) => void;
  setActiveOrder: (order: Order | null) => void;
  showToast: (msg: string) => void;
  addToCart: (
    food: FoodItem,
    quantity?: number,
    customizations?: Record<string, string>,
    event?: React.MouseEvent
  ) => void;
  updateQuantity: (cartId: string, delta: number) => void;
  removeFromCart: (cartId: string) => void;
  toggleFavorite: (foodId: string) => void;
  applyPromo: (code: string) => { success: boolean; message: string };
  placeOrder: (customer: { name: string; address: string }) => Promise<{ success: boolean; order?: Order; error?: string }>;
  cartTotalCount: number;
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  total: number;
}

const FoodContext = createContext<FoodContextType | null>(null);

export const FoodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Initialize product catalog directly from website local storage
  const [foodItems, setFoodItems] = useState<FoodItem[]>(() => {
    try {
      const local = localStorage.getItem('bitewithtaste_products');
      if (local) {
        const parsed = JSON.parse(local);
        // Hydrate full catalog if user previously had fewer than 20 items
        if (Array.isArray(parsed) && parsed.length >= 25) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed reading bitewithtaste_products from localStorage', e);
    }
    return INITIAL_FOOD_ITEMS;
  });

  // 2. Initialize inventory from website local storage
  const [inventory, setInventory] = useState<Record<string, number>>(() => {
    try {
      const local = localStorage.getItem('bitewithtaste_inventory');
      if (local) {
        const parsed = JSON.parse(local);
        if (parsed && typeof parsed === 'object' && Object.keys(parsed).length >= 25) {
          return parsed;
        }
      }
    } catch (e) {}

    const map: Record<string, number> = {};
    INITIAL_FOOD_ITEMS.forEach((f) => {
      map[f.id] = f.inStock;
    });
    return map;
  });

  // Automatically sync and persist food items whenever changed
  useEffect(() => {
    try {
      localStorage.setItem('bitewithtaste_products', JSON.stringify(foodItems));
    } catch (e) {
      console.error('Failed to persist products to localStorage', e);
    }
  }, [foodItems]);

  // Automatically sync and persist inventory whenever changed
  useEffect(() => {
    try {
      localStorage.setItem('bitewithtaste_inventory', JSON.stringify(inventory));
    } catch (e) {
      console.error('Failed to persist inventory to localStorage', e);
    }
  }, [inventory]);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const local = localStorage.getItem('aura_cart');
      return local ? JSON.parse(local) : [];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const local = localStorage.getItem('aura_favorites');
      return local ? JSON.parse(local) : ['dish-1', 'dish-5'];
    } catch {
      return ['dish-1', 'dish-5'];
    }
  });

  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | 'All'>('All');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminOrders, setAdminOrders] = useState<Order[]>([]);
  const [isAdminLoading, setIsAdminLoading] = useState(false);
  const [isProductManagerOpen, setIsProductManagerOpen] = useState(false);
  const [activeDetailDish, setActiveDetailDish] = useState<FoodItem | null>(null);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [ordersHistory, setOrdersHistory] = useState<Order[]>(() => {
    try {
      const local = localStorage.getItem('aura_orders_history');
      return local ? JSON.parse(local) : [];
    } catch {
      return [];
    }
  });
  const [activePromo, setActivePromo] = useState<{ code: string; percent: number; freeDelivery?: boolean } | null>({
    code: 'AURA20',
    percent: 20,
    freeDelivery: false,
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  }, []);

  const fetchAdminOrders = useCallback(async () => {
    setIsAdminLoading(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        if (data.orders && Array.isArray(data.orders)) {
          setAdminOrders(data.orders);
        }
      }
    } catch (err) {
      console.error('Failed to fetch orders from database:', err);
    } finally {
      setIsAdminLoading(false);
    }
  }, []);

  const markOrderAsDelivered = async (orderId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}/deliver`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to update order in database.' };
      }

      const deliveredTime = data.order?.deliveredAt || new Date().toISOString();

      // Update admin orders list
      setAdminOrders((prev) =>
        prev.map((ord): Order => (ord.id === orderId ? { ...ord, status: 'delivered' as const, deliveredAt: deliveredTime } : ord))
      );

      // Update user order history as well
      setOrdersHistory((prev) => {
        const updated: Order[] = prev.map((ord): Order =>
          ord.id === orderId ? { ...ord, status: 'delivered' as const, deliveredAt: deliveredTime } : ord
        );
        try {
          localStorage.setItem('aura_orders_history', JSON.stringify(updated));
        } catch {}
        return updated;
      });

      // Update active order if it's currently tracked
      setActiveOrder((prev) =>
        prev?.id === orderId ? { ...prev, status: 'delivered' as const, deliveredAt: deliveredTime } : prev
      );

      showToast(`Order #${orderId} marked as Delivered in database! ✓`);
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Database network communication error.' };
    }
  };

  const seedDemoOrders = async (): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('/api/orders/seed', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.orders) {
        setAdminOrders(data.orders);
        showToast('Fresh operational orders loaded into database!');
        return { success: true, message: data.message };
      }
      return { success: false, message: data.error || 'Failed to seed orders' };
    } catch (e: any) {
      return { success: false, message: e.message || 'Server error' };
    }
  };

  // Fetch real-time inventory from backend
  const fetchInventory = useCallback(async () => {
    try {
      const res = await fetch('/api/inventory');
      if (res.ok) {
        const data = await res.json();
        if (data.inventory) {
          setInventory(data.inventory);
          // Sync with food items
          setFoodItems((prev) =>
            prev.map((item) => ({
              ...item,
              inStock: data.inventory[item.id] !== undefined ? data.inventory[item.id] : item.inStock,
            }))
          );
        }
      }
    } catch (e) {
      // Offline fallback
    }
  }, []);

  useEffect(() => {
    fetchInventory();
    const interval = setInterval(fetchInventory, 12000); // Live poll for peak traffic inventory updates
    return () => clearInterval(interval);
  }, [fetchInventory]);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('aura_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  // Persist favorites
  useEffect(() => {
    try {
      localStorage.setItem('aura_favorites', JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  const toggleFavorite = (foodId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(foodId);
      const updated = exists ? prev.filter((id) => id !== foodId) : [...prev, foodId];
      showToast(exists ? 'Removed from your culinary vault' : 'Saved to your culinary vault ★');
      return updated;
    });
  };

  const addToCart = (
    food: FoodItem,
    quantity = 1,
    customizations: Record<string, string> = {},
    event?: React.MouseEvent
  ) => {
    const availableStock = inventory[food.id] ?? food.inStock;
    if (availableStock <= 0) {
      showToast(`⚠️ ${food.name} is temporarily sold out for this service.`);
      return;
    }

    // Trigger visual particle burst
    if (event) {
      triggerCartParticleBurst(event.clientX, event.clientY);
    } else {
      triggerCartParticleBurst();
    }

    // Calculate extra customization price
    let extraPrice = 0;
    if (food.customizations) {
      food.customizations.forEach((c) => {
        const selectedVal = customizations[c.id];
        if (selectedVal) {
          const opt = c.options.find((o) => o.label === selectedVal);
          if (opt) extraPrice += opt.extraPrice;
        }
      });
    }

    const unitPrice = food.price + extraPrice;
    const cartId = `${food.id}-${JSON.stringify(customizations)}`;

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.cartId === cartId);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          itemTotal: newQty * unitPrice,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            cartId,
            foodId: food.id,
            food,
            quantity,
            selectedCustomizations: customizations,
            itemTotal: quantity * unitPrice,
          },
        ];
      }
    });

    showToast(`Added ${quantity}x ${food.name} to Cart`);
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.cartId === cartId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            const singleUnitPrice = item.itemTotal / item.quantity;
            return {
              ...item,
              quantity: newQty,
              itemTotal: newQty * singleUnitPrice,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (cartId: string) => {
    setCart((prev) => prev.filter((i) => i.cartId !== cartId));
    showToast('Dish removed from cart');
  };

  const applyPromo = (code: string) => {
    const clean = code.trim().toUpperCase();
    const offer = PROMO_OFFERS.find((p) => p.code.toUpperCase() === clean);
    if (!offer) {
      return { success: false, message: 'Invalid promo authorization code.' };
    }
    setActivePromo({
      code: offer.code,
      percent: offer.discountPercent || 0,
      freeDelivery: offer.freeDelivery || false,
    });
    showToast(`Promo ${offer.code} activated (${offer.badge})`);
    return { success: true, message: `Activated ${offer.badge}` };
  };

  const cartTotalCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  const subtotal = cart.reduce((acc, curr) => acc + curr.itemTotal, 0);

  const isFreeDelivery = (activePromo?.freeDelivery || subtotal > 35) && subtotal > 0;
  const deliveryFee = subtotal === 0 ? 0 : isFreeDelivery ? 0 : 4.5;
  const discountAmount = activePromo?.percent ? (subtotal * activePromo.percent) / 100 : 0;
  const total = Math.max(0, subtotal - discountAmount + deliveryFee);

  const placeOrder = async (customer: { name: string; address: string }): Promise<{ success: boolean; order?: Order; error?: string }> => {
    if (cart.length === 0) {
      return { success: false, error: 'Your cart is empty' };
    }

    try {
      const payload = {
        items: cart.map((c) => ({
          foodId: c.foodId,
          name: c.food.name,
          price: c.itemTotal / c.quantity,
          quantity: c.quantity,
          selectedCustomizations: c.selectedCustomizations,
        })),
        customerName: customer.name,
        address: customer.address,
        discount: discountAmount,
        deliveryFee,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'High traffic order congestion. Please retry.' };
      }

      if (data.success && data.order) {
        const newOrder = data.order;
        setActiveOrder(newOrder);
        setOrdersHistory((prev) => {
          const filtered = prev.filter((o) => o.id !== newOrder.id);
          const updated = [newOrder, ...filtered];
          try {
            localStorage.setItem('aura_orders_history', JSON.stringify(updated));
          } catch {}
          return updated;
        });
        setCart([]);
        setIsCartOpen(false);
        setIsTrackingOpen(true);
        triggerCelebrationConfetti();
        if (data.updatedInventory) {
          setInventory(data.updatedInventory);
        }
        showToast(`Order #${newOrder.id} confirmed & saved to Order Vault!`);
        return { success: true, order: newOrder };
      }
      return { success: false, error: 'Could not process order.' };
    } catch (err: any) {
      return { success: false, error: 'Network communication glitch with order gateway.' };
    }
  };

  // Reorder past order items
  const reorder = (pastOrder: Order) => {
    let addedCount = 0;
    pastOrder.items.forEach((item) => {
      const food = foodItems.find((f) => f.id === item.foodId);
      if (food) {
        addToCart(food, item.quantity, item.selectedCustomizations);
        addedCount += item.quantity;
      }
    });
    if (addedCount > 0) {
      setIsOrderHistoryOpen(false);
      setIsCartOpen(true);
      showToast(`Restored ${addedCount} items from Order #${pastOrder.id} to Cart!`);
    } else {
      showToast('Items from this order are currently unavailable.');
    }
  };

  const clearOrderHistory = () => {
    setOrdersHistory([]);
    try {
      localStorage.removeItem('aura_orders_history');
    } catch {}
    showToast('Orders vault history cleared.');
  };

  // Local Product Data Vault Actions (Connected to localStorage)
  const addCustomDish = (newDish: Omit<FoodItem, 'id'>) => {
    const id = `dish-custom-${Date.now()}`;
    const dishWithId: FoodItem = {
      ...newDish,
      id,
      inStock: newDish.inStock ?? 20,
    };
    setFoodItems((prev) => [dishWithId, ...prev]);
    setInventory((prev) => ({ ...prev, [id]: dishWithId.inStock }));
    showToast(`Added "${newDish.name}" to website local products!`);
  };

  const updateDish = (id: string, updates: Partial<FoodItem>) => {
    setFoodItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
    if (updates.inStock !== undefined) {
      setInventory((prev) => ({ ...prev, [id]: updates.inStock! }));
    }
    showToast(`Product updated in local storage!`);
  };

  const deleteDish = (id: string) => {
    setFoodItems((prev) => prev.filter((item) => item.id !== id));
    setInventory((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    showToast('Product removed from local data.');
  };

  const resetDefaultProducts = () => {
    try {
      localStorage.removeItem('bitewithtaste_products');
      localStorage.removeItem('bitewithtaste_inventory');
    } catch {}
    setFoodItems(INITIAL_FOOD_ITEMS);
    const map: Record<string, number> = {};
    INITIAL_FOOD_ITEMS.forEach((f) => {
      map[f.id] = f.inStock;
    });
    setInventory(map);
    showToast('Restored default menu to website local data.');
  };

  // Fetch initial orders from server if any
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        if (res.ok) {
          const data = await res.json();
          if (data.orders && Array.isArray(data.orders) && data.orders.length > 0) {
            setOrdersHistory((prev) => {
              const combined = [...data.orders, ...prev];
              const seen = new Set();
              const deduped = combined.filter((o) => {
                if (seen.has(o.id)) return false;
                seen.add(o.id);
                return true;
              });
              try {
                localStorage.setItem('aura_orders_history', JSON.stringify(deduped));
              } catch {}
              return deduped;
            });
          }
        }
      } catch {}
    };
    fetchOrders();
  }, []);

  return (
    <FoodContext.Provider
      value={{
        foodItems,
        inventory,
        cart,
        favorites,
        selectedCategory,
        isCartOpen,
        isSearchOpen,
        isAIOpen,
        isAdminOpen,
        setIsAdminOpen,
        adminOrders,
        fetchAdminOrders,
        isAdminLoading,
        markOrderAsDelivered,
        seedDemoOrders,
        activeDetailDish,
        activeOrder,
        isTrackingOpen,
        ordersHistory,
        isOrderHistoryOpen,
        isProductManagerOpen,
        setIsProductManagerOpen,
        addCustomDish,
        updateDish,
        deleteDish,
        resetDefaultProducts,
        setIsOrderHistoryOpen,
        reorder,
        clearOrderHistory,
        activePromo,
        toastMessage,
        setSelectedCategory,
        setIsCartOpen,
        setIsSearchOpen,
        setIsAIOpen,
        setActiveDetailDish,
        setIsTrackingOpen,
        setActiveOrder,
        showToast,
        addToCart,
        updateQuantity,
        removeFromCart,
        toggleFavorite,
        applyPromo,
        placeOrder,
        cartTotalCount,
        subtotal,
        deliveryFee,
        discountAmount,
        total,
      }}
    >
      {children}
    </FoodContext.Provider>
  );
};

export const useFood = () => {
  const context = useContext(FoodContext);
  if (!context) {
    throw new Error('useFood must be used within FoodProvider');
  }
  return context;
};
