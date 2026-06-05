import db from '../db';

export const getProducts = async (req, res) => {
  try {
    const products = await db.query('SELECT * FROM products');
    res.json(products.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching products' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await db.query('SELECT * FROM products WHERE id = $1', [id]);
    if (!product.rows[0]) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching product' });
  }
};
