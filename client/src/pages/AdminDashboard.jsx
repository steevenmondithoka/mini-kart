import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Upload, Database, FileJson } from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [view, setView] = useState('single'); // 'single' or 'bulk'
    const [formData, setFormData] = useState({ name: '', price: '', image: '', category: '', description: '' });
    const [bulkData, setBulkData] = useState(""); 
    const [loading, setLoading] = useState(false);

    // FIXED: Changed Rs.{ to ${
    const config = { headers: { Authorization: `Bearer ${user.token}` } };

    // Handle Single Add
    const handleSingleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/products`, formData, config);
            alert("Object Published Successfully");
            setFormData({ name: '', price: '', image: '', category: '', description: '' });
        } catch (err) { 
            alert("Error adding product: " + (err.response?.data?.message || err.message)); 
        }
    };

    // Handle Bulk Add (JSON Paste)
    const handleBulkSubmit = async () => {
        try {
            setLoading(true);
            // FIXED: Added .trim() to prevent invisible space errors
            const cleanJson = bulkData.trim();
            const parsedData = JSON.parse(cleanJson); 

            if (!Array.isArray(parsedData)) {
                throw new Error("Input must be an array [{}, {}]");
            }

            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/products/bulk`, parsedData, config);
            
            // FIXED: Changed Rs.{ to ${
            alert(`${parsedData.length} Objects added to collection.`);
            setBulkData("");
        } catch (err) {
            console.error("Full Error:", err);
            alert("JSON Error: " + err.message);
        } finally { 
            setLoading(false); 
        }
    };

    // Handle File Upload (JSON File)
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const fileReader = new FileReader();
        fileReader.readAsText(file, "UTF-8");
        fileReader.onload = (e) => {
            setBulkData(e.target.result);
        };
    };

    return (
        <div className="bg-[#F5F5F7] min-h-screen pb-20">
            <Navbar />
            <div className="max-w-4xl mx-auto pt-32 px-6">

                {/* Switcher */}
                <div className="flex gap-8 mb-10 border-b border-gray-200">
                    <button
                        onClick={() => setView('single')}
                        // FIXED: Changed Rs.{ to ${
                        className={`pb-4 text-[10px] uppercase tracking-[0.3em] font-bold transition-all ${view === 'single' ? 'border-b-2 border-black text-black' : 'text-gray-400'}`}
                    >
                        Single Entry
                    </button>
                    <button
                        onClick={() => setView('bulk')}
                        // FIXED: Changed Rs.{ to ${
                        className={`pb-4 text-[10px] uppercase tracking-[0.3em] font-bold transition-all ${view === 'bulk' ? 'border-b-2 border-black text-black' : 'text-gray-400'}`}
                    >
                        Bulk Import
                    </button>
                </div>

                <div className="bg-white p-12 shadow-sm border border-gray-100">
                    {view === 'single' ? (
                        <>
                            <h2 className="text-3xl font-light italic mb-10 tracking-tighter uppercase">Curate Object</h2>
                            <form onSubmit={handleSingleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="md:col-span-2">
                                    <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-2">Object Name</label>
                                    <input type="text" className="w-full border-b border-gray-200 py-2 outline-none focus:border-black italic" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-2">Price (INR)</label>
                                    <input type="number" className="w-full border-b border-gray-200 py-2 outline-none focus:border-black" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-2">Category</label>
                                    <input type="text" className="w-full border-b border-gray-200 py-2 outline-none focus:border-black italic" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-2">Image URL</label>
                                    <input type="text" className="w-full border-b border-gray-200 py-2 outline-none focus:border-black text-xs" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} required />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-2">Overview</label>
                                    <textarea className="w-full border border-gray-100 p-4 h-32 outline-none focus:border-black mt-2 text-sm italic" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
                                </div>
                                <button type="submit" className="bg-black text-white px-10 py-5 text-[10px] uppercase tracking-[0.3em] font-bold md:col-span-2 hover:bg-gray-800 transition shadow-xl">Publish to Series</button>
                            </form>
                        </>
                    ) : (
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-3xl font-light italic mb-2 tracking-tighter uppercase">Bulk Archive</h2>
                                <p className="text-[10px] uppercase tracking-widest text-gray-400">Import multiple objects via JSON array</p>
                            </div>

                            {/* File Upload Area */}
                            <div className="border-2 border-dashed border-gray-100 p-10 text-center hover:border-black transition-colors relative">
                                <input
                                    type="file"
                                    accept=".json"
                                    onChange={handleFileUpload}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <Upload className="mx-auto text-gray-300 mb-4" size={32} strokeWidth={1} />
                                <p className="text-[10px] uppercase tracking-widest text-gray-400">Drop JSON file or click to browse</p>
                            </div>

                            <div className="relative">
                                <label className="text-[10px] uppercase tracking-widest text-gray-400 block mb-4">Or Paste JSON Array</label>
                                <textarea
                                    className="w-full border border-gray-100 p-6 h-64 outline-none focus:border-black font-mono text-xs bg-gray-50"
                                    placeholder='[{"name": "Object 1", "price": 100, "category": "Sanitary", "image": "...", "description": "..."}]'
                                    value={bulkData}
                                    onChange={(e) => setBulkData(e.target.value)}
                                />
                            </div>

                            <button
                                onClick={handleBulkSubmit}
                                disabled={loading || !bulkData}
                                className="w-full bg-black text-white py-5 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-gray-800 transition shadow-xl disabled:bg-gray-200"
                            >
                                {loading ? 'Processing Array...' : 'Inject into Database'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;