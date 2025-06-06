const express = require('express');
const User = require('../models/user');
const Project = require('../models/project');
const Game = require('../models/game');
const router = express.Router();
//const { v4: uuidv4 } = require('uuid'); //while users are found via unique usernames, projects get a uuid.





 //this route will be used to play a game from the database! 
 // It's role is to fetch a game from the database based on it's title in the route.
 //If I'm right, this means game links will work
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
      const { id, userId,title,description,nodeMap,images,thumbnail} = req.body;  
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



// route to get games from the database. Used in the explore page. optional query param userId
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;

    let filter = {};
    if (userId) {
      filter.userId = userId; // Only add this filter if userId is present
    }

    const games = await Game.find(filter); // Filter if userId exists, otherwise get all
    res.json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ message: 'Error fetching games', error });
  }
});

module.exports = router;

