const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Get JWT secret from environment variable
const jwtSecret = process.env.JWT_SECRET || 'default_jwt_secret';

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
    console.log("authenticating token");
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401); // If no token, return 401 Unauthorized

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) return res.sendStatus(403); // If token is invalid, return 403 Forbidden
        req.user = user; // Attach user information to the request
        console.log("authenticated token");
        next(); // Proceed to the next middleware or route handler
    });
};

// User registration route
router.post('/register', async (req, res) => {
    console.log("register request send");
    const { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });  // Return JSON for error
    }

    try {
        // Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });  // Return JSON for error
        }
        const salt = await bcrypt.genSalt(10); // Generate a salt
        const hashedPassword = await bcrypt.hash(password, salt); // Hash the password
        const user = new User({ username, email, password: hashedPassword });

        await user.save();

        // Send a JSON response with a success message
        res.status(201).json({ message: 'User registered' });  // Return success in JSON format
    } catch (error) {
        res.status(400).json({ error: error.message });  // Return error as JSON
    }
});


// Login route (authentication)
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await User.findOne({ username });
      if (!user) return res.status(400).send('Invalid credentials');
  

      const isMatch = await bcrypt.compare(password, user.password); // ✅ Secure

        console.log("Provided password:", password);
        console.log("Stored hashed password:", user.password);
        console.log("Password match result:", isMatch);
      if (!isMatch) return res.status(400).send('nomatch');  // Passwords don't match
  
      const token = jwt.sign({ id: user._id, username: user.username }, jwtSecret, { expiresIn: '1h' });
  
      res.json({ token, user: { username: user.username, email: user.email } });
    } catch (error) {
      console.log(error);
      res.status(500).send('Server error');
    }
  });

router.post('/update', authenticateToken, async (req, res) => { //this updates the user profile non password fields
    const { username, email, profileImage } = req.body;   //right now just updates username and email. But we'll make it update everything
  
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).send('User not found');
  
      user.username = username;
      user.email = email;
      user.profileImage = profileImage
  
      await user.save();
  
      res.json({ message: 'User updated' });
    } catch (error) {
      console.log(error);
      res.status(500).send('Server error');
    }
  });

  router.post('/changePassword', authenticateToken, async (req, res) => {   //seperate route for changing the password
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    console.log("currentPassword", currentPassword);
    console.log("newPassword", newPassword);
    console.log("confirmNewPassword", confirmNewPassword);
  
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).send('User not found');
      const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
  
      // Compare the provided current password with the pssword in database
      const isMatch = await bcrypt.compare(currentPassword, user.password);
  
      if (!isMatch) return res.status(400).send('Current password is incorrect');
  
      if (newPassword !== confirmNewPassword) return res.status(400).send('Passwords do not match');
  
      user.password = newPassword;
  
      await user.save();
  
      res.json({ message: 'Password updated' });
    } catch (error) {
      console.log(error);
      res.status(500).send('Server error');
    }
  });


// Protected route to get user data
router.get('/user', authenticateToken, async (req, res) => {
    try {
        console.log("user route accessed");
        const user = await User.findById(req.user.id).select('-password'); // Exclude password from response
        if (!user) return res.status(404).send('User not found');
        res.json(user); // Send user data
    } catch (error) {
        res.status(500).send('Server error');
    }
});


module.exports = router;
