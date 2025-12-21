import React, { useState, useEffect, useContext } from 'react';
import { getUserOrders } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await getUserOrders(user.id);
      setOrders(res.data);
    };
    fetchOrders();
  }, [user]);

  return (
    <div>
      <h1>Orders</h1>
      {orders.map((order) => (
        <div key={order.id}>
          <p>Order ID: {order.id} - Status: {order.status}</p>
        </div>
      ))}
    </div>
  );
};

export default Orders;