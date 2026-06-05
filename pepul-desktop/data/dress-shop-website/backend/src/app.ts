import express from 'express';
import dressesRouter from './routes/dresses';

const app = express();

app.use(express.json());
app.use('/api/dresses', dressesRouter);

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
