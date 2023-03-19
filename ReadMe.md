"scripts": {
    "start": "node app.js",
    "seed" : "node seed.js"
  }

Before start do this :-

Run 
    `npm run seed` to insert dummy data in db
    `npm run start` to start server


webhook Endpoint:-

URL :- `{BaseUrl}/webhooks/instamojo`

https://testthehousemonks.onrender.com/ this is the link for website.

frontEnd and bakend both are hosted in render.com


cURL for webhook:-

``` curl --location --request POST 'https://thehousemonks.onrender.com/webhooks/instamojo' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'amount= 2500.00' \
--data-urlencode 'buyer= foo@example.com' \
--data-urlencode 'buyer_name= John Doe' \
--data-urlencode 'buyer_phone= 9999999999' \
--data-urlencode 'currency= INR' \
--data-urlencode 'fees=50.00' \
--data-urlencode 'longurl=https://test.instamojo.com/@iamsahilshukla/38d6a107407e4fa1a0490dcc6483f1ff' \
--data-urlencode 'mac=1ddf3b78f84d071324c0bf1d3f095898267d60ee' \
--data-urlencode 'payment_id=MOJO3319705A50266520' \
--data-urlencode 'payment_request_id=38d6a107407e4fa1a0490dcc6483f1ff' \
--data-urlencode 'purpose=Invoice 4' \
--data-urlencode 'shorturl=https://imjo.in/NNxHg' \
--data-urlencode 'status=Credit' ```

just update paymentId and status.

Thanks,
Sahil shukla

