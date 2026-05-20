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
  Percent, ArrowUpDown, ArrowRight, Plus, BellElectric,
  Heart, Star, TrendingUp, Award, ChevronLeft, ChevronRight,
  X, SlidersHorizontal, Grid3X3, LayoutList, Zap,
  Package, RefreshCw, Shield, Truck, Search, Eye
} from 'lucide-react';

/* ─── Splash Screen ─────────────────────────────────────────────── */
const SplashScreen = ({ onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.04) 0%, transparent 70%)' }} />

      <div className="relative flex flex-col items-center gap-6">
        {/* Logo letters animate in staggered */}
        <div className="flex items-baseline gap-0 overflow-hidden">
          {['M','I','N','I','K','A','R','T'].map((letter, i) => (
            <motion.span
              key={i}
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className={`text-5xl sm:text-7xl font-black tracking-tight leading-none ${
                i < 4 ? 'text-white' : 'text-white/30'
              }`}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-[10px] uppercase tracking-[0.8em] text-white/40 font-bold"
        >
          The 2026 Archive
        </motion.p>

        {/* Loading bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="w-32 h-[1px] bg-white/10 relative overflow-hidden mt-4"
        >
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ delay: 1.1, duration: 1.2, ease: 'easeInOut' }}
            className="absolute inset-y-0 w-full bg-white"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

/* ─── Marquee ───────────────────────────────────────────────────── */
const Marquee = ({ items }) => (
  <div className="overflow-hidden bg-black text-white py-2.5 flex">
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={i}
        animate={{ x: ['0%', '-100%'] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="flex items-center gap-10 whitespace-nowrap px-6 shrink-0"
      >
        {items.map((item, j) => (
          <span key={j} className="text-[8px] uppercase tracking-[0.4em] font-bold flex items-center gap-3">
            <span className="text-yellow-400">✦</span> {item}
          </span>
        ))}
      </motion.div>
    ))}
  </div>
);

/* ─── Stat Counter ──────────────────────────────────────────────── */
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

/* ─── Toast ─────────────────────────────────────────────────────── */
const Toast = ({ message, onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 2200); return () => clearTimeout(t); }, [onDone]);
  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
      className="fixed bottom-20 sm:bottom-8 left-1/2 -translate-x-1/2 z-[999] bg-black text-white px-6 py-3 text-[9px] uppercase tracking-widest font-bold rounded-full shadow-2xl flex items-center gap-2 whitespace-nowrap max-w-[90vw]"
    >
      <Zap size={11} className="text-yellow-400 shrink-0" />
      <span className="truncate">{message}</span>
    </motion.div>
  );
};

/* ─── Banner Carousel ───────────────────────────────────────────── */
const bannerSlides = [
  {
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000',
    tag: 'The 2026 Archive',
    title: 'Curated',
    titleBold: 'Objects.',
    sub: 'Hand-vetted for material integrity.',
  },
  {
    image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=2000',
    tag: 'New Arrivals',
    title: 'Premium',
    titleBold: 'Selection.',
    sub: 'Finest products from global studios.',
  },
  {
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2000',
    tag: 'Festival Offers',
    title: 'Limited',
    titleBold: 'Edition.',
    sub: 'Exclusive festival pricing.',
  },
  {
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=2000',
    tag: 'Electronics',
    title: 'Modern',
    titleBold: 'Tech.',
    sub: 'Latest consumer electronics, curated.',
  },
];

