const blackList=new Set();
const addToBlackList=(token)=>{
    blackList.add(token);
};
const isBlackListed=(token)=>{
    return blackList.has(token);
};
module.exports={addToBlackList,isBlackListed};
