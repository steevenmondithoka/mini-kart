import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  ChevronDown, ChevronRight, SlidersHorizontal, X,
  Star, Heart, ShoppingBag, Eye, Zap, ArrowUpDown,
  Grid3X3, LayoutList, ChevronLeft, Search, Check
} from 'lucide-react';

/* ══════════════════════════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════════════════════════ */
const Toast = ({ message, onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 2000); return () => clearTimeout(t); }, [onDone]);
  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
      transition={{ type: 'spring', damping: 22, stiffness: 300 }}
      className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-auto z-[998]"
    >
      <div className="bg-gray-900 text-white px-5 py-3 text-[10px] uppercase tracking-widest font-bold rounded-2xl shadow-2xl flex items-center gap-2.5 border border-white/10">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shrink-0" />
        <span className="truncate sm:whitespace-nowrap">{message}</span>
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   FILTER SECTION (collapsible)
══════════════════════════════════════════════════════════════════ */
const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 py-4">
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full text-left">
        <span className="text-[11px] uppercase tracking-widest font-black text-gray-700">{title}</span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-3 space-y-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CheckboxOption = ({ label, checked, onChange, count }) => (
  <label className="flex items-center gap-2.5 cursor-pointer group">
    <div onClick={onChange}
      className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all shrink-0 ${
        checked ? 'bg-blue-600 border-blue-600' : 'border-gray-300 group-hover:border-blue-400'
      }`}>
      {checked && <Check size={10} className="text-white" strokeWidth={3} />}
    </div>
    <span className="text-[11px] text-gray-600 group-hover:text-gray-900 transition flex-1">{label}</span>
    {count !== undefined && <span className="text-[9px] text-gray-400">({count})</span>}
  </label>
);

/* ══════════════════════════════════════════════════════════════════
   PRODUCT ROW — Flipkart list style
══════════════════════════════════════════════════════════════════ */
const ProductRow = ({ product, onAdd, onWish, isWished, onToast }) => {
  const [adding, setAdding] = useState(false);
  const navigate = useNavigate();

  const doAdd = async (e) => {
    e.stopPropagation();
    setAdding(true);
    await onAdd(product);
    onToast('Added to cart ✓');
    setTimeout(() => setAdding(false), 1600);
  };

  const doWish = (e) => {
    e.stopPropagation();
    onWish(product._id);
    onToast(isWished ? 'Removed from wishlist' : 'Saved to wishlist ♥');
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : Math.floor(Math.random() * 30) + 10;

  const fakeOriginal = Math.round(product.price * (1 + discount / 100));

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden cursor-pointer"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      <div className="flex gap-4 p-4">
        {/* Image */}
        <div className="w-36 sm:w-44 shrink-0 flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden self-stretch">
          <img src={product.image} alt={product.name}
            className="w-full h-full object-contain p-2 hover:scale-105 transition-transform duration-500 max-h-40" />
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          {/* Name */}
          <h3 className="text-sm sm:text-base font-semibold text-gray-800 leading-snug line-clamp-2 hover:text-blue-600 transition">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-green-500 text-white px-2 py-0.5 rounded text-[10px] font-black w-fit">
              <span>4.0</span> <Star size={8} className="fill-white" />
            </div>
            <span className="text-[10px] text-gray-400">128 Ratings & 32 Reviews</span>
          </div>

          {/* Description bullets */}
          {product.description && (
            <ul className="hidden sm:block space-y-0.5">
              {product.description.split(',').slice(0, 3).map((item, i) => (
                <li key={i} className="text-[11px] text-gray-500 flex items-start gap-1.5">
                  <span className="text-gray-300 mt-0.5">•</span>
                  <span className="line-clamp-1">{item.trim()}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Price row */}
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-lg sm:text-xl font-black text-gray-900">₹{product.price.toLocaleString()}</span>
            <span className="text-[11px] text-gray-400 line-through">₹{fakeOriginal.toLocaleString()}</span>
            <span className="text-[11px] font-black text-green-600">{discount}% off</span>
          </div>
          <p className="text-[10px] text-teal-600 font-semibold">Free Delivery</p>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-2" onClick={e => e.stopPropagation()}>
            <button onClick={doAdd} disabled={adding}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-black transition-all ${
                adding ? 'bg-green-500 text-white' : 'bg-amber-400 text-black hover:bg-amber-500 active:scale-95'
              }`}>
              <ShoppingBag size={12} /> {adding ? 'Added ✓' : 'Add to Cart'}
            </button>
            <button onClick={doWish}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-black border transition-all ${
                isWished
                  ? 'border-red-200 bg-red-50 text-red-500'
                  : 'border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-500'
              }`}>
              <Heart size={12} fill={isWished ? 'currentColor' : 'none'} />
              <span className="hidden sm:inline">{isWished ? 'Saved' : 'Wishlist'}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   PRODUCT GRID CARD
══════════════════════════════════════════════════════════════════ */
const ProductGridCard = ({ product, onAdd, onWish, isWished, onToast }) => {
  const [adding, setAdding] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  const doAdd = async (e) => {
    e.stopPropagation();
    setAdding(true);
    await onAdd(product);
    onToast('Added to cart ✓');
    setTimeout(() => setAdding(false), 1600);
  };

  const doWish = (e) => {
    e.stopPropagation();
    onWish(product._id);
    onToast(isWished ? 'Removed' : 'Saved ♥');
  };

  const discount = Math.floor(Math.random() * 30) + 10;
  const fakeOriginal = Math.round(product.price * (1 + discount / 100));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      <div className="relative bg-gray-50 overflow-hidden" style={{ paddingBottom: '100%' }}>
        <div className="absolute inset-0 flex items-center justify-center p-3">
          {!loaded && <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-100 to-gray-200" />}
          <img src={product.image} alt={product.name} onLoad={() => setLoaded(true)}
            className={`max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105 ${loaded ? 'opacity-100' : 'opacity-0'}`} />
        </div>
        {/* Discount badge */}
        <div className="absolute top-2 left-2">
          <span className="bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded">{discount}% OFF</span>
        </div>
        {/* Wishlist */}
        <button onClick={doWish}
          className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center shadow transition-all ${
            isWished ? 'bg-red-500 text-white' : 'bg-white text-gray-400 opacity-0 group-hover:opacity-100'
          }`}>
          <Heart size={12} fill={isWished ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="flex flex-col flex-1 p-3 gap-1.5" onClick={e => e.stopPropagation()}>
        <Link to={`/product/${product._id}`}>
          <h3 className="text-[11px] font-semibold text-gray-800 line-clamp-2 leading-snug hover:text-blue-600 transition">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-1.5">
          <span className="bg-green-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
            4.0 <Star size={7} className="fill-white" />
          </span>
          <span className="text-[8px] text-gray-400">(128)</span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="font-black text-sm text-gray-900">₹{product.price.toLocaleString()}</span>
          <span className="text-[9px] text-gray-400 line-through">₹{fakeOriginal.toLocaleString()}</span>
          <span className="text-[9px] font-black text-green-600">{discount}%</span>
        </div>
        <button onClick={doAdd} disabled={adding}
          className={`w-full mt-1 py-2 rounded-lg text-[8px] uppercase font-black tracking-wide transition-all ${
            adding ? 'bg-green-500 text-white' : 'bg-amber-400 text-black hover:bg-amber-500 active:scale-95'
          }`}>
          <ShoppingBag size={9} className="inline mr-1" />
          {adding ? 'Added ✓' : 'Add to Cart'}
        </button>
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   CATEGORY PAGE
══════════════════════════════════════════════════════════════════ */
const CategoryPage = () => {
  const { category } = useParams(); // e.g. "Electronics", "Laptops"
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [wishlist, setWishlist]     = useState([]);
  const [toast, setToast]           = useState(null);
  const [viewMode, setViewMode]     = useState('list');
  const [sortBy, setSortBy]         = useState('popularity');
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Filters state
  const [priceRange, setPriceRange]   = useState([0, 200000]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedBrands, setSelectedBrands]   = useState([]);

  const { user }      = useAuth();
  const { addToCart } = useCart();
  const auth = user?.token ? { headers: { Authorization: `Bearer ${user.token}` } } : {};

  const decodedCat = decodeURIComponent(category || '');

  // Fetch products
  useEffect(() => {
    setLoading(true);
    setSelectedBrands([]);
    setSelectedRatings([]);
    setPriceRange([0, 200000]);
    const url = `${import.meta.env.VITE_API_BASE_URL}/products?category=${encodeURIComponent(decodedCat)}`;
    axios.get(url)
      .then(({ data }) => setProducts(data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [decodedCat]);

  // Fetch wishlist
  useEffect(() => {
    if (!user?.token) { setWishlist([]); return; }
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/wishlist`, auth)
      .then(({ data }) => setWishlist(data.map(p => p._id)))
      .catch(() => {});
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

  // Extract brands from products
  const allBrands = [...new Set(products.map(p => {
    const name = p.name.toLowerCase();
    if (name.includes('samsung')) return 'Samsung';
    if (name.includes('apple') || name.includes('iphone') || name.includes('ipad') || name.includes('macbook')) return 'Apple';
    if (name.includes('oneplus')) return 'OnePlus';
    if (name.includes('xiaomi') || name.includes('redmi') || name.includes('poco')) return 'Xiaomi';
    if (name.includes('realme')) return 'Realme';
    if (name.includes('oppo')) return 'OPPO';
    if (name.includes('vivo')) return 'vivo';
    if (name.includes('google') || name.includes('pixel')) return 'Google';
    if (name.includes('motorola') || name.includes('moto')) return 'Motorola';
    if (name.includes('nokia')) return 'Nokia';
    if (name.includes('asus')) return 'ASUS';
    if (name.includes('hp')) return 'HP';
    if (name.includes('dell')) return 'Dell';
    if (name.includes('lenovo')) return 'Lenovo';
    if (name.includes('sony')) return 'Sony';
    if (name.includes('lg')) return 'LG';
    if (name.includes('bosch')) return 'Bosch';
    if (name.includes('philips')) return 'Philips';
    return 'Others';
  }))].filter(Boolean);

  // Apply filters + sort
  const filtered = products.filter(p => {
    if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
    if (selectedBrands.length > 0) {
      const name = p.name.toLowerCase();
      const match = selectedBrands.some(b => name.includes(b.toLowerCase()) ||
        (b === 'Apple' && (name.includes('iphone') || name.includes('ipad') || name.includes('macbook'))) ||
        (b === 'Xiaomi' && (name.includes('redmi') || name.includes('poco')))
      );
      if (!match) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-low')  return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating')     return (b.rating || 4) - (a.rating || 4);
    if (sortBy === 'newest')     return new Date(b.createdAt) - new Date(a.createdAt);
    return 0; // popularity
  });

  const priceSlabs = [
    { label: 'Under ₹10,000', min: 0, max: 10000 },
    { label: '₹10,000 – ₹25,000', min: 10000, max: 25000 },
    { label: '₹25,000 – ₹50,000', min: 25000, max: 50000 },
    { label: '₹50,000 – ₹1,00,000', min: 50000, max: 100000 },
    { label: 'Above ₹1,00,000', min: 100000, max: 200000 },
  ];

  const ratingOptions = [4, 3, 2, 1];

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedRatings([]);
    setPriceRange([0, 200000]);
  };

  const hasFilters = selectedBrands.length > 0 || selectedRatings.length > 0 ||
    priceRange[0] > 0 || priceRange[1] < 200000;

  /* ── Sidebar ─────────────────────────────────────────────────── */
  const Sidebar = () => (
    <div className="space-y-0">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <h2 className="text-sm font-black uppercase tracking-wider text-gray-800 flex items-center gap-2">
          <SlidersHorizontal size={14} /> Filters
        </h2>
        {hasFilters && (
          <button onClick={clearAllFilters}
            className="text-[10px] text-blue-600 font-black uppercase tracking-widest hover:text-blue-800 transition">
            Clear All
          </button>
        )}
      </div>

      {/* Active filter pills */}
      {hasFilters && (
        <div className="py-3 flex flex-wrap gap-1.5 border-b border-gray-100">
          {selectedBrands.map(b => (
            <span key={b} onClick={() => setSelectedBrands(p => p.filter(x => x !== b))}
              className="flex items-center gap-1 bg-blue-50 text-blue-700 text-[9px] font-black px-2.5 py-1 rounded-full cursor-pointer hover:bg-blue-100 transition border border-blue-200">
              {b} <X size={9} />
            </span>
          ))}
          {(priceRange[0] > 0 || priceRange[1] < 200000) && (
            <span onClick={() => setPriceRange([0, 200000])}
              className="flex items-center gap-1 bg-blue-50 text-blue-700 text-[9px] font-black px-2.5 py-1 rounded-full cursor-pointer hover:bg-blue-100 transition border border-blue-200">
              ₹{priceRange[0].toLocaleString()} – ₹{priceRange[1].toLocaleString()} <X size={9} />
            </span>
          )}
        </div>
      )}

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="space-y-2">
          {priceSlabs.map(({ label, min, max }) => (
            <CheckboxOption
              key={label}
              label={label}
              checked={priceRange[0] === min && priceRange[1] === max}
              onChange={() => {
                if (priceRange[0] === min && priceRange[1] === max) {
                  setPriceRange([0, 200000]);
                } else {
                  setPriceRange([min, max]);
                }
              }}
            />
          ))}
        </div>
        {/* Custom range */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-[9px] uppercase tracking-widest text-gray-400 font-black mb-2">Custom Range</p>
          <div className="flex gap-2">
            <input type="number" placeholder="Min"
              value={priceRange[0] || ''}
              onChange={e => setPriceRange([+e.target.value || 0, priceRange[1]])}
              className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-[11px] outline-none focus:border-blue-400 transition" />
            <input type="number" placeholder="Max"
              value={priceRange[1] === 200000 ? '' : priceRange[1]}
              onChange={e => setPriceRange([priceRange[0], +e.target.value || 200000])}
              className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-[11px] outline-none focus:border-blue-400 transition" />
          </div>
        </div>
      </FilterSection>

      {/* Customer Rating */}
      <FilterSection title="Customer Rating">
        {ratingOptions.map(r => (
          <CheckboxOption
            key={r}
            label={
              <span className="flex items-center gap-1">
                {r}★ & above
              </span>
            }
            checked={selectedRatings.includes(r)}
            onChange={() => setSelectedRatings(p =>
              p.includes(r) ? p.filter(x => x !== r) : [...p, r]
            )}
          />
        ))}
      </FilterSection>

      {/* Brand */}
      {allBrands.length > 0 && (
        <FilterSection title="Brand">
          {allBrands.map(brand => (
            <CheckboxOption
              key={brand}
              label={brand}
              checked={selectedBrands.includes(brand)}
              count={products.filter(p => p.name.toLowerCase().includes(brand.toLowerCase()) ||
                (brand === 'Apple' && (p.name.toLowerCase().includes('iphone') || p.name.toLowerCase().includes('ipad'))) ||
                (brand === 'Xiaomi' && (p.name.toLowerCase().includes('redmi') || p.name.toLowerCase().includes('poco')))
              ).length}
              onChange={() => setSelectedBrands(p =>
                p.includes(brand) ? p.filter(x => x !== brand) : [...p, brand]
              )}
            />
          ))}
        </FilterSection>
      )}

      {/* Discount */}
      <FilterSection title="Discount">
        {[70, 50, 30, 10].map(d => (
          <CheckboxOption
            key={d}
            label={`${d}% or more`}
            checked={false}
            onChange={() => {}}
          />
        ))}
      </FilterSection>
    </div>
  );

  return (
    <div className="bg-[#f5f5f5] min-h-screen text-gray-900">
      <Navbar />
      <AnimatePresence>{toast && <Toast message={toast} onDone={() => setToast(null)} />}</AnimatePresence>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {showMobileFilter && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilter(false)}
              className="fixed inset-0 bg-black/50 z-[60] sm:hidden" />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white z-[70] sm:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
                <span className="font-black text-sm uppercase tracking-widest">Filters</span>
                <button onClick={() => setShowMobileFilter(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <X size={16} />
                </button>
              </div>
              <div className="p-4"><Sidebar /></div>
              <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
                <button onClick={() => setShowMobileFilter(false)}
                  className="w-full bg-blue-600 text-white py-3 rounded-full text-[11px] uppercase font-black tracking-widest hover:bg-blue-700 transition">
                  Show {filtered.length} Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 pt-20 sm:pt-24 pb-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mb-4">
          <Link to="/" className="hover:text-blue-600 transition">Home</Link>
          <ChevronRight size={10} />
          <span className="text-gray-700 font-bold">{decodedCat}</span>
        </div>

        <div className="flex gap-4">

          {/* ── LEFT SIDEBAR — desktop ──────────────────────────── */}
          <aside className="hidden sm:block w-56 lg:w-64 shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-24">
              <Sidebar />
            </div>
          </aside>

          {/* ── RIGHT CONTENT ────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Top bar */}
            <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-3 flex items-center justify-between gap-3 sticky top-20 sm:top-24 z-30">
              <div className="flex items-center gap-2">
                {/* Mobile filter button */}
                <button onClick={() => setShowMobileFilter(true)}
                  className="sm:hidden flex items-center gap-1.5 text-[10px] uppercase font-black bg-gray-100 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-200 transition">
                  <SlidersHorizontal size={11} /> Filter
                  {hasFilters && <span className="w-4 h-4 bg-blue-600 text-white rounded-full text-[7px] flex items-center justify-center font-black">
                    {selectedBrands.length + selectedRatings.length + (hasFilters ? 1 : 0)}
                  </span>}
                </button>

                <h1 className="text-sm font-black text-gray-800 capitalize hidden sm:block">{decodedCat}</h1>
                <span className="text-[10px] text-gray-400 hidden sm:block">({filtered.length} products)</span>
              </div>

              <div className="flex items-center gap-2">
                {/* Sort */}
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span className="text-gray-400 hidden sm:block font-bold uppercase tracking-wide">Sort:</span>
                  {[
                    { val: 'popularity', label: 'Popular' },
                    { val: 'price-low',  label: 'Low' },
                    { val: 'price-high', label: 'High' },
                    { val: 'newest',     label: 'New' },
                    { val: 'rating',     label: 'Rating' },
                  ].map(({ val, label }) => (
                    <button key={val} onClick={() => setSortBy(val)}
                      className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wide transition-all ${
                        sortBy === val ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'
                      }`}>
                      {label}
                    </button>
                  ))}
                </div>

                {/* View toggle */}
                <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                  {[['list', LayoutList], ['grid', Grid3X3]].map(([m, Icon]) => (
                    <button key={m} onClick={() => setViewMode(m)}
                      className={`p-1.5 rounded-md transition-all ${viewMode === m ? 'bg-white shadow text-gray-900' : 'text-gray-400'}`}>
                      <Icon size={13} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Products */}
            {loading ? (
              <div className={`grid gap-3 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${viewMode === 'list' ? 'h-40' : ''}`}>
                    <div className={`animate-pulse bg-gradient-to-br from-gray-100 to-gray-200 ${viewMode === 'list' ? 'h-full' : 'aspect-square'}`} />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 py-24 text-center">
                <Search size={32} className="text-gray-200 mx-auto mb-4" />
                <p className="text-sm font-black text-gray-400 mb-2">No products found</p>
                <p className="text-[11px] text-gray-400 mb-6">Try adjusting your filters</p>
                <button onClick={clearAllFilters}
                  className="text-[11px] uppercase font-black text-blue-600 hover:text-blue-800 transition underline">
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3'
                  : 'flex flex-col gap-3'
              }>
                {filtered.map((product, i) => (
                  viewMode === 'list'
                    ? <ProductRow key={product._id} product={product} onAdd={doAdd}
                        onWish={toggleWish} isWished={wishlist.includes(product._id)} onToast={setToast} />
                    : <ProductGridCard key={product._id} product={product} onAdd={doAdd}
                        onWish={toggleWish} isWished={wishlist.includes(product._id)} onToast={setToast} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;