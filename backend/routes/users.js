// routes/users.js
//BOILERPLATE EXPRESS JS CODE CREDIT:https://medium.com/@ibrahimhz/creating-your-first-backend-with-node-js-step-by-step-guide-892769af4cb0
const express = require('express');
const User = require('../models/user');
const router = express.Router();

// Define a route
router.get('/', (req, res) => {
    res.send('this is user route');// this gets executed when user visit http://localhost:3000/user
});

router.get('/101', (req, res) => {
    res.send('this is user 101 route');// this gets executed when user visit http://localhost:3000/user/101
});

router.get('/102', (req, res) => {
    res.send('this is user 102 route');// this gets executed when user visit http://localhost:3000/user/102
});

// Route to get user by ID (public, for fetching profile images)
// Must be after specific routes like /101 and /102
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).select('profileImage username');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Error fetching user', error });
    }
});

// export the router module so that server.js file can use it
module.exports = router;
