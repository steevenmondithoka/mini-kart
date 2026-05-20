import { motion } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const QuickView = ({ product, onClose }) => {
    const { addToCart } = useCart();

    // FIX 1: Guard Clause - If product is null or undefined, don't render anything
    if (!product) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Overlay */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/10 backdrop-blur-sm"
            />

            {/* Drawer */}
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="relative w-full max-w-md bg-white h-full shadow-2xl p-10 flex flex-col overflow-y-auto no-scrollbar"
            >
                <X
                    onClick={onClose}
                    className="absolute top-6 right-6 cursor-pointer hover:rotate-90 transition text-gray-400 hover:text-black"
                    size={20}
                />

                {/* FIX 2: Added optional chaining (?.) and removed grayscale per your previous preference */}
                <img
                    src={product?.image}
                    className="w-full aspect-[4/5] object-cover bg-[#F5F5F7] mb-8"
                    alt={product?.name}
                />

                <h2 className="text-3xl font-light italic mb-2 tracking-tighter">
                    {product?.name}
                </h2>

                <p className="text-2xl font-semibold mb-8 text-gray-900">
                    ₹{product?.price}
                </p>

                <div className="border-t border-gray-100 pt-6 mb-10">
                    <h4 className="text-[10px] uppercase tracking-widest font-bold mb-4 text-gray-400">
                        Description / Overview
                    </h4>
                    <p className="text-gray-500 text-sm leading-relaxed italic">
                        {product?.description}
                    </p>
                </div>

                <button
                    onClick={() => { addToCart(product); onClose(); }}
                    className="w-full bg-black text-white py-5 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-gray-800 transition flex items-center justify-center gap-4 mt-auto"
                >
                    Add to Bag <ArrowRight size={14} />
                </button>
            </motion.div>
        </div>
    );
};

export default QuickView;