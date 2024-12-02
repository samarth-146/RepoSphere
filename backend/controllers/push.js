const fs=require('fs').promises;
const path=require('path');
const {S3,S3_BUCKET}=require('../config/aws-config');


async function Push() {
    const repoPath=path.resolve(process.cwd(),'.Sphere');
    const commitsPath=path.join(repoPath,'commits');
    try{
        const commitDirs=await fs.readdir(commitsPath);
        for(const dir of commitDirs){
            const commitPath=path.join(commitsPath,dir);
            const files=await fs.readdir(commitPath);
            for(const file of files){
                const filePath=path.join(commitPath,file);
                const fileContent=await fs.readFile(filePath);
                const params={
                    Bucket:S3_BUCKET,
                    Key:`commits/${dir}/${file}`,
                    Body:fileContent
                };
                await S3.upload(params).promise();

            }
        }
        console.log("Successfully Pushed The Code Into AWS");

    }catch(e){
        console.error(`Error while pushing the file ${e}`);
    }
}

module.exports=Push;