const BannerCarousel = ({ onShopNow }) => {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef(null);

  const goTo = (idx) => {
    if (animating) return;
    setAnimating(true);
    setCurrent(idx);
    setTimeout(() => setAnimating(false), 700);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => setCurrent(c => (c + 1) % bannerSlides.length), 4000);
    return () => clearInterval(timerRef.current);
  }, []);

  const manualGo = (idx) => {
    clearInterval(timerRef.current);
    goTo(idx);
    timerRef.current = setInterval(() => setCurrent(c => (c + 1) % bannerSlides.length), 4000);
  };

  const slide = bannerSlides[current];

  return (
    <section className="relative w-full overflow-hidden" style={{ height: 'clamp(320px, 55vw, 520px)' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <img src={slide.image} alt={slide.titleBold} className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full flex flex-col items-center justify-end pb-12 sm:justify-center sm:pb-0 text-center text-white px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={current + '-content'}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <span className="text-[8px] uppercase tracking-[0.8em] text-white/60 font-black mb-3 block">{slide.tag}</span>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-light italic tracking-tighter leading-tight mb-3">
              {slide.title} <span className="not-italic font-black">{slide.titleBold}</span>
            </h1>
            <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] text-white/60 mb-6 max-w-xs leading-relaxed hidden sm:block">
              {slide.sub}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center gap-3">
          <button onClick={onShopNow}
            className="flex items-center gap-2 bg-white text-black px-6 sm:px-10 py-3 sm:py-4 text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-black rounded-full hover:bg-gray-100 transition-all duration-300">
            Shop Now <ArrowRight size={12} />
          </button>
          <Link to="/philosophy"
            className="flex items-center gap-2 border border-white/40 text-white px-6 sm:px-10 py-3 sm:py-4 text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-black rounded-full hover:bg-white/10 transition-all duration-300">
            Our Story
          </Link>
        </div>

        {/* Stats — hidden on small mobile */}
        <div className="hidden sm:flex items-center gap-8 md:gap-12 mt-10">
          {[{ n: 2400, label: 'Products', s: '+' }, { n: 98, label: 'Satisfaction', s: '%' }, { n: 120, label: 'Brands', s: '+' }].map(({ n, label, s }) => (
            <div key={label} className="text-center">
              <div className="text-xl font-light tabular-nums text-white"><Counter target={n} suffix={s} /></div>
              <div className="text-[7px] uppercase tracking-[0.4em] text-white/50 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Arrows — hidden on mobile */}
      <button onClick={() => manualGo((current - 1 + bannerSlides.length) % bannerSlides.length)}
        className="hidden sm:flex absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm items-center justify-center hover:bg-white/40 transition-all">
        <ChevronLeft size={18} className="text-white" />
      </button>
      <button onClick={() => manualGo((current + 1) % bannerSlides.length)}
        className="hidden sm:flex absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm items-center justify-center hover:bg-white/40 transition-all">
        <ChevronRight size={18} className="text-white" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
        {bannerSlides.map((_, i) => (
          <button key={i} onClick={() => manualGo(i)}
            className={`transition-all duration-300 rounded-full ${i === current ? 'w-6 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40'}`} />
        ))}
      </div>
    </section>
  );
};

/* ─── Product Card ──────────────────────────────────────────────── */
const ProductCard = ({ product, index, onQuickView, onWishlist, isWished, onToast, listView, onAddToCart }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    await onAddToCart(product);
    onToast(`Added to cart ✦`);
    setTimeout(() => setAdding(false), 1500);
  };

  if (listView) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.03 }}
        className="group flex gap-3 sm:gap-5 bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden p-3 sm:p-4"
      >
        <Link to={`/product/${product._id}`} className="w-24 h-24 sm:w-32 sm:h-32 bg-[#F5F5F7] rounded-xl overflow-hidden shrink-0 relative">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          {product.category === 'Festival Offers' && (
            <span className="absolute top-1 left-1 bg-yellow-400 text-black text-[6px] font-black uppercase px-1.5 py-0.5 rounded-full">Sale</span>
          )}
        </Link>
        <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
          <div>
            <span className="text-[7px] uppercase tracking-[0.3em] text-gray-400 font-bold">{product.category}</span>
            <Link to={`/product/${product._id}`}>
              <h3 className="text-xs sm:text-sm font-bold mt-0.5 hover:text-gray-600 transition line-clamp-2 leading-snug">{product.name}</h3>
            </Link>
            <div className="flex items-center gap-1 mt-1.5">
              <div className="flex items-center gap-0.5 bg-green-500 px-1.5 py-0.5 rounded text-white">
                <span className="text-[8px] font-black">4.0</span>
                <Star size={7} className="fill-white" />
              </div>
              <span className="text-[8px] text-gray-400">(128)</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 flex-wrap gap-1.5">
            <span className="text-base sm:text-lg font-black text-gray-900">₹{product.price.toLocaleString()}</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={(e) => { e.preventDefault(); onWishlist(product._id); onToast(isWished ? 'Removed' : 'Saved ✦'); }}
                className={`p-1.5 rounded-lg border transition-all ${isWished ? 'bg-red-50 border-red-200 text-red-500' : 'border-gray-200 text-gray-400'}`}>
                <Heart size={11} fill={isWished ? 'currentColor' : 'none'} />
              </button>
              <button onClick={handleAddToCart} disabled={adding}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[8px] uppercase tracking-wide font-black transition-all ${adding ? 'bg-green-500 text-white' : 'bg-black text-white hover:bg-gray-800'}`}>
                <ShoppingBag size={10} /> {adding ? 'Added!' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.4, delay: (index % 6) * 0.05 }}
      className="group bg-white border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden flex flex-col"
    >
      {/* Image */}
      <Link to={`/product/${product._id}`} className="relative block bg-[#F7F7F7] overflow-hidden" style={{ paddingBottom: '100%' }}>
        <div className="absolute inset-0">
          {!imgLoaded && <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />}
          <img
            src={product.image} alt={product.name}
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>

        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.category === 'Festival Offers' && (
            <span className="bg-yellow-400 text-black px-2 py-0.5 text-[6px] sm:text-[7px] uppercase font-black rounded-full shadow-sm">Sale</span>
          )}
          {index < 3 && (
            <span className="bg-black text-white px-2 py-0.5 text-[6px] sm:text-[7px] uppercase font-black rounded-full flex items-center gap-0.5 shadow-sm">
              <TrendingUp size={6} /> Top
            </span>
          )}
        </div>

        <button
          onClick={(e) => { e.preventDefault(); onWishlist(product._id); onToast(isWished ? 'Removed' : 'Saved ✦'); }}
          className={`absolute top-2 right-2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
            isWished ? 'bg-red-500 text-white opacity-100' : 'bg-white text-gray-400 opacity-0 group-hover:opacity-100 sm:opacity-100'
          }`}
        >
          <Heart size={11} fill={isWished ? 'white' : 'none'} />
        </button>
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 p-2.5 sm:p-4 gap-1.5 sm:gap-2">
        <span className="text-[7px] uppercase tracking-[0.3em] text-gray-400 font-bold leading-none">{product.category}</span>

        <Link to={`/product/${product._id}`}>
          <h3 className="text-[11px] sm:text-[12px] font-semibold text-gray-800 leading-snug line-clamp-2 hover:text-black transition">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5 bg-green-500 px-1.5 py-0.5 rounded text-white w-fit">
            <span className="text-[8px] font-black leading-none">4.0</span>
            <Star size={7} className="fill-white" />
          </div>
          <span className="text-[8px] text-gray-400">(128)</span>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-sm sm:text-base font-black text-gray-900">₹{product.price.toLocaleString()}</span>
          <span className="text-[7px] sm:text-[8px] text-green-600 font-bold">Free</span>
        </div>

        {/* Action row */}
        <div className="flex gap-1.5 mt-auto pt-2 border-t border-gray-100">
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 sm:py-2.5 text-[8px] sm:text-[9px] uppercase tracking-wide font-black rounded-xl transition-all duration-300 ${
              adding ? 'bg-green-500 text-white' : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            <ShoppingBag size={10} /> {adding ? 'Added!' : 'Add'}
          </button>
          <button
            onClick={(e) => { e.preventDefault(); onQuickView(product); }}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center border border-gray-200 rounded-xl text-gray-400 hover:border-black hover:text-black transition-all shrink-0"
          >
            <Eye size={11} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Featured Slider ───────────────────────────────────────────── */
const FeaturedSlider = ({ products }) => {
  const [idx, setIdx] = useState(0);
  const featured = products.slice(0, 5);
  if (!featured.length) return null;
  const prev = () => setIdx(i => (i - 1 + featured.length) % featured.length);
  const next = () => setIdx(i => (i + 1) % featured.length);
  const product = featured[idx];

  return (
    <section className="mb-8 sm:mb-16">
      <div className="flex items-center justify-between mb-4 sm:mb-8">
        <div>
          <span className="text-[8px] uppercase tracking-[0.5em] text-blue-500 font-black">Featured</span>
          <h2 className="text-lg sm:text-2xl font-light italic tracking-tight mt-0.5">Editor's Pick</h2>
        </div>
        <div className="flex gap-2">
          <button onClick={prev} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all">
            <ChevronLeft size={14} />
          </button>
          <button onClick={next} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-0 bg-[#F5F5F7] rounded-2xl sm:rounded-3xl overflow-hidden"
        >
          <div className="aspect-[16/9] sm:aspect-[4/3] lg:aspect-auto overflow-hidden">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-[3s]" />
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-16 gap-4 sm:gap-6">
            <span className="text-[8px] uppercase tracking-[0.5em] text-gray-400 font-bold flex items-center gap-2">
              <Award size={9} className="text-yellow-500" /> {product.category}
            </span>
            <h3 className="text-2xl sm:text-4xl font-light italic tracking-tight leading-tight">{product.name}</h3>
            <div className="flex items-center gap-4">
              <span className="text-xl sm:text-3xl font-light">₹{product.price.toLocaleString()}</span>
              <Link to={`/product/${product._id}`}
                className="flex items-center gap-2 bg-black text-white px-5 sm:px-8 py-3 sm:py-4 text-[9px] uppercase tracking-widest font-black rounded-full hover:bg-gray-800 transition-all group">
                View <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="flex items-center gap-2">
              {featured.map((_, i) => (
                <button key={i} onClick={() => setIdx(i)}
                  className={`transition-all duration-300 rounded-full ${i === idx ? 'w-6 h-1.5 bg-black' : 'w-1.5 h-1.5 bg-gray-300'}`} />
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

/* ─── Main Component ────────────────────────────────────────────── */
const Home = () => {
  const [showSplash, setShowSplash]   = useState(true);
  const [products, setProducts]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeCategory, setActiveCategory]   = useState('All');
  const [sortBy, setSortBy]             = useState('newest');
  const [visibleCount, setVisibleCount] = useState(20);
  const [viewMode, setViewMode]         = useState('grid');
  const [showFilters, setShowFilters]   = useState(false);
  const [priceRange, setPriceRange]     = useState([0, 100000]);
  const [toast, setToast]               = useState(null);
  const [wishlist, setWishlist]         = useState([]);

  const { user }      = useAuth();
  const { addToCart } = useCart();
  const authHeaders   = user?.token ? { headers: { Authorization: `Bearer ${user.token}` } } : {};

  const location    = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('search') || '';

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user?.token) { setWishlist([]); return; }
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/wishlist`, authHeaders);
        setWishlist(data.map(p => p._id));
      } catch (err) { console.error('Wishlist fetch failed:', err); }
    };
    fetchWishlist();
  }, [user]);

  const toggleWishlist = useCallback(async (id) => {
    if (!user?.token) return;
    const isWished = wishlist.includes(id);
    try {
      if (isWished) {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/wishlist/${id}`, authHeaders);
        setWishlist(prev => prev.filter(x => x !== id));
      } else {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/wishlist/${id}`, {}, authHeaders);
        setWishlist(prev => [...prev, id]);
      }
    } catch (err) { console.error('Wishlist toggle failed:', err); }
  }, [wishlist, user]);

  const handleAddToCart = useCallback(async (product) => {
    if (!user) { setToast('Please sign in to add to cart'); return; }
    await addToCart(product);
  }, [user, addToCart]);

  const categories = [
    { name: 'All', icon: <Sparkles size={12} /> },
    { name: 'Home Needs', icon: <HomeIcon size={12} /> },
    { name: 'Sanitary', icon: <Bath size={12} /> },
    { name: 'Laptops', icon: <Laptop size={12} /> },
    { name: 'Stores', icon: <ShoppingBag size={12} /> },
    { name: 'Electronics', icon: <BellElectric size={12} /> },
    { name: 'Festival Offers', icon: <Percent size={12} /> },
  ];

  const marqueeItems = [
    'Free Shipping Over ₹999', 'New Archive 2026', 'Easy Returns 30 Days', 'Secure Checkout',
  ];

  const trustBadges = [
    { icon: <Truck size={16} />, title: 'Free Delivery', sub: 'Above ₹999' },
    { icon: <RefreshCw size={16} />, title: '30-Day Returns', sub: 'Hassle-free' },
    { icon: <Shield size={16} />, title: 'Secure Payment', sub: '256-bit SSL' },
    { icon: <Package size={16} />, title: 'Gift Packing', sub: 'Premium wrap' },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `${import.meta.env.VITE_API_BASE_URL}/products?keyword=${searchQuery}`;
        if (activeCategory !== 'All') url += `&category=${activeCategory}`;
        const { data } = await axios.get(url);
        let sorted = [...data];
        if (sortBy === 'price-low')  sorted.sort((a, b) => a.price - b.price);
        if (sortBy === 'price-high') sorted.sort((a, b) => b.price - a.price);
        if (sortBy === 'rating')     sorted.sort((a, b) => (b.rating || 4) - (a.rating || 4));
        setProducts(sorted);
        setVisibleCount(20);
      } catch (err) {}
      setLoading(false);
    };
    fetchProducts();
  }, [searchQuery, activeCategory, sortBy]);

  const filteredProducts = products.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
  const visibleProducts  = filteredProducts.slice(0, visibleCount);

  return (
    <>
      {/* Splash Screen */}
      <AnimatePresence>
        {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}
      </AnimatePresence>

      <div className="bg-[#F1F3F6] min-h-screen text-[#1D1D1F] selection:bg-black selection:text-white overflow-x-hidden">
        <Navbar />

        <AnimatePresence>
          {selectedProduct && <QuickView product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
        </AnimatePresence>
        <AnimatePresence>
          {toast && <Toast message={toast} onDone={() => setToast(null)} />}
        </AnimatePresence>

        {/* Marquee */}
       

        {/* Banner */}
        {!searchQuery && (
          <BannerCarousel onShopNow={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })} />
        )}

        {/* Trust Badges */}
        {!searchQuery && (
          <section className="border-y border-gray-200 bg-white">
            <div className="max-w-[1800px] mx-auto px-3 sm:px-8 md:px-12 py-4 sm:py-6 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {trustBadges.map(({ icon, title, sub }) => (
                <div key={title} className="flex items-center gap-2 sm:gap-3 group">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#F5F5F7] flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-300 shrink-0">
                    {icon}
                  </div>
                  <div>
                    <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-wide">{title}</div>
                    <div className="text-[8px] sm:text-[9px] text-gray-400">{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <main className="max-w-[1800px] mx-auto px-3 sm:px-4 md:px-8 py-4 sm:py-8" id="products-section">

          {/* Featured Slider */}
          {!searchQuery && !loading && products.length > 0 && (
            <FeaturedSlider products={products} />
          )}

          {/* Controls bar */}
          <div className="sticky top-14 sm:top-20 z-40 mb-4 sm:mb-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-2 sm:p-3 shadow-sm flex flex-col gap-2 sm:gap-3">
              {/* Categories scroll */}
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {categories.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setActiveCategory(item.name)}
                    className={`flex items-center gap-1.5 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-[8px] sm:text-[9px] uppercase tracking-wide sm:tracking-widest font-black transition-all whitespace-nowrap ${
                      activeCategory === item.name
                        ? 'bg-black text-white shadow-lg shadow-black/20'
                        : 'text-gray-400 hover:text-black hover:bg-gray-50'
                    }`}
                  >
                    {item.icon} {item.name}
                  </button>
                ))}
              </div>

              {/* Sort / View / Filter row */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-2 px-1">
                <div className="flex items-center gap-2">
                  <span className="text-[8px] text-gray-400 uppercase tracking-wide hidden sm:block">
                    {filteredProducts.length} items
                  </span>
                  <button
                    onClick={() => setShowFilters(f => !f)}
                    className={`flex items-center gap-1.5 text-[8px] sm:text-[9px] uppercase tracking-wide font-bold px-3 py-1.5 rounded-lg transition-all ${
                      showFilters ? 'bg-black text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <SlidersHorizontal size={11} /> Filter
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5 bg-gray-50 rounded-lg p-1">
                    <button onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-black' : 'text-gray-400'}`}>
                      <Grid3X3 size={12} />
                    </button>
                    <button onClick={() => setViewMode('list')}
                      className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-black' : 'text-gray-400'}`}>
                      <LayoutList size={12} />
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-2.5 py-1.5">
                    <ArrowUpDown size={10} className="text-gray-400" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="text-[8px] sm:text-[9px] uppercase tracking-wide font-bold bg-transparent outline-none cursor-pointer"
                    >
                      <option value="newest">New</option>
                      <option value="price-low">Low</option>
                      <option value="price-high">High</option>
                      <option value="rating">Top</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mt-2"
                >
                  <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-wrap gap-4 sm:gap-8 items-end">
                    <div className="flex-1 min-w-[140px]">
                      <label className="text-[8px] uppercase tracking-widest font-black text-gray-500 mb-2 block">
                        Max: ₹{priceRange[1].toLocaleString()}
                      </label>
                      <input type="range" min={0} max={100000} step={500}
                        value={priceRange[1]}
                        onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-full accent-black" />
                    </div>
                    <div className="flex-1 min-w-[140px]">
                      <label className="text-[8px] uppercase tracking-widest font-black text-gray-500 mb-2 block">
                        Min: ₹{priceRange[0].toLocaleString()}
                      </label>
                      <input type="range" min={0} max={100000} step={500}
                        value={priceRange[0]}
                        onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="w-full accent-black" />
                    </div>
                    <button onClick={() => setPriceRange([0, 100000])}
                      className="flex items-center gap-1.5 text-[8px] uppercase tracking-widest font-bold text-gray-500 hover:text-black transition px-3 py-2 border border-gray-200 rounded-lg">
                      <X size={9} /> Reset
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Wishlist strip */}
          {wishlist.length > 0 && user && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="mb-4 flex items-center gap-3 text-[9px] uppercase tracking-wide text-gray-500 bg-white border border-dashed border-gray-200 rounded-2xl px-4 py-3">
              <Heart size={12} className="text-red-400 fill-red-400 shrink-0" />
              <span className="font-bold">{wishlist.length} saved</span>
              <Link to="/wishlist" className="ml-auto flex items-center gap-1.5 text-black font-black hover:underline">
                Wishlist <ArrowRight size={9} />
              </Link>
            </motion.div>
          )}

          {/* Product Grid / List */}
          {loading ? (
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'grid-cols-1'} gap-3 sm:gap-4`}>
              {[...Array(10)].map((_, i) => (
                <div key={i} className={`bg-white rounded-2xl overflow-hidden border border-gray-100 ${viewMode === 'list' ? 'h-28 flex gap-3 p-3' : ''}`}>
                  <div className={`bg-gray-100 animate-pulse ${viewMode === 'list' ? 'w-24 h-24 rounded-xl shrink-0' : 'w-full aspect-square'}`} />
                  {viewMode === 'list' && <div className="flex-1 space-y-2 py-1"><div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" /><div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" /></div>}
                  {viewMode === 'grid' && <div className="p-2.5 space-y-1.5"><div className="h-2.5 bg-gray-100 rounded animate-pulse w-3/4" /><div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" /><div className="h-7 bg-gray-100 rounded-xl animate-pulse mt-2" /></div>}
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-24 text-center bg-white rounded-2xl border border-gray-100">
              <Search size={28} className="text-gray-200 mx-auto mb-4" />
              <p className="text-[10px] uppercase tracking-widest text-gray-400">No products found</p>
            </div>
          ) : (
            <>
              <div className={viewMode === 'grid'
                ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4'
                : 'flex flex-col gap-3 sm:gap-4'
              }>
                {visibleProducts.map((product, index) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    index={index}
                    onQuickView={setSelectedProduct}
                    onWishlist={toggleWishlist}
                    isWished={wishlist.includes(product._id)}
                    onToast={setToast}
                    onAddToCart={handleAddToCart}
                    listView={viewMode === 'list'}
                  />
                ))}
              </div>

              {visibleCount < filteredProducts.length && (
                <div className="mt-10 sm:mt-16 flex flex-col items-center gap-4">
                  <button
                    onClick={() => setVisibleCount(v => v + 20)}
                    className="group flex items-center gap-3 text-[9px] sm:text-[10px] uppercase tracking-[0.4em] font-black bg-white border border-gray-200 px-10 sm:px-14 py-4 sm:py-5 hover:bg-black hover:text-white hover:border-black transition-all duration-500 rounded-full shadow-sm hover:shadow-xl"
                  >
                    Load More <Plus size={12} className="group-hover:rotate-90 transition-transform duration-500" />
                  </button>
                  <p className="text-[8px] text-gray-400 uppercase tracking-widest">
                    {visibleCount} of {filteredProducts.length}
                  </p>
                </div>
              )}
            </>
          )}

          {/* Editorial */}
          {!loading && (
            <section className="my-12 sm:my-24 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 items-center border-y border-gray-200 py-10 sm:py-24 bg-white rounded-2xl sm:rounded-3xl px-6 sm:px-12">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="space-y-6 sm:space-y-10">
                <span className="text-[8px] uppercase tracking-[0.6em] text-blue-500 font-black">The Philosophy</span>
                <h2 className="text-3xl sm:text-5xl md:text-7xl font-light italic tracking-tighter leading-[0.9]">
                  Curated for the <br /><span className="not-italic font-black">Minimalist Soul.</span>
                </h2>
                <p className="text-gray-400 text-sm max-w-sm leading-relaxed tracking-wide">
                  Every object in our series is hand-vetted for aesthetic permanence. We curate artifacts that last lifetimes.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[{ n: 12, label: 'Years', s: '+' }, { n: 500, label: 'Partners', s: '+' }].map(({ n, label, s }) => (
                    <div key={label} className="border border-gray-100 rounded-2xl p-4 sm:p-6">
                      <div className="text-2xl sm:text-3xl font-light tabular-nums"><Counter target={n} suffix={s} /></div>
                      <div className="text-[8px] uppercase tracking-widest text-gray-400 mt-1">{label}</div>
                    </div>
                  ))}
                </div>
                <Link to="/philosophy" className="inline-flex items-center gap-3 text-[9px] uppercase tracking-[0.4em] font-black border-b border-black pb-2 group">
                  Our Story <ArrowRight size={11} className="group-hover:translate-x-2 transition-transform" />
                </Link>
              </motion.div>
              <div className="relative aspect-[4/3] sm:aspect-[4/5] bg-[#F5F5F7] overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl">
                <motion.img
                  whileHover={{ scale: 1.04 }} transition={{ duration: 2.5 }}
                  src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=2000"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-[3s]" alt="Studio"
                />
                <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8 bg-white/90 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-lg">
                  <p className="text-[8px] uppercase tracking-widest font-black text-gray-500 mb-1">Studio Note</p>
                  <p className="text-[10px] sm:text-[11px] italic text-gray-700 leading-relaxed">"Design is not just what it looks like — it's how it works."</p>
                </div>
              </div>
            </section>
          )}

          {/* Newsletter */}
          <section className="relative bg-black text-white p-8 sm:p-16 md:p-24 rounded-2xl sm:rounded-[3rem] text-center my-8 sm:my-16 overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)]">
            <div className="absolute inset-0 opacity-20 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 30% 50%, #3b82f6 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, #8b5cf6 0%, transparent 60%)' }} />
            <div className="relative z-10 max-w-xl mx-auto space-y-6 sm:space-y-10">
              <span className="text-[8px] uppercase tracking-[0.8em] text-gray-500 font-bold">Exclusive Access</span>
              <h2 className="text-2xl sm:text-4xl md:text-6xl font-light italic tracking-tighter">Join the Series.</h2>
              <p className="text-gray-400 text-[9px] uppercase tracking-[0.3em] leading-loose hidden sm:block">
                Early access to the Winter 2026 Archive.
              </p>
              <div className="flex border border-gray-800 rounded-full overflow-hidden max-w-sm mx-auto bg-white/5 backdrop-blur-sm focus-within:border-gray-600 transition-colors">
                <input type="email" placeholder="your@email.com"
                  className="bg-transparent flex-1 text-[10px] outline-none tracking-wide px-4 sm:px-6 py-3 sm:py-4 placeholder:text-gray-700 min-w-0" />
                <button className="bg-white text-black px-4 sm:px-6 py-2 sm:py-3 text-[8px] font-black uppercase tracking-[0.2em] rounded-full m-1 hover:bg-gray-100 transition-colors whitespace-nowrap">
                  Join
                </button>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 pt-10 sm:pt-16 pb-6 sm:pb-8 px-4 sm:px-8 md:px-12 mt-4 sm:mt-8">
          <div className="max-w-[1800px] mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-12 gap-8 sm:gap-16 border-b border-gray-100 pb-10 sm:pb-16 mb-6 sm:mb-8">
              <div className="col-span-2 sm:col-span-2 md:col-span-5 space-y-4 sm:space-y-8">
                <h3 className="text-3xl sm:text-5xl font-light italic tracking-tighter">MINIKART</h3>
                <p className="text-[10px] text-gray-400 max-w-xs leading-relaxed uppercase tracking-[0.2em]">
                  A global curation studio for minimalist living.
                </p>
                <div className="flex gap-2 sm:gap-3">
                  {['IG', 'PIN', 'TW', 'YT'].map(s => (
                    <button key={s} className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl border border-gray-200 text-[8px] sm:text-[9px] font-black text-gray-500 hover:bg-black hover:text-white hover:border-black transition-all duration-300">{s}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-4 md:col-span-2">
                <h4 className="text-[8px] font-black uppercase tracking-[0.4em]">Navigate</h4>
                <ul className="text-[10px] text-gray-500 space-y-3 uppercase tracking-widest">
                  {['Archive', 'Blog', 'Philosophy'].map(l => (
                    <li key={l} className="hover:text-black cursor-pointer transition">{l}</li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4 md:col-span-2">
                <h4 className="text-[8px] font-black uppercase tracking-[0.4em]">Support</h4>
                <ul className="text-[10px] text-gray-500 space-y-3 uppercase tracking-widest">
                  {['FAQs', 'Returns', 'Contact'].map(l => (
                    <li key={l} className="hover:text-black cursor-pointer transition">{l}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <p className="text-[7px] sm:text-[8px] uppercase tracking-[0.5em] text-gray-400">© 2026 MINIKART. DESIGNED FOR THE FEW.</p>
              <div className="flex gap-6 text-[7px] sm:text-[8px] uppercase tracking-widest text-gray-400 font-bold">
                {['Terms', 'Privacy', 'Cookies'].map(t => <span key={t} className="hover:text-black cursor-pointer transition">{t}</span>)}
              </div>
            </div>
          </div>
        </footer>

        {/* Back to top */}
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          className="fixed bottom-20 sm:bottom-8 right-4 sm:right-8 w-10 h-10 sm:w-12 sm:h-12 bg-black text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-gray-800 transition z-50 text-xs font-black"
        >
          ↑
        </motion.button>
      </div>
    </>
  );
};

export default Home;