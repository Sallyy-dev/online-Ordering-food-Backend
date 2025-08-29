require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
app.set('view engine' , 'ejs');


const seedInitialData = require("./seeds/seedData");
const connectDB = require("./config/db");

const user = require("./routes/user");
const foodItem = require("./routes/foodItem");
const order = require("./routes/order");
const payments = require("./routes/payments");
const webhooks = require("./routes/webhooks");
const menuRoutes = require('./routes/menuRoutes');


app.use(express.json());  
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.error('Could not connect to MongoDB', err));


app.use('/api/users',user );
app.use('/api/foodItems', foodItem);
app.use('/api/orders', order);
app.use('/api/payments',payments );
app.use('/webhooks', webhooks); 
app.use("/api/menu", menuRoutes);






// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

connectDB().then(() => {
  seedInitialData(); 
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});