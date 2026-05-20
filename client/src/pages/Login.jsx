import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/users/login`, { email, password });
            login(data);
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || "Invalid Email or Password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-6 text-[#1D1D1F]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white p-12 shadow-sm border border-gray-100"
            >
                <h2 className="text-4xl font-light italic mb-2 tracking-tighter">Sign In.</h2>
                <p className="text-[10px] uppercase tracking-[0.5em] text-gray-400 mb-10 font-bold leading-relaxed">
                    Access your curated collection
                </p>

                <form onSubmit={submitHandler} className="space-y-8">
                    <div className="relative">
                        <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-2 font-bold">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border-b border-gray-200 py-2 outline-none focus:border-black transition bg-transparent text-sm"
                            placeholder="name@example.com"
                            required
                        />
                    </div>

                    <div className="relative">
                        <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-2 font-bold">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border-b border-gray-200 py-2 outline-none focus:border-black transition bg-transparent text-sm"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-5 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-gray-800 transition-all duration-500 shadow-xl disabled:bg-gray-400"
                    >
                        {loading ? 'Authenticating...' : 'Enter Studio'}
                    </button>

                    <div className="text-center mt-4">
  <Link to="/forgot-password" className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-black transition font-bold">
    Forgot Password?
  </Link>
</div>
                </form>

                <div className="mt-12 text-center pt-8 border-t border-gray-50">
                    <p className="text-[11px] text-gray-400 uppercase tracking-widest font-medium">
                        New to Aesthet?{' '}
                        <Link to="/register" className="text-black font-black hover:underline underline-offset-4">
                            Create Account
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;