// Example using Express.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, '..', 'frontend', 'public'))); // Serve static files from the 'public' directory
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const cors = require('cors');

const FRONTEND_URL = process.env.FRONTEND_URL;

app.use(cors({
    origin: FRONTEND_URL, // Your frontend URL
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
    credentials: true
}));

// Include route files
const usersRoute = require('./routes/users');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const gameRoutes = require('./routes/games');
const saveGameRoutes = require('./routes/savegames');

console.log("Routing");

app.get('/', (req, res) => {    //when root isa accessed, serve index.html from the public folder.
    console.log("displaying index.html");
    res.sendFile(path.join(__dirname, '..', 'frontend', 'public', 'index.html'));
});


// Set Up routes
app.use('/users', usersRoute);  
app.use('/auth', authRoutes);
app.use('/projects', projectRoutes);
app.use('/games', gameRoutes);
app.use('/savegames', saveGameRoutes);
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