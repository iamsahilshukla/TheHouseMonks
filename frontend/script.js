document.addEventListener("DOMContentLoaded", () => {
  // Get the table body elements
  const unpaidTableBody = document.querySelector('#unpaid-invoices');
  const paidTableBody = document.querySelector('#paid-invoices');
  const payment_link = 'https://www.google.com';
  // Fetch the invoice data from the server
  fetch('http://thehousemonks.onrender.com/invoices/')
    .then(response => response.json())
    .then(invoices => {
      // Loop through the invoices and add rows to the table
      invoices.forEach(invoice => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${invoice._id}</td>
        <td>${invoice.description}</td>
        <td>${invoice.amount}</td>
      `;
        if (invoice.status === 'paid') {
          row.innerHTML += `
          <td>${new Date(invoice.payment_date).toLocaleDateString()}</td>
        `;
          paidTableBody.appendChild(row);
        } else {
          row.innerHTML += `
          <td>${payment_link ? `<button class="pay-now-btn btn" data-invoiceid="${invoice._id}">Pay Now</button>` : ''}</td>
        `;
          unpaidTableBody.appendChild(row);
          // Add a click event listener to the newly created button
          row.querySelector('.pay-now-btn').addEventListener('click', async (event) => {
            const button = event.target;
            var InvoiceId = button.dataset.invoiceid;
            console.log ("invoiceId");
            console.log (InvoiceId);
            const response = await fetch('http://thehousemonks.onrender.com/payments/pay', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({invoice_id:InvoiceId})
            });
            const { payment_request_id, longurl } = await response.json();
            // Redirect the user to the Instamojo payment page
            window.location = longurl;
          });
        }
      });
    })
    .catch(error => {
      console.error('Error fetching invoice data:', error);
    });
});
