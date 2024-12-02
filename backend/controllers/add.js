const fs=require('fs').promises;
const path=require('path');
async function Add(filepath){
    const repoPath=path.resolve(process.cwd(),".Sphere");
    const addPath=path.join(repoPath,'staging');
    const fileName=path.basename(filepath);
    try{
        await fs.mkdir(addPath,{recursive:true});
        //Make a copy in the 'addPath' with the 'fileName' specified by the user's 'filepath'
        await fs.copyFile(filepath,path.join(addPath,fileName));
        console.log("Added file in staging area");
    }catch(e){
        console.error("Error occured while adding a file",e);
    }
}

module.exports=Add;