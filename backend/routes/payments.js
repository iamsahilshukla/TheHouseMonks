// routes/payments.js
import { Router } from 'express';
import { findById } from '../models/invoice.js';
import fetch from 'node-fetch';
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
        const formData = new FormData();
        formData.append('grant_type', 'client_credentials');
        formData.append('client_id', 'test_y0brvg5o0beAFd5wsREVjGfdnMF2Zkq4hza');
        formData.append('client_secret', 'test_0p2I3qS574cRFjaJAfc6FSScnHzDQgAjrgBU6zmmMDTpBhL0EfMoNrFBzI1mc6TnsDm2BdcEy7zWNleyx9z8n2UhKOINlGlzbSXp3RQTMbsB4HSHzcrJbRxLHMV');

        const tokenResponse = await fetch('https://test.instamojo.com/oauth2/token/', {
            method: 'POST',
            body: formData
        });
        const tokenData = await tokenResponse.json();
        const authToken = tokenData.access_token;

        return authToken;
    }
    // Function to create a payment request
    async function createPaymentRequest(authToken, purpose, amount, buyerName, email, phone, redirectUrl, webhook, allowRepeatedPayments) {
        const paymentRequestResponse = await fetch('https://test.instamojo.com/v2/payment_requests/', {
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
        const phone = '9999999999';
        const redirectUrl = `http://localhost:3000/payments/${invoice_id}/success`;
        const webhook = '';
        const allowRepeatedPayments = false;

        const paymentRequestData = await createPaymentRequest(authToken, purpose, amount, buyerName, email, phone, redirectUrl, webhook, allowRepeatedPayments);
        console.log(`Payment request created: ${JSON.stringify(paymentRequestData)}`);

        res.json({
            payment_request_id: paymentRequestData.id,
            longurl: paymentRequestData.longurl
        });


        // Handle successful/failed payments
        // This will depend on how you are implementing your payment flow and what methods you are using to update your database or user interface.

        // Webhook
        // You will need to implement a webhook endpoint to receive and handle notifications from Instamojo. This will likely involve updating your database and/or sending email notifications to users.

        // Redirect
        // After the user completes the payment on the Instamojo payment page, they will be redirected to the URL specified in the redirect_url parameter of the payment request.

        // Query status of a Payment requests
        // You can query the status of a payment request by making a GET request to the following endpoint: https://test.instamojo.com/v2/payment_requests/{payment_request_id}/
        // Replace {payment_request_id} with the ID of the payment request you want to query.
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