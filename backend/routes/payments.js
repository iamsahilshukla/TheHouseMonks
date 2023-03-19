// routes/payments.js
import { Router } from 'express';
import { findById } from '../models/invoice.js';
import fetch from 'node-fetch';
import query from 'querystring';
const router = Router();

router.post('/pay', async (req, res) => {
    const { invoice_id } = req.body;
    const invoice = await findById(invoice_id);
    console.log(req.body);
    if (!invoice) {
        console.log('Invoice not found');
        return;
    }
    // Function to generate access token
    async function generateAccessToken() {
        // const qs = require('querystring');
        const data = query.stringify({
            grant_type: 'client_credentials',
            client_id: 'test_y0brvg5o0beAFd5wsREVjGfdnMF2Zkq4hza',
            client_secret: 'test_0p2I3qS574cRFjaJAfc6FSScnHzDQgAjrgBU6zmmMDTpBhL0EfMoNrFBzI1mc6TnsDm2BdcEy7zWNleyx9z8n2UhKOINlGlzbSXp3RQTMbsB4HSHzcrJbRxLHMV'
        });

        const tokenResponse = await fetch('http://test.instamojo.com/oauth2/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': data.length
            },
            body: data
        });
        const tokenData = await tokenResponse.json();
        const authToken = tokenData.access_token;

        return authToken;
    }
    // Function to create a payment request
    async function createPaymentRequest(authToken, purpose, amount, buyerName, email, phone, redirectUrl, webhook, allowRepeatedPayments) {
        const paymentRequestResponse = await fetch('http://test.instamojo.com/v2/payment_requests/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                purpose: purpose,
                amount: amount,
                buyer_name: buyerName,
                email: email,
                phone: phone,
                redirect_url: redirectUrl,
                webhook: webhook,
                allow_repeated_payments: allowRepeatedPayments
            })
        });

        const paymentRequestData = await paymentRequestResponse.json();
        return paymentRequestData;
    }

    // Integration steps
    (async function () {
        // Generate access token
        const authToken = await generateAccessToken();
        console.log(`Access token: ${authToken}`);

        // Create payment request
        const purpose = invoice.description;
        const amount = invoice.amount.toString();
        const buyerName = invoice.name;
        const email = invoice.email;
        const phone = '9999999999';  //currently not taking data from user once we take data from user we can update in db and fetch it.
        const redirectUrl = `https://thehousemonks.onrender.com/payments/${invoice_id}/success`;
        const webhook = 'https://thehousemonks.onrender.com/webhooks/instamojo';
        const allowRepeatedPayments = false;

        const paymentRequestData = await createPaymentRequest(authToken, purpose, amount, buyerName, email, phone, redirectUrl, webhook, allowRepeatedPayments);
        console.log(`Payment request created: ${JSON.stringify(paymentRequestData)}`);

        res.json({
            payment_request_id: paymentRequestData.id,
            longurl: paymentRequestData.longurl
        });
    })();

});

router.get('/:id/success', async (req, res) => {
    const invoice = await findById(req.params.id);
    if (!invoice) {
        res.status(404).send('Invoice not found');
        return;
    }
    const payment_id = req.query.payment_id;
    const payment_status = req.query.payment_status;
    const payment_request_id = req.query.payment_request_id;
    if (payment_status == 'Credit') {
        invoice.status = 'paid';
    }
    invoice.payment_id = payment_id;
    invoice.payment_request_id = payment_request_id;
    invoice.payment_status = payment_status;
    invoice.payment_date = Date.now()
    await invoice.save();
    if (payment_status == 'Credit') {
        res.render('success', { invoice, payment_id, payment_status });
    } else if (payment_status == 'Pending') {
        res.render('pending', { invoice, payment_id, payment_status });
    }
    else {
        res.render('failure', { invoice, payment_id, payment_status })
    }
});

export default router;