import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  Heart, Trash2, ShoppingBag, ArrowRight,
  Star, Package, Sparkles
} from 'lucide-react';

/* ─── Empty State ───────────────────────────────────────────────── */
const EmptyWishlist = () => (
  <motion.div
    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-40 text-center px-6"
  >
    <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mb-10">
      <Heart size={36} className="text-red-300" strokeWidth={1.5} />
    </div>
    <h2 className="text-4xl font-light italic tracking-tight mb-4 text-gray-900">Nothing saved yet.</h2>
    <p className="text-[10px] uppercase tracking-[0.5em] text-gray-400 font-bold max-w-xs leading-relaxed mb-12">
      Browse the collection and tap the heart icon to save objects you love.
    </p>
    <Link
      to="/"
      className="group flex items-center gap-4 bg-black text-white px-10 py-5 text-[10px] uppercase tracking-[0.4em] font-black rounded-full hover:bg-gray-800 transition-all duration-300"
    >
      <Sparkles size={13} /> Explore Collection
      <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
    </Link>
  </motion.div>
);

/* ─── Wishlist Card ─────────────────────────────────────────────── */
const WishlistCard = ({ product, onRemove, onAddToCart }) => {
  const [removing, setRemoving] = useState(false);

  const handleRemove = async () => {
    setRemoving(true);
    setTimeout(() => onRemove(product._id), 350);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: removing ? 0 : 1, scale: removing ? 0.9 : 1 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      transition={{ duration: 0.35 }}
      className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-2xl hover:shadow-black/5 transition-all duration-500"
    >
      {/* Image */}
      <Link to={`/product/${product._id}`} className="block">
        <div className="aspect-[3/4] overflow-hidden bg-[#F5F5F7] relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Remove button */}
          <button
            onClick={(e) => { e.preventDefault(); handleRemove(); }}
            className="absolute top-4 right-4 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50 hover:text-red-500 shadow-lg"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="p-5 space-y-3">
        <div>
          <span className="text-[8px] uppercase tracking-[0.4em] text-gray-400 font-bold">{product.category}</span>
          <Link to={`/product/${product._id}`}>
            <h3 className="text-[12px] font-bold uppercase tracking-wide mt-1 hover:underline underline-offset-2 leading-snug line-clamp-2">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={9} className={i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'} />
          ))}
          <span className="text-[8px] text-gray-400 ml-1">(4.0)</span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-base font-light">₹{product.price.toLocaleString()}</span>
          <button
            onClick={() => onAddToCart(product)}
            className="flex items-center gap-2 bg-black text-white px-4 py-2.5 text-[8px] uppercase tracking-widest font-black rounded-xl hover:bg-gray-800 transition-all duration-300 hover:gap-3 group/btn"
          >
            <ShoppingBag size={11} className="group-hover/btn:scale-110 transition-transform" />
            Add
          </button>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Main Wishlist Page ────────────────────────────────────────── */
const Wishlist = () => {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const { addToCart } = useCart();
  const { user } = useAuth();

  const authHeaders = { headers: { Authorization: `Bearer ${user?.token}` } };

  // Load wishlist from backend
  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (!user?.token) { setLoading(false); return; }
      setLoading(true);
      try {
        const { data } = await axios.get('http://localhost:5000/api/wishlist', authHeaders);
        setWishlistProducts(data);
      } catch (err) {
        console.error('Failed to fetch wishlist:', err);
        setWishlistProducts([]);
      }
      setLoading(false);
    };

    fetchWishlistProducts();
  }, [user]);

  const handleRemove = async (id) => {
    try {
      const { data } = await axios.delete(`http://localhost:5000/api/wishlist/${id}`, authHeaders);
      setWishlistProducts(data);
      showToast('Removed from wishlist');
    } catch (err) {
      console.error('Remove failed:', err);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    showToast(`${product.name.substring(0, 20)}... added to cart ✦`);
  };

  const handleClearAll = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/wishlist`, authHeaders);
      setWishlistProducts([]);
      showToast('Wishlist cleared');
    } catch (err) {
      console.error('Clear failed:', err);
    }
  };

  const handleAddAllToCart = () => {
    wishlistProducts.forEach(p => addToCart(p));
    showToast(`${wishlistProducts.length} items added to cart ✦`);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className="min-h-screen bg-white text-[#1D1D1F]">
      <Navbar />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[999] bg-black text-white px-8 py-4 text-[10px] uppercase tracking-widest font-bold rounded-full shadow-2xl flex items-center gap-3 whitespace-nowrap"
          >
            <Heart size={11} className="text-red-400 fill-red-400" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-[1800px] mx-auto px-6 md:px-12 pt-36 pb-24">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <span className="text-[9px] uppercase tracking-[0.7em] text-red-400 font-black flex items-center gap-2 mb-4">
            <Heart size={10} className="fill-red-400" /> Saved Objects
          </span>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl md:text-7xl font-light italic tracking-tighter leading-none">
                Your Wishlist.
              </h1>
              <p className="text-gray-400 text-[10px] uppercase tracking-widest mt-4">
                {wishlistProducts.length} {wishlistProducts.length === 1 ? 'object' : 'objects'} saved
                {user && <span className="ml-2 text-gray-300">· {user.name}</span>}
              </p>
            </div>

            {wishlistProducts.length > 0 && (
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={handleAddAllToCart}
                  className="flex items-center gap-3 bg-black text-white px-8 py-4 text-[9px] uppercase tracking-widest font-black rounded-full hover:bg-gray-800 transition-all duration-300 group"
                >
                  <ShoppingBag size={12} /> Add All to Cart
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-2 border border-gray-200 px-6 py-4 text-[9px] uppercase tracking-widest font-black text-gray-500 rounded-full hover:border-red-200 hover:text-red-500 hover:bg-red-50 transition-all duration-300"
                >
                  <Trash2 size={11} /> Clear All
                </button>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-6 mt-10">
            <div className="flex-1 h-[1px] bg-gray-100" />
            <Package size={14} className="text-gray-300" />
            <div className="flex-1 h-[1px] bg-gray-100" />
          </div>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-3xl overflow-hidden border border-gray-100">
                <div className="aspect-[3/4] bg-gray-100 animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : wishlistProducts.length === 0 ? (
          <EmptyWishlist />
        ) : (
          <>
            <motion.div
              layout
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            >
              <AnimatePresence>
                {wishlistProducts.map((product, index) => (
                  <WishlistCard
                    key={product._id}
                    product={product}
                    index={index}
                    onRemove={handleRemove}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Continue Shopping */}
            <motion.div
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              className="mt-24 flex flex-col items-center gap-6 text-center border-t border-gray-100 pt-16"
            >
              <p className="text-[10px] uppercase tracking-[0.6em] text-gray-400 font-bold">Discover More</p>
              <Link
                to="/"
                className="group flex items-center gap-4 text-[11px] uppercase tracking-[0.4em] font-black border border-gray-200 px-12 py-5 rounded-full hover:bg-black hover:text-white hover:border-black transition-all duration-500"
              >
                Continue Browsing <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
};

export default Wishlist;