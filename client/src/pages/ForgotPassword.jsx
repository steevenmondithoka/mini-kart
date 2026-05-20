import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import { Mail, ArrowRight, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const ForgotPassword = () => {
  const [email,     setEmail]   = useState('');
  const [loading,   setLoading] = useState(false);
  const [sent,      setSent]    = useState(false);
  const [error,     setError]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError('');
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/users/forgot-password`, { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-6 text-[#1D1D1F]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white p-12 shadow-sm border border-gray-100 rounded-3xl"
        >
          <AnimatePresence mode="wait">
            {sent ? (
              /* ── Success state ── */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle size={32} className="text-green-500" strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="text-3xl font-light italic tracking-tight mb-2">Check your inbox.</h2>
                  <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-bold">Reset link sent</p>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  If <span className="font-bold text-gray-800">{email}</span> is registered with us,
                  you'll receive a password reset link shortly. It expires in <strong>15 minutes</strong>.
                </p>
                <p className="text-[9px] text-gray-400 uppercase tracking-widest">
                  Didn't get it? Check your spam folder.
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 text-[10px] uppercase tracking-widest font-black rounded-full hover:bg-gray-800 transition-all duration-300 mt-4"
                >
                  Back to Sign In <ArrowRight size={12} />
                </Link>
              </motion.div>
            ) : (
              /* ── Form state ── */
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="mb-10">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-6">
                    <Mail size={22} strokeWidth={1.5} className="text-gray-600" />
                  </div>
                  <h2 className="text-4xl font-light italic mb-2 tracking-tighter text-gray-900">
                    Forgot Password?
                  </h2>
                  <p className="text-[10px] uppercase tracking-[0.5em] text-gray-400 font-bold leading-relaxed">
                    Enter your email and we'll send a reset link
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-2 font-bold">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border-b border-gray-200 py-2 outline-none focus:border-black transition bg-transparent text-sm"
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 text-red-500 bg-red-50 px-4 py-3 rounded-xl text-[10px] uppercase tracking-widest font-bold"
                    >
                      <AlertCircle size={14} /> {error}
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-5 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-gray-800 transition-all duration-500 shadow-xl mt-4 disabled:bg-gray-300 rounded-2xl flex items-center justify-center gap-3"
                  >
                    {loading
                      ? <><Loader size={14} className="animate-spin" /> Sending...</>
                      : <> Send Reset Link <ArrowRight size={13} /></>
                    }
                  </button>
                </form>

                <div className="mt-10 text-center pt-8 border-t border-gray-50">
                  <p className="text-[11px] text-gray-400 uppercase tracking-widest font-medium">
                    Remember your password?{' '}
                    <Link to="/login" className="text-black font-black hover:underline underline-offset-4">
                      Sign In
                    </Link>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
};

export default ForgotPassword;