// Example using Express.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend', 'public'))); // Serve static files from the 'public' directory
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:5177', // Your frontend URL
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
    credentials: true
}));

// Include route files
const usersRoute = require('./routes/users');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
console.log("Routing");

app.get('/', (req, res) => {    //when root isa accessed, serve index.html from the public folder.
    console.log("displaying index.html");
    res.sendFile(path.join(__dirname, '..', 'frontend', 'public', 'index.html'));
});


// Set Up routes
app.use('/users', usersRoute);  
app.use('/auth', authRoutes);
app.use('/projects', projectRoutes);
//use bodyParser




//mongoose atlas connector
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    // You can log the error stack for more details
    console.error(err.stack);
  });



// Example specifying the port and starting the server
const port = process.env.PORT || 5000; // You can use environment variables for port configuration
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});