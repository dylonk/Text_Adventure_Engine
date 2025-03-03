
const dataHas = (data, property,expectedType="null") => { //safer way of quickly checking if a node has data without spam
    if(expectedType=="null") expectedType = null;
    if(expectedType=="string") expectedType = "";
    if(expectedType=="number") expectedType = -10;
    if(expectedType=="color") expectedType = "hotpink";
    if(expectedType=="array") expectedType = [];

    console.log("💾🤲 dataHas(data=",data,"property=",property,")")
    if(data.hasOwnProperty(property)){
      console.log("💾🤲 Property found:", data[property])
      return data[property]
    }
    else{
      console.warn("💾🤲 Property not found")
      return expectedType;
    }
};

export{
    dataHas,
}