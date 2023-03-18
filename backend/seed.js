// seed.js
import pkg from 'mongoose';
const { connect, connection } = pkg;
import { insertMany } from './models/invoice.js';

connect('mongodb+srv://sahilshukla22:sgYG9DAPEBumsUUp@integ.jxluxuz.mongodb.net', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    return insertMany([
      { name : "Sahil", email : "sahil.shukla@test.in",amount: 100, description: 'Invoice 1' ,purpose : "FIFA"},
      { name : "Sahil", email : "sahil.shukla@test.in" ,amount: 200, description: 'Invoice 2',purpose : "Cricket" },
      { name : "Sahil", email : "sahil.shukla@test.in" ,amount: 300, description: 'Invoice 3',purpose : "TableTennis" },
    ]);
  })
  .then(() => {
    console.log('Dummy data inserted');
    connection.close();
  })
  .catch((err) => console.error(err));
