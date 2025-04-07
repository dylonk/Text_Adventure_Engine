
const express = require('express');
const User = require('../models/user');
const Project = require('../models/project');
const SaveGame = require('../models/savegame');
const router = express.Router();

//this gets a savegame based off of the game and user ids
router.get('/', async (req, res) => {
    const gameId = req.query.gameId;  // Extract the game ID from the query
    const userId = req.query.userId;  // Extract the user ID from the query
    try {
      // Fetch the savegame from the database
      const savegame = await SaveGame.find(); // This fetches all games in the database
      res.json(savegame); // Send the found savegame as the response
    } catch (error) {
      console.error('Error fetching savegame:', error);
      res.status(500).json({ message: 'Error fetching savegame', error });
    }
  });
  module.exports = router;  //gotta export the router


  //yes, it saves a savegame.
  router.post('/save', async (req, res) => {
    console.log("Save request received.");
  
    // Get the game data from the request body
    const { gameId, userId, nodeMap } = req.body;
  
    // Validate that the required data is present
    if (!gameId || !userId || !nodeMap) {
      console.error("Missing required data: ", { gameId, userId, nodeMap });
      return res.status(400).json({
        message: 'Missing required data: gameId, userid, and nodeMap are required.'
      });
    }
  
    console.log("Received data:", { gameId, userId, nodeMap });
  
    try {
      // Attempt to find and update the savegame
      const savegame = await SaveGame.findOneAndUpdate(
        { gameId: gameId, userId: userId }, // Filter to find the document
        { nodeMap: nodeMap }, // Update the nodeMap
        { upsert: true, new: true } // Options to insert if not found and return the new document
      );
  
      // If the savegame is updated successfully
      console.log('Savegame saved successfully:', savegame);
      res.status(200).json(savegame); // Respond with the saved savegame
  
    } catch (error) {
      // Handle errors that might occur during the database operation
      console.error('Error saving savegame:', error);
      res.status(500).json({
        message: 'Error saving savegame',
        error: error.message // Include the error message in the response
      });
    }
  });
  
  module.exports = router;  //gotta export the router



  

