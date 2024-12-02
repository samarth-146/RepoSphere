const fs=require('fs').promises;
const path=require('path');


async function Init() {
    const repoPath=path.resolve(process.cwd(),".Sphere");
    const commitPath=path.join(repoPath,'commits');

    try{
        await fs.mkdir(repoPath,{recursive:true});
        await fs.mkdir(commitPath,{recursive:true});
        await fs.writeFile(path.join(repoPath,'config.json'),JSON.stringify({bucket:'S3'}));
        console.log("Initialised Successfully");
    }
    catch(e){
        console.error("Error while initialising");
    }
}

module.exports=Init;