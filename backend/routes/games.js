const express = require('express');
const User = require('../models/user');
const Project = require('../models/project');
const Game = require('../models/game');
const router = express.Router();
//const { v4: uuidv4 } = require('uuid'); //while users are found via unique usernames, projects get a uuid.





 // Route to save a project
 router.post('/save', async (req, res) => {
    console.log("save request send");
    try {
      const { id, userId,title,description,gameData} = req.body;  
      console.log("id is", id, "title is", title);  //ok, so it successfully gets ID and name of the project
      console.log("sent user id is", userId);
      console.log("Received game data:", gameData);  // Log the gameData to see what's being passed
             // If gameData is undefined or empty, try logging the full body and checking its structure
             if (!gameData) {
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
          gameData: gameData
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

// converts gamedata back to a map. we're probably gonna need this to keep games playable 
function serializableToMap(obj) {
    const map = new Map();
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        map.set(Number(key), obj[key]);
      }
    }
    return map;
  }
