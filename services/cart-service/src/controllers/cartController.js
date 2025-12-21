const { redisClient } = require('../utils/redis');
const { getProduct } = require('../utils/serviceClient');

// Helper to generate cart key
const getCartKey = (userId) => `cart:${userId}`;

const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cartKey = getCartKey(userId);

    // Get all items from cart hash
    const cartData = await redisClient.hGetAll(cartKey);

    // Convert hash data to items array with product details
    const items = await Promise.all(
      Object.entries(cartData).map(async ([productId, quantity]) => {
        try {
          const product = await getProduct(productId);
          return {
            id: `${userId}-${productId}`,
            product_id: parseInt(productId),
            quantity: parseInt(quantity),
            product: product || null,
          };
        } catch (error) {
          return {
            id: `${userId}-${productId}`,
            product_id: parseInt(productId),
            quantity: parseInt(quantity),
            product: null,
          };
        }
      })
    );

    res.json({
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

    const cartKey = getCartKey(userId);

    // Get current quantity (if exists)
    const currentQty = await redisClient.hGet(cartKey, productId.toString());
    const newQuantity = currentQty ? parseInt(currentQty) + quantity : quantity;

    // Add/update item in cart
    await redisClient.hSet(cartKey, productId.toString(), newQuantity.toString());

    res.status(201).json({
      message: 'Item added to cart',
      item: {
        id: `${userId}-${productId}`,
        product_id: productId,
        quantity: newQuantity,
      },
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

    // Parse itemId (format: userId-productId)
    const [userId, productId] = itemId.split('-');
    if (!userId || !productId) {
      return res.status(400).json({ error: 'Invalid item ID format' });
    }

    const cartKey = getCartKey(userId);

    // Check if item exists
    const exists = await redisClient.hExists(cartKey, productId);
    if (!exists) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    // Verify product and check inventory
    const product = await getProduct(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.inventory < quantity) {
      return res.status(400).json({ error: 'Insufficient inventory' });
    }

    // Update item quantity
    await redisClient.hSet(cartKey, productId, quantity.toString());

    res.json({
      message: 'Cart item updated',
      item: {
        id: itemId,
        product_id: parseInt(productId),
        quantity,
      },
    });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const removeItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    // Parse itemId (format: userId-productId)
    const [userId, productId] = itemId.split('-');
    if (!userId || !productId) {
      return res.status(400).json({ error: 'Invalid item ID format' });
    }

    const cartKey = getCartKey(userId);

    // Check if item exists
    const exists = await redisClient.hExists(cartKey, productId);
    if (!exists) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    // Remove item from cart
    await redisClient.hDel(cartKey, productId);

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Remove item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cartKey = getCartKey(userId);

    // Check if cart exists
    const exists = await redisClient.exists(cartKey);
    if (!exists) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Delete entire cart
    await redisClient.del(cartKey);

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
