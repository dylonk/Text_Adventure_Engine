const express = require('express');
const User = require('../models/user');
const Project = require('../models/project');
const router = express.Router();
//const { v4: uuidv4 } = require('uuid'); //while users are found via unique usernames, projects get a uuid.





 // Route to save a project
 router.post('/save', async (req, res) => {
    console.log("save request send");
    try {
      const { id, userId,name} = req.body;   //will include nodes once implemented
      console.log("id is", id, "name is", name);  //ok, so it successfully gets ID and name of the project
      console.log("sent user id is", userId);
      //console.log("requser id is", req.user._id);
      // Create or update the project
      const project = await Project.findOneAndUpdate(
        { id: id },           // Filter to find the document
        {
          userId: userId,
          name: name,
          //nodes: nodes              nodes not implemented yet
        },                    // Update object
        { upsert: true, new: true }  // Options
      );

      console.log('Project saved successfully', project);
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: 'Error saving project', error });
    }
  });

  module.exports = router;  //gotta export the router
