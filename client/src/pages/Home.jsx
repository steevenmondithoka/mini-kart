import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Navbar from '../components/Navbar';
import QuickView from '../components/QuickView';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  Sparkles, Laptop, Bath, Home as HomeIcon, ShoppingBag,
  Percent, ArrowRight, Plus, BellElectric,
  Heart, Star, TrendingUp, Award, ChevronLeft, ChevronRight,
  SlidersHorizontal, Grid3X3, LayoutList, Zap,
  Package, RefreshCw, Shield, Truck, Search, Eye,
  Smartphone, BookOpen, Sofa, Bike, Car, Utensils,
  Dumbbell, Baby, ChevronDown, ChevronUp, X, Filter
} from 'lucide-react';

/* ─── Splash ─────────────────────────────────────────────────────── */
const SplashScreen = ({ onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 2400); return () => clearTimeout(t); }, [onDone]);
  return (
    <motion.div
      initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[99999] bg-[#0A0A0A] flex flex-col items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center gap-3"
      >
        <div className="w-16 h-16 rounded-2xl bg-[#FF4D00] flex items-center justify-center mb-2">
          <ShoppingBag size={28} className="text-white" />
        </div>
        <div className="flex items-baseline gap-0.5">
          {['M','I','N','I','K','A','R','T'].map((l, i) => (
            <motion.span key={i}
              initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.06 + 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className={`text-4xl font-black tracking-tight ${i < 4 ? 'text-white' : 'text-white/30'}`}
            >{l}</motion.span>
          ))}
        </div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          className="text-[9px] uppercase tracking-[0.6em] text-white/30 font-medium">
          Shop Smarter. Live Better.
        </motion.p>
      </motion.div>
      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ delay: 1.2, duration: 1, ease: 'easeInOut' }}
        className="absolute bottom-0 left-0 h-[3px] bg-[#FF4D00] origin-left w-full"
      />
    </motion.div>
  );
};

/* ─── Toast ──────────────────────────────────────────────────────── */
const Toast = ({ message, onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 2000); return () => clearTimeout(t); }, [onDone]);
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-24 sm:bottom-6 left-1/2 -translate-x-1/2 z-[999] bg-gray-900 text-white px-5 py-3 text-[10px] font-semibold rounded-2xl shadow-2xl flex items-center gap-2 whitespace-nowrap"
    >
      <div className="w-4 h-4 rounded-full bg-[#FF4D00] flex items-center justify-center shrink-0">
        <span className="text-white text-[8px]">✓</span>
      </div>
      {message}
    </motion.div>
  );
};

