// Example using Express.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();





const app = express();
app.use(express.json());

// Include route files
const usersRoute = require('./routes/users');
const authRoutes = require('./routes/auth');


// Set Up routes
app.use('/users', usersRoute);  
app.use('/auth', authRoutes);
//use bodyParser




//mongoose atlas connector
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));


app.use(bodyParser.json());


// When the main page is visitied(get request sent), html is displayed.
app.get('/', (req, res) => {
    res.send('<h1>Hello, Express.js Server!</h1>');
});

// Example specifying the port and starting the server
const port = process.env.PORT || 3000; // You can use environment variables for port configuration
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});