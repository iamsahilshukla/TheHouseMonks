import express from 'express';
import { connect } from 'mongoose';
import path from 'path';
import invoicesRouter from './routes/invoices.js';
import paymentsRouter from './routes/payments.js';
import webhooksRouter from './routes/webhooks.js';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const app = express();

// Connect to MongoDB
connect('mongodb+srv://sahilshukla22:sgYG9DAPEBumsUUp@integ.jxluxuz.mongodb.net'); //needs to be in config password and username

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Add route for the root path
app.get('/', (req, res) => {
  res.send('Welcome to the invoice app!');
});

// Add the middleware for the routes
app.use('/invoices', invoicesRouter);
app.use('/payments', paymentsRouter);
app.use('/webhooks', webhooksRouter);

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
