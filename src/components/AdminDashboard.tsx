import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Package,
  Search,
  Filter,
  RefreshCw,
  LayoutGrid,
  Table as TableIcon,
  DollarSign,
  TrendingUp,
  MapPin,
  Calendar,
  Sparkles,
  Phone,
  User,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Database,
  X,
  AlertCircle
} from 'lucide-react';
import { useFood } from '../context/FoodContext';
import { Order } from '../types';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    adminOrders,
    fetchAdminOrders,
    isAdminLoading,
    markOrderAsDelivered,
    seedDemoOrders,
    showToast,
  } = useFood();

  const [activeTab, setActiveTab] = useState<'active' | 'history' | 'all'>('active');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [deliveringId, setDeliveringId] = useState<string | null>(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // Fetch orders whenever dashboard opens
  useEffect(() => {
    if (isAdminOpen) {
      fetchAdminOrders();
    }
  }, [isAdminOpen, fetchAdminOrders]);

  // Calculations for Admin KPIs
  const activeOrders = useMemo(() => {
    return adminOrders.filter((o) => o.status !== 'delivered');
  }, [adminOrders]);

  const deliveredOrders = useMemo(() => {
    return adminOrders.filter((o) => o.status === 'delivered');
  }, [adminOrders]);

  const totalRevenue = useMemo(() => {
    return adminOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  }, [adminOrders]);

  const activeRevenue = useMemo(() => {
    return activeOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  }, [activeOrders]);

  // Filtered orders list depending on active tab & search query
  const displayedOrders = useMemo(() => {
    let list: Order[] = [];
    if (activeTab === 'active') {
      list = activeOrders;
    } else if (activeTab === 'history') {
      list = deliveredOrders;
    } else {
      list = adminOrders;
    }

    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase().trim();
    return list.filter((order) => {
      const matchId = order.id.toLowerCase().includes(q);
      const matchCustomer = (order.customerName || '').toLowerCase().includes(q);
      const matchAddress = (order.address || '').toLowerCase().includes(q);
      const matchItems = order.items.some((item) =>
        item.name.toLowerCase().includes(q)
      );
      return matchId || matchCustomer || matchAddress || matchItems;
    });
  }, [activeTab, activeOrders, deliveredOrders, adminOrders, searchQuery]);

  const handleMarkAsDelivered = async (orderId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDeliveringId(orderId);
    try {
      const res = await markOrderAsDelivered(orderId);
      if (res.success) {
        // If the details modal is open for this order, update it
        if (selectedOrderDetails?.id === orderId) {
          setSelectedOrderDetails((prev) =>
            prev ? { ...prev, status: 'delivered', deliveredAt: new Date().toISOString() } : null
          );
        }
      } else {
        showToast(res.error || 'Failed to update order status.');
      }
    } finally {
      setDeliveringId(null);
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Delivered
          </span>
        );
      case 'in_transit':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/30 animate-pulse">
            <Clock className="w-3.5 h-3.5" />
            In Transit (Active)
          </span>
        );
      case 'plating':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            Plating (Kitchen)
          </span>
        );
      case 'preparing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5" />
            Kitchen Prep
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <Package className="w-3.5 h-3.5" />
            Incoming Queued
          </span>
        );
    }
  };

  if (!isAdminOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6 bg-black/80 backdrop-blur-md overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-7xl h-[94vh] bg-[#0d1117] border border-amber-500/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-zinc-100"
      >
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-gradient-to-r from-zinc-900/90 via-[#0d1117] to-zinc-900/90 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <ShieldCheck className="w-6 h-6 text-zinc-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white">
                  Order Management Admin Dashboard
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <Database className="w-3 h-3" /> Live Database Connected
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Real-time incoming orders dispatch, database synchronization, & past history archive.
              </p>
            </div>
          </div>

          {/* Quick Actions & Close */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
            <button
              id="admin-seed-btn"
              onClick={() => seedDemoOrders()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800/90 hover:bg-zinc-700 text-amber-300 border border-amber-500/30 transition-colors shadow-sm"
              title="Add sample incoming & past orders to database"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Seed Demo Orders</span>
            </button>

            <button
              id="admin-refresh-btn"
              onClick={() => fetchAdminOrders()}
              disabled={isAdminLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAdminLoading ? 'animate-spin text-amber-400' : ''}`} />
              <span>Sync DB</span>
            </button>

            <button
              id="admin-close-btn"
              onClick={() => setIsAdminOpen(false)}
              className="w-8 h-8 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
              aria-label="Close Admin Dashboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Operational Statistics Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 px-6 py-3.5 border-b border-zinc-800/80 bg-zinc-950/40">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/70">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">Incoming Active</p>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-amber-400">{activeOrders.length}</span>
                <span className="text-xs text-zinc-500">requiring delivery</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/70">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">Past Delivered</p>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-emerald-400">{deliveredOrders.length}</span>
                <span className="text-xs text-zinc-500">completed</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/70">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">Total Revenue</p>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-white">${totalRevenue.toFixed(2)}</span>
                <span className="text-xs text-zinc-500">from {adminOrders.length} orders</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/70">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">Active Pipeline</p>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-purple-300">${activeRevenue.toFixed(2)}</span>
                <span className="text-xs text-zinc-500">in preparation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter, Tabs, and View Switcher Control Strip */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between px-6 py-3 border-b border-zinc-800/80 bg-zinc-900/40 gap-3">
          {/* Tabs: Active vs Past History */}
          <div className="flex items-center p-1 bg-zinc-900 rounded-xl border border-zinc-800">
            <button
              id="admin-tab-active"
              onClick={() => setActiveTab('active')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'active'
                  ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>Incoming Active Orders</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeTab === 'active'
                    ? 'bg-zinc-950 text-amber-400'
                    : 'bg-amber-500/20 text-amber-300'
                }`}
              >
                {activeOrders.length}
              </span>
            </button>

            <button
              id="admin-tab-history"
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'history'
                  ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>Past History (Delivered)</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeTab === 'history'
                    ? 'bg-zinc-950 text-emerald-400'
                    : 'bg-emerald-500/20 text-emerald-300'
                }`}
              >
                {deliveredOrders.length}
              </span>
            </button>

            <button
              id="admin-tab-all"
              onClick={() => setActiveTab('all')}
              className={`hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-zinc-700 text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>All Orders</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-zinc-800 text-zinc-300">
                {adminOrders.length}
              </span>
            </button>
          </div>

          {/* Search Input & Layout Mode */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="admin-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search order ID, guest, items..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1">
              <button
                id="admin-view-cards"
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'cards' ? 'bg-zinc-800 text-amber-400' : 'text-zinc-500 hover:text-zinc-300'
                }`}
                title="Grid Cards Layout"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                id="admin-view-table"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'table' ? 'bg-zinc-800 text-amber-400' : 'text-zinc-500 hover:text-zinc-300'
                }`}
                title="Dense Table Layout"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Body: Orders Display */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0a0d13]">
          {displayedOrders.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 border border-dashed border-zinc-800 rounded-2xl bg-zinc-950/30">
              <div className="w-16 h-16 rounded-full bg-zinc-900/90 border border-zinc-800 flex items-center justify-center mb-4 text-zinc-500">
                {activeTab === 'active' ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                ) : (
                  <ShoppingBag className="w-8 h-8 text-zinc-500" />
                )}
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                {activeTab === 'active'
                  ? 'All Incoming Orders Delivered!'
                  : activeTab === 'history'
                  ? 'No Past Delivered Orders in Record'
                  : 'No Orders Found'}
              </h3>
              <p className="text-xs text-zinc-400 max-w-sm mb-6">
                {activeTab === 'active'
                  ? 'Outstanding work! There are currently zero pending active deliveries. New customer orders will appear here automatically.'
                  : 'Delivered orders will appear in this history archive as soon as you mark active incoming orders as delivered.'}
              </p>
              {activeTab === 'active' && (
                <button
                  id="admin-empty-seed-btn"
                  onClick={() => seedDemoOrders()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-xs transition-colors shadow-lg shadow-amber-500/20"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Test Orders in Database</span>
                </button>
              )}
            </div>
          ) : viewMode === 'cards' ? (
            /* Cards View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {displayedOrders.map((order) => {
                  const isDelivering = deliveringId === order.id;
                  const isActive = order.status !== 'delivered';

                  return (
                    <motion.div
                      key={order.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                      className={`flex flex-col justify-between p-4 rounded-2xl border transition-all duration-200 ${
                        isActive
                          ? 'bg-zinc-900/70 border-amber-500/30 hover:border-amber-500/50 shadow-lg shadow-black/40'
                          : 'bg-zinc-950/60 border-zinc-800/80 opacity-90'
                      }`}
                    >
                      <div>
                        {/* Order Header */}
                        <div className="flex items-start justify-between gap-2 pb-3 border-b border-zinc-800/70">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                                {order.id}
                              </span>
                              <span className="text-[11px] text-zinc-400">
                                {new Date(order.createdAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            <h4 className="font-semibold text-white text-sm mt-1.5 flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-zinc-400" />
                              {order.customerName}
                            </h4>
                          </div>
                          <div>{getStatusBadge(order.status)}</div>
                        </div>

                        {/* Customer & Location */}
                        <div className="py-2.5 text-xs text-zinc-400 space-y-1">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
                            <span className="truncate">{order.address}</span>
                          </div>
                          {order.phone && (
                            <div className="flex items-center gap-1.5 text-zinc-400">
                              <Phone className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                              <span>{order.phone}</span>
                            </div>
                          )}
                        </div>

                        {/* Items Preview */}
                        <div className="py-2.5 px-3 rounded-xl bg-zinc-950/60 border border-zinc-800/60 space-y-1.5">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 flex items-center justify-between">
                            <span>Ordered Items ({order.items.reduce((s, i) => s + i.quantity, 0)})</span>
                            <span className="text-zinc-400 font-mono">Qty x Price</span>
                          </p>
                          <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                            {order.items.map((item, idx) => (
                              <div
                                key={`${item.foodId}-${idx}`}
                                className="flex items-center justify-between text-xs text-zinc-300"
                              >
                                <span className="truncate pr-2">
                                  <span className="font-bold text-amber-400">{item.quantity}x</span>{' '}
                                  {item.name}
                                </span>
                                <span className="font-mono text-zinc-400 shrink-0">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Card Footer with Total & Action Button */}
                      <div className="pt-3.5 mt-3 border-t border-zinc-800/80 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[10px] text-zinc-400 uppercase font-medium">Total Amount</p>
                          <p className="text-base font-bold font-mono text-white">
                            ${order.total.toFixed(2)}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            id={`view-order-btn-${order.id}`}
                            onClick={() => setSelectedOrderDetails(order)}
                            className="px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors"
                            title="View Full Order Details"
                          >
                            Details
                          </button>

                          {isActive ? (
                            <button
                              id={`deliver-order-btn-${order.id}`}
                              onClick={(e) => handleMarkAsDelivered(order.id, e)}
                              disabled={isDelivering}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/25 active:scale-95 disabled:opacity-50"
                            >
                              {isDelivering ? (
                                <>
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  <span>Updating DB...</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="w-4 h-4" />
                                  <span>Mark as Delivered</span>
                                </>
                              )}
                            </button>
                          ) : (
                            <div className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Delivered</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            /* Table View */
            <div className="w-full overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950/60 shadow-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-900/80 text-zinc-400 uppercase font-semibold text-[11px] tracking-wider">
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Customer Name</th>
                    <th className="py-3 px-4">Items Summary</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Time</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                  {displayedOrders.map((order) => {
                    const isDelivering = deliveringId === order.id;
                    const isActive = order.status !== 'delivered';

                    return (
                      <tr
                        key={order.id}
                        className="hover:bg-zinc-900/50 transition-colors cursor-pointer"
                        onClick={() => setSelectedOrderDetails(order)}
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                          {order.id}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-white">
                          <div>{order.customerName}</div>
                          <div className="text-[11px] text-zinc-500 truncate max-w-[200px]">
                            {order.address}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="max-w-[240px] truncate text-zinc-300">
                            {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                          </div>
                          <div className="text-[10px] text-zinc-500">
                            {order.items.reduce((s, i) => s + i.quantity, 0)} total items
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-white text-sm">
                          ${order.total.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4">{getStatusBadge(order.status)}</td>
                        <td className="py-3.5 px-4 text-zinc-400 text-[11px]">
                          {new Date(order.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {isActive ? (
                            <button
                              id={`table-deliver-btn-${order.id}`}
                              onClick={(e) => handleMarkAsDelivered(order.id, e)}
                              disabled={isDelivering}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-colors shadow-sm disabled:opacity-50"
                            >
                              {isDelivering ? (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              )}
                              <span>Mark as Delivered</span>
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Delivered
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal for In-depth Order Inspection */}
        <AnimatePresence>
          {selectedOrderDetails && (
            <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-lg bg-[#111620] border border-zinc-700 rounded-2xl p-6 shadow-2xl space-y-4 text-zinc-200"
              >
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 text-sm">
                      {selectedOrderDetails.id}
                    </span>
                    {getStatusBadge(selectedOrderDetails.status)}
                  </div>
                  <button
                    onClick={() => setSelectedOrderDetails(null)}
                    className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-3 p-3 bg-zinc-900/60 rounded-xl border border-zinc-800">
                    <div>
                      <p className="text-zinc-500 uppercase font-medium text-[10px]">Customer Name</p>
                      <p className="text-white font-semibold text-sm mt-0.5">
                        {selectedOrderDetails.customerName}
                      </p>
                    </div>
                    <div>
                      <p className="text-zinc-500 uppercase font-medium text-[10px]">Phone Number</p>
                      <p className="text-white font-semibold mt-0.5">
                        {selectedOrderDetails.phone || '+1 (555) 349-2810'}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-zinc-500 uppercase font-medium text-[10px]">Delivery Address</p>
                      <p className="text-white mt-0.5">{selectedOrderDetails.address}</p>
                    </div>
                    <div>
                      <p className="text-zinc-500 uppercase font-medium text-[10px]">Order Time</p>
                      <p className="text-zinc-300 mt-0.5">
                        {new Date(selectedOrderDetails.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {selectedOrderDetails.deliveredAt && (
                      <div>
                        <p className="text-zinc-500 uppercase font-medium text-[10px]">Delivered At</p>
                        <p className="text-emerald-400 mt-0.5">
                          {new Date(selectedOrderDetails.deliveredAt).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Items List */}
                  <div>
                    <h5 className="font-semibold text-white mb-2 uppercase text-[11px] tracking-wider text-zinc-400">
                      Dishes & Items
                    </h5>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {selectedOrderDetails.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/40 border border-zinc-800/80"
                        >
                          <div>
                            <span className="font-bold text-amber-400 mr-2">{item.quantity}x</span>
                            <span className="text-white font-medium">{item.name}</span>
                          </div>
                          <span className="font-mono text-zinc-300">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="pt-2 border-t border-zinc-800 space-y-1 font-mono">
                    <div className="flex justify-between text-zinc-400">
                      <span>Subtotal:</span>
                      <span>${selectedOrderDetails.subtotal.toFixed(2)}</span>
                    </div>
                    {selectedOrderDetails.discount > 0 && (
                      <div className="flex justify-between text-emerald-400">
                        <span>Discount Applied:</span>
                        <span>-${selectedOrderDetails.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-zinc-400">
                      <span>Delivery Fee:</span>
                      <span>${selectedOrderDetails.deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-white font-bold text-sm pt-1 border-t border-zinc-800">
                      <span>Total Amount:</span>
                      <span className="text-amber-400">${selectedOrderDetails.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800 flex justify-end gap-2">
                  <button
                    onClick={() => setSelectedOrderDetails(null)}
                    className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-colors"
                  >
                    Close
                  </button>
                  {selectedOrderDetails.status !== 'delivered' && (
                    <button
                      onClick={() => handleMarkAsDelivered(selectedOrderDetails.id)}
                      disabled={deliveringId === selectedOrderDetails.id}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-colors shadow-lg shadow-emerald-500/20"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm & Mark Delivered</span>
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
