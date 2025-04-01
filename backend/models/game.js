const mongoose = require('mongoose');


const GameSchema = new mongoose.Schema({
  userId: {   //userID just uses the default mongoDB _id of the user
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Reference to the User model
    required: true 
  },
  id: {   //id is required
    type: String, 
    required: true 
  },
  title: {   //name is required
    type: String, 
    required: true 
  },
  description: {   //description is required
    type: String, 
    required: true 
  },
  thumbnail: {   //thumbnail is required
    type: String, 
    required: true 
  },


  GameData: {      //array of nodes. This will hopefully get smart
    type: mongoose.Schema.Types.Mixed, // Or define a more specific schema if possible
    default: []
  },



}, 

{

  timestamps: true // Automatically adds `createdAt` and `updatedAt` fields
});

  const Game = mongoose.model('Game', GameSchema);
  module.exports = Game;  //exports the game module, so it can be used throughout the application.


