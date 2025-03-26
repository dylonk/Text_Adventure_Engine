

const bindChild = (node, nodes) =>{
  const n = {
    val:node,
    hidden:false,
    children:[]
  }

  for(let i = 0; i < nodes.length; i++){
    if(nodes[i].data.parentID == node.id){
      if(nodes[i].data.hasOwnProperty("isObject")) n.children.push(bindChild(nodes[i],nodes));
    }
  }
  return n
}

const treeify = (nodes) => {
  console.log("🌳🪄 n-utils.js treeify(nodes=",nodes,")")
  const node = {
    data:{
      object_name:"Global"
    },
    id:0
  }

  let n = bindChild(node,nodes)

  console.log("🌳🪄 returning nodeTree=",n)
  return n
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
    bindChild,
    treeify,
}