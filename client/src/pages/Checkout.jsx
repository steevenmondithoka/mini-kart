import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, CheckCircle2, ArrowRight, CreditCard, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

const stripePromise = loadStripe('pk_test_51Q0hB6JlQgM78p5cEb88xIir1fmt1424JUqBhxS09tV748YLVPo4sYFxf9kszItnhqez2aOXngcq5qYtQ83XZwip00vXUKe4ON');

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const { cartTotal, cartItems, clearCart } = useCart();
    const { user } = useAuth();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('COD'); // 'Stripe' or 'COD'

    // Pricing Logic: 18% GST
    const gstRate = 0.18;
    const gstAmount = cartTotal * gstRate;
    const finalTotal = cartTotal + gstAmount;

    // Capture expanded shipping details
    const [shippingDetails, setShippingDetails] = useState({
        email: user?.email || '', // Pre-fill with user email
        phone: '',
        address: '',
        city: '',
        postalCode: ''
    });

    const handleInputChange = (e) => {
        setShippingDetails({ ...shippingDetails, [e.target.name]: e.target.value });
    };

    const placeOrder = async (paymentResult = null) => {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        
        const orderData = {
            orderItems: cartItems.map(item => ({
                name: item.name,
                qty: item.qty || 1,
                price: item.price,
                image: item.image,
                product: item._id,
            })),
            shippingAddress: shippingDetails, // Includes email and phone now
            totalPrice: finalTotal,
            paymentMethod: paymentMethod,
            paymentResult: paymentResult,
            isPaid: paymentMethod === 'Stripe', 
            paidAt: paymentMethod === 'Stripe' ? new Date() : null,
            status: 'Processing'
        };

        try {
            // This API call should trigger the initial "Order Placed" email on the backend
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/orders`, orderData, config);
            clearCart();
            setSuccess(true);
            setLoading(false);
        } catch (err) {
            setError("Error saving your order. Please try again.");
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (paymentMethod === 'Stripe') {
                if (!stripe || !elements) return;
                const config = { headers: { Authorization: `Bearer ${user.token}` } };

                // 1. Create Payment Intent
                const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/orders/create-payment-intent`, 
                    { amount: finalTotal }, 
                    config
                );

                // 2. Confirm Payment
                const result = await stripe.confirmCardPayment(data.clientSecret, {
                    payment_method: { card: elements.getElement(CardElement) }
                });

                if (result.error) {
                    setError(result.error.message);
                    setLoading(false);
                    return;
                }
                
                await placeOrder({ id: result.paymentIntent.id, status: result.paymentIntent.status });
            } else if (paymentMethod === 'COD') {
                await placeOrder();
            }
        } catch (err) {
            setError("Error processing order. Check your terminal connection.");
            setLoading(false);
        }
    };

    if (success) return (
        <div className="text-center py-20 flex flex-col items-center justify-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <CheckCircle2 size={80} className="text-green-500 mb-8" strokeWidth={1} />
            </motion.div>
            <h2 className="text-4xl font-light italic mb-4">Transaction Completed.</h2>
            <p className="text-gray-400 uppercase tracking-widest text-[10px] mb-4 italic">
                A confirmation has been dispatched to {shippingDetails.email}
            </p>
            <p className="text-gray-400 uppercase tracking-widest text-[10px] mb-12 italic">
                {paymentMethod === 'COD' ? 'Please keep cash ready for delivery.' : 'Payment received. Preparing your package.'}
            </p>
            <Link to="/orders" className="group flex items-center gap-3 border-b border-black pb-2 text-[10px] uppercase tracking-[0.3em] font-bold hover:text-gray-400 transition">
                Track in Archive <ArrowRight size={14} />
            </Link>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-12">
            {/* Contact & Shipping */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2 text-[10px] uppercase tracking-[0.4em] text-gray-400 font-bold mb-2">Shipping & Contact Details</div>
                
                {/* Mobile and Email Inputs */}
                <input 
                    name="email" 
                    type="email" 
                    placeholder="Email Address" 
                    value={shippingDetails.email}
                    className="border-b border-gray-200 py-3 outline-none focus:border-black transition text-sm italic" 
                    onChange={handleInputChange} 
                    required 
                />
                <input 
                    name="phone" 
                    type="tel" 
                    placeholder="Mobile Number" 
                    className="border-b border-gray-200 py-3 outline-none focus:border-black transition text-sm italic" 
                    onChange={handleInputChange} 
                    required 
                />
                
                <input 
                    name="address" 
                    placeholder="Street Address" 
                    className="md:col-span-2 border-b border-gray-200 py-3 outline-none focus:border-black transition text-sm italic" 
                    onChange={handleInputChange} 
                    required 
                />
                <input 
                    name="city" 
                    placeholder="City" 
                    className="border-b border-gray-200 py-3 outline-none focus:border-black transition text-sm italic" 
                    onChange={handleInputChange} 
                    required 
                />
                <input 
                    name="postalCode" 
                    placeholder="Postal Code" 
                    className="border-b border-gray-200 py-3 outline-none focus:border-black transition text-sm italic" 
                    onChange={handleInputChange} 
                    required 
                />
            </div>

            {/* Selector */}
            <div className="pt-10 border-t border-gray-100">
                <label className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-bold block mb-6">Settlement Method</label>
                <div className="grid grid-cols-2 gap-4">
                    <button type="button" onClick={() => setPaymentMethod('Stripe')} className={`p-6 border flex flex-col items-center gap-3 transition ${paymentMethod === 'Stripe' ? 'border-black bg-black text-white' : 'border-gray-100 text-gray-400'}`}>
                        <CreditCard size={20} strokeWidth={1}/>
                        <span className="text-[10px] uppercase tracking-widest font-bold">Online Payment</span>
                    </button>
                    <button type="button" onClick={() => setPaymentMethod('COD')} className={`p-6 border flex flex-col items-center gap-3 transition ${paymentMethod === 'COD' ? 'border-black bg-black text-white' : 'border-gray-100 text-gray-400'}`}>
                        <Truck size={20} strokeWidth={1}/>
                        <span className="text-[10px] uppercase tracking-widest font-bold">Cash on Delivery</span>
                    </button>
                </div>
            </div>

            {paymentMethod === 'Stripe' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 border border-gray-100 bg-white shadow-sm">
                    <div className="flex justify-between mb-4"><span className="text-[10px] uppercase tracking-widest text-gray-300 italic">Secure Card Entry</span> <Lock size={12} className="text-gray-200"/></div>
                    <CardElement options={{ style: { base: { fontSize: '16px', color: '#1d1d1f' } } }} />
                </motion.div>
            )}

            {/* Summary */}
            <div className="bg-gray-50/50 p-8 space-y-4 border border-gray-100">
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                    <span>Subtotal</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                    <span>GST (18%)</span>
                    <span>₹{gstAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-4 border-t border-gray-200 text-gray-900">
                    <span className="uppercase tracking-[0.2em]">Grand Total</span>
                    <span>₹{finalTotal.toFixed(2)}</span>
                </div>
            </div>

            {error && <p className="text-red-500 text-[10px] uppercase font-bold tracking-widest">{error}</p>}

            <button disabled={loading} className="w-full bg-black text-white py-6 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-gray-800 transition shadow-2xl disabled:bg-gray-200">
                {loading ? 'Validating...' : paymentMethod === 'COD' ? 'Confirm Cash Order' : `Pay ₹${finalTotal.toFixed(2)} Now`}
            </button>
        </form>
    );
};

const Checkout = () => {
    return (
        <div className="bg-[#F5F5F7] min-h-screen pb-20">
            <Navbar />
            <div className="max-w-4xl mx-auto pt-32 px-6">
                <div className="bg-white p-12 border border-gray-100 shadow-sm">
                    <header className="mb-12 flex justify-between items-end border-b border-gray-50 pb-8">
                        <div>
                            <h1 className="text-4xl font-light italic tracking-tighter">Settlement.</h1>
                            <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 mt-2 font-bold italic">Terminal Secure Connection</p>
                        </div>
                        <ShieldCheck className="text-gray-200" size={40} strokeWidth={1} />
                    </header>
                    <Elements stripe={stripePromise}>
                        <CheckoutForm />
                    </Elements>
                </div>
            </div>
        </div>
    );
};

export default Checkout;