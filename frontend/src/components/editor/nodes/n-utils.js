
const dataHas = (data, property) => { //safer way of quickly checking if a node has data without spam
    console.log("💾🤲 dataHas(data=",data,"property=",property,")")
    if(data.hasOwnProperty(property)){
      console.log("💾🤲 Property found:", data[property])
      return data[property]
    }
    else{
      console.warn("💾🤲 Property not found")
      return null
    }
};

export{
    dataHas,
}