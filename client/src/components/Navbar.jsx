import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag, Search, User, AlignLeft, X,
  LogOut, ChevronRight, Heart, LayoutDashboard,
  Package, ClipboardList, Home, ShieldCheck, UserCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Wishlist count helper ─────────────────────────────────────── */
const useWishlistCount = () => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const read = () => {
      try { setCount(JSON.parse(localStorage.getItem('mk_wishlist') || '[]').length); }
      catch { setCount(0); }
    };
    read();
    window.addEventListener('storage', read);
    const interval = setInterval(read, 1000);
    return () => { window.removeEventListener('storage', read); clearInterval(interval); };
  }, []);
  return count;
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const { cartItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const wishlistCount = useWishlistCount();
  const isHomePage = location.pathname === '/';

  const isTransparent = isHomePage && !isScrolled;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const searchHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) navigate(`/?search=${keyword}`);
    else navigate('/');
    setIsSearchOpen(false);
    setKeyword('');
  };

  const logoutHandler = () => {
    logout();
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    navigate('/login');
  };

  const guestLinks = [
    { to: '/', label: 'Collection', icon: <Home size={14} /> },
  ];

  const userLinks = [
    { to: '/', label: 'Collection', icon: <Home size={14} /> },
    { to: '/orders', label: 'My Orders', icon: <ClipboardList size={14} /> },
  ];

  const adminLinks = [
    { to: '/', label: 'Collection', icon: <Home size={14} /> },
    { to: '/admin', label: 'Add Products', icon: <Package size={14} />, accent: true },
    { to: '/admin/products', label: 'All Products', icon: <LayoutDashboard size={14} /> },
    { to: '/admin/orders', label: 'All Orders', icon: <ClipboardList size={14} /> },
    { to: '/orders', label: 'My Orders', icon: <ShieldCheck size={14} /> },
  ];

  const activeLinks = !user ? guestLinks : user.isAdmin ? adminLinks : userLinks;

  const navBg = isTransparent
    ? 'bg-transparent py-5'
    : 'bg-white/95 backdrop-blur-xl border-b border-gray-100/80 py-3 shadow-sm shadow-black/[0.03]';

  const textColor   = isTransparent ? 'text-white' : 'text-gray-900';
  const subTextColor = isTransparent ? 'text-white/60' : 'text-gray-400';
  const iconHover   = isTransparent ? 'hover:bg-white/20' : 'hover:bg-gray-100';
  const borderColor = isTransparent ? 'border-white/20' : 'border-gray-100';
  const linkColor   = isTransparent ? 'text-white/80 hover:text-white hover:bg-white/15' : 'text-gray-500 hover:text-black hover:bg-gray-50';

  /* ── Avatar circle ── shows photo if user.avatar is set ───────── */
  const AvatarCircle = ({ size = 'sm' }) => {
    const cls = size === 'sm' ? 'w-6 h-6 text-[9px]' : 'w-9 h-9 text-sm';
    const bg  = isTransparent ? 'bg-white text-black' : 'bg-black text-white';
    return user?.avatar ? (
      <img src={user.avatar} alt={user.name}
        className={`${cls} rounded-full object-cover shrink-0 border-2 ${isTransparent ? 'border-white/40' : 'border-gray-200'}`} />
    ) : (
      <div className={`${cls} ${bg} rounded-full flex items-center justify-center font-black uppercase shrink-0`}>
        {user?.name?.[0] || '?'}
      </div>
    );
  };

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-500 ease-out px-5 md:px-12 ${navBg}`}>
        <div className="max-w-[1800px] mx-auto flex justify-between items-center">

          {/* LEFT */}
          <div className="flex items-center gap-4 md:gap-10">
            <button
              className={`lg:hidden p-1 transition ${isTransparent ? 'text-white hover:opacity-70' : 'hover:opacity-60'}`}
              onClick={() => setMobileMenuOpen(true)}
            >
              <AlignLeft size={20} strokeWidth={1.5} />
            </button>

            <Link to="/" className="group flex flex-col leading-none select-none">
              <span className={`text-base md:text-xl font-black tracking-[0.35em] uppercase transition-all duration-500 group-hover:tracking-[0.55em] ${textColor}`}>
                MINIKART
              </span>
              <span className={`text-[6px] tracking-[0.5em] uppercase font-medium hidden md:block mt-0.5 ${subTextColor}`}>
                The 2026 Archive
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className={`hidden lg:flex items-center gap-1 border-l pl-8 ${borderColor}`}>
              {activeLinks.map(({ to, label, icon, accent }) => (
                <Link
                  key={to + label}
                  to={to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] uppercase tracking-[0.35em] font-black transition-all duration-200
                    ${location.pathname === to && to !== '/'
                      ? 'bg-white text-black'
                      : accent
                        ? isTransparent ? 'text-yellow-300 hover:bg-white/15' : 'text-blue-600 hover:bg-blue-50'
                        : linkColor
                    }`}
                >
                  {icon} {label}
                </Link>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2 md:gap-3">

            {/* Search */}
            <div className="flex items-center gap-1">
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.form
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: typeof window !== 'undefined' && window.innerWidth < 640 ? 100 : 200, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={searchHandler}
                    className="overflow-hidden"
                  >
                    <input
                      autoFocus type="text" value={keyword} placeholder="Search..."
                      className={`bg-transparent border-b text-[10px] tracking-widest outline-none py-1 w-full placeholder:opacity-50 ${isTransparent ? 'border-white text-white placeholder:text-white' : 'border-black text-black placeholder:text-gray-400'}`}
                      onChange={(e) => setKeyword(e.target.value)}
                    />
                  </motion.form>
                )}
              </AnimatePresence>
              <button onClick={() => setIsSearchOpen(v => !v)} className={`p-2 rounded-xl transition-all duration-200 ${iconHover} ${textColor}`}>
                <AnimatePresence mode="wait">
                  {isSearchOpen
                    ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X size={16} /></motion.div>
                    : <motion.div key="s" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><Search size={17} strokeWidth={1.5} /></motion.div>
                  }
                </AnimatePresence>
              </button>
            </div>

            {/* Wishlist */}
            {user && !user.isAdmin && (
              <Link to="/wishlist" className={`relative p-2 rounded-xl transition-all duration-200 group ${iconHover} ${textColor}`}>
                <Heart size={17} strokeWidth={1.5} className="group-hover:text-red-400 transition-colors" />
                {wishlistCount > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[7px] w-4 h-4 rounded-full flex items-center justify-center font-black">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </motion.span>
                )}
              </Link>
            )}

            {/* User menu (desktop) */}
            <div className="hidden lg:block relative" ref={userMenuRef}>
              {user ? (
                <>
                  <button
                    onClick={() => setUserMenuOpen(v => !v)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 ${iconHover}`}
                  >
                    <AvatarCircle size="sm" />
                    <span className={`text-[9px] uppercase tracking-widest font-black ${textColor}`}>
                      Hi, {user.name.split(' ')[0]}
                    </span>
                    {user.isAdmin && (
                      <span className={`text-[7px] px-2 py-0.5 rounded-full font-black uppercase tracking-wide ${isTransparent ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'}`}>
                        Admin
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.18 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-gray-100 shadow-2xl shadow-black/10 overflow-hidden z-50"
                      >
                        {/* Profile header */}
                        <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-3">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-black uppercase shrink-0">
                              {user.name[0]}
                            </div>
                          )}
                          <div className="overflow-hidden">
                            <p className="text-[10px] font-black uppercase tracking-widest truncate text-gray-900">{user.name}</p>
                            <p className="text-[9px] text-gray-400 truncate">{user.email}</p>
                            {user.phone && <p className="text-[9px] text-gray-400">{user.phone}</p>}
                          </div>
                        </div>

                        {/* My Profile link */}
                        <div className="py-2 border-b border-gray-50">
                          <Link
                            to="/profile"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-5 py-3 text-[9px] uppercase tracking-widest font-bold text-gray-600 hover:bg-gray-50 hover:text-black transition-colors"
                          >
                            <UserCircle size={14} /> My Profile
                          </Link>
                        </div>

                        {/* Nav links */}
                        <div className="py-2">
                          {activeLinks.slice(1).map(({ to, label, icon }) => (
                            <Link key={to + label} to={to} onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-5 py-3 text-[9px] uppercase tracking-widest font-bold text-gray-600 hover:bg-gray-50 hover:text-black transition-colors">
                              {icon} {label}
                            </Link>
                          ))}
                        </div>

                        {/* Sign out */}
                        <div className="px-3 py-3 border-t border-gray-50">
                          <button onClick={logoutHandler}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-[9px] uppercase tracking-widest font-black text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                            <LogOut size={13} /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link to="/login"
                  className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-[9px] uppercase tracking-widest font-black transition-all duration-300 ${
                    isTransparent
                      ? 'border-white/40 text-white hover:bg-white hover:text-black'
                      : 'border-gray-200 text-gray-900 hover:bg-black hover:text-white hover:border-black'
                  }`}>
                  <User size={13} /> Sign In
                </Link>
              )}
            </div>

            {/* Cart */}
            <Link to="/cart" className={`relative p-2 rounded-xl transition-all duration-200 group ${iconHover} ${textColor}`}>
              <ShoppingBag size={17} strokeWidth={1.5} className="group-hover:opacity-70 transition" />
              {cartItems.length > 0 && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className={`absolute -top-0.5 -right-0.5 text-[7px] w-4 h-4 rounded-full flex items-center justify-center font-black ${isTransparent ? 'bg-white text-black' : 'bg-black text-white'}`}>
                  {cartItems.length > 9 ? '9+' : cartItems.length}
                </motion.span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Mobile Drawer ─────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] lg:hidden" />

            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed inset-y-0 left-0 z-[70] w-[82%] max-w-sm bg-white shadow-2xl flex flex-col lg:hidden"
            >
              <div className="flex justify-between items-center px-8 py-7 border-b border-gray-100">
                <div>
                  <span className="text-lg font-black tracking-[0.4em] uppercase text-gray-900">MINIKART</span>
                  <p className="text-[8px] tracking-[0.4em] uppercase text-gray-400 mt-0.5">The 2026 Archive</p>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition">
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-8">
                <p className="text-[8px] uppercase tracking-[0.5em] text-gray-400 font-black mb-6 px-2">Navigation</p>
                <ul className="flex flex-col gap-1">
                  {activeLinks.map(({ to, label, icon, accent }) => (
                    <li key={to + label}>
                      <Link onClick={() => setMobileMenuOpen(false)} to={to}
                        className={`flex items-center justify-between px-4 py-4 rounded-2xl transition-all group ${
                          location.pathname === to && to !== '/' ? 'bg-black text-white'
                          : accent ? 'text-blue-600 hover:bg-blue-50'
                          : 'hover:bg-gray-50'}`}
                      >
                        <span className="flex items-center gap-3 text-lg font-light italic tracking-tight">
                          <span className="text-sm">{icon}</span> {label}
                        </span>
                        <ChevronRight size={16} className="opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </Link>
                    </li>
                  ))}

                  {/* Profile link */}
                  {user && (
                    <li>
                      <Link onClick={() => setMobileMenuOpen(false)} to="/profile"
                        className="flex items-center justify-between px-4 py-4 rounded-2xl hover:bg-gray-50 transition-all group">
                        <span className="flex items-center gap-3 text-lg font-light italic tracking-tight">
                          <UserCircle size={14} /> My Profile
                        </span>
                        <ChevronRight size={16} className="opacity-30 group-hover:opacity-100 transition-all" />
                      </Link>
                    </li>
                  )}

                  {/* Wishlist */}
                  {user && !user.isAdmin && (
                    <li>
                      <Link onClick={() => setMobileMenuOpen(false)} to="/wishlist"
                        className="flex items-center justify-between px-4 py-4 rounded-2xl hover:bg-red-50 text-red-500 transition-all group">
                        <span className="flex items-center gap-3 text-lg font-light italic tracking-tight">
                          <Heart size={14} /> Wishlist
                          {wishlistCount > 0 && (
                            <span className="bg-red-500 text-white text-[8px] px-2 py-0.5 rounded-full font-black">{wishlistCount}</span>
                          )}
                        </span>
                        <ChevronRight size={16} className="opacity-30 group-hover:opacity-100 transition-all" />
                      </Link>
                    </li>
                  )}
                </ul>
              </div>

              <div className="px-6 py-8 border-t border-gray-100">
                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 px-2">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover border border-gray-200 shrink-0" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-sm font-black uppercase shrink-0">
                          {user.name[0]}
                        </div>
                      )}
                      <div className="overflow-hidden">
                        <p className="text-[10px] font-black uppercase tracking-widest truncate">{user.name}</p>
                        <p className="text-[9px] text-gray-400 truncate">{user.email}</p>
                      </div>
                    </div>
                    <button onClick={logoutHandler}
                      className="w-full flex items-center justify-center gap-3 bg-red-50 text-red-500 py-4 text-[9px] uppercase tracking-widest font-black rounded-2xl hover:bg-red-100 transition">
                      <LogOut size={13} /> Sign Out
                    </button>
                  </div>
                ) : (
                  <Link onClick={() => setMobileMenuOpen(false)} to="/login"
                    className="w-full bg-black text-white py-4 text-[10px] uppercase tracking-widest font-black flex items-center justify-center gap-3 rounded-2xl hover:bg-gray-900 transition">
                    <User size={13} /> Sign In to Your Account
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;