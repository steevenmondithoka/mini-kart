import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, XCircle, Clock, CheckCircle2, Truck,
  Calendar, ChevronDown, ChevronUp, Search,
  ArrowRight, ShoppingBag, RefreshCw, MapPin,
  CreditCard, Zap, Filter
} from 'lucide-react';

/* ─── Toast ─────────────────────────────────────────────────────── */
const Toast = ({ message, type = 'success', onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 2500); return () => clearTimeout(t); }, [onDone]);
  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[999] px-8 py-4 text-[10px] uppercase tracking-widest font-bold rounded-full shadow-2xl flex items-center gap-3 whitespace-nowrap ${
        type === 'error' ? 'bg-red-500 text-white' : 'bg-black text-white'
      }`}
    >
      <Zap size={12} className="text-yellow-400" /> {message}
    </motion.div>
  );
};

/* ─── Status config ──────────────────────────────────────────────── */
const STATUS_CONFIG = {
  Processing: { color: 'text-blue-600',  bg: 'bg-blue-50',  border: 'border-blue-100',  dot: 'bg-blue-500'  },
  Shipped:    { color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', dot: 'bg-purple-500' },
  Delivered:  { color: 'text-green-600', bg: 'bg-green-50',  border: 'border-green-100',  dot: 'bg-green-500'  },
  Cancelled:  { color: 'text-red-500',   bg: 'bg-red-50',    border: 'border-red-100',    dot: 'bg-red-400'    },
};

const STEPS = [
  { id: 'Processing', icon: Clock,        label: 'Order Placed'  },
  { id: 'Shipped',    icon: Truck,         label: 'Shipped'       },
  { id: 'Delivered',  icon: CheckCircle2,  label: 'Delivered'     },
];

/* ─── Progress Tracker ───────────────────────────────────────────── */
const ProgressTracker = ({ status }) => {
  if (status === 'Cancelled') return (
    <div className="flex flex-col items-center justify-center gap-3 py-8 bg-red-50 border border-red-100 rounded-2xl">
      <XCircle size={28} className="text-red-400" strokeWidth={1.5} />
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-red-500 font-black">Order Cancelled</p>
        <p className="text-[9px] text-red-400 mt-1 italic">Any paid amount will be refunded automatically.</p>
      </div>
    </div>
  );

  const currentIndex = STEPS.findIndex(s => s.id === status);
  const progress     = currentIndex / (STEPS.length - 1) * 100;

  return (
    <div className="relative flex justify-between items-center w-full px-4 py-6">
      {/* Background line */}
      <div className="absolute top-1/2 left-8 right-8 h-[2px] bg-gray-100 -translate-y-1/2" />
      {/* Progress line */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `calc(${progress}% - 4rem)` }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="absolute top-1/2 left-8 h-[2px] bg-blue-500 -translate-y-1/2"
      />

      {STEPS.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isActive    = index === currentIndex;
        const Icon        = step.icon;
        return (
          <div key={step.id} className="relative z-10 flex flex-col items-center gap-3">
            <motion.div
              initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: index * 0.15 }}
              className={`w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all duration-500 shadow-sm ${
                isCompleted ? 'bg-blue-500 border-blue-500 text-white'
                : isActive  ? (status === 'Delivered' ? 'bg-green-500 border-green-500 text-white' : 'bg-blue-500 border-blue-500 text-white')
                : 'bg-white border-gray-200 text-gray-300'
              }`}
            >
              <Icon size={16} />
            </motion.div>
            <p className={`text-[8px] uppercase tracking-[0.2em] font-black whitespace-nowrap ${
              isCompleted || isActive ? 'text-gray-800' : 'text-gray-300'
            }`}>{step.label}</p>
          </div>
        );
      })}
    </div>
  );
};

/* ─── Order Card ─────────────────────────────────────────────────── */
const OrderCard = ({ order, onCancel }) => {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.Processing;

  const getExpectedDate = (dateString) => {
    const d = new Date(dateString);
    d.setDate(d.getDate() + 5);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-50">
        <div className="flex items-start gap-4">
          {/* Status dot */}
          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${cfg.dot} animate-pulse`} />
          <div>
            <p className="text-[8px] uppercase tracking-[0.3em] text-gray-400 font-bold">Order ID</p>
            <p className="text-[11px] font-mono font-bold text-gray-700 mt-0.5">#{order._id.slice(-10).toUpperCase()}</p>
            <p className="text-[9px] text-gray-400 mt-0.5 flex items-center gap-1.5">
              <Calendar size={9} /> Placed on {formatDate(order.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Status badge */}
          <span className={`text-[9px] uppercase tracking-widest font-black px-4 py-2 rounded-full border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
            {order.status}
          </span>
          {/* Payment method */}
          <span className={`text-[9px] uppercase tracking-widest font-black px-4 py-2 rounded-full border ${
            order.paymentMethod === 'COD' ? 'text-orange-600 bg-orange-50 border-orange-100' : 'text-green-600 bg-green-50 border-green-100'
          }`}>
            {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
          </span>
          {/* Expand toggle */}
          <button
            onClick={() => setExpanded(e => !e)}
            className="p-2 rounded-xl border border-gray-100 hover:bg-gray-50 transition text-gray-400"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* ── Items preview (always visible) ─────────────────────── */}
      <div className="px-6 py-5 flex items-center gap-4">
        <div className="flex -space-x-3">
          {order.orderItems.slice(0, 4).map((item, i) => (
            <div key={i} className="w-12 h-12 rounded-xl border-2 border-white bg-gray-50 overflow-hidden shadow-sm shrink-0">
              <img src={item.image?.startsWith('http') ? item.image : `http://localhost${item.image}`}
                alt={item.name} className="w-full h-full object-cover" />
            </div>
          ))}
          {order.orderItems.length > 4 && (
            <div className="w-12 h-12 rounded-xl border-2 border-white bg-gray-100 flex items-center justify-center text-[9px] font-black text-gray-500 shadow-sm">
              +{order.orderItems.length - 4}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold text-gray-800 truncate">
            {order.orderItems.map(i => i.name).join(', ')}
          </p>
          <p className="text-[9px] text-gray-400 mt-0.5">{order.orderItems.length} item{order.orderItems.length > 1 ? 's' : ''}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[8px] uppercase tracking-widest text-gray-400 font-bold">Total</p>
          <p className="text-lg font-black text-gray-900">₹{order.totalPrice.toLocaleString()}</p>
        </div>
      </div>

      {/* ── Delivery date bar ───────────────────────────────────── */}
      {order.status !== 'Cancelled' && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center gap-3">
          <Calendar size={13} className="text-gray-400 shrink-0" />
          {order.status === 'Delivered' ? (
            <p className="text-[10px] uppercase tracking-widest font-bold text-green-600">
              Delivered on: <span className="italic font-black">{formatDate(order.deliveredAt || order.updatedAt)}</span>
            </p>
          ) : (
            <p className="text-[10px] uppercase tracking-widest font-bold text-blue-600">
              Expected by: <span className="italic font-black">{getExpectedDate(order.createdAt)}</span>
            </p>
          )}
        </div>
      )}

      {/* ── Expanded section ────────────────────────────────────── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-gray-100"
          >
            {/* Progress tracker */}
            <div className="px-8 pt-8 pb-4">
              <p className="text-[9px] uppercase tracking-widest font-black text-gray-400 mb-4">Order Progress</p>
              <ProgressTracker status={order.status} />
            </div>

            {/* Item details */}
            <div className="px-8 py-6 border-t border-gray-50">
              <p className="text-[9px] uppercase tracking-widest font-black text-gray-400 mb-5">Items Ordered</p>
              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-5 group">
                    <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                      <img
                        src={item.image?.startsWith('http') ? item.image : `http://localhost${item.image}`}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[12px] font-bold text-gray-800 truncate">{item.name}</h4>
                      <p className="text-[9px] uppercase tracking-widest text-gray-400 mt-0.5">Qty: {item.qty}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[9px] text-gray-400">₹{item.price.toLocaleString()} × {item.qty}</p>
                      <p className="text-sm font-black text-gray-900 mt-0.5">₹{(item.price * item.qty).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping address */}
            {order.shippingAddress && (
              <div className="px-8 py-5 border-t border-gray-50 bg-gray-50/40">
                <p className="text-[9px] uppercase tracking-widest font-black text-gray-400 mb-2 flex items-center gap-2">
                  <MapPin size={10} /> Shipping Address
                </p>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  {[order.shippingAddress.address, order.shippingAddress.city, order.shippingAddress.postalCode].filter(Boolean).join(', ')}
                </p>
              </div>
            )}

            {/* Summary + actions */}
            <div className="px-8 py-5 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex gap-8 flex-wrap">
                <div>
                  <p className="text-[8px] uppercase tracking-[0.2em] text-gray-400 font-bold">Grand Total</p>
                  <p className="text-xl font-black tracking-tight mt-0.5">₹{order.totalPrice.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[8px] uppercase tracking-[0.2em] text-gray-400 font-bold">Payment Status</p>
                  <p className={`text-[10px] font-black uppercase tracking-widest mt-1 flex items-center gap-1.5 ${order.isPaid ? 'text-green-600' : 'text-orange-500'}`}>
                    <CreditCard size={11} />
                    {order.isPaid ? 'Paid' : 'Pending'}
                  </p>
                </div>
              </div>

              {order.status === 'Processing' && (
                <button
                  onClick={() => onCancel(order._id)}
                  className="flex items-center gap-2 text-red-500 hover:text-white hover:bg-red-500 transition-all py-3 px-6 border border-red-200 rounded-2xl text-[9px] uppercase tracking-[0.3em] font-black"
                >
                  <XCircle size={14} /> Cancel Order
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ─── Main Orders Page ───────────────────────────────────────────── */
const Orders = () => {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [filter,  setFilter]  = useState('All'); // All | Processing | Shipped | Delivered | Cancelled
  const [toast,   setToast]   = useState(null);

  const { user } = useAuth();

  const fetchOrders = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/orders/myorders`, config);
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders', error);
    }
    setLoading(false);
  };

  useEffect(() => { if (user) fetchOrders(); }, [user]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/orders/${orderId}/cancel`, {}, config);
      fetchOrders();
      setToast({ type: 'success', msg: 'Order cancelled successfully' });
    } catch (error) {
      setToast({ type: 'error', msg: error.response?.data?.message || 'Error cancelling order' });
    }
  };

  const filterTabs = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  const filteredOrders = orders.filter(o => {
    const matchesFilter = filter === 'All' || o.status === filter;
    const matchesSearch = search === '' ||
      o._id.toLowerCase().includes(search.toLowerCase()) ||
      o.orderItems.some(i => i.name.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total:     orders.length,
    active:    orders.filter(o => o.status === 'Processing' || o.status === 'Shipped').length,
    delivered: orders.filter(o => o.status === 'Delivered').length,
    spent:     orders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + o.totalPrice, 0),
  };

  return (
    <div className="bg-[#F5F5F7] min-h-screen pb-24">
      <Navbar />

      <AnimatePresence>
        {toast && <Toast message={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto pt-32 px-6">

        {/* ── Header ─────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <span className="text-[9px] uppercase tracking-[0.7em] text-gray-400 font-black flex items-center gap-2 mb-3">
            <Package size={10} /> Order History
          </span>
          <h1 className="text-5xl font-light italic tracking-tighter text-gray-900">Your Archive.</h1>
          <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 mt-2 font-bold">Transaction History & Live Tracking</p>
        </motion.div>

        {/* ── Stats row ──────────────────────────────────────────── */}
        {!loading && orders.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {[
              { label: 'Total Orders',   value: stats.total,               suffix: '',  color: 'text-gray-900' },
              { label: 'Active',         value: stats.active,              suffix: '',  color: 'text-blue-600' },
              { label: 'Delivered',      value: stats.delivered,           suffix: '',  color: 'text-green-600' },
              { label: 'Total Spent',    value: `₹${stats.spent.toLocaleString()}`, suffix: '', color: 'text-gray-900' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <p className="text-[8px] uppercase tracking-widest text-gray-400 font-bold">{label}</p>
                <p className={`text-2xl font-black mt-1 ${color}`}>{value}</p>
              </div>
            ))}
          </motion.div>
        )}

        {/* ── Search + Filter ─────────────────────────────────────── */}
        {!loading && orders.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl border border-gray-100 p-4 mb-8 shadow-sm flex flex-col gap-4">
            {/* Search */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-transparent focus-within:border-gray-200 transition-colors">
              <Search size={14} className="text-gray-400 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by order ID or product name..."
                className="bg-transparent flex-1 text-[11px] tracking-wide outline-none placeholder:text-gray-400"
              />
              {search && (
                <button onClick={() => setSearch('')} className="text-gray-400 hover:text-black transition">
                  <XCircle size={14} />
                </button>
              )}
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={12} className="text-gray-400 shrink-0" />
              {filterTabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-4 py-2 rounded-xl text-[9px] uppercase tracking-widest font-black transition-all ${
                    filter === tab ? 'bg-black text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {tab}
                  {tab !== 'All' && (
                    <span className="ml-1.5 opacity-60">
                      ({orders.filter(o => o.status === tab).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Content ─────────────────────────────────────────────── */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl h-40 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-20 text-center border border-gray-100 shadow-sm">
            <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-6">
              <Package className="text-gray-200" size={36} strokeWidth={1} />
            </div>
            <h3 className="text-2xl font-light italic tracking-tight text-gray-700 mb-3">No orders yet.</h3>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold mb-10">Your archive is currently empty.</p>
            <Link to="/"
              className="inline-flex items-center gap-3 bg-black text-white px-10 py-4 text-[10px] uppercase tracking-widest font-black rounded-full hover:bg-gray-800 transition-all">
              <ShoppingBag size={13} /> Start Shopping <ArrowRight size={13} />
            </Link>
          </motion.div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-gray-100">
            <Search size={28} className="text-gray-200 mx-auto mb-4" />
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">No orders match your search.</p>
            <button onClick={() => { setSearch(''); setFilter('All'); }}
              className="mt-6 text-[9px] uppercase tracking-widest font-black text-black underline flex items-center gap-2 mx-auto">
              <RefreshCw size={10} /> Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold px-1">
              {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found
            </p>
            <AnimatePresence>
              {filteredOrders.map((order, i) => (
                <motion.div key={order._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <OrderCard order={order} onCancel={handleCancelOrder} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;