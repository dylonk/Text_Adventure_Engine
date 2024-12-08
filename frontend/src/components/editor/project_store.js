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

      // Get the nodes from the nodes store
      const nodesStore = useNodesStore();
      const allNodes = nodesStore.getAllNodes();

      // Prepare project data
      const projectData = {
        id: projectId.value,
        userId: userid.value,
        name: projectName.value,
        //nodes: allNodes     nodesnot there yet
      };

      // Here you would typically send this to your backend
      try {
        console.log('Exporting project:', projectData);
        const response = await fetch('http://localhost:5000/projects/save', {  //tries to POST the data to the project save route in backend
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
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

    function initProject()     //initializes the project. Only temporarily linked to a toolbar button. If project already initted, does nothing
      {
        console.log("initProject called");
        if (!projectId.value) { //project has no id? not initted? init that thang
          projectId.value = uuidv4();
        }
        if(!projectName.value) {
          projectName.value = "New Project";
        }
        console.log("initted project with id", projectId.value, "and name", projectName.value);
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
     // nodeCount,
     // roomCount,
     // itemCount,
     // promptCount
    };

  });