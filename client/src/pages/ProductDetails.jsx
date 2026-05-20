import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ShoppingBag, Truck, ShieldCheck,
  Heart, Star, Zap, Share2, Check, ChevronRight,
  ArrowRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

/* ─── Toast ─────────────────────────────────────────────────────── */
const Toast = ({ message, onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 2200); return () => clearTimeout(t); }, [onDone]);
  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[999] bg-black text-white px-8 py-4 text-[10px] uppercase tracking-widest font-bold rounded-full shadow-2xl flex items-center gap-3 whitespace-nowrap"
    >
      <Zap size={12} className="text-yellow-400" /> {message}
    </motion.div>
  );
};

const ProductDetails = () => {
  const { id }        = useParams();
  const navigate      = useNavigate();
  const { addToCart } = useCart();
  const { user }      = useAuth();

  const [product,   setProduct]   = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [toast,     setToast]     = useState(null);
  const [isWished,  setIsWished]  = useState(false);
  const [added,     setAdded]     = useState(false); // true = show "Go to Cart"
  const [imgLoaded, setImgLoaded] = useState(false);
  const [qty,       setQty]       = useState(1);

  const authHeaders = user?.token ? { headers: { Authorization: `Bearer ${user.token}` } } : {};

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error('Error fetching product details', err);
      }
      setLoading(false);
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  // Reset "added" state if product changes
  useEffect(() => { setAdded(false); }, [id]);

  // Check wishlist status on load
  useEffect(() => {
    const checkWishlist = async () => {
      if (!user?.token || !product) return;
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/wishlist`, authHeaders);
        setIsWished(data.some(p => p._id === product._id));
      } catch {}
    };
    checkWishlist();
  }, [product, user]);

  const handleAdd = async () => {
    if (!user) { showToast('Please sign in to add to cart'); return; }
    await addToCart(product, qty);
    setAdded(true); // stays true — button becomes "Go to Cart" permanently until page change
    showToast(`${product.name.substring(0, 22)}... added to cart ✦`);
  };

  const handleWishlist = async () => {
    if (!user) { showToast('Please sign in to save items'); return; }
    try {
      if (isWished) {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/wishlist/${product._id}`, authHeaders);
        setIsWished(false);
        showToast('Removed from wishlist');
      } else {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/wishlist/${product._id}`, {}, authHeaders);
        setIsWished(true);
        showToast('Added to wishlist ✦');
      }
    } catch { showToast('Something went wrong'); }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Link copied to clipboard ✦');
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 bg-white">
      <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] uppercase tracking-[0.5em] text-gray-400 animate-pulse">Loading Object...</p>
    </div>
  );

  if (!product) return (
    <div className="h-screen flex flex-col items-center justify-center gap-6 bg-white">
      <p className="text-[11px] uppercase tracking-widest text-gray-400">Object not found.</p>
      <Link to="/" className="text-[10px] uppercase tracking-widest font-black underline">Back to Collection</Link>
    </div>
  );

  return (
    <div className="bg-white min-h-screen text-[#1D1D1F]">
      <Navbar />

      <AnimatePresence>
        {toast && <Toast message={toast} onDone={() => setToast(null)} />}
      </AnimatePresence>

      <main className="max-w-screen-2xl mx-auto px-6 md:px-12 pt-32 pb-24">

        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-gray-400 mb-10"
        >
          <Link to="/" className="hover:text-black transition">Collection</Link>
          <ChevronRight size={10} />
          <span className="text-[9px] uppercase tracking-widest text-gray-400">{product.category}</span>
          <ChevronRight size={10} />
          <span className="text-black font-bold truncate max-w-[200px]">{product.name}</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-start">

          {/* ── Left: Image ──────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <div className="relative bg-[#F5F5F7] rounded-3xl overflow-hidden aspect-square group">
              {!imgLoaded && <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />}

              <img
                src={product.image}
                alt={product.name}
                onLoad={() => setImgLoaded(true)}
                className={`w-full h-full object-cover transition-all duration-[2s] group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              />

              {/* Category badge */}
              <div className="absolute top-6 left-6">
                <span className="bg-white/90 backdrop-blur-sm text-black px-4 py-2 text-[8px] uppercase tracking-[0.3em] font-black rounded-full shadow-sm">
                  {product.category}
                </span>
              </div>

              {/* Wishlist + Share */}
              <div className="absolute top-6 right-6 flex flex-col gap-2">
                <button
                  onClick={handleWishlist}
                  className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md shadow-lg transition-all duration-300 ${
                    isWished ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-600 hover:bg-red-50 hover:text-red-500'
                  }`}
                >
                  <Heart size={15} fill={isWished ? 'white' : 'none'} />
                </button>
                <button
                  onClick={handleShare}
                  className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-600 hover:bg-gray-100 shadow-lg transition-all duration-300"
                >
                  <Share2 size={14} />
                </button>
              </div>
            </div>

            {/* Thumbnail strip */}
            <div className="flex gap-3 mt-4">
              {[1, 2, 3].map(i => (
                <div key={i} className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer ${i === 1 ? 'border-black' : 'border-transparent opacity-50 hover:opacity-80'}`}>
                  <img src={product.image} alt="" className="w-full h-full object-cover" style={{ filter: i !== 1 ? `hue-rotate(${i * 30}deg) saturate(0.7)` : 'none' }} />
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Right: Info ──────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}
            className="flex flex-col lg:sticky lg:top-28"
          >
            <span className="text-[9px] uppercase tracking-[0.6em] text-gray-400 font-bold mb-3">{product.category}</span>
            <h1 className="text-4xl md:text-6xl font-light italic tracking-tighter mb-4 leading-tight">{product.name}</h1>

            {/* Stars */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} className={i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'} />
                ))}
              </div>
              <span className="text-[9px] text-gray-400 uppercase tracking-widest">(128 reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-8">
              <p className="text-4xl font-light text-gray-900">₹{product.price.toLocaleString()}</p>
              <span className="text-[9px] uppercase tracking-widest text-green-500 font-black bg-green-50 px-3 py-1 rounded-full">In Stock</span>
            </div>

            {/* Description */}
            <div className="border-t border-gray-100 pt-8 mb-8">
              <h4 className="text-[9px] uppercase tracking-widest font-black mb-4 text-gray-400">Overview</h4>
              <p className="text-gray-500 leading-relaxed font-light text-base">
                {product.description}
              </p>
            </div>

            {/* Trust markers */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="flex items-center gap-3 text-[9px] uppercase tracking-widest text-gray-500 border border-gray-100 p-4 rounded-2xl hover:border-gray-300 transition-all">
                <Truck size={15} className="shrink-0" /> Fast Delivery
              </div>
              <div className="flex items-center gap-3 text-[9px] uppercase tracking-widest text-gray-500 border border-gray-100 p-4 rounded-2xl hover:border-gray-300 transition-all">
                <ShieldCheck size={15} className="shrink-0" /> 2 Year Warranty
              </div>
            </div>

            {/* Qty selector — hide after adding */}
            {!added && (
              <div className="flex items-center gap-4 mb-6">
                <span className="text-[9px] uppercase tracking-widest text-gray-400 font-black">Qty</span>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="px-4 py-3 text-gray-600 hover:bg-gray-50 transition text-lg font-light"
                  >−</button>
                  <span className="px-5 py-3 text-sm font-black border-x border-gray-200 min-w-[48px] text-center">{qty}</span>
                  <button
                    onClick={() => setQty(q => q + 1)}
                    className="px-4 py-3 text-gray-600 hover:bg-gray-50 transition text-lg font-light"
                  >+</button>
                </div>
              </div>
            )}

            {/* CTA buttons */}
            <div className="flex flex-col gap-3">
              <AnimatePresence mode="wait">
                {added ? (
                  /* ── Go to Cart button ── */
                  <motion.div
                    key="go-to-cart"
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-3"
                  >
                    {/* Success confirmation strip */}
                    <div className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-2xl px-5 py-3">
                      <Check size={16} className="text-green-500 shrink-0" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-green-700">Added to your cart</p>
                        <p className="text-[9px] text-green-500 mt-0.5">{qty} × {product.name.substring(0, 30)}{product.name.length > 30 ? '...' : ''}</p>
                      </div>
                    </div>

                    {/* Go to Cart */}
                    <motion.button
                      onClick={() => navigate('/cart')}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-5 text-[10px] uppercase tracking-[0.3em] font-black bg-black text-white rounded-2xl shadow-xl flex items-center justify-center gap-4 hover:bg-gray-800 transition-all duration-300 group"
                    >
                      <ShoppingBag size={16} />
                      Go to Cart
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </motion.button>

                    {/* Continue shopping */}
                    <button
                      onClick={() => { setAdded(false); setQty(1); }}
                      className="w-full py-4 text-[10px] uppercase tracking-[0.3em] font-black border border-gray-200 text-gray-600 rounded-2xl hover:border-gray-400 transition-all duration-300"
                    >
                      + Add More / Change Qty
                    </button>
                  </motion.div>
                ) : (
                  /* ── Add to Cart button ── */
                  <motion.div
                    key="add-to-cart"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-3"
                  >
                    <motion.button
                      onClick={handleAdd}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-5 text-[10px] uppercase tracking-[0.3em] font-black bg-black text-white rounded-2xl shadow-xl flex items-center justify-center gap-4 hover:bg-gray-800 transition-all duration-500"
                    >
                      <ShoppingBag size={16} /> Add to Cart
                    </motion.button>

                    <button
                      onClick={handleWishlist}
                      className={`w-full py-4 text-[10px] uppercase tracking-[0.3em] font-black border rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 ${
                        isWished
                          ? 'border-red-200 bg-red-50 text-red-500'
                          : 'border-gray-200 text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      <Heart size={14} fill={isWished ? 'currentColor' : 'none'} />
                      {isWished ? 'Saved to Wishlist' : 'Save to Wishlist'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Shipping note */}
            <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-6 flex items-center gap-2">
              <Truck size={11} /> Free shipping on orders above ₹999
            </p>
          </motion.div>
        </div>
      </main>

      <footer className="bg-[#F5F5F7] py-20 px-8 text-center">
        <div className="text-[9px] uppercase tracking-[0.5em] text-gray-400">© 2026 MINIKART. DESIGNED FOR THE FEW.</div>
      </footer>
    </div>
  );
};

export default ProductDetails;