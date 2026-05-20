import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useNavigate } from "react-router-dom";


const Cart = () => {
    const { cartItems, removeFromCart, updateQty, cartTotal } = useCart();
    const navigate = useNavigate();


    return (
        <div className="bg-white min-h-screen text-[#1D1D1F]">
            <Navbar />

            <main className="max-w-7xl mx-auto px-8 pt-32 pb-20">
                <header className="mb-16">
                    <h1 className="text-5xl md:text-7xl font-light italic tracking-tighter">Your Collection.</h1>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 mt-4 font-bold">
                        {cartItems.length} Objects Selected
                    </p>
                </header>

                {cartItems.length === 0 ? (
                    <div className="py-20 border-t border-gray-100 text-center">
                        <p className="text-gray-400 italic mb-8">Your collection is currently empty.</p>
                        <Link to="/" className="inline-block bg-black text-white px-10 py-4 text-[10px] uppercase tracking-widest font-bold">
                            Return to Gallery
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">

                        {/* ITEMS LIST */}
                        <div className="lg:col-span-2 space-y-12">
                            {cartItems.map((item) => (
                                <motion.div
                                    layout
                                    key={item.product}
                                    className="flex flex-col md:flex-row gap-8 pb-12 border-b border-gray-50 items-center"
                                >
                                    <div className="w-full md:w-48 aspect-square bg-[#F5F5F7] overflow-hidden">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover " />
                                    </div>

                                    <div className="flex-1 flex flex-col justify-between h-full">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-medium uppercase tracking-tight">{item.name}</h3>
                                                <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">{item.category}</p>
                                            </div>
                                            <p className="text-lg font-semibold">₹.{(item.price * item.qty).toFixed(2)}</p>
                                        </div>

                                        <div className="flex items-center justify-between mt-8">
                                            {/* Quantity Toggles */}
                                            <div className="flex items-center border border-gray-100 px-4 py-2 gap-6">
                                                <button onClick={() => updateQty(item.product, item.qty - 1)} className="hover:text-gray-400 transition">
                                                    <Minus size={14} />
                                                </button>
                                                <span className="text-sm font-bold">{item.qty}</span>
                                                <button onClick={() => updateQty(item.product, item.qty + 1)} className="hover:text-gray-400 transition">
                                                    <Plus size={14} />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeFromCart(item.product)}
                                                className="text-red-400 hover:text-red-600 transition flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest"
                                            >
                                                <Trash2 size={14} /> Remove
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* SUMMARY BOX */}
                        <div className="lg:col-span-1">
                            <div className="bg-[#F5F5F7] p-10 sticky top-32">
                                <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-8 border-b border-gray-200 pb-4">Order Summary</h3>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 italic">Subtotal</span>
                                        <span>₹.{cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 italic">Shipping</span>
                                        <span className="text-[10px] uppercase font-bold text-gray-400">Calculated at next step</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-end border-t border-gray-200 pt-6 mb-10">
                                    <span className="text-lg font-light italic">Total</span>
                                    <span className="text-3xl font-bold tracking-tighter">₹.{cartTotal.toFixed(2)}</span>
                                </div>

                                <button onClick={() => navigate('/checkout')} className="w-full bg-black text-white py-5 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-gray-800 transition flex items-center justify-center gap-4 shadow-xl  cursor-pointer">
                                    Proceed to Checkout <ArrowRight size={14} />
                                </button>

                                <p className="text-[9px] text-gray-400 text-center mt-6 uppercase tracking-widest leading-relaxed">
                                    Complimentary shipping on all orders <br /> over ₹.2,000.
                                </p>
                            </div>
                        </div>

                    </div>
                )}
            </main>
        </div>
    );
};

export default Cart;