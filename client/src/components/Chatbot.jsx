import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const getWelcomeMessage = (user) => ({
  role: 'bot',
  text: user
    ? `Welcome back, ${user.name.split(' ')[0]}. I am The Archivist. I can see your orders, cart, and wishlist. How may I assist you today?`
    : 'Greetings. I am The Archivist. How may I assist your curation today? Sign in for personalised help.',
});

const Chatbot = () => {
  const { user } = useAuth();

  const [isOpen,    setIsOpen]    = useState(false);
  const [isTyping,  setIsTyping]  = useState(false);
  const [messages,  setMessages]  = useState([getWelcomeMessage(user)]);
  const [input,     setInput]     = useState('');
  const scrollRef = useRef(null);

  // ── Reset chat whenever the logged-in user changes ─────────────
  useEffect(() => {
    setMessages([getWelcomeMessage(user)]);
    setInput('');
    setIsTyping(false);
  }, [user?._id]); // keyed on user ID — fires on login, logout, user switch

  // Auth header
  const authHeaders = user?.token
    ? { headers: { Authorization: `Bearer ${user.token}` } }
    : {};

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    const updatedMessages = [...messages, { role: 'user', text: userText }];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/chat',
        { message: userText, history: messages },
        authHeaders
      );

      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
        setIsTyping(false);
      }, 600);

    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'bot', text: 'The archive connection is unstable. Please try again.' }]);
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[9999] selection:bg-black selection:text-white cursor-pointer">

      {/* CHAT WINDOW */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 150 }}
            className="absolute bottom-20 right-0 w-[340px] md:w-[400px] h-[550px] bg-white shadow-[0_40px_100px_rgba(0,0,0,0.15)] border border-gray-100 flex flex-col overflow-hidden rounded-xl"
          >
            {/* Header */}
            <div className="bg-black/95 backdrop-blur-md text-white p-7 flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <p className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-60 leading-none">
                    {user ? `Hi, ${user.name.split(' ')[0]}` : 'Steeve BOT'}
                  </p>
                </div>
                <h3 className="text-lg font-light italic tracking-tight flex items-center gap-2 mt-1">
                  The Archivist <ShieldCheck size={14} className="text-blue-400" />
                </h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={20} className="opacity-50 hover:opacity-100 transition-opacity" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-8 bg-[#FAFAFA] no-scrollbar scroll-smooth">
              {messages.map((msg, i) => (
                <motion.div
                  initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`p-5 max-w-[85%] relative shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-black text-white rounded-2xl rounded-tr-none'
                      : 'bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-none'
                  }`}>
                    <p className="text-[8px] uppercase tracking-[0.2em] font-black mb-2 opacity-40">
                      {msg.role === 'user' ? (user ? user.name.split(' ')[0].toUpperCase() : 'GUEST') : 'STUDIO ARCHIVE'}
                    </p>
                    <p className="text-[13px] leading-relaxed font-light italic tracking-wide">
                      {msg.text}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-white border border-gray-100 p-4 rounded-2xl flex gap-1 items-center">
                    <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 h-1 bg-gray-400 rounded-full" />
                    <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1 h-1 bg-gray-400 rounded-full" />
                    <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1 h-1 bg-gray-400 rounded-full" />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="p-5 bg-white border-t border-gray-100">
              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-transparent focus-within:border-gray-200 transition-all"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about orders, cart, products..."
                  className="flex-grow bg-transparent text-[11px] uppercase tracking-widest outline-none py-2 px-3 placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="bg-black text-white p-3 rounded-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-20 disabled:scale-100"
                >
                  <Send size={16} strokeWidth={1.5} />
                </button>
              </form>
              <p className="text-center text-[7px] uppercase tracking-[0.4em] text-gray-300 mt-4 font-bold">
                {user ? 'Personalised Archive Access' : 'Sign in for personalised help'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TRIGGER BUTTON */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-black text-white w-16 h-16 shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-full flex items-center justify-center border border-gray-800 relative z-[10000]"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={26} strokeWidth={1} />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
              <MessageCircle size={26} strokeWidth={1.2} />
            </motion.div>
          )}
        </AnimatePresence>

        {!isOpen && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-blue-500 border-2 border-white rounded-full" />
        )}
      </motion.button>
    </div>
  );
};

export default Chatbot;