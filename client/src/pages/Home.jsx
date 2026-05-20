import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
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

/* ─── Floating Cursor ──────────────────────────────────────────── */
const MagneticCursor = () => {
  const cursorRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    const move = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX - 12}px, ${e.clientY - 12}px)`;
      }
    };
    const over = (e) => setHovered(e.target.closest('button, a, [data-cursor]') !== null);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseover', over); };
  }, []);
  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 z-[9999] pointer-events-none transition-all duration-150 ${
        hovered ? 'w-10 h-10 bg-black/20 backdrop-blur-sm border border-black/30' : 'w-6 h-6 bg-black'
      } rounded-full hidden lg:block`}
    />
  );
};

/* ─── Marquee ───────────────────────────────────────────────────── */
const Marquee = ({ items }) => (
  <div className="overflow-hidden bg-black text-white py-3 flex">
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={i}
        animate={{ x: ['0%', '-100%'] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="flex items-center gap-16 whitespace-nowrap px-8 shrink-0"
      >
        {items.map((item, j) => (
          <span key={j} className="text-[9px] uppercase tracking-[0.5em] font-bold flex items-center gap-4">
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
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[999] bg-black text-white px-8 py-4 text-[10px] uppercase tracking-widest font-bold rounded-full shadow-2xl flex items-center gap-3"
    >
      <Zap size={12} className="text-yellow-400" /> {message}
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
    sub: 'Hand-vetted for material integrity and design permanence.',
  },
  {
    image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=2000',
    tag: 'New Arrivals',
    title: 'Premium',
    titleBold: 'Selection.',
    sub: 'Discover the finest products from global artisan studios.',
  },
  {
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2000',
    tag: 'Festival Offers',
    title: 'Limited',
    titleBold: 'Edition.',
    sub: 'Exclusive festival pricing on our most coveted objects.',
  },
  {
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=2000',
    tag: 'Electronics',
    title: 'Modern',
    titleBold: 'Tech.',
    sub: 'The latest in consumer electronics, curated for quality.',
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
    timerRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % bannerSlides.length);
    }, 4000);
    return () => clearInterval(timerRef.current);
  }, []);

  const manualGo = (idx) => {
    clearInterval(timerRef.current);
    goTo(idx);
    timerRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % bannerSlides.length);
    }, 4000);
  };

  const slide = bannerSlides[current];

  return (
    <section className="relative w-full overflow-hidden" style={{ height: '520px' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <img src={slide.image} alt={slide.titleBold} className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={current + '-content'}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="flex flex-col items-center"
          >
            <span className="text-[9px] uppercase tracking-[1em] text-white/60 font-black mb-5 block">{slide.tag}</span>
            <h1 className="text-5xl md:text-7xl font-light italic tracking-tighter leading-tight mb-6">
              {slide.title} <span className="not-italic font-black">{slide.titleBold}</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.5em] text-white/60 mb-10 max-w-sm leading-relaxed">{slide.sub}</p>
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button onClick={onShopNow} className="group flex items-center gap-3 bg-white text-black px-10 py-4 text-[10px] uppercase tracking-[0.4em] font-black rounded-full hover:bg-gray-100 transition-all duration-300">
            Shop Now <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <Link to="/philosophy" className="flex items-center gap-3 border border-white/40 text-white px-10 py-4 text-[10px] uppercase tracking-[0.4em] font-black rounded-full hover:bg-white/10 transition-all duration-300">
            Our Story
          </Link>
        </div>

        <div className="flex items-center gap-12 mt-14">
          {[{ n: 2400, label: 'Products', s: '+' }, { n: 98, label: 'Satisfaction', s: '%' }, { n: 120, label: 'Brands', s: '+' }].map(({ n, label, s }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-light tabular-nums text-white"><Counter target={n} suffix={s} /></div>
              <div className="text-[8px] uppercase tracking-[0.4em] text-white/50 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={() => manualGo((current - 1 + bannerSlides.length) % bannerSlides.length)}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-all duration-300">
        <ChevronLeft size={20} className="text-white" />
      </button>
      <button onClick={() => manualGo((current + 1) % bannerSlides.length)}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-all duration-300">
        <ChevronRight size={20} className="text-white" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {bannerSlides.map((_, i) => (
          <button key={i} onClick={() => manualGo(i)}
            className={`transition-all duration-300 rounded-full ${i === current ? 'w-8 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/70'}`} />
        ))}
      </div>
    </section>
  );
};

/* ─── Product Card — Flipkart-style with MINIKART theme ─────────── */
const ProductCard = ({ product, index, onQuickView, onWishlist, isWished, onToast, listView, onAddToCart }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    await onAddToCart(product);
    onToast(`${product.name.substring(0, 20)}... added to cart ✦`);
    setTimeout(() => setAdding(false), 1500);
  };

  // ── List view ─────────────────────────────────────────────────
  if (listView) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.03 }}
        className="group flex gap-5 bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden p-4"
      >
        <Link to={`/product/${product._id}`} className="w-32 h-32 bg-[#F5F5F7] rounded-xl overflow-hidden shrink-0 relative">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          {product.category === 'Festival Offers' && (
            <span className="absolute top-2 left-2 bg-yellow-400 text-black text-[7px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full">Sale</span>
          )}
        </Link>
        <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
          <div>
            <span className="text-[8px] uppercase tracking-[0.3em] text-gray-400 font-bold">{product.category}</span>
            <Link to={`/product/${product._id}`}>
              <h3 className="text-sm font-bold mt-0.5 hover:text-gray-600 transition line-clamp-2 leading-snug">{product.name}</h3>
            </Link>
            <div className="flex items-center gap-1.5 mt-2">
              <div className="flex items-center gap-0.5 bg-green-500 px-2 py-0.5 rounded text-white">
                <span className="text-[9px] font-black">4.0</span>
                <Star size={8} className="fill-white" />
              </div>
              <span className="text-[9px] text-gray-400">(128 ratings)</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
            <div>
              <span className="text-xl font-black text-gray-900">₹{product.price.toLocaleString()}</span>
              <span className="text-[9px] text-green-600 font-bold ml-2">Free Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.preventDefault(); onWishlist(product._id); onToast(isWished ? 'Removed from wishlist' : 'Saved ✦'); }}
                className={`p-2 rounded-xl border transition-all ${isWished ? 'bg-red-50 border-red-200 text-red-500' : 'border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-500'}`}
              >
                <Heart size={13} fill={isWished ? 'currentColor' : 'none'} />
              </button>
              <button onClick={(e) => { e.preventDefault(); onQuickView(product); }}
                className="p-2 rounded-xl border border-gray-200 text-gray-400 hover:border-black hover:text-black transition-all">
                <Eye size={13} />
              </button>
              <button onClick={handleAddToCart} disabled={adding}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] uppercase tracking-widest font-black transition-all duration-300 ${
                  adding ? 'bg-green-500 text-white' : 'bg-black text-white hover:bg-gray-800'
                }`}>
                <ShoppingBag size={11} /> {adding ? 'Added!' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // ── Grid view — Flipkart-style card ───────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.5, delay: (index % 6) * 0.06 }}
      className="group bg-white border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden flex flex-col"
    >
      {/* Image area */}
      <Link to={`/product/${product._id}`} className="relative block bg-[#F7F7F7] overflow-hidden" style={{ paddingBottom: '100%' }}>
        <div className="absolute inset-0">
          {!imgLoaded && <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />}
          <img
            src={product.image} alt={product.name}
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.category === 'Festival Offers' && (
            <span className="bg-yellow-400 text-black px-2.5 py-1 text-[7px] uppercase tracking-wide font-black rounded-full shadow-sm">Sale</span>
          )}
          {index < 3 && (
            <span className="bg-black text-white px-2.5 py-1 text-[7px] uppercase tracking-wide font-black rounded-full flex items-center gap-1 shadow-sm">
              <TrendingUp size={7} /> Top Pick
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); onWishlist(product._id); onToast(isWished ? 'Removed from wishlist' : 'Saved ✦'); }}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
            isWished ? 'bg-red-500 text-white opacity-100' : 'bg-white text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500'
          }`}
        >
          <Heart size={13} fill={isWished ? 'white' : 'none'} />
        </button>
      </Link>

      {/* Info area */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        {/* Category */}
        <span className="text-[8px] uppercase tracking-[0.3em] text-gray-400 font-bold leading-none">{product.category}</span>

        {/* Name */}
        <Link to={`/product/${product._id}`}>
          <h3 className="text-[12px] font-semibold text-gray-800 leading-snug line-clamp-2 hover:text-black transition group-hover:underline underline-offset-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-green-500 px-2 py-0.5 rounded text-white w-fit">
            <span className="text-[9px] font-black leading-none">4.0</span>
            <Star size={8} className="fill-white" />
          </div>
          <span className="text-[9px] text-gray-400">(128)</span>
        </div>

        {/* Price row */}
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-lg font-black text-gray-900">₹{product.price.toLocaleString()}</span>
          <span className="text-[9px] text-green-600 font-bold">Free delivery</span>
        </div>

        {/* Action buttons — always visible like Flipkart */}
        <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[9px] uppercase tracking-widest font-black rounded-xl transition-all duration-300 ${
              adding ? 'bg-green-500 text-white' : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            <ShoppingBag size={11} /> {adding ? 'Added!' : 'Add to Cart'}
          </button>
          <button
            onClick={(e) => { e.preventDefault(); onQuickView(product); }}
            className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-xl text-gray-400 hover:border-black hover:text-black transition-all duration-200 shrink-0"
          >
            <Eye size={13} />
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
    <section className="mb-32">
      <div className="flex items-center justify-between mb-10">
        <div>
          <span className="text-[9px] uppercase tracking-[0.6em] text-blue-500 font-black">Featured Series</span>
          <h2 className="text-2xl font-light italic tracking-tight mt-1">Editor's Selection</h2>
        </div>
        <div className="flex gap-2">
          <button onClick={prev} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all duration-300">
            <ChevronLeft size={16} />
          </button>
          <button onClick={next} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all duration-300">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-[#F5F5F7] rounded-3xl overflow-hidden"
        >
          <div className="aspect-[4/3] lg:aspect-auto overflow-hidden">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-[3s]" />
          </div>
          <div className="flex flex-col justify-center p-10 lg:p-16 space-y-8">
            <span className="text-[9px] uppercase tracking-[0.6em] text-gray-400 font-bold flex items-center gap-2">
              <Award size={10} className="text-yellow-500" /> {product.category}
            </span>
            <h3 className="text-4xl lg:text-5xl font-light italic tracking-tight leading-tight">{product.name}</h3>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
              A masterclass in restraint and material integrity. Selected for lasting quality and design permanence.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-3xl font-light">₹{product.price.toLocaleString()}</span>
              <Link to={`/product/${product._id}`}
                className="flex items-center gap-3 bg-black text-white px-8 py-4 text-[10px] uppercase tracking-widest font-black rounded-full hover:bg-gray-800 transition-all duration-300 group">
                View Object <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="flex items-center gap-2 pt-2">
              {featured.map((_, i) => (
                <button key={i} onClick={() => setIdx(i)}
                  className={`transition-all duration-300 rounded-full ${i === idx ? 'w-8 h-2 bg-black' : 'w-2 h-2 bg-gray-300 hover:bg-gray-500'}`} />
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

  // Fetch wishlist
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
    { name: 'All', icon: <Sparkles size={13} /> },
    { name: 'Home Needs', icon: <HomeIcon size={13} /> },
    { name: 'Sanitary', icon: <Bath size={13} /> },
    { name: 'Laptops', icon: <Laptop size={13} /> },
    { name: 'Stores', icon: <ShoppingBag size={13} /> },
    { name: 'Electronics', icon: <BellElectric size={13} /> },
    { name: 'Festival Offers', icon: <Percent size={13} /> },
  ];

  const marqueeItems = [
    'Free Shipping Over ₹999', 'New Archive 2026', 'Handcrafted Selection',
    'Easy Returns 30 Days', 'Secure Checkout', 'Members Get Early Access',
  ];

  const trustBadges = [
    { icon: <Truck size={18} />, title: 'Free Delivery', sub: 'On orders above ₹999' },
    { icon: <RefreshCw size={18} />, title: '30-Day Returns', sub: 'Hassle-free returns' },
    { icon: <Shield size={18} />, title: 'Secure Payment', sub: '256-bit encryption' },
    { icon: <Package size={18} />, title: 'Premium Packing', sub: 'Gift-ready packaging' },
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
    <div className="bg-[#F1F3F6] min-h-screen text-[#1D1D1F] selection:bg-black selection:text-white overflow-x-hidden">
      
      <Navbar />

      <AnimatePresence>
        {selectedProduct && <QuickView product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {toast && <Toast message={toast} onDone={() => setToast(null)} />}
      </AnimatePresence>

      {/* Marquee */}
      

      {/* Banner Carousel */}
      {!searchQuery && (
        <BannerCarousel onShopNow={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })} />
      )}

      {/* Trust Badges */}
      {!searchQuery && (
        <section className="border-y border-gray-200 bg-white">
          <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
            {trustBadges.map(({ icon, title, sub }) => (
              <div key={title} className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-[#F5F5F7] flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-300 shrink-0">
                  {icon}
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wide">{title}</div>
                  <div className="text-[9px] text-gray-400">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <main className="max-w-[1800px] mx-auto px-4 md:px-8 py-8" id="products-section">

        {/* Featured Slider */}
        {!searchQuery && !loading && products.length > 0 && (
          <FeaturedSlider products={products} />
        )}

        {/* Controls bar */}
        <div className="sticky top-20 z-40 mb-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {categories.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveCategory(item.name)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[9px] uppercase tracking-widest font-black transition-all whitespace-nowrap ${
                    activeCategory === item.name
                      ? 'bg-black text-white shadow-lg shadow-black/20'
                      : 'text-gray-400 hover:text-black hover:bg-gray-50'
                  }`}
                >
                  {item.icon} {item.name}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 pt-3 px-1">
              <div className="flex items-center gap-4">
                <span className="text-[9px] text-gray-400 uppercase tracking-widest hidden sm:block">
                  {filteredProducts.length} products
                </span>
                <button
                  onClick={() => setShowFilters(f => !f)}
                  className={`flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold px-4 py-2 rounded-lg transition-all ${
                    showFilters ? 'bg-black text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <SlidersHorizontal size={12} /> Filters
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
                  <button onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-black' : 'text-gray-400'}`}>
                    <Grid3X3 size={14} />
                  </button>
                  <button onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-black' : 'text-gray-400'}`}>
                    <LayoutList size={14} />
                  </button>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2">
                  <ArrowUpDown size={12} className="text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-[9px] uppercase tracking-widest font-bold bg-transparent outline-none cursor-pointer"
                  >
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low</option>
                    <option value="price-high">Price: High</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mt-2"
              >
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-wrap gap-8 items-end">
                  <div className="flex-1 min-w-[200px]">
                    <label className="text-[9px] uppercase tracking-widest font-black text-gray-500 mb-3 block">
                      Max Price: ₹{priceRange[1].toLocaleString()}
                    </label>
                    <input type="range" min={0} max={100000} step={500}
                      value={priceRange[1]}
                      onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full accent-black" />
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <label className="text-[9px] uppercase tracking-widest font-black text-gray-500 mb-3 block">
                      Min Price: ₹{priceRange[0].toLocaleString()}
                    </label>
                    <input type="range" min={0} max={100000} step={500}
                      value={priceRange[0]}
                      onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-full accent-black" />
                  </div>
                  <button onClick={() => setPriceRange([0, 100000])}
                    className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-gray-500 hover:text-black transition px-4 py-2 border border-gray-200 rounded-lg">
                    <X size={10} /> Reset
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Wishlist strip */}
        {wishlist.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mb-6 flex items-center gap-4 text-[10px] uppercase tracking-widest text-gray-500 bg-white border border-dashed border-gray-200 rounded-2xl px-6 py-4">
            <Heart size={14} className="text-red-400 fill-red-400" />
            <span className="font-bold">{wishlist.length} items saved to wishlist</span>
            <Link to="/wishlist" className="ml-auto flex items-center gap-2 text-black font-black hover:underline">
              View Wishlist <ArrowRight size={10} />
            </Link>
          </motion.div>
        )}

        {/* Product Grid / List */}
        {loading ? (
          <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'grid-cols-1'} gap-4`}>
            {[...Array(10)].map((_, i) => (
              <div key={i} className={`bg-white rounded-2xl overflow-hidden border border-gray-100 ${viewMode === 'list' ? 'h-36' : ''}`}>
                <div className={`${viewMode === 'list' ? 'h-full flex gap-4 p-4' : ''}`}>
                  <div className={`bg-gray-100 animate-pulse ${viewMode === 'list' ? 'w-28 h-28 rounded-xl shrink-0' : 'w-full aspect-square'}`} />
                  {viewMode === 'list' && (
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" />
                      <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
                    </div>
                  )}
                </div>
                {viewMode === 'grid' && (
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" />
                    <div className="h-4 bg-gray-100 rounded animate-pulse w-1/2" />
                    <div className="h-8 bg-gray-100 rounded-xl animate-pulse mt-3" />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-40 text-center bg-white rounded-2xl border border-gray-100">
            <Search size={32} className="text-gray-200 mx-auto mb-6" />
            <p className="text-[11px] uppercase tracking-widest text-gray-400">No products found</p>
          </div>
        ) : (
          <>
            <div className={viewMode === 'grid'
              ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
              : 'flex flex-col gap-4'
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
              <div className="mt-16 flex flex-col items-center gap-6">
                <button
                  onClick={() => setVisibleCount(v => v + 20)}
                  className="group flex items-center gap-4 text-[10px] uppercase tracking-[0.5em] font-black bg-white border border-gray-200 px-14 py-5 hover:bg-black hover:text-white hover:border-black transition-all duration-500 rounded-full shadow-sm hover:shadow-xl"
                >
                  Load More <Plus size={14} className="group-hover:rotate-90 transition-transform duration-500" />
                </button>
                <p className="text-[9px] text-gray-400 uppercase tracking-widest">
                  Showing {visibleCount} of {filteredProducts.length} products
                </p>
              </div>
            )}
          </>
        )}

        {/* Editorial Section */}
        {!loading && (
          <section className="my-24 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center border-y border-gray-200 py-24 bg-white rounded-3xl px-12">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }} className="space-y-10">
              <span className="text-[9px] uppercase tracking-[0.7em] text-blue-500 font-black">The Philosophy</span>
              <h2 className="text-5xl md:text-7xl font-light italic tracking-tighter leading-[0.9]">
                Curated for the <br /><span className="not-italic font-black">Minimalist Soul.</span>
              </h2>
              <p className="text-gray-400 text-sm max-w-sm leading-relaxed tracking-wide">
                Every object in our series is hand-vetted for aesthetic permanence. We don't follow trends; we curate artifacts that last lifetimes.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4">
                {[{ n: 12, label: 'Years of Curation', s: '+' }, { n: 500, label: 'Artisan Partners', s: '+' }].map(({ n, label, s }) => (
                  <div key={label} className="border border-gray-100 rounded-2xl p-6">
                    <div className="text-3xl font-light tabular-nums"><Counter target={n} suffix={s} /></div>
                    <div className="text-[9px] uppercase tracking-widest text-gray-400 mt-1">{label}</div>
                  </div>
                ))}
              </div>
              <Link to="/philosophy" className="inline-flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] font-black border-b border-black pb-2 group">
                Our Story <ArrowRight size={12} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </motion.div>
            <div className="relative aspect-[4/5] bg-[#F5F5F7] overflow-hidden rounded-3xl shadow-2xl">
              <motion.img
                whileHover={{ scale: 1.04 }} transition={{ duration: 2.5 }}
                src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=2000"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-[3s]" alt="Studio"
              />
              <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-lg">
                <p className="text-[9px] uppercase tracking-widest font-black text-gray-500 mb-1">Studio Note</p>
                <p className="text-[11px] italic text-gray-700 leading-relaxed">"Design is not just what it looks like — it's how it works."</p>
              </div>
            </div>
          </section>
        )}

        {/* Newsletter */}
        <section className="relative bg-black text-white p-10 md:p-24 rounded-[3rem] text-center my-16 overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)]">
          <div className="absolute inset-0 opacity-20 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 30% 50%, #3b82f6 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, #8b5cf6 0%, transparent 60%)' }} />
          <div className="relative z-10 max-w-xl mx-auto space-y-10">
            <span className="text-[9px] uppercase tracking-[1em] text-gray-500 font-bold">Exclusive Access</span>
            <h2 className="text-4xl md:text-6xl font-light italic tracking-tighter">Join the Series.</h2>
            <p className="text-gray-400 text-[10px] uppercase tracking-[0.3em] leading-loose">
              Early access to the Winter 2026 Archive and exclusive curation notes.
            </p>
            <div className="flex border border-gray-800 rounded-full overflow-hidden max-w-sm mx-auto bg-white/5 backdrop-blur-sm focus-within:border-gray-600 transition-colors">
              <input type="email" placeholder="your@email.com"
                className="bg-transparent flex-1 text-[11px] outline-none tracking-wide px-6 py-4 placeholder:text-gray-700" />
              <button className="bg-white text-black px-6 py-3 text-[9px] font-black uppercase tracking-[0.3em] rounded-full m-1 hover:bg-gray-100 transition-colors">
                Join
              </button>
            </div>
            <p className="text-[8px] text-gray-700 tracking-widest">No spam. Unsubscribe anytime.</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 pt-16 pb-8 px-6 md:px-12 mt-8">
        <div className="max-w-[1800px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 border-b border-gray-100 pb-16 mb-8">
            <div className="md:col-span-5 space-y-8">
              <h3 className="text-5xl font-light italic tracking-tighter">MINIKART</h3>
              <p className="text-[11px] text-gray-400 max-w-xs leading-relaxed uppercase tracking-[0.2em]">
                A global curation studio dedicated to the art of minimalist living and high-integrity objects.
              </p>
              <div className="flex gap-3">
                {['IG', 'PIN', 'TW', 'YT'].map(s => (
                  <button key={s} className="w-10 h-10 rounded-xl border border-gray-200 text-[9px] font-black text-gray-500 hover:bg-black hover:text-white hover:border-black transition-all duration-300">{s}</button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2 space-y-6">
              <h4 className="text-[9px] font-black uppercase tracking-[0.5em]">Navigate</h4>
              <ul className="text-[11px] text-gray-500 space-y-4 uppercase tracking-widest">
                {['Series Archive', 'Member Log', 'Studio Blog', 'Philosophy'].map(l => (
                  <li key={l} className="hover:text-black cursor-pointer transition">{l}</li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-2 space-y-6">
              <h4 className="text-[9px] font-black uppercase tracking-[0.5em]">Support</h4>
              <ul className="text-[11px] text-gray-500 space-y-4 uppercase tracking-widest">
                {['FAQs', 'Shipping', 'Returns', 'Contact'].map(l => (
                  <li key={l} className="hover:text-black cursor-pointer transition">{l}</li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-3 space-y-6">
              <h4 className="text-[9px] font-black uppercase tracking-[0.5em]">Contact</h4>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                hello@minikart.studio<br />Mon–Sat, 9AM–6PM IST
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[8px] uppercase tracking-[0.6em] text-gray-400">© 2026 MINIKART. DESIGNED FOR THE FEW.</p>
            <div className="flex gap-8 text-[8px] uppercase tracking-widest text-gray-400 font-bold">
              {['Terms', 'Privacy', 'Cookies'].map(t => <span key={t} className="hover:text-black cursor-pointer transition">{t}</span>)}
            </div>
          </div>
        </div>
      </footer>

      {/* Back to top */}
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        className="fixed bottom-8 right-8 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-gray-800 transition z-50 text-xs font-black"
      >
        ↑
      </motion.button>
    </div>
  );
};

export default Home;