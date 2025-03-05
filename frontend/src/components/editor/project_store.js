  import { defineStore } from 'pinia';
  import { ref, computed } from 'vue';
  import { useNodesStore } from './nodes/node_store.js';  //imports from node store
  import { v4 as uuidv4 } from 'uuid';

  export const useProjectStore = defineStore('project', () => {
    // Project metadata
    const projectName = ref('');
    const projectId = ref('');
    const userid = ref('');

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
        //being really when we get more general settings we could probably afford to place stuff like idcounter in a list of settings and just import that. again, all just organizational
        const projectData = await response.json();  
        projectName.value = projectData.name;
        projectId.value = projectData.id;
        useNodesStore().nodes = projectData.nodes;
        useNodesStore().edges = projectData.edges;
        useNodesStore().idCounter = projectData.idCounter;
        useNodesStore().object_count = projectData.object_count;
        } catch (error) {
          console.error('Failed to open project', error);
        };
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
      renameProject,
      exportProject,
      initProject,
      openProject,
     // nodeCount,
     // roomCount,
     // itemCount,
     // promptCount
    };

  });