/* ─── Counter ────────────────────────────────────────────────────── */
const Counter = ({ target, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let v = 0; const step = target / 50;
    const t = setInterval(() => {
      v += step; if (v >= target) { setCount(target); clearInterval(t); } else setCount(Math.floor(v));
    }, 20);
    return () => clearInterval(t);
  }, [inView, target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

/* ─── Categories ─────────────────────────────────────────────────── */
const allCategories = [
  { name: 'All',           label: 'For You',     icon: <Sparkles size={20} />,    color: 'from-violet-500 to-purple-600' },
  { name: 'Fashion',       label: 'Fashion',     icon: <ShoppingBag size={20} />, color: 'from-pink-500 to-rose-500' },
  { name: 'Mobiles',       label: 'Mobiles',     icon: <Smartphone size={20} />,  color: 'from-blue-500 to-cyan-500' },
  { name: 'Electronics',   label: 'Electronics', icon: <BellElectric size={20} />,color: 'from-amber-500 to-orange-500' },
  { name: 'Sanitary',      label: 'Beauty',      icon: <Bath size={20} />,        color: 'from-fuchsia-500 to-pink-500' },
  { name: 'Home Needs',    label: 'Home',        icon: <HomeIcon size={20} />,    color: 'from-teal-500 to-emerald-500' },
  { name: 'Appliances',    label: 'Appliances',  icon: <Zap size={20} />,         color: 'from-yellow-500 to-amber-500' },
  { name: 'Toys',          label: 'Toys & Baby', icon: <Baby size={20} />,        color: 'from-sky-400 to-blue-500' },
  { name: 'Food',          label: 'Food',        icon: <Utensils size={20} />,    color: 'from-green-500 to-teal-500' },
  { name: 'Sports',        label: 'Sports',      icon: <Dumbbell size={20} />,    color: 'from-red-500 to-orange-500' },
  { name: 'Laptops',       label: 'Laptops',     icon: <Laptop size={20} />,      color: 'from-indigo-500 to-blue-600' },
  { name: 'Furniture',     label: 'Furniture',   icon: <Sofa size={20} />,        color: 'from-stone-500 to-zinc-600' },
  { name: 'Books',         label: 'Books',       icon: <BookOpen size={20} />,    color: 'from-lime-500 to-green-500' },
  { name: 'Auto',          label: 'Auto',        icon: <Car size={20} />,         color: 'from-slate-500 to-gray-600' },
  { name: 'Festival Offers', label: 'Offers',   icon: <Percent size={20} />,     color: 'from-[#FF4D00] to-red-500' },
];

const CategoryBar = ({ active, setActive }) => (
  <div className="bg-white border-b border-gray-100 shadow-sm sticky top-[56px] sm:top-[64px] z-40">
    <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-hide px-2 py-2">
      {allCategories.map(cat => {
        const isActive = active === cat.name;
        return (
          <button key={cat.name} onClick={() => setActive(cat.name)}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl shrink-0 transition-all duration-200 ${isActive ? 'bg-gray-50' : ''}`}
          >
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br transition-all duration-200 ${isActive ? cat.color + ' shadow-md scale-105' : 'from-gray-100 to-gray-200 !text-gray-500'}`}>
              {cat.icon}
            </div>
            <span className={`text-[9px] font-semibold whitespace-nowrap transition-colors leading-none ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
              {cat.label}
            </span>
            {isActive && <div className="w-1 h-1 rounded-full bg-[#FF4D00]" />}
          </button>
        );
      })}
    </div>
  </div>
);

/* ─── Banner ─────────────────────────────────────────────────────── */
const banners = [
  { image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1600', badge: '🔥 Hot Deals', title: 'Up to 70% Off', sub: 'Electronics & Gadgets', cta: 'Shop Now', accent: '#FF4D00' },
  { image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600', badge: '✨ New In', title: 'Fashion 2026', sub: 'Fresh Styles Just Dropped', cta: 'Explore', accent: '#7C3AED' },
  { image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=1600', badge: '⚡ Flash Sale', title: 'Weekend Picks', sub: 'Exclusive Online Prices', cta: 'Grab It', accent: '#059669' },
];

const Banner = ({ onShop }) => {
  const [cur, setCur] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => setCur(c => (c + 1) % banners.length), 4000);
    return () => clearInterval(timerRef.current);
  }, []);

  const go = (i) => { clearInterval(timerRef.current); setCur(i); timerRef.current = setInterval(() => setCur(c => (c + 1) % banners.length), 4000); };
  const b = banners[cur];

  return (
    <div className="relative mx-3 mt-3 rounded-2xl overflow-hidden" style={{ height: 'clamp(180px, 50vw, 340px)' }}>
      <AnimatePresence mode="wait">
        <motion.div key={cur} initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
          className="absolute inset-0">
          <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
        </motion.div>
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <motion.div key={cur + 'c'} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.4 }}
          className="absolute inset-0 flex flex-col justify-center px-5 sm:px-10 z-10">
          <span className="text-[10px] font-bold text-white/80 mb-1">{b.badge}</span>
          <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight mb-1">{b.title}</h2>
          <p className="text-[10px] sm:text-xs text-white/70 mb-4 font-medium">{b.sub}</p>
          <button onClick={onShop}
            style={{ background: b.accent }}
            className="self-start px-5 py-2.5 rounded-xl text-white text-[10px] font-black uppercase tracking-wide flex items-center gap-1.5 shadow-lg active:scale-95 transition-transform">
            {b.cta} <ArrowRight size={12} />
          </button>
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-3 right-4 z-10 flex gap-1.5">
        {banners.map((_, i) => (
          <button key={i} onClick={() => go(i)}
            className={`rounded-full transition-all duration-300 ${i === cur ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40'}`} />
        ))}
      </div>
    </div>
  );
};

/* ─── Mini Promo Cards ───────────────────────────────────────────── */
const PromoCards = ({ onSetCategory }) => {
  const promos = [
    { label: 'Mega Sale', sub: 'Up to 80% off', color: 'bg-gradient-to-br from-[#FF4D00] to-[#FF8C00]', cat: 'Festival Offers' },
    { label: 'New Arrivals', sub: 'Just dropped', color: 'bg-gradient-to-br from-[#7C3AED] to-[#4F46E5]', cat: 'Fashion' },
    { label: 'Best Sellers', sub: 'Top rated picks', color: 'bg-gradient-to-br from-[#059669] to-[#0EA5E9]', cat: 'Electronics' },
  ];
  return (
    <div className="flex gap-2.5 px-3 mt-3 overflow-x-auto scrollbar-hide">
      {promos.map(p => (
        <button key={p.label} onClick={() => onSetCategory(p.cat)}
          className={`${p.color} rounded-2xl px-4 py-3 shrink-0 text-left min-w-[120px] active:scale-95 transition-transform`}>
          <p className="text-white font-black text-[12px] leading-tight">{p.label}</p>
          <p className="text-white/70 text-[9px] mt-0.5">{p.sub}</p>
        </button>
      ))}
    </div>
  );
};

/* ─── Section Header ─────────────────────────────────────────────── */
const SectionHeader = ({ title, sub, onSeeAll }) => (
  <div className="flex items-end justify-between px-3 mb-3">
    <div>
      <h3 className="text-[15px] font-black text-gray-900 leading-none">{title}</h3>
      {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
    {onSeeAll && (
      <button onClick={onSeeAll} className="text-[10px] font-bold text-[#FF4D00] flex items-center gap-0.5">
        See All <ChevronRight size={11} />
      </button>
    )}
  </div>
);

/* ─── Trust Bar ──────────────────────────────────────────────────── */
const TrustBar = () => (
  <div className="flex gap-2 px-3 mt-4 overflow-x-auto scrollbar-hide pb-1">
    {[
      { icon: <Truck size={14} />, label: 'Free Delivery', sub: '₹999+' },
      { icon: <RefreshCw size={14} />, label: '30-Day Returns' },
      { icon: <Shield size={14} />, label: 'Secure Pay' },
      { icon: <Package size={14} />, label: 'Gift Wrap' },
    ].map(({ icon, label, sub }) => (
      <div key={label} className="flex items-center gap-2 bg-white rounded-xl px-3 py-2.5 shrink-0 border border-gray-100 shadow-sm">
        <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center text-[#FF4D00]">{icon}</div>
        <div>
          <p className="text-[9px] font-bold text-gray-800 leading-none">{label}</p>
          {sub && <p className="text-[8px] text-gray-400">{sub}</p>}
        </div>
      </div>
    ))}
  </div>
);

/* ─── Product Card ───────────────────────────────────────────────── */
const ProductCard = ({ product, index, onQuickView, onWishlist, isWished, onToast, listView, onAddToCart }) => {
  const [adding, setAdding] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleCart = async (e) => {
    e.preventDefault(); e.stopPropagation();
    setAdding(true);
    await onAddToCart(product);
    onToast('Added to cart');
    setTimeout(() => setAdding(false), 1500);
  };

  if (listView) {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        transition={{ duration: 0.3, delay: index * 0.03 }}
        className="bg-white rounded-2xl overflow-hidden border border-gray-100 mx-3 mb-2.5 flex gap-3 p-3 active:scale-[0.99] transition-transform">
        <Link to={`/product/${product._id}`} className="w-24 h-24 rounded-xl overflow-hidden bg-gray-50 shrink-0 relative">
          {!imgLoaded && <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-xl" />}
          <img src={product.image} alt={product.name} onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover ${imgLoaded ? 'opacity-100' : 'opacity-0'}`} />
        </Link>
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <span className="text-[8px] uppercase tracking-wide text-gray-400 font-semibold">{product.category}</span>
            <Link to={`/product/${product._id}`}>
              <p className="text-[12px] font-semibold text-gray-800 line-clamp-2 leading-snug mt-0.5">{product.name}</p>
            </Link>
            <div className="flex items-center gap-1 mt-1">
              <div className="flex items-center gap-0.5 bg-green-500 rounded px-1.5 py-0.5">
                <span className="text-[8px] text-white font-bold">4.0</span>
                <Star size={7} className="text-white fill-white" />
              </div>
              <span className="text-[8px] text-gray-400">(128)</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-1">
            <div>
              <span className="text-[14px] font-black text-gray-900">₹{product.price.toLocaleString()}</span>
              <span className="text-[8px] text-green-600 font-semibold ml-1.5">Free delivery</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={e => { e.preventDefault(); onWishlist(product._id); onToast(isWished ? 'Removed' : 'Wishlisted'); }}
                className={`w-7 h-7 rounded-lg border flex items-center justify-center ${isWished ? 'bg-red-50 border-red-200' : 'border-gray-200'}`}>
                <Heart size={11} className={isWished ? 'text-red-500 fill-red-500' : 'text-gray-400'} />
              </button>
              <button onClick={handleCart} disabled={adding}
                className={`px-3 py-1.5 rounded-xl text-[9px] font-black transition-all flex items-center gap-1 ${adding ? 'bg-green-500 text-white' : 'bg-gray-900 text-white'}`}>
                {adding ? '✓' : <><ShoppingBag size={10} /> Add</>}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ duration: 0.3, delay: (index % 4) * 0.05 }}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 flex flex-col active:scale-[0.98] transition-transform">
      <Link to={`/product/${product._id}`} className="relative block bg-gray-50 overflow-hidden" style={{ paddingBottom: '105%' }}>
        <div className="absolute inset-0">
          {!imgLoaded && <div className="absolute inset-0 bg-gray-100 animate-pulse" />}
          <img src={product.image} alt={product.name} onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover ${imgLoaded ? 'opacity-100' : 'opacity-0'}`} />
        </div>
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.category === 'Festival Offers' && (
            <span className="bg-[#FF4D00] text-white px-2 py-0.5 text-[7px] font-black rounded-lg">SALE</span>
          )}
          {index < 3 && (
            <span className="bg-gray-900 text-white px-2 py-0.5 text-[7px] font-black rounded-lg flex items-center gap-0.5">
              <TrendingUp size={7} /> TOP
            </span>
          )}
        </div>
        <button onClick={e => { e.preventDefault(); onWishlist(product._id); onToast(isWished ? 'Removed' : 'Wishlisted'); }}
          className={`absolute top-2 right-2 w-7 h-7 rounded-xl flex items-center justify-center shadow transition-all ${isWished ? 'bg-red-500' : 'bg-white/90'}`}>
          <Heart size={11} className={isWished ? 'text-white fill-white' : 'text-gray-400'} />
        </button>
      </Link>
      <div className="p-2.5 flex flex-col gap-1 flex-1">
        <span className="text-[7px] text-gray-400 uppercase tracking-wide font-semibold">{product.category}</span>
        <Link to={`/product/${product._id}`}>
          <p className="text-[11px] font-semibold text-gray-800 line-clamp-2 leading-snug">{product.name}</p>
        </Link>
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-0.5 bg-green-500 rounded px-1.5 py-0.5">
            <span className="text-[7px] text-white font-bold">4.0★</span>
          </div>
          <span className="text-[7px] text-gray-400">(128)</span>
        </div>
        <div className="flex items-center justify-between mt-auto pt-1.5 border-t border-gray-50">
          <div>
            <span className="text-[13px] font-black text-gray-900">₹{product.price.toLocaleString()}</span>
            <span className="text-[7px] text-green-600 font-semibold block leading-none">Free</span>
          </div>
          <button onClick={handleCart} disabled={adding}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[9px] font-black transition-all ${adding ? 'bg-green-500 text-white' : 'bg-gray-900 text-white'}`}>
            {adding ? '✓' : <><ShoppingBag size={9} /><span>Add</span></>}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Filter Sheet (Mobile bottom sheet) ────────────────────────── */
const FilterSheet = ({ open, onClose, priceRange, setPriceRange, sortBy, setSortBy, count }) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" onClick={onClose} />
        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 p-5 pb-8 shadow-2xl max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[14px] font-black text-gray-900">Filters & Sort</h3>
            <button onClick={onClose} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
              <X size={14} />
            </button>
          </div>

          {/* Sort */}
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Sort By</p>
          <div className="grid grid-cols-2 gap-2 mb-5">
            {[
              { value: 'newest', label: 'Popularity' },
              { value: 'price-low', label: 'Price: Low → High' },
              { value: 'price-high', label: 'Price: High → Low' },
              { value: 'rating', label: 'Top Rated' },
            ].map(opt => (
              <button key={opt.value} onClick={() => setSortBy(opt.value)}
                className={`px-3 py-2.5 rounded-xl text-[10px] font-bold border transition-all text-center ${sortBy === opt.value ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600'}`}>
                {opt.label}
              </button>
            ))}
          </div>

          {/* Price */}
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">Price Range</p>
          <div className="flex gap-2 flex-wrap mb-4">
            {[
              { label: 'Under ₹500', val: [0, 500] },
              { label: '₹500–₹2K', val: [500, 2000] },
              { label: '₹2K–₹10K', val: [2000, 10000] },
              { label: 'Above ₹10K', val: [10000, 100000] },
            ].map(chip => (
              <button key={chip.label} onClick={() => setPriceRange(chip.val)}
                className={`px-3 py-2 rounded-xl border text-[10px] font-semibold transition-all ${priceRange[0] === chip.val[0] && priceRange[1] === chip.val[1] ? 'bg-[#FF4D00] text-white border-[#FF4D00]' : 'border-gray-200 text-gray-600'}`}>
                {chip.label}
              </button>
            ))}
          </div>

          <div className="space-y-3 mb-6">
            {['Min', 'Max'].map((label, li) => (
              <div key={label}>
                <div className="flex justify-between text-[9px] text-gray-400 mb-1">
                  <span>{label} Price</span>
                  <span className="font-bold text-gray-700">₹{priceRange[li].toLocaleString()}</span>
                </div>
                <input type="range" min={0} max={100000} step={500}
                  value={priceRange[li]}
                  onChange={e => {
                    const v = Number(e.target.value);
                    setPriceRange(prev => li === 0 ? [v, prev[1]] : [prev[0], v]);
                  }}
                  className="w-full accent-[#FF4D00]" />
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button onClick={() => { setPriceRange([0, 100000]); setSortBy('newest'); }}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-[11px] font-bold text-gray-600">
              Clear All
            </button>
            <button onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-gray-900 text-white text-[11px] font-black">
              Show {count} Results
            </button>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

/* ─── Desktop Sidebar ────────────────────────────────────────────── */
const DesktopSidebar = ({ priceRange, setPriceRange, sortBy, setSortBy, activeCategory, count }) => {
  const [open, setOpen] = useState({ sort: true, price: true, rating: false });
  const toggle = k => setOpen(p => ({ ...p, [k]: !p[k] }));

  return (
    <aside className="hidden sm:block w-52 shrink-0 bg-white rounded-2xl border border-gray-100 self-start sticky top-24 overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 text-gray-700">
          <SlidersHorizontal size={11} /> Filters
        </span>
        <button onClick={() => { setPriceRange([0, 100000]); setSortBy('newest'); }}
          className="text-[8px] text-[#FF4D00] font-bold hover:underline uppercase tracking-wide">Clear</button>
      </div>
      <div className="px-4 divide-y divide-gray-50">
        {/* Sort */}
        <div>
          <button onClick={() => toggle('sort')} className="w-full flex justify-between py-3 text-[10px] font-black uppercase tracking-widest text-gray-700">
            Sort {open.sort ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          {open.sort && (
            <div className="pb-3 space-y-1">
              {[{ v: 'newest', l: 'Popularity' }, { v: 'price-low', l: 'Price: Low → High' }, { v: 'price-high', l: 'Price: High → Low' }, { v: 'rating', l: 'Top Rated' }].map(o => (
                <button key={o.v} onClick={() => setSortBy(o.v)}
                  className={`w-full flex items-center gap-2 text-[10px] py-1.5 px-2 rounded-lg transition-all ${sortBy === o.v ? 'bg-orange-50 text-[#FF4D00] font-bold' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${sortBy === o.v ? 'border-[#FF4D00] bg-[#FF4D00]' : 'border-gray-300'}`}>
                    {sortBy === o.v && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  {o.l}
                </button>
              ))}
            </div>
          )}
        </div>
        {/* Price */}
        <div>
          <button onClick={() => toggle('price')} className="w-full flex justify-between py-3 text-[10px] font-black uppercase tracking-widest text-gray-700">
            Price {open.price ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          {open.price && (
            <div className="pb-4 space-y-3">
              <div className="flex flex-wrap gap-1">
                {[{ label: 'Under ₹500', val: [0, 500] }, { label: '₹500-2K', val: [500, 2000] }, { label: '₹2K-10K', val: [2000, 10000] }, { label: 'Above ₹10K', val: [10000, 100000] }].map(chip => (
                  <button key={chip.label} onClick={() => setPriceRange(chip.val)}
                    className={`text-[8px] px-2 py-1 rounded-lg border transition-all ${priceRange[0] === chip.val[0] && priceRange[1] === chip.val[1] ? 'bg-orange-50 border-[#FF4D00] text-[#FF4D00] font-bold' : 'border-gray-200 text-gray-500 hover:border-gray-400'}`}>
                    {chip.label}
                  </button>
                ))}
              </div>
              {['Min', 'Max'].map((lbl, li) => (
                <div key={lbl}>
                  <div className="flex justify-between text-[8px] text-gray-400 mb-1">
                    <span>{lbl}</span>
                    <span className="font-bold text-gray-700">₹{priceRange[li].toLocaleString()}</span>
                  </div>
                  <input type="range" min={0} max={100000} step={500} value={priceRange[li]}
                    onChange={e => { const v = Number(e.target.value); setPriceRange(p => li === 0 ? [v, p[1]] : [p[0], v]); }}
                    className="w-full accent-[#FF4D00] h-1" />
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Rating */}
        <div>
          <button onClick={() => toggle('rating')} className="w-full flex justify-between py-3 text-[10px] font-black uppercase tracking-widest text-gray-700">
            Rating {open.rating ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          {open.rating && (
            <div className="pb-3 space-y-1.5">
              {[4,3,2,1].map(r => (
                <button key={r} className="w-full flex items-center gap-2 text-[10px] py-1.5 px-2 rounded-lg text-gray-600 hover:bg-gray-50">
                  <div className="w-3.5 h-3.5 rounded border-2 border-gray-300 shrink-0" />
                  <div className="flex items-center gap-0.5 bg-green-500 px-1.5 py-0.5 rounded">
                    <span className="text-[7px] text-white font-black">{r}★ & above</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <p className="text-[8px] text-gray-400 uppercase tracking-wide">{count} items</p>
      </div>
    </aside>
  );
};

/* ─── Bottom Nav (Mobile) ────────────────────────────────────────── */
const BottomNav = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-around px-2 py-2 z-50 sm:hidden shadow-2xl">
      {[
        { icon: <HomeIcon size={20} />, label: 'Home', path: '/' },
        { icon: <Search size={20} />, label: 'Search', path: '/?search=' },
        { icon: <ShoppingBag size={20} />, label: 'Cart', path: '/cart' },
        { icon: <Heart size={20} />, label: 'Wishlist', path: '/wishlist' },
        { icon: user ? <div className="w-5 h-5 rounded-full bg-[#FF4D00] flex items-center justify-center text-white text-[8px] font-black">{user.name?.[0]?.toUpperCase() || 'U'}</div> : <Sparkles size={20} />, label: user ? 'Profile' : 'Login', path: user ? '/profile' : '/login' },
      ].map(item => (
        <button key={item.label} onClick={() => navigate(item.path)}
          className="flex flex-col items-center gap-0.5 px-3 py-1 text-gray-500 active:text-[#FF4D00] transition-colors">
          {item.icon}
          <span className="text-[8px] font-semibold">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

/* ─── Home ───────────────────────────────────────────────────────── */
const Home = () => {
  const [splash, setSplash]       = useState(true);
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [qvProduct, setQvProduct] = useState(null);
  const [category, setCategory]   = useState('All');
  const [sortBy, setSortBy]       = useState('newest');
  const [visible, setVisible]     = useState(20);
  const [viewMode, setViewMode]   = useState('grid');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [toast, setToast]         = useState(null);
  const [wishlist, setWishlist]   = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);

  const { user }      = useAuth();
  const { addToCart } = useCart();
  const location      = useLocation();
  const searchQuery   = new URLSearchParams(location.search).get('search') || '';
  const authHeaders   = user?.token ? { headers: { Authorization: `Bearer ${user.token}` } } : {};
  const showSidebar   = category !== 'All';

  useEffect(() => {
    if (!user?.token) { setWishlist([]); return; }
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/wishlist`, authHeaders)
      .then(({ data }) => setWishlist(data.map(p => p._id)))
      .catch(() => {});
  }, [user]);

  const toggleWishlist = useCallback(async (id) => {
    if (!user?.token) return;
    const wished = wishlist.includes(id);
    try {
      if (wished) {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/wishlist/${id}`, authHeaders);
        setWishlist(p => p.filter(x => x !== id));
      } else {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/wishlist/${id}`, {}, authHeaders);
        setWishlist(p => [...p, id]);
      }
    } catch {}
  }, [wishlist, user]);

  const handleAddToCart = useCallback(async (product) => {
    if (!user) { setToast('Please sign in first'); return; }
    await addToCart(product);
  }, [user, addToCart]);

  useEffect(() => {
    setLoading(true);
    let url = `${import.meta.env.VITE_API_BASE_URL}/products?keyword=${searchQuery}`;
    if (category !== 'All') url += `&category=${category}`;
    axios.get(url).then(({ data }) => {
      let sorted = [...data];
      if (sortBy === 'price-low')  sorted.sort((a, b) => a.price - b.price);
      if (sortBy === 'price-high') sorted.sort((a, b) => b.price - a.price);
      if (sortBy === 'rating')     sorted.sort((a, b) => (b.rating || 4) - (a.rating || 4));
      setProducts(sorted); setVisible(20);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [searchQuery, category, sortBy]);

  const filtered = products.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
  const visible_ = filtered.slice(0, visible);
  const isHome   = category === 'All' && !searchQuery;

  return (
    <>
      <AnimatePresence>{splash && <SplashScreen onDone={() => setSplash(false)} />}</AnimatePresence>

      <div className="bg-[#F5F5F7] min-h-screen text-gray-900 overflow-x-hidden pb-20 sm:pb-0">
        {/* Navbar with guaranteed dark bg */}
        <div className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
          <Navbar />
        </div>

        <AnimatePresence>{qvProduct && <QuickView product={qvProduct} onClose={() => setQvProduct(null)} />}</AnimatePresence>
        <AnimatePresence>{toast && <Toast message={toast} onDone={() => setToast(null)} />}</AnimatePresence>

        {/* Category Bar */}
        <CategoryBar active={category} setActive={setCategory} />

        {/* Home View */}
        {isHome && (
          <>
            <Banner onShop={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })} />
            <PromoCards onSetCategory={setCategory} />
            <TrustBar />
          </>
        )}

        {/* Search / Category breadcrumb */}
        {(searchQuery || !isHome) && (
          <div className="bg-white mx-3 mt-3 rounded-xl px-4 py-2.5 flex items-center gap-2 border border-gray-100">
            {!isHome && (
              <button onClick={() => setCategory('All')} className="text-[10px] text-gray-400 hover:text-gray-700">Home</button>
            )}
            {!isHome && <ChevronRight size={10} className="text-gray-300" />}
            <span className="text-[10px] font-bold text-gray-700">
              {searchQuery ? `"${searchQuery}"` : allCategories.find(c => c.name === category)?.label}
            </span>
            <span className="ml-auto text-[9px] text-gray-400">{filtered.length} products</span>
          </div>
        )}

        <main className="px-0 sm:px-4 pt-3 sm:pt-6 max-w-[1800px] mx-auto" id="products">
          <div className="flex gap-4 items-start sm:px-0">

            {/* Desktop Sidebar */}
            <AnimatePresence>
              {showSidebar && (
                <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="px-0 sm:block hidden">
                  <DesktopSidebar priceRange={priceRange} setPriceRange={setPriceRange} sortBy={sortBy} setSortBy={setSortBy} activeCategory={category} count={filtered.length} />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex-1 min-w-0">
              {/* Section header + toolbar */}
              {isHome && !loading && (
                <div className="mb-3">
                  <SectionHeader title="All Products" sub={`${filtered.length} curated items`} />
                </div>
              )}

              {/* Toolbar */}
              <div className="flex items-center justify-between px-3 mb-3 gap-2">
                <div className="flex items-center gap-1.5 bg-white rounded-xl p-1 border border-gray-100">
                  <button onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-gray-900 text-white' : 'text-gray-400'}`}>
                    <Grid3X3 size={12} />
                  </button>
                  <button onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-gray-900 text-white' : 'text-gray-400'}`}>
                    <LayoutList size={12} />
                  </button>
                </div>

                {/* Mobile filter btn */}
                <button onClick={() => setFilterOpen(true)}
                  className="sm:hidden flex items-center gap-1.5 bg-white rounded-xl px-3 py-2 border border-gray-100 text-[10px] font-bold text-gray-700">
                  <Filter size={12} /> Filter & Sort
                </button>

                {/* Desktop sort */}
                <div className="hidden sm:flex items-center gap-1.5 bg-white rounded-xl px-3 py-2 border border-gray-100">
                  <span className="text-[9px] text-gray-400">Sort:</span>
                  <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                    className="text-[9px] font-bold bg-transparent outline-none cursor-pointer text-gray-700">
                    <option value="newest">Popularity</option>
                    <option value="price-low">Price: Low</option>
                    <option value="price-high">Price: High</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
              </div>

              {/* Product Grid */}
              {loading ? (
                <div className={`grid gap-2.5 px-3 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className={`bg-white rounded-2xl overflow-hidden border border-gray-100 ${viewMode === 'list' ? 'h-28 flex gap-3 p-3' : ''}`}>
                      <div className={`bg-gray-100 animate-pulse ${viewMode === 'list' ? 'w-24 h-24 rounded-xl shrink-0' : 'w-full aspect-square'}`} />
                      {viewMode === 'grid' && <div className="p-2.5 space-y-2"><div className="h-2 bg-gray-100 rounded animate-pulse w-3/4" /><div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" /></div>}
                    </div>
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="mx-3 py-20 bg-white rounded-2xl border border-gray-100 text-center">
                  <Search size={32} className="text-gray-200 mx-auto mb-3" />
                  <p className="text-[11px] font-bold text-gray-400">No products found</p>
                  <button onClick={() => setCategory('All')} className="mt-3 text-[10px] text-[#FF4D00] font-bold">Browse All</button>
                </div>
              ) : (
                <>
                  {viewMode === 'grid' ? (
                    <div className={`grid gap-2.5 px-3 ${showSidebar ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'}`}>
                      {visible_.map((p, i) => (
                        <ProductCard key={p._id} product={p} index={i} onQuickView={setQvProduct}
                          onWishlist={toggleWishlist} isWished={wishlist.includes(p._id)}
                          onToast={setToast} onAddToCart={handleAddToCart} listView={false} />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      {visible_.map((p, i) => (
                        <ProductCard key={p._id} product={p} index={i} onQuickView={setQvProduct}
                          onWishlist={toggleWishlist} isWished={wishlist.includes(p._id)}
                          onToast={setToast} onAddToCart={handleAddToCart} listView />
                      ))}
                    </div>
                  )}

                  {visible < filtered.length && (
                    <div className="mt-8 px-3 flex flex-col items-center gap-2 pb-4">
                      <button onClick={() => setVisible(v => v + 20)}
                        className="w-full max-w-xs py-3.5 bg-gray-900 text-white rounded-2xl text-[11px] font-black flex items-center justify-center gap-2 active:scale-95 transition-transform">
                        Load More <Plus size={12} />
                      </button>
                      <p className="text-[8px] text-gray-400 uppercase tracking-widest">{visible} of {filtered.length}</p>
                    </div>
                  )}
                </>
              )}

              {/* Newsletter — home only */}
              {isHome && !loading && (
                <div className="mx-3 mt-8 mb-4 rounded-3xl bg-gray-900 p-6 text-center overflow-hidden relative">
                  <div className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse at 30% 50%, #FF4D00 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, #7C3AED 0%, transparent 60%)' }} />
                  <div className="relative z-10">
                    <span className="text-[9px] uppercase tracking-[0.5em] text-white/40 font-bold">Exclusive Access</span>
                    <h3 className="text-2xl font-black text-white mt-1 mb-1 italic">Join the Club.</h3>
                    <p className="text-[10px] text-white/50 mb-4">Get early deals & new arrivals.</p>
                    <div className="flex border border-white/10 rounded-2xl overflow-hidden bg-white/5 focus-within:border-white/30 transition-colors max-w-xs mx-auto">
                      <input type="email" placeholder="your@email.com"
                        className="flex-1 bg-transparent text-[10px] outline-none text-white px-4 py-3 placeholder:text-white/30 min-w-0" />
                      <button className="bg-[#FF4D00] text-white px-4 m-1 rounded-xl text-[9px] font-black shrink-0">Join</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-100 mt-4 px-4 pt-8 pb-24 sm:pb-8">
          <div className="max-w-[1800px] mx-auto">
            <div className="flex flex-col sm:flex-row justify-between gap-8 border-b border-gray-100 pb-8 mb-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#FF4D00] flex items-center justify-center">
                    <ShoppingBag size={14} className="text-white" />
                  </div>
                  <h3 className="text-xl font-black tracking-tight">MINIKART</h3>
                </div>
                <p className="text-[10px] text-gray-400 max-w-xs leading-relaxed">Shop smarter. Live better. A curated marketplace for quality products.</p>
                <div className="flex gap-2">
                  {['IG','TW','YT','PIN'].map(s => (
                    <button key={s} className="w-8 h-8 rounded-xl border border-gray-200 text-[8px] font-black text-gray-500 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all">{s}</button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8">
                {[
                  { title: 'Shop', links: ['Archive', 'New Arrivals', 'Offers', 'Blog'] },
                  { title: 'Help', links: ['FAQs', 'Returns', 'Contact', 'Privacy'] },
                ].map(col => (
                  <div key={col.title}>
                    <h4 className="text-[9px] font-black uppercase tracking-[0.4em] mb-3 text-gray-500">{col.title}</h4>
                    <ul className="space-y-2">
                      {col.links.map(l => (
                        <li key={l} className="text-[10px] text-gray-500 hover:text-gray-900 cursor-pointer transition">{l}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-[8px] text-gray-400 text-center uppercase tracking-widest">© 2026 MINIKART. All rights reserved.</p>
          </div>
        </footer>

        {/* Mobile Filter Sheet */}
        <FilterSheet open={filterOpen} onClose={() => setFilterOpen(false)}
          priceRange={priceRange} setPriceRange={setPriceRange}
          sortBy={sortBy} setSortBy={setSortBy} count={filtered.length} />

        {/* Mobile Bottom Nav */}
        <BottomNav />

        {/* Scroll to top — desktop */}
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="hidden sm:flex fixed bottom-8 right-8 w-10 h-10 bg-gray-900 text-white rounded-full items-center justify-center shadow-2xl hover:bg-gray-700 transition z-50 text-xs font-black">
          ↑
        </button>
      </div>
    </>
  );
};

export default Home;