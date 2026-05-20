import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import {
  Camera, Save, User, Phone, MapPin,
  Lock, CheckCircle, AlertCircle, ArrowRight, Loader
} from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();

  const [name, setName]     = useState(user?.name || '');
  const [phone, setPhone]   = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [address, setAddress] = useState({
    line1:      user?.address?.line1      || '',
    line2:      user?.address?.line2      || '',
    city:       user?.address?.city       || '',
    state:      user?.address?.state      || '',
    postalCode: user?.address?.postalCode || '',
    country:    user?.address?.country    || 'India',
  });
  const [password, setPassword]               = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading]   = useState(false);
  const [toast, setToast]       = useState(null); // { type: 'success'|'error', msg }
  const [activeTab, setActiveTab] = useState('personal'); // 'personal' | 'address' | 'security'

  const fileRef = useRef(null);
  const authHeaders = { headers: { Authorization: `Bearer ${user?.token}` } };

  /* ── Avatar file → base64 ──────────────────────────────────── */
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToast('error', 'Image must be under 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  };

  /* ── Save ──────────────────────────────────────────────────── */
  const handleSave = async () => {
    if (activeTab === 'security') {
      if (password && password !== confirmPassword) {
        showToast('error', 'Passwords do not match');
        return;
      }
      if (password && password.length < 6) {
        showToast('error', 'Password must be at least 6 characters');
        return;
      }
    }

    setLoading(true);
    try {
      const payload = { name, phone, avatar, address };
      if (activeTab === 'security' && password) payload.password = password;

      const { data } = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/users/profile`,
        payload,
        authHeaders
      );

      updateUser(data); // update context + localStorage
      setPassword('');
      setConfirmPassword('');
      showToast('success', 'Profile updated successfully');
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Update failed');
    }
    setLoading(false);
  };

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: <User size={14} /> },
    { id: 'address',  label: 'Address',        icon: <MapPin size={14} /> },
    { id: 'security', label: 'Security',        icon: <Lock size={14} /> },
  ];

  const inputCls = "w-full border-b border-gray-200 py-2.5 outline-none focus:border-black transition bg-transparent text-sm placeholder:text-gray-300";
  const labelCls = "text-[9px] uppercase tracking-widest text-gray-400 block mb-1 font-bold";

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-[#1D1D1F]">
      <Navbar />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -60, opacity: 0 }}
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-[999] px-6 py-3 rounded-full shadow-xl flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold whitespace-nowrap ${
              toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-4xl mx-auto px-6 md:px-12 pt-32 pb-24">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <span className="text-[9px] uppercase tracking-[0.7em] text-gray-400 font-black flex items-center gap-2 mb-4">
            <User size={10} /> Account
          </span>
          <h1 className="text-5xl font-light italic tracking-tighter">My Profile.</h1>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-3">{user?.email}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left — Avatar card */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center gap-6">

              {/* Avatar */}
              <div className="relative">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-gray-100 bg-gray-50">
                  {avatar ? (
                    <img src={avatar} alt={name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-black text-white flex items-center justify-center text-4xl font-black uppercase">
                      {name?.[0] || '?'}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="absolute bottom-0 right-0 w-9 h-9 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition shadow-lg"
                >
                  <Camera size={14} />
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </div>

              <div>
                <p className="font-black text-sm uppercase tracking-wide">{name}</p>
                <p className="text-[10px] text-gray-400 mt-1">{user?.email}</p>
                {phone && <p className="text-[10px] text-gray-400 mt-0.5">{phone}</p>}
                {user?.isAdmin && (
                  <span className="mt-3 inline-block text-[8px] bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-black uppercase tracking-wide">
                    Admin
                  </span>
                )}
              </div>

              {/* Address summary */}
              {(address.city || address.state) && (
                <div className="w-full border-t border-gray-100 pt-5 text-left">
                  <p className="text-[9px] uppercase tracking-widest text-gray-400 font-black mb-2">Saved Address</p>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    {[address.line1, address.city, address.state, address.postalCode, address.country]
                      .filter(Boolean).join(', ')}
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
            className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

              {/* Tabs */}
              <div className="flex border-b border-gray-100">
                {tabs.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 text-[9px] uppercase tracking-widest font-black transition-all ${
                      activeTab === t.id
                        ? 'border-b-2 border-black text-black'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>

              <div className="p-8">

                {/* Personal Info */}
                {activeTab === 'personal' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    <div>
                      <label className={labelCls}>Full Name</label>
                      <input value={name} onChange={e => setName(e.target.value)}
                        className={inputCls} placeholder="Your full name" />
                    </div>
                    <div>
                      <label className={labelCls}>Email Address</label>
                      <input value={user?.email} disabled
                        className={`${inputCls} opacity-40 cursor-not-allowed`} />
                      <p className="text-[8px] text-gray-400 mt-1">Email cannot be changed</p>
                    </div>
                    <div>
                      <label className={labelCls}>Mobile Number</label>
                      <div className="flex items-center gap-3">
                        <Phone size={14} className="text-gray-300 shrink-0" />
                        <input value={phone} onChange={e => setPhone(e.target.value)}
                          className={inputCls} placeholder="+91 XXXXX XXXXX" type="tel" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Address */}
                {activeTab === 'address' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    <div>
                      <label className={labelCls}>Address Line 1</label>
                      <input value={address.line1} onChange={e => setAddress(a => ({ ...a, line1: e.target.value }))}
                        className={inputCls} placeholder="House / Flat / Building no." />
                    </div>
                    <div>
                      <label className={labelCls}>Address Line 2</label>
                      <input value={address.line2} onChange={e => setAddress(a => ({ ...a, line2: e.target.value }))}
                        className={inputCls} placeholder="Street / Locality (optional)" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className={labelCls}>City</label>
                        <input value={address.city} onChange={e => setAddress(a => ({ ...a, city: e.target.value }))}
                          className={inputCls} placeholder="City" />
                      </div>
                      <div>
                        <label className={labelCls}>State</label>
                        <input value={address.state} onChange={e => setAddress(a => ({ ...a, state: e.target.value }))}
                          className={inputCls} placeholder="State" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className={labelCls}>Postal Code</label>
                        <input value={address.postalCode} onChange={e => setAddress(a => ({ ...a, postalCode: e.target.value }))}
                          className={inputCls} placeholder="PIN Code" />
                      </div>
                      <div>
                        <label className={labelCls}>Country</label>
                        <input value={address.country} onChange={e => setAddress(a => ({ ...a, country: e.target.value }))}
                          className={inputCls} placeholder="Country" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Security */}
                {activeTab === 'security' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    <div className="bg-gray-50 rounded-2xl p-5 text-[10px] text-gray-500 leading-relaxed">
                      Leave password fields empty if you don't want to change it.
                    </div>
                    <div>
                      <label className={labelCls}>New Password</label>
                      <input value={password} onChange={e => setPassword(e.target.value)}
                        type="password" className={inputCls} placeholder="Min. 6 characters" />
                    </div>
                    <div>
                      <label className={labelCls}>Confirm New Password</label>
                      <input value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                        type="password" className={inputCls} placeholder="Repeat password" />
                    </div>
                  </motion.div>
                )}

                {/* Save button */}
                <div className="mt-10 flex items-center justify-between">
                  <Link to="/" className="text-[9px] uppercase tracking-widest text-gray-400 hover:text-black transition font-bold flex items-center gap-2">
                    ← Back to Shop
                  </Link>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-3 bg-black text-white px-10 py-4 text-[10px] uppercase tracking-[0.3em] font-black rounded-full hover:bg-gray-800 transition-all duration-300 disabled:bg-gray-300 group"
                  >
                    {loading
                      ? <><Loader size={13} className="animate-spin" /> Saving...</>
                      : <><Save size={13} /> Save Changes</>
                    }
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Profile;