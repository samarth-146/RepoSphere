const { v4: uuidv4 } = require('uuid');
const fs=require('fs').promises;
const path=require('path');

async function Commit(message) {
    const repoPath=path.resolve(process.cwd(),'.Sphere');
    const commitPath=path.join(repoPath,'commits');
    const stagingPath=path.join(repoPath,'staging');
    try{
        const id=uuidv4();
        const idPath=path.join(commitPath,id);
        await fs.mkdir(idPath,{recursive:true});
        const files=await fs.readdir(stagingPath);
        console.log(files);
        for(let file of files){
            await fs.copyFile(path.join(stagingPath,file),path.join(idPath,file));
        }
        await fs.writeFile(path.join(idPath,'commit.json'),JSON.stringify({message:message,date:new Date().toISOString()}))
    }catch(e){
        console.error("Error while commiting the files",e);
    }
}
module.exports=Commit;