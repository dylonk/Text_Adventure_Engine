const express = require('express');
const User = require('../models/user');
const Project = require('../models/project');
const Game = require('../models/game');
const Rating = require('../models/rating');
const router = express.Router();

// Import authenticateToken middleware
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};
//const { v4: uuidv4 } = require('uuid'); //while users are found via unique usernames, projects get a uuid.

// route to get games from the database. Used in the explore page. optional query param userId
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;

    let filter = {};
    if (userId) {
      filter.userId = userId; // Only add this filter if userId is present
    }

    const games = await Game.find(filter).populate('userId', 'username'); // Populate username from User model
    
    // Get all game IDs to calculate average ratings
    const gameIds = games.map(game => game.id);
    const ratings = await Rating.find({ gameId: { $in: gameIds } });
    
    // Calculate average rating for each game
    const ratingMap = {};
    ratings.forEach(rating => {
      if (!ratingMap[rating.gameId]) {
        ratingMap[rating.gameId] = { sum: 0, count: 0 };
      }
      ratingMap[rating.gameId].sum += rating.rating;
      ratingMap[rating.gameId].count += 1;
    });
    
    // Transform the response to include username and average rating
    const gamesWithUsername = games.map(game => {
      const gameObj = game.toObject();
      gameObj.username = gameObj.userId?.username || 'unknown';
      
      // Calculate average rating
      if (ratingMap[game.id]) {
        gameObj.rating = ratingMap[game.id].sum / ratingMap[game.id].count;
      } else {
        gameObj.rating = 2.5; // Default rating if no ratings exist
      }
      
      return gameObj;
    });
    res.json(gamesWithUsername);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ message: 'Error fetching games', error });
  }
});

// Route to get user's rating for a specific game (MUST be before /:gameTitle route)
router.get('/rating/:gameId', authenticateToken, async (req, res) => {
  try {
    const { gameId } = req.params;
    const userId = req.user.id;
    
    const rating = await Rating.findOne({ userId: userId, gameId: gameId });
    
    if (rating) {
      res.json({ rating: rating.rating });
    } else {
      res.json({ rating: null });
    }
  } catch (error) {
    console.error('Error fetching user rating:', error);
    res.status(500).json({ message: 'Error fetching user rating', error });
  }
});

 //this route will be used to play a game from the database! 
 // It's role is to fetch a game from the database based on it's title in the route.
 //If I'm right, this means game links will work
 // NOTE: This must be AFTER more specific routes like /rating/:gameId
 router.get('/:gameTitle', async (req, res) => {
  console.log("Play request received");

  try {
      const gameTitle = req.params.gameTitle; // Access the dynamic route parameter
      console.log(`Loading game: ${gameTitle}`);
      
      // Fetch the game with that title from backend database
      const game = await Game.findOne({title: gameTitle}); 

      if (!game) {
          return res.status(404).send('Game not found');
      }

      //Send the game to the front-end
      //we're gonna have to de-jsonify it when we send it to game.vue but shouldn't be an issue
      res.json(game); 

  } catch (error) {
      console.log(error);
      res.status(500).send('Server error');
  }
});

 // Route to project to become a game
 router.post('/save', async (req, res) => {
    console.log("save request send");
    try {
      const { id, userId,username,title,description,nodeMap,images,thumbnail} = req.body;  
      console.log("id is", id, "title is", title);  //ok, so it successfully gets ID and name of the project
      console.log("sent user id is", userId);
      console.log("Received nodemap:", nodeMap);  // Log the nodeMap to see what's being passed
             // If nodemap is undefined or empty, try logging the full body and checking its structure
             if (!nodeMap) {
                console.log("GameData is missing or empty in the request body");
                return res.status(400).json({ message: 'GameData missing in the request' });
            }
      // Create or update the game
      const game = await Game.findOneAndUpdate(
        { id: id },           // Filter to find the document
        {
          userId: userId,
          username:username,
          title: title,
          description: description,
          thumbnail: thumbnail,
          nodeMap: nodeMap,
          images: images
        },                    // Update object
        { upsert: true, new: true }  // Options
      );

      console.log('Game saved successfully', game);
      res.json(game);
    } catch (error) {
      res.status(500).json({ message: 'Error saving game', error });
    }
  });

  router.post('/delete', async (req, res) => {
    console.log("delete request send");
    try {
      const { id } = req.body;  
      console.log("id is", id);  //ok, so it successfully gets ID and name of the project
      const game = await Game.findOneAndDelete({ id: id });
      console.log('Game deleted successfully', game);
      res.json(game);
    } catch (error) {
      res.status(500).json({ message: 'Error deleting game', error });
    }
  });

// Route to submit a rating for a game
router.post('/rate', authenticateToken, async (req, res) => {
  try {
    const { gameId, rating } = req.body;
    const userId = req.user.id; // From authenticated token
    
    // Validate rating value
    if (!gameId || rating === undefined || rating < 0 || rating > 5) {
      return res.status(400).json({ message: 'Invalid rating data. Rating must be between 0 and 5.' });
    }
    
    // Find or create rating (upsert)
    const userRating = await Rating.findOneAndUpdate(
      { userId: userId, gameId: gameId },
      { rating: rating },
      { upsert: true, new: true }
    );
    
    // Calculate new average rating for the game
    const allRatings = await Rating.find({ gameId: gameId });
    const averageRating = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;
    
    res.json({ 
      success: true, 
      rating: userRating.rating,
      averageRating: averageRating 
    });
  } catch (error) {
    console.error('Error submitting rating:', error);
    res.status(500).json({ message: 'Error submitting rating', error });
  }
});

module.exports = router;

