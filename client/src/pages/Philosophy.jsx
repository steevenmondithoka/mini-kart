import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { Minus, ArrowRight, Shield, Zap, Wind } from 'lucide-react';
import { Link } from 'react-router-dom';

const Philosophy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const pillars = [
        {
            title: "Material Integrity",
            description: "We select objects crafted from honest materials—ash wood, raw travertine, and surgical-grade titanium. No veneers, no shortcuts.",
            icon: <Shield size={20} strokeWidth={1} />
        },
        {
            title: "Aesthetic Permanence",
            description: "Our curation ignores trends. We look for the 'Silent Form'—designs that remain relevant fifty years from today.",
            icon: <Wind size={20} strokeWidth={1} />
        },
        {
            title: "Functional Silence",
            description: "An object should serve its purpose without demanding attention. We curate for the modern sanctuary.",
            icon: <Zap size={20} strokeWidth={1} />
        }
    ];

    return (
        <div className="bg-white min-h-screen text-[#1D1D1F] selection:bg-black selection:text-white">
            <Navbar />

            {/* 1. HERO SECTION */}
            

            {/* 2. INTRO STORY */}
            <section className="max-w-[1400px] mx-auto px-8 py-40 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-10"
                >
                    <div className="flex items-center gap-4 text-blue-500">
                        <Minus />
                        <span className="text-[10px] uppercase tracking-[0.4em] font-black">The Vision</span>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-light italic tracking-tighter leading-none">
                        Quality is the only <br /> <span className="not-italic font-bold">Sustainability.</span>
                    </h2>
                    <p className="text-gray-500 text-lg font-light leading-relaxed italic max-w-md">
                        In an era of disposable objects, we choose the permanent. We believe that buying once and buying well is the most profound act of environmental and personal respect.
                    </p>
                </motion.div>
                <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden shadow-2xl">
                    <motion.img 
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 2 }}
                        src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=2000" 
                        className="w-full h-full object-cover grayscale"
                    />
                </div>
            </section>

            {/* 3. THE THREE PILLARS */}
            <section className="bg-[#1D1D1F] text-white py-40 px-8">
                <div className="max-w-[1400px] mx-auto">
                    <div className="mb-24 text-center">
                        <span className="text-[10px] uppercase tracking-[1em] text-gray-500 block mb-6">Our Core</span>
                        <h2 className="text-4xl md:text-6xl font-light italic tracking-tighter">The Archival Standard</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                        {pillars.map((pillar, index) => (
                            <motion.div 
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2 }}
                                viewport={{ once: true }}
                                className="p-10 border border-gray-800 hover:border-gray-600 transition-colors group"
                            >
                                <div className="mb-8 text-blue-400 group-hover:scale-110 transition-transform">
                                    {pillar.icon}
                                </div>
                                <h3 className="text-xl font-bold uppercase tracking-widest mb-4">{pillar.title}</h3>
                                <p className="text-gray-400 font-light leading-loose text-sm uppercase tracking-wider">
                                    {pillar.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. LARGE EDITORIAL IMAGE */}
            <section className="h-screen relative overflow-hidden">
                <motion.img 
                    initial={{ scale: 1.2 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 3 }}
                    src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=2000" 
                    className="w-full h-full object-cover grayscale opacity-80"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <h2 className="text-white text-5xl md:text-[8vw] font-light italic tracking-tighter text-center px-10">
                        Less, but <span className="not-italic font-bold">Better.</span>
                    </h2>
                </div>
            </section>

            {/* 5. CALL TO ACTION */}
            <section className="py-60 text-center bg-white">
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="max-w-xl mx-auto px-6"
                >
                    <span className="text-[10px] uppercase tracking-[0.6em] text-gray-400 mb-8 block">Ready to curate?</span>
                    <h2 className="text-4xl md:text-6xl font-light italic tracking-tighter mb-12">Experience the <br /> 2026 Archive.</h2>
                    <Link to="/" className="inline-flex items-center gap-6 text-[10px] uppercase tracking-[0.4em] font-black border-b-2 border-black pb-4 group">
                        Enter Collection <ArrowRight size={16} className="group-hover:translate-x-3 transition-transform" />
                    </Link>
                </motion.div>
            </section>

            {/* 6. MINIMALIST FOOTER */}
            <footer className="bg-[#F5F5F7] py-20 px-10 border-t border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="text-2xl font-light italic tracking-tighter">MINIKART</div>
                    <div className="flex gap-10 text-[9px] uppercase tracking-[0.4em] font-bold text-gray-400">
                        <span>Instagram</span>
                        <span>Journal</span>
                        <span>Contact</span>
                    </div>
                    <p className="text-[8px] uppercase tracking-[0.5em] text-gray-400">© 2026 ARCHIVE SERIES</p>
                </div>
            </footer>
        </div>
    );
};

export default Philosophy;