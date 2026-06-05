import express, { Request, Response } from 'express';
import { Product } from '../models/Product';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

export default router;
