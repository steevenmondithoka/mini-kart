import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Trash2, CheckSquare, Square } from 'lucide-react';

const AdminProductList = () => {
    const [products, setProducts] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const { user } = useAuth();

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products`);
            setProducts(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Individual Delete
    const deleteHandler = async (id) => {
        if (window.confirm("Remove this object from the archive?")) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/products/${id}`, config);
                fetchProducts();
            } catch (err) {
                alert("Error deleting product.");
            }
        }
    };

    // Bulk Delete Selected
    const bulkDeleteHandler = async () => {
        if (window.confirm(`Are you sure you want to delete ${selectedIds.length} objects?`)) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                // We use a POST or DELETE with data for bulk operations
                await axios.post(`${import.meta.env.VITE_API_BASE_URL}/products/bulk-delete`, { ids: selectedIds }, config);
                setSelectedIds([]);
                fetchProducts();
                alert("Selected items removed.");
            } catch (err) {
                alert("Bulk delete failed.");
            }
        }
    };

    // Selection Logic
    const toggleSelect = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(item => item !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === products.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(products.map(p => p._id));
        }
    };

    return (
        <div className="bg-[#F5F5F7] min-h-screen pb-20">
            <Navbar />
            <div className="max-w-6xl mx-auto pt-32 px-6">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h1 className="text-4xl font-light italic tracking-tighter">Inventory Archive.</h1>
                        <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 mt-2 font-bold italic">Manage Curated Objects</p>
                    </div>

                    {/* Bulk Action Button */}
                    {selectedIds.length > 0 && (
                        <button 
                            onClick={bulkDeleteHandler}
                            className="bg-red-500 text-white px-6 py-3 text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 hover:bg-red-600 transition shadow-lg"
                        >
                            <Trash2 size={14} /> Remove {selectedIds.length} Selected
                        </button>
                    )}
                </div>

                <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="p-6 w-10">
                                    <button onClick={toggleSelectAll} className="text-gray-400 hover:text-black">
                                        {selectedIds.length === products.length ? <CheckSquare size={18}/> : <Square size={18}/>}
                                    </button>
                                </th>
                                <th className="p-6 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Preview</th>
                                <th className="p-6 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Details</th>
                                <th className="p-6 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Category</th>
                                <th className="p-6 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Price</th>
                                <th className="p-6 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {products.map((product) => (
                                <tr key={product._id} className={`hover:bg-gray-50/50 transition-colors group ${selectedIds.includes(product._id) ? 'bg-blue-50/30' : ''}`}>
                                    <td className="p-6">
                                        <button onClick={() => toggleSelect(product._id)} className="text-gray-300 hover:text-black transition">
                                            {selectedIds.includes(product._id) ? <CheckSquare size={18} className="text-black"/> : <Square size={18}/>}
                                        </button>
                                    </td>
                                    <td className="p-6 w-24">
                                        <img src={product.image} alt="" className="w-16 h-20 object-cover  group-hover:grayscale-0 transition-all duration-500" />
                                    </td>
                                    <td className="p-6">
                                        <p className="text-sm font-bold uppercase tracking-tight">{product.name}</p>
                                        <p className="text-[10px] text-gray-400 font-mono mt-1">ID: {product._id.slice(-6).toUpperCase()}</p>
                                    </td>
                                    <td className="p-6">
                                        <span className="text-[10px] uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">{product.category}</span>
                                    </td>
                                    <td className="p-6 text-sm font-light">
                                        ₹{product.price}
                                    </td>
                                    <td className="p-6 text-right">
                                        <button
                                            onClick={() => deleteHandler(product._id)}
                                            className="text-gray-300 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={18} strokeWidth={1.5} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminProductList;