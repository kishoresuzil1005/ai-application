import express from 'express';
import productsRouter from './routes/products';

const app = express();

app.use(express.json());
app.use('/api/products', productsRouter);

const port = 3000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
