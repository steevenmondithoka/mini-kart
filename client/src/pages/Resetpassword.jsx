import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader, ArrowRight } from 'lucide-react';

const ResetPassword = () => {
  const { token }  = useParams();
  const navigate   = useNavigate();

  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass,        setShowPass]        = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [loading,         setLoading]         = useState(false);
  const [success,         setSuccess]         = useState(false);
  const [error,           setError]           = useState('');

  const strength = (() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 6)  s++;
    if (password.length >= 10) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][strength];
  const strengthColor = ['', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-blue-500', 'bg-green-500'][strength];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.'); return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.'); return;
    }

    setLoading(true);
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/users/reset-password/${token}`, { password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired reset link.');
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
            {success ? (
              /* ── Success ── */
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
                  <h2 className="text-3xl font-light italic tracking-tight mb-2">Password Reset!</h2>
                  <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-bold">Successfully updated</p>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Your password has been changed. Redirecting you to sign in...
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 text-[10px] uppercase tracking-widest font-black rounded-full hover:bg-gray-800 transition-all duration-300"
                >
                  Sign In Now <ArrowRight size={12} />
                </Link>
              </motion.div>
            ) : (
              /* ── Form ── */
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="mb-10">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-6">
                    <Lock size={22} strokeWidth={1.5} className="text-gray-600" />
                  </div>
                  <h2 className="text-4xl font-light italic mb-2 tracking-tighter text-gray-900">
                    New Password.
                  </h2>
                  <p className="text-[10px] uppercase tracking-[0.5em] text-gray-400 font-bold leading-relaxed">
                    Choose a strong password for your account
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* New password */}
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-2 font-bold">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPass ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border-b border-gray-200 py-2 outline-none focus:border-black transition bg-transparent text-sm pr-8"
                        placeholder="Min. 6 characters"
                        required
                      />
                      <button type="button" onClick={() => setShowPass(v => !v)}
                        className="absolute right-0 top-2 text-gray-400 hover:text-black transition">
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    {/* Strength meter */}
                    {password.length > 0 && (
                      <div className="mt-3 space-y-1.5">
                        <div className="flex gap-1">
                          {[1,2,3,4,5].map(i => (
                            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor : 'bg-gray-100'}`} />
                          ))}
                        </div>
                        <p className={`text-[9px] uppercase tracking-widest font-bold ${
                          strength <= 1 ? 'text-red-400' : strength <= 2 ? 'text-orange-400' : strength <= 3 ? 'text-yellow-500' : 'text-green-500'
                        }`}>{strengthLabel}</p>
                      </div>
                    )}
                  </div>

                  {/* Confirm password */}
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-2 font-bold">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full border-b py-2 outline-none transition bg-transparent text-sm pr-8 ${
                          confirmPassword && confirmPassword !== password
                            ? 'border-red-300 focus:border-red-400'
                            : 'border-gray-200 focus:border-black'
                        }`}
                        placeholder="Repeat password"
                        required
                      />
                      <button type="button" onClick={() => setShowConfirm(v => !v)}
                        className="absolute right-0 top-2 text-gray-400 hover:text-black transition">
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {confirmPassword && confirmPassword !== password && (
                      <p className="text-[9px] text-red-400 uppercase tracking-widest font-bold mt-1.5">Passwords don't match</p>
                    )}
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
                    disabled={loading || (confirmPassword && confirmPassword !== password)}
                    className="w-full bg-black text-white py-5 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-gray-800 transition-all duration-500 shadow-xl mt-4 disabled:bg-gray-300 rounded-2xl flex items-center justify-center gap-3"
                  >
                    {loading
                      ? <><Loader size={14} className="animate-spin" /> Resetting...</>
                      : <>Reset Password <ArrowRight size={13} /></>
                    }
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
};

export default ResetPassword;