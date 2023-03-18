// routes/invoices.js
import { Router } from 'express';
import { Invoice } from '../models/invoice.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.json(invoices);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

export default router;
