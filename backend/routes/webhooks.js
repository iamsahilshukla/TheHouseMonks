import e, { Router } from 'express';
import crypto from 'crypto';
const router = Router();
import { Invoice } from '../models/invoice.js';

router.post('/instamojo', async (req, res) => {
  // Extract data from the webhook payload
  const data = req.body;
  const mac = data.mac;
  delete data.mac;
  
  // Sort the data in ascending order based on the keys
  const sortedData = Object.keys(data).sort().reduce((obj, key) => {
    obj[key] = data[key];
    return obj;
  }, {});

  // Calculate the HMAC value of the data using the provided salt
  // const hmac = crypto.createHmac('sha1', '1f26e6c95875482ab86a7a851fca68c1').update(Object.values(sortedData).join('|')).digest('hex');
  // console.log(hmac);

  // Check if the calculated HMAC value matches the provided HMAC value
  // if (mac === hmac) {
    const paymentId = data.payment_id;
    console.log (data);
    const paymentStatus = data.status;
    var finalStatus;
    if(paymentStatus == 'Credit') { finalStatus = 'paid';}
    else{
    finalStatus = 'unpaid';}
    const invoice = await Invoice.findOneAndUpdate({ payment_id : paymentId }, { status: finalStatus, payment_status: paymentStatus ,payment_date : Date.now()});
    if (!invoice) {
      res.status(404).send('Invoice not found');
      return;
    }
    res.send('Webhook processed successfully');
  // } else {
  //   res.status(400).send('Webhook signature verification failed');
  // }
});

export default router;
