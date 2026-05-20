import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Navbar from '../components/Navbar';
import QuickView from '../components/QuickView';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  Sparkles, Laptop, Bath, Home as HomeIcon, ShoppingBag,
  Percent, ArrowUpDown, ArrowRight, Plus, BellElectric,
  Heart, Star, TrendingUp, Award, ChevronLeft, ChevronRight,
  X, SlidersHorizontal, Grid3X3, LayoutList, Zap,
  Package, RefreshCw, Shield, Truck, Search, Eye,
  Flame, Tag
} from 'lucide-react';

/* ══════════════════════════════════════════════════════════════════
   SPLASH SCREEN
══════════════════════════════════════════════════════════════════ */
const SplashScreen = ({ onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t); }, [onDone]);
  const letters = 'MINIKART'.split('');
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="fixed inset-0 z-[99999] bg-[#0a0a0a] flex flex-col items-center justify-center"
    >
      {/* Animated radial glow */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 2.5, opacity: 0.15 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute w-64 h-64 rounded-full"
        style={{ background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)' }}
      />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative flex flex-col items-center gap-8">
        {/* Logo */}
        <div className="flex items-end gap-[2px] overflow-hidden">
          {letters.map((l, i) => (
            <motion.span
              key={i}
              initial={{ y: 80, opacity: 0, filter: 'blur(8px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              transition={{ delay: i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={`font-black tracking-[-0.02em] leading-none select-none ${
                i < 4
                  ? 'text-white text-6xl sm:text-8xl'
                  : 'text-white/20 text-6xl sm:text-8xl'
              }`}
            >
              {l}
            </motion.span>
          ))}
        </div>

        {/* Animated underline */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-[2px] bg-gradient-to-r from-transparent via-white to-transparent origin-left"
        />

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <div className="w-6 h-[1px] bg-white/30" />
          <span className="text-[10px] uppercase tracking-[0.6em] text-white/40 font-medium">The 2026 Archive</span>
          <div className="w-6 h-[1px] bg-white/30" />
        </motion.div>

        {/* Loading dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex gap-1.5"
        >
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
              className="w-1.5 h-1.5 bg-white rounded-full"
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   MARQUEE
══════════════════════════════════════════════════════════════════ */
const Marquee = ({ items }) => (
  <div className="overflow-hidden bg-gradient-to-r from-black via-gray-900 to-black text-white py-2.5 flex border-b border-white/5">
    {[...Array(3)].map((_, i) => (
      <motion.div key={i}
        animate={{ x: ['0%', '-100%'] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="flex items-center gap-8 whitespace-nowrap px-6 shrink-0"
      >
        {items.map((item, j) => (
          <span key={j} className="text-[8px] uppercase tracking-[0.5em] font-semibold text-white/60 flex items-center gap-2">
            <span className="text-amber-400 text-[10px]">★</span> {item}
          </span>
        ))}
      </motion.div>
    ))}
  </div>
);

/* ══════════════════════════════════════════════════════════════════
   COUNTER
══════════════════════════════════════════════════════════════════ */
const Counter = ({ target, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

/* ══════════════════════════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════════════════════════ */
const Toast = ({ message, onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 2400); return () => clearTimeout(t); }, [onDone]);
  return (
    <motion.div
      initial={{ y: 100, opacity: 0, scale: 0.9 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 100, opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className="fixed bottom-24 sm:bottom-8 left-4 right-4 sm:left-auto sm:right-8 sm:w-auto z-[999]"
    >
      <div className="bg-gray-900 text-white px-5 py-3.5 text-[10px] uppercase tracking-widest font-bold rounded-2xl shadow-2xl flex items-center gap-2.5 border border-white/10">
        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
        <span>{message}</span>
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   BANNER CAROUSEL
══════════════════════════════════════════════════════════════════ */
const SLIDES = [
  { image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000', tag: 'New Collection', title: 'Curated', bold: 'Objects.', accent: '#f59e0b' },
  { image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=2000', tag: 'Just Arrived', title: 'Premium', bold: 'Selection.', accent: '#3b82f6' },
  { image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2000', tag: 'Festival Sale', title: 'Limited', bold: 'Edition.', accent: '#ef4444' },
  { image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=2000', tag: 'Tech Week', title: 'Modern', bold: 'Tech.', accent: '#8b5cf6' },
];

const BannerCarousel = ({ onShopNow }) => {
  const [cur, setCur] = useState(0);
  const timerRef = useRef(null);

  const go = useCallback((idx) => {
    setCur(((idx % SLIDES.length) + SLIDES.length) % SLIDES.length);
  }, []);

  const manual = (idx) => {
    clearInterval(timerRef.current);
    go(idx);
    timerRef.current = setInterval(() => setCur(c => (c + 1) % SLIDES.length), 5000);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => setCur(c => (c + 1) % SLIDES.length), 5000);
    return () => clearInterval(timerRef.current);
  }, []);

  const slide = SLIDES[cur];

  return (
    <section className="relative w-full overflow-hidden bg-black" style={{ height: 'clamp(280px, 60vw, 580px)' }}>
      {/* Image */}
      <AnimatePresence mode="wait">
        <motion.img
          key={cur}
          src={slide.image}
          alt={slide.bold}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      </AnimatePresence>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end sm:justify-center px-5 sm:px-12 pb-12 sm:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={cur + 'txt'}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg"
          >
            {/* Tag pill */}
            <motion.div className="inline-flex items-center gap-2 mb-3 sm:mb-5">
              <span className="px-3 py-1 rounded-full text-[8px] sm:text-[9px] uppercase tracking-[0.4em] font-black text-black"
                style={{ background: slide.accent }}>
                {slide.tag}
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.85] text-white mb-4 sm:mb-6">
              <span className="font-light italic">{slide.title}</span><br />
              <span style={{ color: slide.accent }}>{slide.bold}</span>
            </h1>

            <p className="text-white/50 text-[10px] sm:text-sm uppercase tracking-[0.3em] mb-6 sm:mb-8 max-w-xs hidden sm:block">
              Hand-vetted for material integrity and design permanence.
            </p>

            <div className="flex items-center gap-3">
              <button onClick={onShopNow}
                className="flex items-center gap-2 text-black text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-black px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95"
                style={{ background: slide.accent }}>
                Shop Now <ArrowRight size={12} />
              </button>
              <Link to="/philosophy"
                className="flex items-center gap-2 text-white text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-black px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-full border border-white/30 hover:bg-white/10 transition-all duration-300">
                Our Story
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Stats — desktop only */}
      <div className="absolute bottom-6 right-6 sm:right-12 hidden sm:flex items-center gap-8 z-10">
        {[{ n: 2400, s: '+', l: 'Products' }, { n: 98, s: '%', l: 'Satisfied' }, { n: 120, s: '+', l: 'Brands' }].map(({ n, s, l }) => (
          <div key={l} className="text-right">
            <div className="text-2xl font-black text-white tabular-nums"><Counter target={n} suffix={s} /></div>
            <div className="text-[8px] uppercase tracking-[0.4em] text-white/40 mt-0.5">{l}</div>
          </div>
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 flex items-center gap-1">
        <span className="text-white font-black text-sm sm:text-base tabular-nums">{String(cur + 1).padStart(2, '0')}</span>
        <span className="text-white/30 text-xs">/</span>
        <span className="text-white/30 text-xs">{String(SLIDES.length).padStart(2, '0')}</span>
      </div>

      {/* Arrows */}
      <button onClick={() => manual(cur - 1)}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-black/70 transition-all">
        <ChevronLeft size={16} className="text-white" />
      </button>
      <button onClick={() => manual(cur + 1)}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-black/70 transition-all">
        <ChevronRight size={16} className="text-white" />
      </button>

      {/* Progress bars */}
      <div className="absolute bottom-4 left-5 sm:left-12 z-20 flex items-center gap-1.5">
        {SLIDES.map((s, i) => (
          <button key={i} onClick={() => manual(i)} className="relative h-[3px] rounded-full overflow-hidden bg-white/20 transition-all duration-300"
            style={{ width: i === cur ? 28 : 12 }}>
            {i === cur && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 5, ease: 'linear' }}
                className="absolute inset-0 origin-left"
                style={{ background: slide.accent }}
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════════════════
   TRUST BADGES
══════════════════════════════════════════════════════════════════ */
const TrustBadges = () => {
  const badges = [
    { icon: Truck, title: 'Free Delivery', sub: 'Orders above ₹999', color: '#10b981' },
    { icon: RefreshCw, title: '30-Day Returns', sub: 'No questions asked', color: '#3b82f6' },
    { icon: Shield, title: 'Secure Pay', sub: '256-bit encrypted', color: '#8b5cf6' },
    { icon: Package, title: 'Gift Wrap', sub: 'Premium packaging', color: '#f59e0b' },
  ];
  return (
    <section className="bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-5 grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-100">
        {badges.map(({ icon: Icon, title, sub, color }) => (
          <div key={title} className="flex items-center gap-3 px-4 py-3 sm:py-4 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
              style={{ background: `${color}15` }}>
              <Icon size={16} style={{ color }} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-wide truncate">{title}</p>
              <p className="text-[8px] sm:text-[9px] text-gray-400 truncate">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════════════════
   FEATURED SLIDER
══════════════════════════════════════════════════════════════════ */
const FeaturedSlider = ({ products }) => {
  const [idx, setIdx] = useState(0);
  const featured = products.slice(0, 5);
  if (!featured.length) return null;
  const p = featured[idx];

  return (
    <section className="mb-6 sm:mb-12">
      <div className="flex items-center justify-between mb-4 px-1">
        <div>
          <p className="text-[8px] uppercase tracking-[0.5em] text-blue-500 font-black">Featured</p>
          <h2 className="text-lg sm:text-2xl font-black tracking-tight mt-0.5">Editor's Pick</h2>
        </div>
        <div className="flex gap-2">
          {[-1, 1].map(d => (
            <button key={d} onClick={() => setIdx(i => ((i + d + featured.length) % featured.length))}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all">
              {d < 0 ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={idx}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-900"
          style={{ minHeight: 'clamp(200px, 50vw, 400px)' }}
        >
          <img src={p.image} alt={p.name} className="absolute inset-0 w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="relative z-10 flex flex-col justify-end h-full p-5 sm:p-10 min-h-[200px]">
            <span className="text-[8px] uppercase tracking-widest text-amber-400 font-black mb-2">{p.category}</span>
            <h3 className="text-xl sm:text-4xl font-black text-white leading-tight mb-3 max-w-lg">{p.name}</h3>
            <div className="flex items-center gap-4">
              <span className="text-white text-lg sm:text-3xl font-black">₹{p.price.toLocaleString()}</span>
              <Link to={`/product/${p._id}`}
                className="flex items-center gap-2 bg-white text-black text-[9px] uppercase tracking-widest font-black px-5 py-2.5 rounded-full hover:bg-amber-400 transition-all duration-300 group">
                View <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
          {/* Dots */}
          <div className="absolute top-4 right-4 flex gap-1.5 z-10">
            {featured.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)}
                className={`rounded-full transition-all duration-300 ${i === idx ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40'}`} />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

/* ══════════════════════════════════════════════════════════════════
   PRODUCT CARD
══════════════════════════════════════════════════════════════════ */
const ProductCard = ({ product, index, onQuickView, onWishlist, isWished, onToast, listView, onAddToCart }) => {
  const [loaded, setLoaded] = useState(false);
  const [adding, setAdding] = useState(false);

  const doAdd = async (e) => {
    e.preventDefault(); e.stopPropagation();
    setAdding(true);
    await onAddToCart(product);
    onToast('Added to cart ✓');
    setTimeout(() => setAdding(false), 1800);
  };

  const doWish = (e) => {
    e.preventDefault(); e.stopPropagation();
    onWishlist(product._id);
    onToast(isWished ? 'Removed from wishlist' : 'Saved to wishlist ♥');
  };

  if (listView) return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.35, delay: index * 0.03 }}
      className="flex gap-3 bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-300 hover:shadow-lg transition-all duration-300 p-3"
    >
      <Link to={`/product/${product._id}`} className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-gray-50 shrink-0">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
        {product.category === 'Festival Offers' && (
          <span className="absolute top-1 left-1 bg-red-500 text-white text-[6px] font-black uppercase px-1.5 py-0.5 rounded-full">SALE</span>
        )}
      </Link>
      <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
        <div>
          <p className="text-[7px] uppercase tracking-[0.3em] text-gray-400 font-bold">{product.category}</p>
          <Link to={`/product/${product._id}`}>
            <h3 className="text-[11px] sm:text-sm font-bold mt-0.5 line-clamp-2 hover:text-gray-600 transition">{product.name}</h3>
          </Link>
          <div className="flex items-center gap-1 mt-1">
            <div className="bg-green-500 px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <span className="text-white text-[8px] font-black">4.0</span>
              <Star size={7} className="text-white fill-white" />
            </div>
            <span className="text-[8px] text-gray-400">(128)</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm sm:text-base font-black">₹{product.price.toLocaleString()}</span>
            <span className="text-[8px] text-green-600 font-bold ml-1.5">Free</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={doWish}
              className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${isWished ? 'bg-red-50 border-red-200 text-red-500' : 'border-gray-200 text-gray-400 hover:text-red-400'}`}>
              <Heart size={11} fill={isWished ? 'currentColor' : 'none'} />
            </button>
            <button onClick={doAdd} disabled={adding}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[8px] uppercase font-black transition-all ${adding ? 'bg-green-500 text-white' : 'bg-black text-white hover:bg-gray-800'}`}>
              <ShoppingBag size={9} />{adding ? '✓' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.35, delay: (index % 6) * 0.04 }}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 flex flex-col"
    >
      {/* Image */}
      <Link to={`/product/${product._id}`} className="relative block overflow-hidden bg-gray-50" style={{ paddingBottom: '100%' }}>
        <div className="absolute inset-0">
          {!loaded && <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-100 to-gray-200" />}
          <img src={product.image} alt={product.name} onLoad={() => setLoaded(true)}
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.07] ${loaded ? 'opacity-100' : 'opacity-0'}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.category === 'Festival Offers' && (
            <span className="bg-red-500 text-white px-2 py-0.5 text-[6px] sm:text-[7px] uppercase font-black rounded-full shadow-sm flex items-center gap-0.5">
              <Tag size={7} /> Sale
            </span>
          )}
          {index < 4 && (
            <span className="bg-amber-400 text-black px-2 py-0.5 text-[6px] sm:text-[7px] uppercase font-black rounded-full shadow-sm flex items-center gap-0.5">
              <Flame size={7} /> Hot
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button onClick={doWish}
          className={`absolute top-2 right-2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
            isWished ? 'bg-red-500 text-white scale-100' : 'bg-white/90 text-gray-400 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100'
          }`}>
          <Heart size={12} fill={isWished ? 'currentColor' : 'none'} />
        </button>
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 p-3 gap-1.5">
        <p className="text-[7px] uppercase tracking-[0.3em] text-gray-400 font-bold">{product.category}</p>

        <Link to={`/product/${product._id}`}>
          <h3 className="text-[11px] sm:text-[12px] font-bold text-gray-800 line-clamp-2 leading-snug hover:text-black transition">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1.5">
          <div className="bg-green-500 px-1.5 py-0.5 rounded flex items-center gap-0.5 w-fit">
            <span className="text-white text-[8px] font-black">4.0</span>
            <Star size={7} className="text-white fill-white" />
          </div>
          <span className="text-[8px] text-gray-400">(128)</span>
        </div>

        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="text-sm sm:text-base font-black text-gray-900">₹{product.price.toLocaleString()}</span>
          <span className="text-[7px] sm:text-[8px] text-green-600 font-bold">Free delivery</span>
        </div>

        {/* Actions */}
        <div className="flex gap-1.5 mt-auto pt-2 border-t border-gray-100">
          <button onClick={doAdd} disabled={adding}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 sm:py-2.5 text-[8px] sm:text-[9px] uppercase tracking-wide font-black rounded-xl transition-all duration-300 ${
              adding ? 'bg-green-500 text-white' : 'bg-gray-900 text-white hover:bg-black'
            }`}>
            <ShoppingBag size={10} /> {adding ? 'Added ✓' : 'Add to Cart'}
          </button>
          <button onClick={(e) => { e.preventDefault(); onQuickView(product); }}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center border border-gray-200 rounded-xl text-gray-400 hover:border-gray-900 hover:text-gray-900 transition-all shrink-0">
            <Eye size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   MAIN HOME
══════════════════════════════════════════════════════════════════ */
const Home = () => {
  const [splash, setSplash]           = useState(true);
  const [products, setProducts]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [selected, setSelected]       = useState(null);
  const [category, setCategory]       = useState('All');
  const [sortBy, setSortBy]           = useState('newest');
  const [visible, setVisible]         = useState(20);
  const [viewMode, setViewMode]       = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange]   = useState([0, 100000]);
  const [toast, setToast]             = useState(null);
  const [wishlist, setWishlist]       = useState([]);

  const { user }      = useAuth();
  const { addToCart } = useCart();
  const auth          = user?.token ? { headers: { Authorization: `Bearer ${user.token}` } } : {};
  const location      = useLocation();
  const q             = new URLSearchParams(location.search).get('search') || '';

  useEffect(() => {
    if (!user?.token) { setWishlist([]); return; }
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/wishlist`, auth)
      .then(({ data }) => setWishlist(data.map(p => p._id)))
      .catch(() => {});
  }, [user]);

  const toggleWishlist = useCallback(async (id) => {
    if (!user?.token) return;
    if (wishlist.includes(id)) {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/wishlist/${id}`, auth);
      setWishlist(p => p.filter(x => x !== id));
    } else {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/wishlist/${id}`, {}, auth);
      setWishlist(p => [...p, id]);
    }
  }, [wishlist, user]);

  const doAddToCart = useCallback(async (product) => {
    if (!user) { setToast('Please sign in first'); return; }
    await addToCart(product);
  }, [user, addToCart]);

  const cats = [
    { name: 'All', icon: <Sparkles size={11} /> },
    { name: 'Home Needs', icon: <HomeIcon size={11} /> },
    { name: 'Sanitary', icon: <Bath size={11} /> },
    { name: 'Laptops', icon: <Laptop size={11} /> },
    { name: 'Stores', icon: <ShoppingBag size={11} /> },
    { name: 'Electronics', icon: <BellElectric size={11} /> },
    { name: 'Festival Offers', icon: <Percent size={11} /> },
  ];

  useEffect(() => {
    setLoading(true);
    let url = `${import.meta.env.VITE_API_BASE_URL}/products?keyword=${q}`;
    if (category !== 'All') url += `&category=${category}`;
    axios.get(url).then(({ data }) => {
      let s = [...data];
      if (sortBy === 'price-low')  s.sort((a, b) => a.price - b.price);
      if (sortBy === 'price-high') s.sort((a, b) => b.price - a.price);
      if (sortBy === 'rating')     s.sort((a, b) => (b.rating || 4) - (a.rating || 4));
      setProducts(s);
      setVisible(20);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [q, category, sortBy]);

  const filtered = products.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
  const shown    = filtered.slice(0, visible);

  const marquee = ['Free Shipping ₹999+', 'New 2026 Archive', '30-Day Returns', 'Secure Checkout', 'Members Early Access'];

  return (
    <>
      <AnimatePresence>{splash && <SplashScreen onDone={() => setSplash(false)} />}</AnimatePresence>

      <div className="bg-[#f4f4f4] min-h-screen text-gray-900 selection:bg-black selection:text-white overflow-x-hidden">
        <Navbar />
        <AnimatePresence>{selected && <QuickView product={selected} onClose={() => setSelected(null)} />}</AnimatePresence>
        <AnimatePresence>{toast && <Toast message={toast} onDone={() => setToast(null)} />}</AnimatePresence>

        {/* Marquee */}
        <Marquee items={marquee} />

        {/* Banner */}
        {!q && <BannerCarousel onShopNow={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })} />}

        {/* Trust */}
        {!q && <TrustBadges />}

        {/* Main */}
        <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8" id="shop">

          {/* Featured */}
          {!q && !loading && products.length > 0 && <FeaturedSlider products={products} />}

          {/* Section header */}
          {!q && (
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-[9px] uppercase tracking-[0.5em] text-gray-400 font-black whitespace-nowrap">All Products</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
          )}

          {/* Sticky Controls */}
          <div className="sticky top-14 sm:top-20 z-40 mb-4">
            <div className="bg-white/95 backdrop-blur-xl border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden">
              {/* Category scroll */}
              <div className="flex gap-1 p-2 overflow-x-auto no-scrollbar">
                {cats.map(({ name, icon }) => (
                  <button key={name} onClick={() => setCategory(name)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[8px] sm:text-[9px] uppercase tracking-wide font-black whitespace-nowrap transition-all duration-200 ${
                      category === name ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                    }`}>
                    {icon} {name}
                  </button>
                ))}
              </div>

              {/* Controls row */}
              <div className="flex items-center justify-between px-3 pb-2 pt-1 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-[8px] text-gray-400 font-medium hidden sm:block">{filtered.length} products</span>
                  <button onClick={() => setShowFilters(f => !f)}
                    className={`flex items-center gap-1.5 text-[8px] uppercase tracking-wide font-black px-2.5 py-1.5 rounded-lg transition-all ${showFilters ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    <SlidersHorizontal size={10} /> Filter
                  </button>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                    {[['grid', Grid3X3], ['list', LayoutList]].map(([m, Icon]) => (
                      <button key={m} onClick={() => setViewMode(m)}
                        className={`p-1.5 rounded-md transition-all ${viewMode === m ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400'}`}>
                        <Icon size={12} />
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 bg-gray-100 rounded-lg px-2.5 py-1.5">
                    <ArrowUpDown size={9} className="text-gray-400" />
                    <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                      className="text-[8px] uppercase font-black bg-transparent outline-none cursor-pointer text-gray-700">
                      <option value="newest">New</option>
                      <option value="price-low">Low ↑</option>
                      <option value="price-high">High ↓</option>
                      <option value="rating">Top</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mt-1.5">
                  <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[9px] uppercase tracking-widest font-black text-gray-500">Price Range</p>
                      <button onClick={() => setPriceRange([0, 100000])}
                        className="text-[8px] uppercase font-black text-gray-400 hover:text-gray-900 transition flex items-center gap-1">
                        <X size={9} /> Reset
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-[8px] text-gray-500 mb-1.5">
                          <span>Min: ₹{priceRange[0].toLocaleString()}</span>
                          <span>Max: ₹{priceRange[1].toLocaleString()}</span>
                        </div>
                        <div className="space-y-2">
                          <input type="range" min={0} max={100000} step={500} value={priceRange[0]}
                            onChange={e => setPriceRange([+e.target.value, priceRange[1]])}
                            className="w-full accent-gray-900 h-1" />
                          <input type="range" min={0} max={100000} step={500} value={priceRange[1]}
                            onChange={e => setPriceRange([priceRange[0], +e.target.value])}
                            className="w-full accent-gray-900 h-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Wishlist strip */}
          <AnimatePresence>
            {wishlist.length > 0 && user && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="mb-4 overflow-hidden">
                <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-100 rounded-2xl px-4 py-3 flex items-center gap-3">
                  <Heart size={13} className="text-red-500 fill-red-500 shrink-0" />
                  <span className="text-[9px] uppercase tracking-wide font-black text-red-600">{wishlist.length} saved</span>
                  <Link to="/wishlist" className="ml-auto flex items-center gap-1.5 text-[9px] uppercase font-black text-red-600 hover:text-red-800 transition">
                    View <ArrowRight size={10} />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products */}
          {loading ? (
            <div className={`grid gap-3 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'grid-cols-1'}`}>
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className={`bg-white rounded-2xl border border-gray-100 overflow-hidden ${viewMode === 'list' ? 'flex gap-3 p-3 h-28' : ''}`}>
                  <div className={`animate-pulse bg-gradient-to-br from-gray-100 to-gray-200 ${viewMode === 'list' ? 'w-24 h-22 rounded-xl shrink-0' : 'w-full aspect-square'}`} />
                  {viewMode === 'grid' && (
                    <div className="p-3 space-y-2">
                      <div className="h-2.5 bg-gray-100 rounded-full animate-pulse w-2/3" />
                      <div className="h-3 bg-gray-100 rounded-full animate-pulse" />
                      <div className="h-8 bg-gray-100 rounded-xl animate-pulse mt-3" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 sm:py-32 text-center bg-white rounded-2xl border border-gray-100">
              <Search size={32} className="text-gray-200 mx-auto mb-4" />
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-black">No products found</p>
              <button onClick={() => { setCategory('All'); setPriceRange([0, 100000]); }}
                className="mt-4 text-[9px] uppercase font-black text-gray-900 underline">Clear filters</button>
            </div>
          ) : (
            <>
              <div className={viewMode === 'grid'
                ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4'
                : 'flex flex-col gap-3'
              }>
                {shown.map((product, i) => (
                  <ProductCard key={product._id} product={product} index={i}
                    onQuickView={setSelected} onWishlist={toggleWishlist}
                    isWished={wishlist.includes(product._id)} onToast={setToast}
                    onAddToCart={doAddToCart} listView={viewMode === 'list'} />
                ))}
              </div>

              {visible < filtered.length && (
                <div className="mt-10 flex flex-col items-center gap-3">
                  <button onClick={() => setVisible(v => v + 20)}
                    className="flex items-center gap-2 bg-gray-900 text-white text-[9px] uppercase tracking-widest font-black px-10 py-3.5 rounded-full hover:bg-black transition-all duration-300 hover:scale-105 active:scale-95 group">
                    Load More <Plus size={12} className="group-hover:rotate-90 transition-transform duration-300" />
                  </button>
                  <p className="text-[8px] text-gray-400 uppercase tracking-widest">{visible} of {filtered.length}</p>
                </div>
              )}
            </>
          )}

          {/* Editorial */}
          {!loading && (
            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
              className="mt-12 sm:mt-20 rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-900 text-white">
              <div className="grid grid-cols-1 sm:grid-cols-2">
                <div className="relative aspect-[4/3] sm:aspect-auto">
                  <img src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=2000"
                    className="w-full h-full object-cover opacity-60" alt="Studio" />
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent" />
                </div>
                <div className="flex flex-col justify-center p-8 sm:p-12 gap-5">
                  <span className="text-[8px] uppercase tracking-[0.6em] text-amber-400 font-black">Our Philosophy</span>
                  <h2 className="text-3xl sm:text-5xl font-black leading-[0.9] tracking-tight">
                    Curated for<br /><span className="text-amber-400">the Few.</span>
                  </h2>
                  <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                    Every object is hand-vetted for aesthetic permanence. We don't follow trends — we curate artifacts that last.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {[{ n: 12, l: 'Years', s: '+' }, { n: 500, l: 'Partners', s: '+' }].map(({ n, l, s }) => (
                      <div key={l} className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="text-2xl font-black tabular-nums text-amber-400"><Counter target={n} suffix={s} /></div>
                        <div className="text-[8px] uppercase tracking-widest text-gray-500 mt-1">{l}</div>
                      </div>
                    ))}
                  </div>
                  <Link to="/philosophy"
                    className="inline-flex items-center gap-2 text-[9px] uppercase tracking-widest font-black text-amber-400 hover:text-amber-300 transition group">
                    Read Our Story <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.section>
          )}

          {/* Newsletter */}
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="mt-8 sm:mt-12 relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8 sm:p-16 text-center border border-white/5">
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #f59e0b 0%, transparent 50%), radial-gradient(circle at 80% 50%, #3b82f6 0%, transparent 50%)' }} />
            <div className="relative z-10 max-w-lg mx-auto">
              <span className="text-[8px] uppercase tracking-[0.7em] text-amber-400 font-black block mb-4">Members Only</span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-3">Join the Archive.</h2>
              <p className="text-gray-400 text-[10px] sm:text-sm mb-6 sm:mb-8">Early access to new drops & exclusive deals.</p>
              <div className="flex bg-white/5 border border-white/10 rounded-full overflow-hidden focus-within:border-amber-400/50 transition-colors max-w-sm mx-auto">
                <input type="email" placeholder="your@email.com"
                  className="bg-transparent flex-1 text-[11px] outline-none px-5 py-3 placeholder:text-gray-600 min-w-0" />
                <button className="bg-amber-400 text-black px-5 py-2.5 text-[8px] font-black uppercase tracking-widest rounded-full m-1 hover:bg-amber-300 transition-colors whitespace-nowrap">
                  Join
                </button>
              </div>
              <p className="text-[8px] text-gray-600 mt-3">No spam. Unsubscribe anytime.</p>
            </div>
          </motion.section>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white mt-8 sm:mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-16">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pb-10 border-b border-white/10">
              <div className="col-span-2 sm:col-span-1 space-y-4">
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight">MINI<span className="text-amber-400">KART</span></h3>
                <p className="text-[10px] text-gray-500 leading-relaxed max-w-[180px]">Curated objects for minimalist living.</p>
                <div className="flex gap-2">
                  {['IG', 'PIN', 'TW', 'YT'].map(s => (
                    <button key={s} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-[8px] font-black text-gray-400 hover:bg-amber-400 hover:text-black hover:border-amber-400 transition-all duration-300">{s}</button>
                  ))}
                </div>
              </div>
              {[
                { title: 'Shop', links: ['Archive', 'New Arrivals', 'Festival', 'Electronics'] },
                { title: 'Info', links: ['Philosophy', 'Blog', 'About Us'] },
                { title: 'Help', links: ['FAQs', 'Returns', 'Shipping', 'Contact'] },
              ].map(({ title, links }) => (
                <div key={title} className="space-y-3">
                  <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-400">{title}</h4>
                  <ul className="space-y-2">
                    {links.map(l => (
                      <li key={l} className="text-[10px] text-gray-500 hover:text-white cursor-pointer transition-colors">{l}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-6">
              <p className="text-[8px] uppercase tracking-[0.5em] text-gray-600">© 2026 MINIKART. All rights reserved.</p>
              <div className="flex gap-5">
                {['Terms', 'Privacy', 'Cookies'].map(t => (
                  <span key={t} className="text-[8px] uppercase tracking-widest text-gray-600 hover:text-white cursor-pointer transition-colors font-bold">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </footer>

        {/* Back to top */}
        <motion.button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          className="fixed bottom-24 sm:bottom-8 right-4 sm:right-6 w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-black border border-white/10 transition z-40 text-xs font-black">
          ↑
        </motion.button>
      </div>
    </>
  );
};

export default Home;