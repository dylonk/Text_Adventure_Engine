const mongoose = require('mongoose');
const User = require('./user');


const ProjectSchema = new mongoose.Schema({
  userId: {   //userID just uses the default mongoDB _id of the user
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Reference to the User model
    required: true 
  },
  id: {   //id is required
    type: String, 
    required: true 
  },
  name: {   //name is required
    type: String, 
    required: true 
  },


  nodes: {      //array of nodes. This will hopefully get smart
    type: mongoose.Schema.Types.Mixed, // Or define a more specific schema if possible
    default: []
  },
  edges: {      //array of nodes. This will hopefully get smart
    type: mongoose.Schema.Types.Mixed, // Or define a more specific schema if possible
    default: []
  },

  //stuff below is kind of pushing it and doesn't really need to have it's own singular field 
  // I'll probably just rewrite this all to be a more convenient data structure. but i just want it working for now
  idCounter: {
    type: Number,
    default: 1
  },
  object_count: {
    total: {
      type: Number,
      default: 0
    },
    room: {
      type: Number,
      default: 0
    },
    item: {
      type: Number,
      default: 0
    },
    npc: {
      type: Number,
      default: 0
    },
    pathway: {
      type: Number,
      default: 0
    },
    custom: {
      type: Number,
      default: 0  
    }
  },

}, 

{

  timestamps: true // Automatically adds `createdAt` and `updatedAt` fields
});

  const Project = mongoose.model('Project', ProjectSchema);
  module.exports = Project;  //exports the project module, so it can be used throughout the application.




 