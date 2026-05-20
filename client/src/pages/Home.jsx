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
   SPLASH
══════════════════════════════════════════════════════════════════ */
const SplashScreen = ({ onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 2600); return () => clearTimeout(t); }, [onDone]);
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[99999] bg-[#0a0a0a] flex flex-col items-center justify-center"
    >
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '36px 36px' }} />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 3, opacity: 0.08 }}
        transition={{ duration: 1.6, ease: 'easeOut' }}
        className="absolute w-48 h-48 rounded-full bg-white"
      />
      <div className="relative flex flex-col items-center gap-6">
        <div className="flex items-end overflow-hidden">
          {'MINIKART'.split('').map((l, i) => (
            <motion.span key={i}
              initial={{ y: 70, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.055, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className={`font-black tracking-[-0.02em] leading-none text-6xl sm:text-8xl ${i < 4 ? 'text-white' : 'text-white/20'}`}>
              {l}
            </motion.span>
          ))}
        </div>
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: 0.65, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-[2px] bg-gradient-to-r from-transparent via-white to-transparent origin-left" />
        <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.4 }}
          className="text-[9px] uppercase tracking-[0.7em] text-white/30 font-medium">
          The 2026 Archive
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
          className="flex gap-1.5">
          {[0,1,2].map(i => (
            <motion.div key={i}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
              className="w-1.5 h-1.5 bg-white rounded-full" />
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
  <div className="overflow-hidden bg-gray-900 text-white py-2 flex">
    {[0,1,2].map(i => (
      <motion.div key={i} animate={{ x: ['0%','-100%'] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        className="flex items-center gap-8 whitespace-nowrap px-6 shrink-0">
        {items.map((item, j) => (
          <span key={j} className="text-[8px] uppercase tracking-[0.4em] font-semibold text-white/50 flex items-center gap-2">
            <span className="text-amber-400">★</span> {item}
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
    const t = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(t); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(t);
  }, [inView, target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

/* ══════════════════════════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════════════════════════ */
const Toast = ({ message, onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 2200); return () => clearTimeout(t); }, [onDone]);
  return (
    <motion.div
      initial={{ y: 80, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 80, opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', damping: 22, stiffness: 300 }}
      className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-auto z-[998]"
    >
      <div className="bg-gray-900 text-white px-5 py-3 text-[10px] uppercase tracking-widest font-bold rounded-2xl shadow-2xl flex items-center gap-2.5 border border-white/10 sm:whitespace-nowrap">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shrink-0" />
        <span className="truncate">{message}</span>
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   BANNER
══════════════════════════════════════════════════════════════════ */
const SLIDES = [
  { image:'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000', tag:'New Collection', title:'Curated', bold:'Objects.', color:'#f59e0b' },
  { image:'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=2000', tag:'Just Arrived', title:'Premium', bold:'Selection.', color:'#3b82f6' },
  { image:'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2000', tag:'Festival Sale', title:'Limited', bold:'Edition.', color:'#ef4444' },
  { image:'https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=2000', tag:'Tech Week', title:'Modern', bold:'Tech.', color:'#8b5cf6' },
];

const Banner = ({ onShop }) => {
  const [cur, setCur] = useState(0);
  const timer = useRef(null);

  const go = useCallback((idx) => {
    clearInterval(timer.current);
    setCur(((idx % SLIDES.length) + SLIDES.length) % SLIDES.length);
    timer.current = setInterval(() => setCur(c => (c+1) % SLIDES.length), 5000);
  }, []);

  useEffect(() => {
    timer.current = setInterval(() => setCur(c => (c+1) % SLIDES.length), 5000);
    return () => clearInterval(timer.current);
  }, []);

  const s = SLIDES[cur];

  return (
    <section className="relative overflow-hidden bg-black" style={{ height:'clamp(260px,58vw,560px)' }}>
      <AnimatePresence mode="wait">
        <motion.img key={cur} src={s.image} alt={s.bold}
          initial={{ opacity:0, scale:1.06 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
          transition={{ duration:0.75 }}
          className="absolute inset-0 w-full h-full object-cover object-center" />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end sm:justify-center px-5 sm:px-14 pb-10 sm:pb-0">
        <AnimatePresence mode="wait">
          <motion.div key={cur+'c'} initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:20 }}
            transition={{ duration:0.45 }} className="max-w-lg">
            <span className="inline-block px-3 py-1 rounded-full text-[8px] sm:text-[9px] uppercase tracking-[0.4em] font-black text-black mb-3 sm:mb-4"
              style={{ background: s.color }}>{s.tag}</span>
            <h1 className="font-black tracking-tight leading-[0.85] text-white mb-4 sm:mb-6"
              style={{ fontSize:'clamp(2.2rem,8vw,5.5rem)' }}>
              <span className="font-light italic">{s.title}</span><br />
              <span style={{ color: s.color }}>{s.bold}</span>
            </h1>
            <div className="flex items-center gap-3">
              <button onClick={onShop}
                className="flex items-center gap-2 text-black text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-black px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-full transition-all hover:scale-105 active:scale-95"
                style={{ background: s.color }}>
                Shop Now <ArrowRight size={12} />
              </button>
              <Link to="/philosophy"
                className="text-white text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-black px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-full border border-white/30 hover:bg-white/10 transition-all">
                Our Story
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide number */}
      <div className="absolute top-3 right-4 z-10 flex items-center gap-1">
        <span className="text-white font-black text-sm tabular-nums">{String(cur+1).padStart(2,'0')}</span>
        <span className="text-white/30 text-xs">/</span>
        <span className="text-white/30 text-xs">{String(SLIDES.length).padStart(2,'0')}</span>
      </div>

      {/* Arrows — desktop only */}
      <button onClick={() => go(cur-1)}
        className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur border border-white/10 items-center justify-center hover:bg-black/70 transition-all">
        <ChevronLeft size={16} className="text-white" />
      </button>
      <button onClick={() => go(cur+1)}
        className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur border border-white/10 items-center justify-center hover:bg-black/70 transition-all">
        <ChevronRight size={16} className="text-white" />
      </button>

      {/* Progress dots */}
      <div className="absolute bottom-4 left-5 sm:left-14 z-20 flex gap-1.5">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => go(i)}
            className="relative h-[3px] rounded-full overflow-hidden bg-white/25 transition-all duration-300"
            style={{ width: i===cur ? 24 : 10 }}>
            {i===cur && (
              <motion.div initial={{ scaleX:0 }} animate={{ scaleX:1 }}
                transition={{ duration:5, ease:'linear' }}
                className="absolute inset-0 origin-left" style={{ background: s.color }} />
            )}
          </button>
        ))}
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════════════════════════
   TRUST BADGES — horizontal scroll on mobile
══════════════════════════════════════════════════════════════════ */
const TrustRow = () => {
  const badges = [
    { icon: Truck,     title:'Free Delivery',  sub:'Above ₹999',     color:'#10b981' },
    { icon: RefreshCw, title:'30-Day Returns', sub:'Hassle-free',     color:'#3b82f6' },
    { icon: Shield,    title:'Secure Pay',     sub:'256-bit SSL',     color:'#8b5cf6' },
    { icon: Package,   title:'Gift Wrap',      sub:'Premium pack',    color:'#f59e0b' },
  ];
  return (
    <div className="bg-white border-y border-gray-100 overflow-x-auto no-scrollbar">
      <div className="flex divide-x divide-gray-100 min-w-max sm:min-w-0 sm:grid sm:grid-cols-4">
        {badges.map(({ icon:Icon, title, sub, color }) => (
          <div key={title} className="flex items-center gap-2.5 px-4 sm:px-6 py-3.5 shrink-0 sm:shrink">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background:`${color}18` }}>
              <Icon size={15} style={{ color }} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wide whitespace-nowrap">{title}</p>
              <p className="text-[8px] text-gray-400 whitespace-nowrap">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   FEATURED — compact mobile card
══════════════════════════════════════════════════════════════════ */
const Featured = ({ products }) => {
  const [idx, setIdx] = useState(0);
  const list = products.slice(0, 5);
  if (!list.length) return null;
  const p = list[idx];
  return (
    <section className="mb-5 sm:mb-8">
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <p className="text-[8px] uppercase tracking-[0.5em] text-amber-500 font-black">Featured</p>
          <h2 className="text-base sm:text-xl font-black tracking-tight">Editor's Pick</h2>
        </div>
        <div className="flex gap-1.5">
          {[-1,1].map(d => (
            <button key={d} onClick={() => setIdx(i => ((i+d+list.length)%list.length))}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all">
              {d<0 ? <ChevronLeft size={12}/> : <ChevronRight size={12}/>}
            </button>
          ))}
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={idx}
          initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
          className="relative rounded-2xl overflow-hidden bg-gray-900"
          style={{ height:'clamp(160px,42vw,320px)' }}>
          <img src={p.image} alt={p.name} className="absolute inset-0 w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          <div className="relative z-10 h-full flex flex-col justify-end p-4 sm:p-8">
            <span className="text-[7px] sm:text-[8px] uppercase tracking-widest text-amber-400 font-black mb-1">{p.category}</span>
            <h3 className="text-base sm:text-3xl font-black text-white leading-tight mb-2 sm:mb-3 line-clamp-2">{p.name}</h3>
            <div className="flex items-center gap-3">
              <span className="text-white font-black text-base sm:text-2xl">₹{p.price.toLocaleString()}</span>
              <Link to={`/product/${p._id}`}
                className="flex items-center gap-1.5 bg-white text-black text-[8px] sm:text-[9px] uppercase tracking-widest font-black px-4 py-2 rounded-full hover:bg-amber-400 transition-all group">
                View <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform"/>
              </Link>
            </div>
          </div>
          <div className="absolute top-3 right-3 flex gap-1 z-10">
            {list.map((_,i) => (
              <button key={i} onClick={() => setIdx(i)}
                className={`rounded-full transition-all ${i===idx ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/30'}`}/>
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
const Card = ({ product, index, onQuickView, onWishlist, isWished, onToast, listView, onAdd }) => {
  const [loaded, setLoaded] = useState(false);
  const [adding, setAdding] = useState(false);

  const doAdd = async (e) => {
    e.preventDefault(); e.stopPropagation();
    setAdding(true);
    await onAdd(product);
    onToast('Added to cart ✓');
    setTimeout(() => setAdding(false), 1800);
  };

  const doWish = (e) => {
    e.preventDefault(); e.stopPropagation();
    onWishlist(product._id);
    onToast(isWished ? 'Removed from wishlist' : 'Saved ♥');
  };

  // ── LIST ─────────────────────────────────────────────────────
  if (listView) return (
    <motion.div
      initial={{ opacity:0, y:6 }} whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true }} transition={{ duration:0.3, delay: index*0.02 }}
      className="flex gap-3 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-all duration-300 p-3"
    >
      <Link to={`/product/${product._id}`}
        className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-50 shrink-0">
        <img src={product.image} alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"/>
        {product.category==='Festival Offers' && (
          <span className="absolute top-1 left-1 bg-red-500 text-white text-[6px] font-black uppercase px-1.5 py-0.5 rounded-full">SALE</span>
        )}
      </Link>
      <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
        <div>
          <p className="text-[7px] uppercase tracking-wide text-gray-400 font-bold truncate">{product.category}</p>
          <Link to={`/product/${product._id}`}>
            <h3 className="text-[11px] font-bold mt-0.5 line-clamp-2 hover:text-gray-600 transition leading-snug">{product.name}</h3>
          </Link>
          <div className="flex items-center gap-1 mt-1">
            <span className="bg-green-500 text-white text-[7px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
              4.0 <Star size={6} className="fill-white"/>
            </span>
            <span className="text-[7px] text-gray-400">(128)</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <div>
            <span className="font-black text-sm">₹{product.price.toLocaleString()}</span>
            <span className="text-[7px] text-green-600 font-bold ml-1">Free</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={doWish}
              className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${isWished ? 'bg-red-50 border-red-200 text-red-500' : 'border-gray-200 text-gray-400 hover:text-red-400'}`}>
              <Heart size={11} fill={isWished?'currentColor':'none'}/>
            </button>
            <button onClick={doAdd} disabled={adding}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-[8px] uppercase font-black transition-all ${adding ? 'bg-green-500 text-white' : 'bg-gray-900 text-white hover:bg-black'}`}>
              <ShoppingBag size={9}/>{adding ? '✓' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // ── GRID ─────────────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity:0, y:10 }} whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true }} transition={{ duration:0.3, delay:(index%6)*0.04 }}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col"
    >
      {/* Image */}
      <Link to={`/product/${product._id}`}
        className="relative block overflow-hidden bg-gray-50" style={{ paddingBottom:'100%' }}>
        <div className="absolute inset-0">
          {!loaded && <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-100 to-gray-200"/>}
          <img src={product.image} alt={product.name}
            onLoad={() => setLoaded(true)}
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06] ${loaded?'opacity-100':'opacity-0'}`}/>
        </div>
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.category==='Festival Offers' && (
            <span className="bg-red-500 text-white px-2 py-0.5 text-[6px] uppercase font-black rounded-full flex items-center gap-0.5 shadow-sm w-fit">
              <Tag size={6}/> Sale
            </span>
          )}
          {index < 4 && (
            <span className="bg-amber-400 text-black px-2 py-0.5 text-[6px] uppercase font-black rounded-full flex items-center gap-0.5 shadow-sm w-fit">
              <Flame size={6}/> Hot
            </span>
          )}
        </div>
        {/* Wishlist */}
        <button onClick={doWish}
          className={`absolute top-2 right-2 z-10 w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
            isWished ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-400 opacity-0 group-hover:opacity-100 sm:opacity-100'
          }`}>
          <Heart size={11} fill={isWished?'currentColor':'none'}/>
        </button>
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 p-2.5 sm:p-3 gap-1">
        <p className="text-[7px] uppercase tracking-wide text-gray-400 font-bold truncate">{product.category}</p>
        <Link to={`/product/${product._id}`}>
          <h3 className="text-[10px] sm:text-[11px] font-bold text-gray-800 line-clamp-2 leading-snug hover:text-black transition">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1.5">
          <span className="bg-green-500 text-white text-[7px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
            4.0 <Star size={6} className="fill-white"/>
          </span>
          <span className="text-[7px] text-gray-400">(128)</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-sm font-black text-gray-900">₹{product.price.toLocaleString()}</span>
          <span className="text-[7px] text-green-600 font-bold">Free</span>
        </div>
        {/* Actions */}
        <div className="flex gap-1.5 mt-1 pt-2 border-t border-gray-100">
          <button onClick={doAdd} disabled={adding}
            className={`flex-1 flex items-center justify-center gap-1 py-2 text-[8px] uppercase font-black rounded-xl transition-all duration-300 ${
              adding ? 'bg-green-500 text-white' : 'bg-gray-900 text-white hover:bg-black active:scale-95'
            }`}>
            <ShoppingBag size={9}/>{adding ? 'Added ✓' : 'Add to Cart'}
          </button>
          <button onClick={(e) => { e.preventDefault(); onQuickView(product); }}
            className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-xl text-gray-400 hover:border-gray-900 hover:text-gray-900 transition-all shrink-0">
            <Eye size={11}/>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════════════ */
const Home = () => {
  const [splash, setSplash]         = useState(true);
  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [selected, setSelected]     = useState(null);
  const [category, setCategory]     = useState('All');
  const [sortBy, setSortBy]         = useState('newest');
  const [visible, setVisible]       = useState(20);
  const [viewMode, setViewMode]     = useState('grid');
  const [showFilter, setShowFilter] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [toast, setToast]           = useState(null);
  const [wishlist, setWishlist]     = useState([]);

  const { user }      = useAuth();
  const { addToCart } = useCart();
  const auth = user?.token ? { headers:{ Authorization:`Bearer ${user.token}` } } : {};
  const loc  = useLocation();
  const q    = new URLSearchParams(loc.search).get('search') || '';

  useEffect(() => {
    if (!user?.token) { setWishlist([]); return; }
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/wishlist`, auth)
      .then(({ data }) => setWishlist(data.map(p => p._id))).catch(() => {});
  }, [user]);

  const toggleWish = useCallback(async (id) => {
    if (!user?.token) return;
    if (wishlist.includes(id)) {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/wishlist/${id}`, auth);
      setWishlist(p => p.filter(x => x !== id));
    } else {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/wishlist/${id}`, {}, auth);
      setWishlist(p => [...p, id]);
    }
  }, [wishlist, user]);

  const doAdd = useCallback(async (product) => {
    if (!user) { setToast('Please sign in first'); return; }
    await addToCart(product);
  }, [user, addToCart]);

  const CATS = [
    { name:'All',            icon:'✦' },
    { name:'Home Needs',     icon:'🏠' },
    { name:'Sanitary',       icon:'🚿' },
    { name:'Laptops',        icon:'💻' },
    { name:'Stores',         icon:'🛍️' },
    { name:'Electronics',    icon:'⚡' },
    { name:'Festival Offers',icon:'🎉' },
  ];

  useEffect(() => {
    setLoading(true);
    let url = `${import.meta.env.VITE_API_BASE_URL}/products?keyword=${q}`;
    if (category !== 'All') url += `&category=${category}`;
    axios.get(url).then(({ data }) => {
      let s = [...data];
      if (sortBy==='price-low')  s.sort((a,b) => a.price-b.price);
      if (sortBy==='price-high') s.sort((a,b) => b.price-a.price);
      if (sortBy==='rating')     s.sort((a,b) => (b.rating||4)-(a.rating||4));
      setProducts(s);
      setVisible(20);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [q, category, sortBy]);

  const filtered = products.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
  const shown    = filtered.slice(0, visible);

  return (
    <>
      <AnimatePresence>{splash && <SplashScreen onDone={() => setSplash(false)}/>}</AnimatePresence>

      <div className="bg-[#f5f5f5] min-h-screen text-gray-900 overflow-x-hidden">
        <Navbar/>
        <AnimatePresence>{selected && <QuickView product={selected} onClose={() => setSelected(null)}/>}</AnimatePresence>
        <AnimatePresence>{toast && <Toast message={toast} onDone={() => setToast(null)}/>}</AnimatePresence>

        {/* Marquee */}
       {/* Banner */}
        {!q && <Banner onShop={() => document.getElementById('shop')?.scrollIntoView({ behavior:'smooth' })}/>}

        {/* Trust */}
        {!q && <TrustRow/>}

        <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8" id="shop">

          {/* Featured */}
          {!q && !loading && products.length > 0 && <Featured products={products}/>}

          {/* Section divider */}
          {!q && (
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-gray-200"/>
              <span className="text-[8px] uppercase tracking-[0.5em] text-gray-400 font-black whitespace-nowrap px-2">All Products</span>
              <div className="flex-1 h-px bg-gray-200"/>
            </div>
          )}

          {/* ── CONTROLS ──────────────────────────────────────── */}
          <div className="sticky top-14 sm:top-20 z-40 mb-3 sm:mb-4">
            <div className="bg-white/95 backdrop-blur-xl border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden">

              {/* Category tabs — compact, emoji + short name */}
              <div className="flex gap-1 px-2 pt-2 pb-1 overflow-x-auto no-scrollbar">
                {CATS.map(({ name, icon }) => (
                  <button key={name} onClick={() => setCategory(name)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[8px] font-black whitespace-nowrap transition-all duration-200 shrink-0 ${
                      category===name
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                    }`}>
                    <span className="text-[10px]">{icon}</span>
                    <span className="hidden sm:inline">{name}</span>
                    <span className="sm:hidden">{name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>

              {/* Second row — filter + view + sort */}
              <div className="flex items-center justify-between px-2 pb-2 pt-1 border-t border-gray-100">
                <div className="flex items-center gap-1.5">
                  <span className="text-[8px] text-gray-400 font-medium hidden sm:block">{filtered.length} items</span>
                  <button onClick={() => setShowFilter(f => !f)}
                    className={`flex items-center gap-1 text-[8px] uppercase font-black px-2.5 py-1.5 rounded-xl transition-all ${showFilter ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    <SlidersHorizontal size={10}/> Filter
                  </button>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center bg-gray-100 rounded-xl p-0.5">
                    {[['grid', Grid3X3],['list', LayoutList]].map(([m, Icon]) => (
                      <button key={m} onClick={() => setViewMode(m)}
                        className={`p-1.5 rounded-lg transition-all ${viewMode===m ? 'bg-white shadow text-gray-900' : 'text-gray-400'}`}>
                        <Icon size={12}/>
                      </button>
                    ))}
                  </div>
                  <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                    className="text-[8px] uppercase font-black bg-gray-100 text-gray-700 border-0 outline-none cursor-pointer rounded-xl px-2.5 py-1.5">
                    <option value="newest">New</option>
                    <option value="price-low">Low ↑</option>
                    <option value="price-high">High ↓</option>
                    <option value="rating">Top</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Filter dropdown */}
            <AnimatePresence>
              {showFilter && (
                <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }}
                  className="overflow-hidden mt-1.5">
                  <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[9px] uppercase tracking-widest font-black text-gray-500">Price Range</p>
                      <button onClick={() => setPriceRange([0,100000])}
                        className="text-[8px] uppercase font-black text-gray-400 hover:text-gray-900 transition flex items-center gap-1">
                        <X size={9}/> Reset
                      </button>
                    </div>
                    <div className="mb-1.5 flex justify-between text-[8px] text-gray-500">
                      <span>₹{priceRange[0].toLocaleString()}</span>
                      <span>₹{priceRange[1].toLocaleString()}</span>
                    </div>
                    <input type="range" min={0} max={100000} step={500} value={priceRange[0]}
                      onChange={e => setPriceRange([+e.target.value, priceRange[1]])}
                      className="w-full accent-gray-900 h-1 mb-2"/>
                    <input type="range" min={0} max={100000} step={500} value={priceRange[1]}
                      onChange={e => setPriceRange([priceRange[0], +e.target.value])}
                      className="w-full accent-gray-900 h-1"/>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Wishlist strip */}
          <AnimatePresence>
            {wishlist.length > 0 && user && (
              <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
                className="mb-3 overflow-hidden">
                <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3 flex items-center gap-3">
                  <Heart size={12} className="text-red-500 fill-red-500 shrink-0"/>
                  <span className="text-[9px] uppercase tracking-wide font-black text-red-600">{wishlist.length} saved</span>
                  <Link to="/wishlist" className="ml-auto flex items-center gap-1 text-[9px] uppercase font-black text-red-600 hover:text-red-800 transition">
                    View <ArrowRight size={9}/>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products */}
          {loading ? (
            <div className={`grid gap-3 ${viewMode==='grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'grid-cols-1'}`}>
              {Array.from({ length:10 }).map((_,i) => (
                <div key={i} className={`bg-white rounded-2xl border border-gray-100 overflow-hidden ${viewMode==='list' ? 'flex gap-3 p-3 h-28' : ''}`}>
                  <div className={`animate-pulse bg-gradient-to-br from-gray-100 to-gray-200 ${viewMode==='list' ? 'w-24 h-22 rounded-xl shrink-0' : 'w-full aspect-square'}`}/>
                  {viewMode==='grid' && <div className="p-3 space-y-2"><div className="h-2 bg-gray-100 rounded-full animate-pulse w-2/3"/><div className="h-3 bg-gray-100 rounded-full animate-pulse"/><div className="h-8 bg-gray-100 rounded-xl animate-pulse mt-3"/></div>}
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-2xl border border-gray-100">
              <Search size={28} className="text-gray-200 mx-auto mb-3"/>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-black">No products found</p>
              <button onClick={() => { setCategory('All'); setPriceRange([0,100000]); }}
                className="mt-3 text-[9px] uppercase font-black underline text-gray-500 hover:text-gray-900 transition">
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className={viewMode==='grid'
                ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4'
                : 'flex flex-col gap-3'}>
                {shown.map((product, i) => (
                  <Card key={product._id} product={product} index={i}
                    onQuickView={setSelected} onWishlist={toggleWish}
                    isWished={wishlist.includes(product._id)} onToast={setToast}
                    onAdd={doAdd} listView={viewMode==='list'}/>
                ))}
              </div>
              {visible < filtered.length && (
                <div className="mt-8 sm:mt-12 flex flex-col items-center gap-2.5">
                  <button onClick={() => setVisible(v => v+20)}
                    className="flex items-center gap-2 bg-gray-900 text-white text-[9px] uppercase tracking-widest font-black px-10 py-3 rounded-full hover:bg-black transition-all hover:scale-105 active:scale-95 group">
                    Load More <Plus size={11} className="group-hover:rotate-90 transition-transform duration-300"/>
                  </button>
                  <p className="text-[8px] text-gray-400 uppercase tracking-widest">{visible} of {filtered.length}</p>
                </div>
              )}
            </>
          )}

          {/* Editorial */}
          {!loading && (
            <motion.section initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} transition={{ duration:0.6 }}
              className="mt-10 sm:mt-16 rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-900 text-white">
              <div className="grid grid-cols-1 sm:grid-cols-2">
                <div className="relative aspect-[16/9] sm:aspect-auto min-h-[180px]">
                  <img src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=2000"
                    className="w-full h-full object-cover opacity-50" alt="Studio"/>
                  <div className="absolute inset-0 bg-gradient-to-b sm:bg-gradient-to-r from-transparent to-gray-900"/>
                </div>
                <div className="flex flex-col justify-center p-6 sm:p-12 gap-4">
                  <span className="text-[8px] uppercase tracking-[0.6em] text-amber-400 font-black">Our Philosophy</span>
                  <h2 className="text-2xl sm:text-4xl font-black leading-[0.9] tracking-tight">
                    Curated for<br /><span className="text-amber-400">the Few.</span>
                  </h2>
                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-sm">
                    Every object is hand-vetted. We don't follow trends — we curate artifacts that last lifetimes.
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {[{ n:12,l:'Years',s:'+' },{ n:500,l:'Partners',s:'+' }].map(({ n,l,s }) => (
                      <div key={l} className="bg-white/5 rounded-xl p-3 sm:p-4 border border-white/10">
                        <div className="text-xl sm:text-2xl font-black tabular-nums text-amber-400"><Counter target={n} suffix={s}/></div>
                        <div className="text-[7px] sm:text-[8px] uppercase tracking-widest text-gray-500 mt-0.5">{l}</div>
                      </div>
                    ))}
                  </div>
                  <Link to="/philosophy"
                    className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-black text-amber-400 hover:text-amber-300 transition group">
                    Read More <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform"/>
                  </Link>
                </div>
              </div>
            </motion.section>
          )}

          {/* Newsletter */}
          <motion.section initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
            className="mt-6 sm:mt-10 rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-900 text-white p-6 sm:p-14 text-center relative border border-white/5">
            <div className="absolute inset-0 opacity-10 pointer-events-none"
              style={{ background:'radial-gradient(circle at 20% 50%,#f59e0b 0%,transparent 50%),radial-gradient(circle at 80% 50%,#3b82f6 0%,transparent 50%)' }}/>
            <div className="relative z-10 max-w-md mx-auto">
              <span className="text-[8px] uppercase tracking-[0.7em] text-amber-400 font-black block mb-3">Members Only</span>
              <h2 className="text-xl sm:text-3xl font-black tracking-tight mb-2">Join the Archive.</h2>
              <p className="text-gray-400 text-[10px] mb-5">Early access to new drops & exclusive deals.</p>
              <div className="flex bg-white/5 border border-white/10 rounded-full overflow-hidden focus-within:border-amber-400/50 transition-colors">
                <input type="email" placeholder="your@email.com"
                  className="bg-transparent flex-1 text-[10px] outline-none px-4 sm:px-5 py-3 placeholder:text-gray-600 min-w-0"/>
                <button className="bg-amber-400 text-black px-4 sm:px-5 py-2 text-[8px] font-black uppercase tracking-widest rounded-full m-1 hover:bg-amber-300 transition-colors whitespace-nowrap">
                  Join
                </button>
              </div>
            </div>
          </motion.section>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white mt-6 sm:mt-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-14">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10 pb-8 border-b border-white/10">
              <div className="col-span-2 sm:col-span-1 space-y-3 sm:space-y-4">
                <h3 className="text-2xl font-black">MINI<span className="text-amber-400">KART</span></h3>
                <p className="text-[9px] text-gray-500 leading-relaxed">Curated objects for minimalist living.</p>
                <div className="flex gap-2">
                  {['IG','PIN','TW','YT'].map(s => (
                    <button key={s} className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-[7px] font-black text-gray-400 hover:bg-amber-400 hover:text-black hover:border-amber-400 transition-all">{s}</button>
                  ))}
                </div>
              </div>
              {[
                { title:'Shop',   links:['Archive','New Arrivals','Festival','Electronics'] },
                { title:'Info',   links:['Philosophy','About Us','Blog'] },
                { title:'Help',   links:['FAQs','Returns','Contact'] },
              ].map(({ title, links }) => (
                <div key={title} className="space-y-2.5">
                  <h4 className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-400">{title}</h4>
                  <ul className="space-y-2">
                    {links.map(l => (
                      <li key={l} className="text-[9px] text-gray-500 hover:text-white cursor-pointer transition">{l}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-5">
              <p className="text-[7px] uppercase tracking-[0.5em] text-gray-600">© 2026 MINIKART</p>
              <div className="flex gap-4">
                {['Terms','Privacy','Cookies'].map(t => (
                  <span key={t} className="text-[7px] uppercase tracking-widest text-gray-600 hover:text-white cursor-pointer transition font-bold">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </footer>

        {/* Back to top */}
        <motion.button onClick={() => window.scrollTo({ top:0, behavior:'smooth' })}
          initial={{ opacity:0 }} whileInView={{ opacity:1 }}
          className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 w-9 h-9 sm:w-10 sm:h-10 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-black border border-white/10 transition z-40 text-xs font-black">
          ↑
        </motion.button>
      </div>
    </>
  );
};

export default Home;