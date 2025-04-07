const mongoose = require('mongoose');
//this is gonna be sort of similar to just game.js, but it stores a savegame. 
//Only three things are really relevant here: 
// the id of the game (immutable), the user id of the player, and the nodeMap. 
//basically, upon loading of the game in game.vue (and all that important metadata), it's gonna look for a savegame.
//it will then load in the nodeMap and start the game.
//for now, only one savegame per user per game. It wouldn't be impossible to change this later.
const SaveGameSchema = new mongoose.Schema({
  userId: {   //userID just uses the default mongoDB _id of the user
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Reference to the User model
    required: true 
  },
  gameId: {   //id of the game in question
    type: String, 
    required: true 
  },
  nodeMap: {      //The Savegame's nodeMap
    type: mongoose.Schema.Types.Mixed, // Or define a more specific schema if possible
    default: []
  },



}, 

{

  timestamps: true // Automatically adds `createdAt` and `updatedAt` fields
});

  const SaveGame = mongoose.model('SaveGame', SaveGameSchema);
  module.exports = SaveGame;  //exports the savegame module, so it can be used throughout the application.


