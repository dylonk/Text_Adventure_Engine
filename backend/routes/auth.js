const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Get JWT secret from environment variable
const jwtSecret = process.env.JWT_SECRET;

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


//validation schemas
//not in models because they are not fundamental data objects for us, just for preventing nosql injection

const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.ref('password')
});

const loginSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(6).required()
});

const updateSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30),
  email: Joi.string().email(),
  profileImage: Joi.string(),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().min(6).required(),
  newPassword: Joi.string().min(6).required(),
  confirmNewPassword: Joi.ref('newPassword')
});
//rate limiters
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per window
  message: 'Too many login attempts. Please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,  // Disable the `X-RateLimit-*` headers
});
const updateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per window
  message: 'Too many update attempts. Please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,  // Disable the `X-RateLimit-*` headers
});
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per window
  message: 'Too many registration attempts. Please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,  // Disable the `X-RateLimit-*` headers
});



// User registration route
router.post('/register', registerLimiter, async (req, res) => {
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

        // Validate user data
        const { error } = registerSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });
        //if it's all good, save the user
        await user.save();

        // Send a JSON response with a success message
        res.status(201).json({ message: 'User registered' });  // Return success in JSON format
    } catch (error) {
        res.status(400).json({ error: error.message });  // Return error as JSON
    }
});


// Login route (authentication)
router.post('/login', loginLimiter,async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await User.findOne({ username });
      if (!user) return res.status(400).send('Invalid credentials');
  

      const isMatch = await bcrypt.compare(password, user.password); //  Secure
      if (!isMatch) return res.status(400).send('incorrect password');  // Passwords don't match
      // Validate user data
      const { error } = loginSchema.validate(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });
  
      const token = jwt.sign({ id: user._id, username: user.username }, jwtSecret, { expiresIn: '1h' });
  
      res.json({ token, user: { username: user.username, email: user.email } });
    } catch (error) {
      console.log(error);
      res.status(500).send('Server error');
    }
  });

router.post('/update', updateLimiter, authenticateToken, async (req, res) => { //this updates the user profile non password fields
    const { username, email, profileImage } = req.body;   //right now just updates username and email. But we'll make it update everything
  
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).send('User not found');
  
      user.username = username;
      user.email = email;
      user.profileImage = profileImage
  
      // Validate user data
      const { error } = updateSchema.validate(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });
  
      await user.save();
  
      res.json({ message: 'User updated' });
    } catch (error) {
      console.log(error);
      res.status(500).send('Server error');
    }
  });

  router.post('/changePassword', authenticateToken, async (req, res) => {   //seperate route for changing the password
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
  
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).send('User not found');

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).send('Current password is incorrect');

    const { error } = changePasswordSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    if (newPassword !== confirmNewPassword) return res.status(400).send('Passwords do not match');

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

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
