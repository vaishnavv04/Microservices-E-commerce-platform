import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getUserOrders } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { formatINR } from '../utils/currency';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const res = await getUserOrders(user.id);
        const orderData = res.data.orders || [];
        // Sort orders by ID desc (newest first)
        const sortedOrders = orderData.sort((a, b) => b.id - a.id);
        setOrders(sortedOrders);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  // Helper for Status Badge Styles
  const getStatusClasses = (status) => {
    const s = status ? status.toLowerCase() : 'pending';
    switch (s) {
      case 'completed':
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
    }
  };

  const getStatusLabel = (status) => {
    const s = status ? status.toLowerCase() : 'pending';
    switch (s) {
      case 'completed':
      case 'delivered':
        return 'Completed';
      case 'shipped':
        return 'Shipped';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Pending';
    }
  };

  if (loading) return (
    <div className="max-w-6xl mx-auto px-8 py-16 text-center">
      <div className="w-12 h-12 border-4 border-primary/10 border-l-primary rounded-full animate-spin mx-auto"></div>
    </div>
  );

  if (orders.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-8 py-24 text-center animate-fade-in">
        <div className="text-6xl mb-4">📦</div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">No Orders Yet</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8">You haven't placed any orders yet.</p>
        <Link 
          to="/products" 
          className="inline-block px-8 py-4 rounded-lg font-semibold text-white bg-gradient-to-br from-primary to-purple-500 hover:from-primary-hover hover:to-purple-600 shadow-lg transition-all duration-300 hover:-translate-y-0.5"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">My Orders</h1>
        <p className="text-slate-500 dark:text-slate-400">Track and manage your recent purchases.</p>
      </div>

      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        {orders.map((order) => {
          const date = new Date().toLocaleDateString('en-IN'); // Use Indian date format

          return (
            <div 
              key={order.id} 
              className="animate-fade-in bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 transition-all duration-300 flex flex-col gap-4 hover:shadow-lg hover:border-primary"
            >
              <div className="flex justify-between items-start pb-4 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <span className="block font-bold text-lg text-slate-800 dark:text-slate-100">Order #{order.id}</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">{date}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${getStatusClasses(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <p className="text-slate-600 dark:text-slate-400">
                    <strong className="text-slate-800 dark:text-slate-200">Total Amount:</strong>{' '}
                    <span className="font-semibold">{formatINR(order.total_amount)}</span>
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{order.items ? order.items.length : 0} Items</p>
                </div>
                
                <div className="flex gap-4 w-full sm:w-auto">
                  <button className="flex-1 sm:flex-none px-4 py-2 text-sm rounded-lg font-semibold bg-transparent border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 transition-all duration-300 hover:border-primary hover:text-primary">
                    Track Order
                  </button>
                  <button className="flex-1 sm:flex-none bg-transparent border-none text-slate-500 dark:text-slate-400 underline p-0 text-sm hover:text-primary transition-colors">
                    View Invoice
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;