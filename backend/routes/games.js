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

 // Route to save a project
 router.post('/save', async (req, res) => {
    console.log("save request send");
    try {
      const { id, userId,title,description,nodeMap} = req.body;  
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
          //thumbnail: thumbnail,
          nodeMap: nodeMap
        },                    // Update object
        { upsert: true, new: true }  // Options
      );

      console.log('Game saved successfully', game);
      res.json(game);
    } catch (error) {
      res.status(500).json({ message: 'Error saving game', error });
    }
  });



  //route to get ALL GAMES, ALL OF THEM. it's for the explore page. we can scale this later.
  router.get('/', async (req, res) => {
    try {
      // Fetch all games
      const games = await Game.find(); // This fetches all games in the database
      res.json(games); // Send the found projects as the response
    } catch (error) {
      console.error('Error fetching games:', error);
      res.status(500).json({ message: 'Error fetching games', error });
    }
  });
  module.exports = router;  //gotta export the router


