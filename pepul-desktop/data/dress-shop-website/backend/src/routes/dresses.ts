import express, { Request, Response } from 'express';
import mysql from 'mysql';

const router = express.Router();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'dress_shop'
});

router.get('/', (req: Request, res: Response) => {
  db.query('SELECT * FROM dresses', (error, results) => {
    if (error) {
      res.status(500).send({ message: 'Error fetching dresses' });
    } else {
      res.send(results);
    }
  });
});

router.get('/:id', (req: Request, res: Response) => {
  db.query('SELECT * FROM dresses WHERE id = ?', [req.params.id], (error, results) => {
    if (error) {
      res.status(500).send({ message: 'Error fetching dress' });
    } else {
      res.send(results[0]);
    }
  });
});

export default router;
