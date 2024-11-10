const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Get JWT secret from environment variable
const jwtSecret = process.env.JWT_SECRET || 'default_jwt_secret';

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401); // If no token, return 401 Unauthorized

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) return res.sendStatus(403); // If token is invalid, return 403 Forbidden
        req.user = user; // Attach user information to the request
        next(); // Proceed to the next middleware or route handler
    });
};

// User registration route
router.post('/register', async (req, res) => {
    console.log("register request send");
    const { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).send('Passwords do not match');
    }

    try {
        // Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send('Username already exists');
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({ username, email, password: hashedPassword });

        await user.save();
        res.status(201).send('User registered');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Login route (authentication)
router.post('/login', async (req, res) => {
    console.log("login request send");
    const { username, password } = req.body;

    try {
        console.log("attempting to find user");
        const user = await User.findOne({ username }); // Try to find the user by username
        if (!user) return res.status(400).send('Invalid credentials'); // User not found

        console.log("attempting to verify password");
        const isMatch = await bcrypt.compare(password, user.password); // Compare provided password with hashed password
        if (!isMatch) return res.status(400).send('Invalid credentials'); // Password mismatch

        console.log("creating token");
        const token = jwt.sign({ id: user._id, username: user.username }, jwtSecret, { expiresIn: '1h' });

        console.log("sending response with token");
        res.json({ token, user: { username: user.username, email: user.email } }); // Send token and user data
    } catch (error) {
        console.log("failed login attempt");
        res.status(400).send(error.message); // Send error message if login fails
    }
});

// Protected route to get user data
router.get('/user', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Exclude password from response
        if (!user) return res.status(404).send('User not found');
        res.json(user); // Send user data
    } catch (error) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
