const { pool } = require('../utils/database');

const getAllProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice } = req.query;
    let query = `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.category_id,
        p.image_url,
        c.name as category_name,
        COALESCE(i.quantity, 0) as inventory
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN inventory i ON p.id = i.product_id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (category) {
      query += ` AND c.name = $${paramCount++}`;
      params.push(category);
    }

    if (search) {
      query += ` AND (p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    if (minPrice) {
      query += ` AND p.price >= $${paramCount++}`;
      params.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      query += ` AND p.price <= $${paramCount++}`;
      params.push(parseFloat(maxPrice));
    }

    query += ' ORDER BY p.created_at DESC';

    const result = await pool.query(query, params);
    res.json({ products: result.rows });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.category_id,
        p.image_url,
        c.name as category_name,
        COALESCE(i.quantity, 0) as inventory
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN inventory i ON p.id = i.product_id
      WHERE p.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product: result.rows[0] });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category_id, image_url, inventory } = req.body;

    // Start transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Insert product
      const productResult = await client.query(
        `INSERT INTO products (name, description, price, category_id, image_url)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, name, description, price, category_id, image_url, created_at`,
        [name, description, price, category_id || null, image_url || null]
      );

      const product = productResult.rows[0];

      // Insert inventory
      if (inventory !== undefined) {
        await client.query(
          `INSERT INTO inventory (product_id, quantity)
           VALUES ($1, $2)
           ON CONFLICT (product_id) 
           DO UPDATE SET quantity = $2, updated_at = CURRENT_TIMESTAMP`,
          [product.id, inventory || 0]
        );
      }

      await client.query('COMMIT');

      res.status(201).json({
        message: 'Product created successfully',
        product: {
          ...product,
          inventory: inventory || 0,
        },
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category_id, image_url, inventory } = req.body;

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(description);
    }
    if (price) {
      updates.push(`price = $${paramCount++}`);
      values.push(price);
    }
    if (category_id !== undefined) {
      updates.push(`category_id = $${paramCount++}`);
      values.push(category_id);
    }
    if (image_url !== undefined) {
      updates.push(`image_url = $${paramCount++}`);
      values.push(image_url);
    }

    if (updates.length === 0 && inventory === undefined) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      if (updates.length > 0) {
        updates.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);

        const productResult = await client.query(
          `UPDATE products 
           SET ${updates.join(', ')}
           WHERE id = $${paramCount}
           RETURNING *`,
          values
        );

        if (productResult.rows.length === 0) {
          await client.query('ROLLBACK');
          return res.status(404).json({ error: 'Product not found' });
        }
      }

      // Update inventory if provided
      if (inventory !== undefined) {
        await client.query(
          `INSERT INTO inventory (product_id, quantity)
           VALUES ($1, $2)
           ON CONFLICT (product_id) 
           DO UPDATE SET quantity = $2, updated_at = CURRENT_TIMESTAMP`,
          [id, inventory]
        );
      }

      await client.query('COMMIT');

      // Fetch updated product
      const result = await pool.query(
        `SELECT 
          p.*,
          c.name as category_name,
          COALESCE(i.quantity, 0) as inventory
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN inventory i ON p.id = i.product_id
        WHERE p.id = $1`,
        [id]
      );

      res.json({
        message: 'Product updated successfully',
        product: result.rows[0],
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, description, created_at FROM categories ORDER BY name'
    );
    res.json({ categories: result.rows });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateInventory = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const result = await pool.query(
      `INSERT INTO inventory (product_id, quantity)
       VALUES ($1, $2)
       ON CONFLICT (product_id) 
       DO UPDATE SET quantity = $2, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [productId, quantity]
    );

    res.json({
      message: 'Inventory updated successfully',
      inventory: result.rows[0],
    });
  } catch (error) {
    console.error('Update inventory error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  getAllCategories,
  updateInventory,
};

