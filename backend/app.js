import express from 'express';
import { connect } from 'mongoose';
import http from 'http';
import path from 'path';
import invoicesRouter from './routes/invoices.js';
import paymentsRouter from './routes/payments.js';
import webhooksRouter from './routes/webhooks.js';
import cors from 'cors';
import { hostname } from 'os';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const app = express();

app.use(cors({
  origin : '*',
}))

// Connect to MongoDB
connect(`mongodb+srv://iamsahilshukla:6zeFu3ACTJLuAUb2@cluster0.mr9ar.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`); //needs to be in config password and username

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

const port = process.env.PORT || 3000;
const server = http.createServer(app);
// Start the server
server.listen(port, hostname,() => {
  console.log(`Server listening on port ${port}`);
});
