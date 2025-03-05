import { stringify, parse } from 'flatted';


const treeify = (nodes) => {
  console.log("🌳🪄 n-utils.js treeify(nodes=",nodes,")")
  let nodeTree = []
    for(let i = 0; i < nodes.length; i++){ // combs input array for nodes of current depth
      if(nodes[i].data.parentID == 0){
        console.log("🌳🪄 node found: ",nodes[i])
        nodeTree.push(nodes[i]);
      }
      else{
        for(let j = 0; j < nodeTree.length; j++){
          if(nodes[i].data.parentID == nodeTree[j].id){
            nodeTree.splice(j+1,0,nodes[i])
          }
        }
      }
    }
  console.log("🌳🪄 returning nodeTree=",nodeTree)
  return nodeTree
}
const dataHas = (data, property,notFoundValue=null) => { //safer way of quickly checking if a node has data without spam

    console.log("💾🤲 n-utils.js dataHas(data=",data,"property=",property,")")
    if(data.hasOwnProperty(property)){
      console.log("💾🤲 Property found:", data[property])
      return data[property]
    }
    else{
      console.warn("💾🤲 Property not found")
      return notFoundValue;
    }
};

export{
    dataHas,
    treeify,
}