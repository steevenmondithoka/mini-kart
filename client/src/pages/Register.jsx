import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useTransform } from 'framer-motion';
import Navbar from '../components/Navbar';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) return alert("Passwords do not match");

        setLoading(true);
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/users/register`, { name, email, password });
            login(data);
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <Navbar/>
        
        <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-6 text-[#1D1D1F]">
           
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white p-12 shadow-sm border border-gray-100"
            >
                <h2 className="text-4xl font-light italic mb-2 tracking-tighter text-gray-900">Join Us.</h2>
                <p className="text-[10px] uppercase tracking-[0.5em] text-gray-400 mb-10 font-bold leading-relaxed">
                    Create your studio profile
                </p>

                <form onSubmit={submitHandler} className="space-y-7">
                    <div>
                        <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-2 font-bold">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border-b border-gray-200 py-2 outline-none focus:border-black transition bg-transparent text-sm"
                            placeholder="Full Name"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-2 font-bold">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border-b border-gray-200 py-2 outline-none focus:border-black transition bg-transparent text-sm"
                            placeholder="Email Address"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-2 font-bold">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border-b border-gray-200 py-2 outline-none focus:border-black transition bg-transparent text-sm"
                            placeholder="Password"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-2 font-bold">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full border-b border-gray-200 py-2 outline-none focus:border-black transition bg-transparent text-sm"
                            placeholder="Confirm Password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-5 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-gray-800 transition-all duration-500 shadow-xl mt-4 disabled:bg-gray-400"
                    >
                        {loading ? 'Creating Account...' : 'Join the Studio'}
                    </button>
                </form>

                <div className="mt-12 text-center pt-8 border-t border-gray-50">
                    <p className="text-[11px] text-gray-400 uppercase tracking-widest font-medium">
                        Already registered?{' '}
                        <Link to="/login" className="text-black font-black hover:underline underline-offset-4">
                            Sign In
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
        </>
    );
};

export default Register;