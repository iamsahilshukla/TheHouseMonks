// seed.js
import pkg from 'mongoose';
const { connect, connection } = pkg;
import { insertMany } from './models/invoice.js';

connect(`mongodb+srv://sahilshukla22:${process.env.mongoDbPass}@integ.jxluxuz.mongodb.net`, {  //needs to be in config password and username
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    return insertMany([
      { name: 'John Doe', email: 'johndoe@example.com', amount: 50, description: 'Invoice 4', purpose: 'Web Development' },
      { name: 'Jane Smith', email: 'janesmith@example.com', amount: 100, description: 'Invoice 5', purpose: 'Graphic Design' },
      { name: 'Bob Johnson', email: 'bobjohnson@example.com', amount: 200, description: 'Invoice 6', purpose: 'Marketing' },
      {
        name: "John Doe",
        email: "john.doe@example.com",
        amount: 50,
        description: "Invoice 7",
        purpose: "Online shopping"
      },
      {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        amount: 75,
        description: "Invoice 8",
        purpose: "Online shopping"
      },
      {
        name: "Bob Johnson",
        email: "bob.johnson@example.com",
        amount: 100,
        description: "Invoice 9",
        purpose: "Subscription"
      },
      {
        name: "Alice Lee",
        email: "alice.lee@example.com",
        amount: 150,
        description: "Invoice 10",
        purpose: "Membership"
      }
    ]);
  })
  .then(() => {
    console.log('Dummy data inserted');
    connection.close();
  })
  .catch((err) => console.error(err));
