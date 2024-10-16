const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//const mongoSanatize = require('express-mongo-sanatize');

const router = express.Router();
//app.use(mongoSanatize());

const authenticateToken = (req, res, next) => { //authenticates user
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401); // If no token, return 401 Unauthorized

    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) return res.sendStatus(403); // If token is invalid, return 403 Forbidden
        req.user = user;
        next(); // Proceed to the next middleware or route handler
    });
};











//user registration route, creates user and saves to database. request body is username and password
router.post('/register', async (req, res) => {
    console.log("register request send");
    const { username, email, password, confirmPassword  } = req.body;
    console.log(req.body);
    try {
        const user = new User({ username, email, password, confirmPassword });
        if (password != confirmPassword) { //ensures no password matching
            return res.status(400).send('Passwords do not match');
        }
        await user.save();  
        res.status(201).send('User registered');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

//takes username and password, and attemptsto find the user. Creates a JWT token with a 1 hour expiration time.
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });//trys to find a user matching the username
        if (!user) return res.status(400).send('Invalid credentials');

        const isMatch = await bcrypt.compare(password, user.password);  //tries to match the password
        if (!isMatch) return res.status(400).send('Invalid credentials');

        const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token, user: { username: user.username, email: user.email } });//sends a json response containing token and user data
    } catch (error) {
        res.status(400).send(error.message);
    }
});



// Protected route to get user data
router.get('/user', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Exclude the password field
        if (!user) return res.status(404).send('User not found');
        res.json(user);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
