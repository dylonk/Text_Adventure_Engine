
class GameNode { //Simplifies the nodes for reading and altering
    constructor(node, childNodes=[], childEdges=[]){
        this.id = node.id ? Number(node.id):0
        this.parentID = node.data.parentID ? Number(node.data.parentID):-1
        this.type = node.type ? node.type:"nullType"
        this.data = node.data ? node.data:{}
        if(node.hasOwnProperty("data")&&node.data.hasOwnProperty("isObject")&&node.data.isObject==true){
            this.isObject =  true
            this.childNodes = childNodes //Stores objects of GameNode class only
            this.childEdges = childEdges //Stores edge objects
        }
        else{
            this.isObject = false
        }
    }
}
const compileGame = (globalCanvases) => { //Gets all nodes and puts them in a more readable form, removing unnecessary information specifically relating to nodes as they are in vueflow
    console.log("🎮🎉 game_logic.js compileGame(Nodes=",nodes,")")
    const nodeMap = new Map(); 
        
    return nodeMap
  }

  



export{
      compileNodes,
      GameNode,
}