const express = require('express');
const User = require('../models/user');
const Project = require('../models/project');
const router = express.Router();
//const { v4: uuidv4 } = require('uuid'); //while users are found via unique usernames, projects get a uuid.





 // Route to save a project
 router.post('/save', async (req, res) => {
    console.log("save request send");
    try {
      const { id, userId,name,nodes,edges,idCounter,object_count} = req.body;  
      console.log("id is", id, "name is", name);  //ok, so it successfully gets ID and name of the project
      console.log("sent user id is", userId);
      //console.log("requser id is", req.user._id);
      // Create or update the project
      const project = await Project.findOneAndUpdate(
        { id: id },           // Filter to find the document
        {
          userId: userId,
          name: name,
          nodes: nodes,              
          edges: edges,
          idCounter: idCounter,
          object_count: object_count
        },                    // Update object
        { upsert: true, new: true }  // Options
      );

      console.log('Project saved successfully', project);
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: 'Error saving project', error });
    }
  });

  router.post('/delete', async (req, res) => {
    console.log("delete request send");
    try {
      const { id } = req.body;  
      console.log("id is", id);
      const project = await Project.findOneAndDelete({ id: id });// Find the project by ID
      res.json(project); // Send the found project as the response
    } catch (error) {
      console.error('Error fetching project:', error);
      res.status(500).json({ message: 'Error fetching project', error });
    }
  });


 //Route to open a project
 //basically just gets a project by id. I feel in my soul there was a better way to set all this up so it doesn't have to do two seperate fetches (the first being getting all projects in project.vue)
 //I guess that would have involved having every displayed project have all the nodes, and even then there would have been a problem. This works perfectly fine but still feels bad. webdev is weird
 //I could have also just used the below route that gets all projects by ID, but having two seperate ones isn't so ugly
 //also sorta unsecure. Might be a check I'm forgetting but it seems like you could open anybody's project if you know the id.
 //but there's an auth check in the save so how much does it really matter anyway. 
 router.get('/open', async (req, res) => {
  console.log("open request send");
  try {
    const {id} = req.query;  
    console.log("id is", id);
    const project = await Project.findOne({ id: id });// Find the project by ID
      res.json(project); // Send the found project as the response
    } catch (error) {
      console.error('Error fetching project:', error);
      res.status(500).json({ message: 'Error fetching project', error });
    }
});


  //route to get all projects by user id
  router.get('/', async (req, res) => {
    try {
      const { userId } = req.query; // Get the userId from the query parameters
      if (!userId) {
        return res.status(400).json({ message: 'userId is required' });
      }
  
      // Fetch all projects where userId matches
      const projects = await Project.find({ userId: userId });
      res.json(projects); // Send the found projects as the response
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ message: 'Error fetching projects', error });
    }
  });
  module.exports = router;  //gotta export the router
