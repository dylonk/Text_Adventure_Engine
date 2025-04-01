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
      // Create or update the game
      const game = await Game.findOneAndUpdate(
        { id: id },           // Filter to find the document
        {
          userId: userId,
          title: title,
          description: description,
          //thumbnail: thumbnail,
          GameData: gameData
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
