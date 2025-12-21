const { pool } = require('../utils/database');
const {
  getCart,
  clearCart,
  createPaymentIntent,
  confirmPayment,
  sendEmailNotification,
  sendSMSNotification,
  updateProductInventory,
} = require('../utils/serviceClient');

const createOrder = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { userId, shippingAddress, paymentIntentId } = req.body;

    // Get cart
    const cart = await getCart(userId);
    if (!cart.items || cart.items.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      if (!item.product) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: `Product ${item.product_id} not found` });
      }

      const itemTotal = item.product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product_id: item.product_id,
        product_name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      });
    }

    // Create order
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total_amount, status, payment_intent_id, shipping_address)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, user_id, total_amount, status, created_at`,
      [userId, totalAmount, 'pending', paymentIntentId || null, shippingAddress || null]
    );

    const order = orderResult.rows[0];

    // Create order items
    for (const item of orderItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, quantity, price)
         VALUES ($1, $2, $3, $4, $5)`,
        [order.id, item.product_id, item.product_name, item.quantity, item.price]
      );

      // Update inventory (reduce quantity)
      try {
        await updateProductInventory(item.product_id, -item.quantity);
      } catch (error) {
        console.error('Inventory update error:', error);
        // Continue even if inventory update fails
      }
    }

    await client.query('COMMIT');

    // Clear cart (non-blocking)
    try {
      await clearCart(userId);
    } catch (error) {
      console.error('Clear cart error:', error);
    }

    res.status(201).json({
      message: 'Order created successfully',
      order: {
        id: order.id,
        user_id: order.user_id,
        total_amount: parseFloat(order.total_amount),
        status: order.status,
        created_at: order.created_at,
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const orderResult = await pool.query(
      'SELECT * FROM orders WHERE id = $1',
      [id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderResult.rows[0];

    const itemsResult = await pool.query(
      'SELECT * FROM order_items WHERE order_id = $1',
      [id]
    );

    res.json({
      order: {
        ...order,
        total_amount: parseFloat(order.total_amount),
        items: itemsResult.rows.map(item => ({
          ...item,
          price: parseFloat(item.price),
        })),
      },
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const ordersResult = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    const orders = await Promise.all(
      ordersResult.rows.map(async (order) => {
        const itemsResult = await pool.query(
          'SELECT * FROM order_items WHERE order_id = $1',
          [order.id]
        );

        return {
          ...order,
          total_amount: parseFloat(order.total_amount),
          items: itemsResult.rows.map(item => ({
            ...item,
            price: parseFloat(item.price),
          })),
        };
      })
    );

    res.json({ orders });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber, userEmail, userPhone } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updates = [];
    const values = [];
    let paramCount = 1;

    updates.push(`status = $${paramCount++}`);
    values.push(status);

    if (trackingNumber) {
      updates.push(`tracking_number = $${paramCount++}`);
      values.push(trackingNumber);
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await pool.query(
      `UPDATE orders 
       SET ${updates.join(', ')}
       WHERE id = $${paramCount}
       RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = result.rows[0];

    // Send notifications if email/phone provided
    if (userEmail || userPhone) {
      const notificationData = {
        orderId: order.id,
        totalAmount: parseFloat(order.total_amount),
        status: order.status,
        trackingNumber: order.tracking_number,
      };

      if (userEmail) {
        try {
          await sendEmailNotification(userEmail, 'shipping_update', notificationData);
        } catch (error) {
          console.error('Email notification error:', error);
        }
      }

      if (userPhone) {
        try {
          await sendSMSNotification(userPhone, 'shipping_update', notificationData);
        } catch (error) {
          console.error('SMS notification error:', error);
        }
      }
    }

    res.json({
      message: 'Order status updated',
      order: {
        ...order,
        total_amount: parseFloat(order.total_amount),
      },
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const processOrderWithPayment = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { userId, shippingAddress } = req.body;

    // Get cart
    const cart = await getCart(userId);
    if (!cart.items || cart.items.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      if (!item.product) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: `Product ${item.product_id} not found` });
      }

      const itemTotal = item.product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product_id: item.product_id,
        product_name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      });
    }

    // Create payment intent
    let paymentIntent;
    try {
      paymentIntent = await createPaymentIntent(totalAmount, null, userId);
    } catch (error) {
      await client.query('ROLLBACK');
      return res.status(500).json({ error: 'Failed to create payment intent' });
    }

    // Create order with payment intent
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total_amount, status, payment_intent_id, shipping_address)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, user_id, total_amount, status, created_at`,
      [userId, totalAmount, 'pending', paymentIntent.paymentIntentId, shippingAddress || null]
    );

    const order = orderResult.rows[0];

    // Create order items
    for (const item of orderItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, quantity, price)
         VALUES ($1, $2, $3, $4, $5)`,
        [order.id, item.product_id, item.product_name, item.quantity, item.price]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Order created, payment intent generated',
      order: {
        id: order.id,
        user_id: order.user_id,
        total_amount: parseFloat(order.total_amount),
        status: order.status,
        created_at: order.created_at,
      },
      payment: {
        clientSecret: paymentIntent.clientSecret,
        paymentIntentId: paymentIntent.paymentIntentId,
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Process order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
};

const confirmOrderPayment = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { orderId, paymentIntentId } = req.body;

    // Get order
    const orderResult = await client.query(
      'SELECT * FROM orders WHERE id = $1',
      [orderId]
    );

    if (orderResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderResult.rows[0];

    if (order.status !== 'pending') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Order is not in pending status' });
    }

    // Confirm payment
    let paymentResult;
    try {
      paymentResult = await confirmPayment(paymentIntentId || order.payment_intent_id);
    } catch (error) {
      await client.query('ROLLBACK');
      return res.status(500).json({ error: 'Payment confirmation failed' });
    }

    if (!paymentResult.success) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Payment not confirmed', details: paymentResult });
    }

    // Update order status
    await client.query(
      'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      ['processing', orderId]
    );

    // Update inventory
    const itemsResult = await client.query(
      'SELECT * FROM order_items WHERE order_id = $1',
      [orderId]
    );

    for (const item of itemsResult.rows) {
      try {
        await updateProductInventory(item.product_id, -item.quantity);
      } catch (error) {
        console.error('Inventory update error:', error);
      }
    }

    await client.query('COMMIT');

    // Clear cart
    try {
      await clearCart(order.user_id);
    } catch (error) {
      console.error('Clear cart error:', error);
    }

    res.json({
      message: 'Order payment confirmed',
      order: {
        ...order,
        status: 'processing',
        total_amount: parseFloat(order.total_amount),
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Confirm order payment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  processOrderWithPayment,
  confirmOrderPayment,
};

