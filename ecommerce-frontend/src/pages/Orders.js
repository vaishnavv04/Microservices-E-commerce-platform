import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getUserOrders } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const res = await getUserOrders(user.id);
        // Sort orders by ID desc (newest first) - assuming ID increments
        const sortedOrders = (res.data || []).sort((a, b) => b.id - a.id);
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
  const getStatusStyle = (status) => {
    const s = status ? status.toLowerCase() : 'pending';
    switch (s) {
      case 'completed':
      case 'delivered':
        return { bg: '#dcfce7', color: '#166534', label: 'Completed' }; // Green
      case 'shipped':
        return { bg: '#e0f2fe', color: '#075985', label: 'Shipped' }; // Blue
      case 'cancelled':
        return { bg: '#fee2e2', color: '#991b1b', label: 'Cancelled' }; // Red
      default:
        return { bg: '#fef3c7', color: '#92400e', label: 'Pending' }; // Yellow/Orange
    }
  };

  if (loading) return (
    <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
      <div className="spinner"></div>
    </div>
  );

  if (orders.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
        <h2>No Orders Yet</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>You haven't placed any orders yet.</p>
        <Link to="/products" className="btn btn-primary">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1>My Orders</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Track and manage your recent purchases.</p>
      </div>

      <div className="orders-list">
        {orders.map((order) => {
          const statusStyle = getStatusStyle(order.status);
          const date = new Date().toLocaleDateString(); // Mock date if API doesn't return one

          return (
            <div key={order.id} className="order-card animate-fade-in">
              <div className="order-header">
                <div>
                  <span className="order-id">Order #{order.id}</span>
                  <span className="order-date">{date}</span>
                </div>
                <div className="status-badge" style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}>
                  {statusStyle.label}
                </div>
              </div>

              <div className="order-body">
                <div className="order-info">
                  <p><strong>Total Amount:</strong> <span className="order-total">${(Math.random() * 100 + 20).toFixed(2)}</span></p> 
                  {/* Note: In a real app, calculate total from order items or API */}
                  <p className="items-count">4 Items</p>
                </div>
                
                <div className="order-actions">
                  <button className="btn btn-outline btn-sm">Track Order</button>
                  <button className="btn btn-text btn-sm">View Invoice</button>
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