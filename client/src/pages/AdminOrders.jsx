import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { Package, CheckCircle2, Truck, Clock, CreditCard, Banknote, Filter } from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchAllOrders = async () => {
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/orders`, config);
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.isAdmin) fetchAllOrders();
  }, [user]);

  const updateStatus = async (id, newStatus) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/orders/${id}/status`, { status: newStatus }, config);
      fetchAllOrders(); 
    } catch (error) {
      alert("Failed to update status");
    }
  };

  // Helper for Stats
  const stats = [
    { label: 'Pending Fulfillment', count: orders.filter(o => o.status === 'Processing').length, icon: Clock },
    { label: 'In Transit', count: orders.filter(o => o.status === 'Shipped').length, icon: Truck },
    { label: 'Revenue', count: `₹${orders.reduce((acc, curr) => acc + curr.totalPrice, 0).toLocaleString()}`, icon: CheckCircle2 },
  ];

  return (
    <div className="bg-[#F5F5F7] min-h-screen pb-20 selection:bg-black selection:text-white">
      <Navbar />
      <div className="max-w-[1600px] mx-auto pt-32 px-10">
        
        {/* Header Section */}
        <header className="mb-16 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-light italic tracking-tighter text-gray-900">Fulfillment Center.</h1>
            <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 mt-3 font-bold italic">Global Logistics Control</p>
          </div>
          
          {/* Dashboard Stats */}
          <div className="flex gap-12 border-l border-gray-200 pl-12">
            {stats.map((stat, i) => (
              <div key={i}>
                <p className="text-[8px] uppercase tracking-[0.3em] text-gray-400 font-black mb-1">{stat.label}</p>
                <p className="text-xl font-light tracking-tight">{stat.count}</p>
              </div>
            ))}
          </div>
        </header>

        {loading ? (
          <div className="py-40 text-center tracking-[0.5em] text-gray-300 uppercase text-[10px] animate-pulse">Synchronizing Archives...</div>
        ) : (
          <div className="bg-white border border-gray-100 shadow-2xl rounded-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="p-6 text-[9px] uppercase tracking-[0.3em] text-gray-400 font-black">Order Reference</th>
                    <th className="p-6 text-[9px] uppercase tracking-[0.3em] text-gray-400 font-black">Customer Details</th>
                    <th className="p-6 text-[9px] uppercase tracking-[0.3em] text-gray-400 font-black">Settlement</th>
                    <th className="p-6 text-[9px] uppercase tracking-[0.3em] text-gray-400 font-black">Total Amount</th>
                    <th className="p-6 text-[9px] uppercase tracking-[0.3em] text-gray-400 font-black">Archive Status</th>
                    <th className="p-6 text-[9px] uppercase tracking-[0.3em] text-gray-400 font-black text-right">Logistics Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map((order) => (
                    <motion.tr 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      key={order._id} 
                      className="hover:bg-gray-50/30 transition-colors group"
                    >
                      {/* ID */}
                      <td className="p-6">
                        <p className="text-xs font-mono text-gray-400">#{order._id.slice(-8).toUpperCase()}</p>
                        <p className="text-[9px] text-gray-300 mt-1 uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </td>

                      {/* Customer */}
                      <td className="p-6">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-800">{order.user?.name || 'Guest'}</p>
                        <p className="text-[10px] text-gray-400 italic mt-0.5">{order.user?.email}</p>
                      </td>

                      {/* Payment Method & Status */}
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          {order.paymentMethod === 'COD' ? <Banknote size={14} className="text-orange-400" /> : <CreditCard size={14} className="text-blue-400" />}
                          <span className="text-[10px] uppercase tracking-widest font-bold">
                            {order.paymentMethod === 'COD' ? 'Cash' : 'Online'}
                          </span>
                        </div>
                        <p className={`text-[8px] uppercase tracking-widest font-black mt-1 ${order.isPaid ? 'text-green-500' : 'text-red-400'}`}>
                          {order.isPaid ? 'Settled' : 'Pending'}
                        </p>
                      </td>

                      {/* Price */}
                      <td className="p-6">
                        <p className="text-sm font-light tracking-tighter text-gray-900">₹{order.totalPrice.toLocaleString()}</p>
                      </td>

                      {/* Status Badge */}
                      <td className="p-6">
                        <span className={`px-3 py-1 rounded-full text-[8px] uppercase tracking-[0.2em] font-black ${
                          order.status === 'Delivered' ? 'bg-green-50 text-green-600' : 
                          order.status === 'Shipped' ? 'bg-blue-50 text-blue-600' : 
                          order.status === 'Cancelled' ? 'bg-red-50 text-red-500' : 
                          'bg-gray-100 text-gray-500'
                        }`}>
                          {order.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-6 text-right">
                        <div className="flex justify-end gap-2">
                          {order.status === 'Processing' && (
                            <button 
                              onClick={() => updateStatus(order._id, 'Shipped')} 
                              className="bg-black text-white px-4 py-2 text-[9px] uppercase tracking-widest font-bold hover:bg-gray-800 transition shadow-lg active:scale-95"
                            >
                              Dispatch
                            </button>
                          )}
                          {order.status === 'Shipped' && (
                            <button 
                              onClick={() => updateStatus(order._id, 'Delivered')} 
                              className="bg-blue-600 text-white px-4 py-2 text-[9px] uppercase tracking-widest font-bold hover:bg-blue-700 transition shadow-lg active:scale-95"
                            >
                              Confirm Delivery
                            </button>
                          )}
                          {order.status === 'Delivered' && (
                            <div className="flex items-center gap-1 text-green-500 opacity-50">
                              <CheckCircle2 size={14} />
                              <span className="text-[9px] uppercase tracking-widest font-bold">Complete</span>
                            </div>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;