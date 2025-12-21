const { pool } = require('../utils/database');
const { getProduct } = require('../utils/serviceClient');

const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get or create cart
    let cartResult = await pool.query(
      'SELECT id FROM cart WHERE user_id = $1',
      [userId]
    );

    let cartId;
    if (cartResult.rows.length === 0) {
      const newCart = await pool.query(
        'INSERT INTO cart (user_id) VALUES ($1) RETURNING id',
        [userId]
      );
      cartId = newCart.rows[0].id;
    } else {
      cartId = cartResult.rows[0].id;
    }

    // Get cart items
    const itemsResult = await pool.query(
      `SELECT 
        ci.id,
        ci.product_id,
        ci.quantity,
        ci.created_at
      FROM cart_items ci
      WHERE ci.cart_id = $1
      ORDER BY ci.created_at DESC`,
      [cartId]
    );

    // Fetch product details for each item
    const items = await Promise.all(
      itemsResult.rows.map(async (item) => {
        try {
          const product = await getProduct(item.product_id);
          return {
            id: item.id,
            product_id: item.product_id,
            quantity: item.quantity,
            product: product || null,
          };
        } catch (error) {
          return {
            id: item.id,
            product_id: item.product_id,
            quantity: item.quantity,
            product: null,
          };
        }
      })
    );

    res.json({
      cart_id: cartId,
      user_id: parseInt(userId),
      items,
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const addItem = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Verify product exists
    const product = await getProduct(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check inventory
    if (product.inventory < quantity) {
      return res.status(400).json({ error: 'Insufficient inventory' });
    }

    // Get or create cart
    let cartResult = await pool.query(
      'SELECT id FROM cart WHERE user_id = $1',
      [userId]
    );

    let cartId;
    if (cartResult.rows.length === 0) {
      const newCart = await pool.query(
        'INSERT INTO cart (user_id) VALUES ($1) RETURNING id',
        [userId]
      );
      cartId = newCart.rows[0].id;
    } else {
      cartId = cartResult.rows[0].id;
    }

    // Add or update item
    const result = await pool.query(
      `INSERT INTO cart_items (cart_id, product_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (cart_id, product_id)
       DO UPDATE SET quantity = cart_items.quantity + $3, updated_at = CURRENT_TIMESTAMP
       RETURNING id, product_id, quantity`,
      [cartId, productId, quantity]
    );

    // Update cart timestamp
    await pool.query(
      'UPDATE cart SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [cartId]
    );

    res.status(201).json({
      message: 'Item added to cart',
      item: result.rows[0],
    });
  } catch (error) {
    console.error('Add item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be greater than 0' });
    }

    // Get item to check product
    const itemResult = await pool.query(
      'SELECT product_id, cart_id FROM cart_items WHERE id = $1',
      [itemId]
    );

    if (itemResult.rows.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    const { product_id, cart_id } = itemResult.rows[0];

    // Verify product and check inventory
    const product = await getProduct(product_id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.inventory < quantity) {
      return res.status(400).json({ error: 'Insufficient inventory' });
    }

    // Update item
    const result = await pool.query(
      `UPDATE cart_items 
       SET quantity = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, product_id, quantity`,
      [quantity, itemId]
    );

    // Update cart timestamp
    await pool.query(
      'UPDATE cart SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [cart_id]
    );

    res.json({
      message: 'Cart item updated',
      item: result.rows[0],
    });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const removeItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const result = await pool.query(
      'DELETE FROM cart_items WHERE id = $1 RETURNING cart_id',
      [itemId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    // Update cart timestamp
    await pool.query(
      'UPDATE cart SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [result.rows[0].cart_id]
    );

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Remove item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cartResult = await pool.query(
      'SELECT id FROM cart WHERE user_id = $1',
      [userId]
    );

    if (cartResult.rows.length === 0) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const cartId = cartResult.rows[0].id;

    // Delete all items
    await pool.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);

    // Update cart timestamp
    await pool.query(
      'UPDATE cart SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [cartId]
    );

    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
};

