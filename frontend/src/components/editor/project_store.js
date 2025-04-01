  import { defineStore } from 'pinia';
  import { ref, computed } from 'vue';
  import { useNodesStore } from './nodes/node_store.js';  //imports from node store
  import { v4 as uuidv4 } from 'uuid';

  export const useProjectStore = defineStore('project', () => {
    // Project metadata
    const projectName = ref('');
    const projectId = ref('');
    const userid = ref('');



    //project settings This one doesn't really need to be arrayed because it doesn't need to persist through sessions
    const showPreview = ref(false);

    // Method to rename the project
    function renameProject(newName) {
      const name = newName || prompt(`Enter a new name for the project ID: ${projectId.value}. Current name: ${projectName.value}`);
      if (name) {
        projectName.value = name;
      }
    }

    // Export project method
    async function exportProject() {  //important function! exports/saves the project. Async because it needs to wait for user profile to be fetched
      console.log("exportProject called");
      const token = localStorage.getItem('token');  //gotta get the token to make sure user logged in
      if (!token) {
        console.log('No token found. Cannot save project');
        return null;
      }
      try {
        const response = await fetch('http://localhost:5000/auth/user', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,  // Pass the JWT token in the Authorization header
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        userid.value = userData._id;  // all this just to get the users id. If only i was less lazy and made this more modular.
        console.log("user id is", userid.value);

    } catch (error) {
        console.error('Error fetching user profile:', error);
    }


      // Prepare project data
      const projectData = {
        id: projectId.value,
        userId: userid.value,
        name: projectName.value,
        nodes: useNodesStore().nodes,
        edges: useNodesStore().edges,
        object_count: useNodesStore().object_count,
        idCounter: useNodesStore().idCounter
      };

      // Here you would typically send this to your backend
      try {
        console.log('Exporting project:', projectData);
        localStorage.setItem('project', JSON.stringify(projectData));//also saves it to localstorage! This is for preview capabilty.

        const response = await fetch('http://localhost:5000/projects/save', {  //tries to POST the data to the project save route in backend
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'  //json
          },
          body: JSON.stringify(projectData)   //json stringifies this data
                });
        if (!response.ok) {
          const errorDetail = await response.text();  // Get error response details
          throw new Error(`Exportfailed: ${errorDetail}`);
        }

      } catch (error) {
        console.error('Failed to export project', error);
        return null;
      }
    }

    //important function! publishes the game to the database as a json. makes use of the compile_game function in nodesStore.
    //unlike project, it has args. They're just metadata that the player inputs on the publish page, might not be whats in the project store.
    async function exportGame(title,description,thumbnail) {  
      console.log("exportGame called");
      const token = localStorage.getItem('token');  //gotta get the token to make sure user logged in
      if (!token) {
        console.log('No token found. Cannot save game');
        return null;
      }
      try {
        const response = await fetch('http://localhost:5000/auth/user', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,  // Pass the JWT token in the Authorization header
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        userid.value = userData._id;  // all this just to get the users id. If only i was less lazy and made this more modular.
        console.log("user id is", userid.value);

    } catch (error) {
        console.error('Error fetching user profile:', error);
    }


      // Prepare Game data
      const Game = {
        id: projectId.value,
        userId: userid.value,
        title: title,
        description: description,
        //thumbnail: thumbnail,
        gameData: useNodesStore().compileGame()
      };

      // Here you would typically send this to your backend
      try {
        console.log('Exporting game:', Game);
        const response = await fetch('http://localhost:5000/games/save', {  //tries to POST the data to the game save route in backend
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'  //json
          },
          body: JSON.stringify(Game)   //json stringifies this data
                });
        if (!response.ok) {
          const errorDetail = await response.text();  // Get error response details
          throw new Error(`Exportfailed: ${errorDetail}`);
        }

      } catch (error) {
        console.error('Failed to export game', error);
        return null;
      }
    }

    //the below function saves the project to a file on the users computer
    //mostly useful for demonstration bypassing that dumbass firewall
    async function saveProjectToFile() {
      console.log("saveProjectToFile called");
    
      const projectData = {
        id: projectId.value,
        userId: userid.value,
        name: projectName.value,
        nodes: useNodesStore().nodes,
        edges: useNodesStore().edges,
        object_count: useNodesStore().object_count,
        idCounter: useNodesStore().idCounter
      };
    
      try {
        console.log('Saving project:', projectData);
    
        // Convert project data to a JSON string
        const fileData = JSON.stringify(projectData);
    
        // Create a Blob from the file data
        const blob = new Blob([fileData], { type: 'application/json' });
    
        // Create an object URL for the Blob
        const url = URL.createObjectURL(blob);
    
        // Create a temporary anchor element to trigger the download
        const a = document.createElement('a');
        a.href = url;
        a.download = 'project.json';  // Filename for the downloaded file
        a.click();  // Programmatically click the anchor to trigger the download
    
        // Clean up the object URL after the download is triggered
        URL.revokeObjectURL(url);
    
        console.log('Project saved successfully!');
      } catch (error) {
        console.error('Failed to save project', error);
      }
    }
    

    //initializes a new project. changed functionality 3/4 to only be initting of new project, deleting everything else.
    //in the future we'll also init global settings. Global settings will probably end up being some sort of array to make it easier
    function initProject()     
      {
        console.log("initProject called");
        projectId.value = uuidv4();
        projectName.value = "New Project";
        useNodesStore().initNodes(); //also have a seperate init function for nodestore. could have all been in this function, just an organizational choice
        console.log("initted project with id", projectId.value, "and name", projectName.value);
      }

    async function openProject(projectID) {  //this function opens a project from the database using the id.
    //if we have time, it wouldn't be too hard to put an autosave function/confirmation here if you already have an unsaved project open
      console.log("openProject called");
      try {
        const response = await fetch(`http://localhost:5000/projects/open?id=${projectID}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          const errorDetail = await response.text();
          throw new Error(`Failed to open project: ${errorDetail}`);
        }
        //waits for the projectData. in the future we can also store global settings here. Like pretty much anything in a project-wide scope
        //being real when we get more general settings we could probably afford to place stuff like idcounter in a list of settings and just import that. again, all just organizational
        const projectData = await response.json();  
        loadProjectData(projectData);
        } catch (error) {
          console.error('Failed to open project', error);
        };
    }

    function openProjectFromFile(file = null) {
      console.log("openProjectFromFile called");
    
      // Case 1: If no file is passed, trigger the file input (toolbar action)
      if (!file) {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        
        // Return a Promise that resolves when a file is selected
        return new Promise((resolve, reject) => {
          // Handle file selection
          fileInput.onchange = () => {
            try {
              const selectedFile = fileInput.files[0];  // Get the selected file
              if (selectedFile) {
                resolve(selectedFile);  // Resolve the promise with the selected file
              } else {
                reject('No file selected');
              }
            } catch (error) {
              reject('Failed to load project from file: ' + error.message);
            }
          };
    
          fileInput.click();  // Open the file input dialog
        }).then((selectedFile) => {
          // This block executes once the file is selected
          return readFile(selectedFile);  // Read the selected file and return its content
        }).then((projectData) => {
          // This block executes once the file is read and parsed
          loadProjectData(projectData);  // Load the project data into your app
        }).catch((error) => {
          console.error('Error in file handling:', error);
        });
      }
    
      // Case 2: If a file is passed directly, read it and process the project data
      try {
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            // Parse the JSON data from the file
            const projectData = JSON.parse(reader.result);
            loadProjectData(projectData);
          } catch (error) {
            console.error('Failed to parse project data from file', error);
          }
        };
    
        // Read the file as text
        reader.readAsText(file);
    
      } catch (error) {
        console.error('Failed to open project from file', error);
      }
    }
    
    // Helper function to read and parse the file content
    function readFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const projectData = JSON.parse(reader.result);
            resolve(projectData);  // Resolve with the parsed project data
          } catch (error) {
            reject('Failed to parse project data');
          }
        };
        reader.onerror = reject;
        reader.readAsText(file);  // Read the file as text
      });
    }

    //helper function, just loads the project data into the store
    function loadProjectData(projectData) {
      projectName.value = projectData.name;
      projectId.value = projectData.id;
      useNodesStore().nodes = projectData.nodes;
      useNodesStore().edges = projectData.edges;
      useNodesStore().idCounter = projectData.idCounter;
      useNodesStore().object_count = projectData.object_count;
    }

    

    async function deleteProject() {  //this function deletes the current project and inits a new one
      console.log("deleteProject called");
      try {
        const response = await fetch(`http://localhost:5000/projects/delete?id=${projectId.value}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          const errorDetail = await response.text();
          throw new Error(`Failed to delete project: ${errorDetail}`);
        }
      } catch (error) {
        console.error('Failed to delete project', error);
      }
      initProject();
    }



    // Computed properties for project insights. Good idea but commenting out for now
    /*
    const nodeCount = computed(() => {
      const nodesStore = useNodesStore();
      return nodesStore.getAllNodes().length;
    });

    const roomCount = computed(() => {
      const nodesStore = useNodesStore();
      return nodesStore.nodes.rooms.length;
    });

    const itemCount = computed(() => {
      const nodesStore = useNodesStore();
      return nodesStore.nodes.items.length;
    });

    const promptCount = computed(() => {
      const nodesStore = useNodesStore();
      return nodesStore.nodes.prompts.length;
    });
  */











    return {
      projectName,
      projectId,
      showPreview,
      renameProject,
      exportProject,
      saveProjectToFile,
      openProjectFromFile,
      initProject,
      openProject,
      deleteProject,
      exportGame
     // nodeCount,
     // roomCount,
     // itemCount,
     // promptCount
    };

  });