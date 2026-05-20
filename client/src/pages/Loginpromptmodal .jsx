import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, UserPlus, ShoppingBag, Lock } from 'lucide-react';

/**
 * LoginPromptModal
 *
 * Show this when a guest user tries to add to cart.
 *
 * Usage in any component:
 *   const [showLoginPrompt, setShowLoginPrompt] = useState(false);
 *   <LoginPromptModal isOpen={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} />
 *
 * Trigger it like this (e.g. in ProductDetails or Home):
 *   const { user } = useAuth();
 *   const handleAddToCart = (product) => {
 *     if (!user) { setShowLoginPrompt(true); return; }
 *     addToCart(product);
 *   };
 */
const LoginPromptModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-6 pointer-events-none"
          >
            <div className="bg-white rounded-3xl shadow-2xl shadow-black/20 w-full max-w-sm overflow-hidden pointer-events-auto">

              {/* Top accent bar */}
              <div className="h-1 bg-black w-full" />

              {/* Header */}
              <div className="relative px-8 pt-8 pb-6 text-center border-b border-gray-50">
                <button
                  onClick={onClose}
                  className="absolute top-5 right-5 p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X size={16} className="text-gray-400" />
                </button>

                <div className="w-16 h-16 bg-[#F5F5F7] rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Lock size={24} strokeWidth={1.5} className="text-gray-600" />
                </div>

                <h2 className="text-2xl font-light italic tracking-tight text-gray-900 mb-2">
                  Sign in to continue
                </h2>
                <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-bold leading-relaxed">
                  Log in or create an account to add items to your cart
                </p>
              </div>

              {/* Cart hint */}
              <div className="px-8 py-5 bg-[#FAFAFA] border-b border-gray-100 flex items-center gap-4">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shrink-0">
                  <ShoppingBag size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest">Your cart is waiting</p>
                  <p className="text-[9px] text-gray-400 mt-0.5">Sign in to save items and checkout securely</p>
                </div>
              </div>

              {/* Actions */}
              <div className="px-8 py-8 space-y-3">
                <Link
                  to="/login"
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-3 bg-black text-white py-4 text-[10px] uppercase tracking-[0.3em] font-black rounded-2xl hover:bg-gray-800 transition-all duration-300"
                >
                  <User size={13} /> Sign In
                </Link>

                <Link
                  to="/register"
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-3 border border-gray-200 text-gray-700 py-4 text-[10px] uppercase tracking-[0.3em] font-black rounded-2xl hover:border-black hover:text-black transition-all duration-300"
                >
                  <UserPlus size={13} /> Create Account
                </Link>

                <button
                  onClick={onClose}
                  className="w-full text-[9px] uppercase tracking-widest text-gray-400 py-2 hover:text-gray-600 transition-colors font-bold"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LoginPromptModal;